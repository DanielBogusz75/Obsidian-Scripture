"""Read scripture rows from JW PUB ZIP archives."""

from __future__ import annotations

import bz2
import gzip
import html
import hashlib
import lzma
import re
import sqlite3
import subprocess
import tempfile
import zipfile
import zlib
from pathlib import Path

from py_backend.models.verse import ScriptureReference, VerseContent
from py_backend.parser.aliases import book_number
from py_backend.sources.base import ScriptureSource
from py_backend.sources.jw_bridge import build_jw_url

_VERSE_LABEL = re.compile(r"<[^>]*class=[\"']vl[\"'][^>]*>(\d+)<", re.IGNORECASE)
_XOR_KEY = bytes.fromhex("11cbb5587e32846d4c26790c633da289f66fe5842a3a585ce1bc3a294af5ada7")


class JWPubReader(ScriptureSource):
    """Query BibleVerse rows from either a direct or nested SQLite database."""

    def __init__(self, archive_path: str | Path) -> None:
        self.archive_path = Path(archive_path)
        self._temporary_database: tempfile.NamedTemporaryFile[bytes] | None = None
        self._connection = self._open_connection()
        identity = self._connection.execute(
            "SELECT MepsLanguageIndex, Symbol, Year, COALESCE(IssueTagNumber, '0') FROM Publication LIMIT 1"
        ).fetchone()
        if identity is None:
            raise ValueError("JW PUB Publication table is empty")
        self._identity = (int(identity[0]), str(identity[1]), int(identity[2]), int(identity[3] or 0))

    def _open_connection(self) -> sqlite3.Connection:
        if not self.archive_path.is_file():
            raise FileNotFoundError(f"JW PUB file does not exist: {self.archive_path}")
        with zipfile.ZipFile(self.archive_path) as archive:
            database = self._find_database(archive)
        self._temporary_database = tempfile.NamedTemporaryFile(suffix=".db")
        self._temporary_database.write(database)
        self._temporary_database.flush()
        connection = sqlite3.connect(self._temporary_database.name)
        connection.row_factory = sqlite3.Row
        return connection

    @staticmethod
    def _find_database(archive: zipfile.ZipFile) -> bytes:
        names = archive.namelist()
        direct = next((name for name in names if name.casefold().endswith(("contents.db", ".sqlite", ".db"))), None)
        if direct:
            return archive.read(direct)
        nested_name = next((name for name in names if name.casefold() == "contents"), None)
        if nested_name is None:
            raise ValueError("JW PUB archive does not contain a SQLite database")
        with zipfile.ZipFile(archive.open(nested_name)) as nested:
            database = next((name for name in nested.namelist() if name.casefold().endswith(("contents.db", ".sqlite", ".db"))), None)
            if database is None:
                raise ValueError("JW PUB contents archive does not contain a SQLite database")
            return nested.read(database)

    def fetch(self, reference: ScriptureReference) -> VerseContent:
        book = book_number(reference.book, reference.language)
        chapter = self._connection.execute(
            """
            SELECT FirstVerseId, LastVerseId
            FROM BibleChapter
            WHERE BookNumber = ? AND ChapterNumber = ?
            """,
            (book, reference.chapter),
        ).fetchone()
        if chapter is None:
            raise LookupError(f"chapter not found: {reference.display}")

        rows = self._connection.execute(
            """
            SELECT Label, Content
            FROM BibleVerse
            WHERE BibleVerseId BETWEEN ? AND ?
            ORDER BY BibleVerseId
            """,
            (chapter["FirstVerseId"], chapter["LastVerseId"]),
        ).fetchall()
        selected = []
        for row in rows:
            verse_number = self._label_number(row["Label"])
            if verse_number is None:
                continue
            if reference.verse_start <= verse_number <= (reference.verse_end or reference.verse_start):
                    selected.append(self._decode_content(row["Content"]))
        if not selected:
            raise LookupError(f"verse not found: {reference.display}")
        return VerseContent(reference, "\n".join(selected), "jwpub", build_jw_url(reference))

    @staticmethod
    def _label_number(label: str) -> int | None:
        if 'class="cl"' in label.casefold() or "class='cl'" in label.casefold():
            return None
        match = _VERSE_LABEL.search(label)
        if match is None:
            raise ValueError(f"unrecognized verse label: {label}")
        return int(match.group(1))

    def _decode_content(self, content: bytes | str | None) -> str:
        if content is None:
            return ""
        if isinstance(content, str):
            return self._clean_html(content)
        candidates = [content]
        try:
            decrypted = self._decrypt_content(content)
            candidates.insert(0, zlib.decompress(decrypted))
        except (OSError, ValueError, RuntimeError, zlib.error):
            pass
        for decoder in (zlib.decompress, gzip.decompress, bz2.decompress, lzma.decompress):
            try:
                candidates.append(decoder(content))
            except (OSError, ValueError, zlib.error, lzma.LZMAError):
                continue
        for candidate in candidates:
            try:
                decoded = candidate.decode("utf-8")
            except UnicodeDecodeError:
                continue
            if "<" in decoded or decoded.isprintable():
                return self._clean_html(decoded)
        raise ValueError("JW PUB verse content uses an unsupported binary encoding")

    def _decrypt_content(self, content: bytes) -> bytes:
        language, symbol, year, issue = self._identity
        parts = [str(language), symbol, str(year)]
        if issue:
            parts.append(str(issue))
        digest = hashlib.sha256("_".join(parts).encode("utf-8")).digest()
        full_key = bytes(left ^ right for left, right in zip(digest, _XOR_KEY))
        result = subprocess.run(
            ["openssl", "enc", "-aes-128-cbc", "-d", "-nopad", "-K", full_key[:16].hex(), "-iv", full_key[16:].hex()],
            input=content,
            capture_output=True,
            check=False,
        )
        if result.returncode != 0:
            raise RuntimeError("JW PUB AES decryption failed")
        return result.stdout

    @staticmethod
    def _clean_html(value: str) -> str:
        value = re.sub(r"<\s*(br|p|div|li)[^>]*>", "\n", value, flags=re.IGNORECASE)
        value = re.sub(r"<[^>]+>", "", value)
        value = html.unescape(value)
        return re.sub(r"\n{3,}", "\n\n", "\n".join(line.strip() for line in value.splitlines())).strip()

    def close(self) -> None:
        self._connection.close()
        if self._temporary_database is not None:
            self._temporary_database.close()

    def __enter__(self) -> "JWPubReader":
        return self

    def __exit__(self, _exc_type: object, _exc_value: object, _traceback: object) -> None:
        self.close()