"""Citation parsing for the supported languages."""

import re

from py_backend.models.verse import ScriptureReference
from py_backend.parser.aliases import BOOK_ALIASES


def parse_reference(value: str, language: str = "en") -> ScriptureReference:
    normalized = " ".join(value.strip().split())
    aliases = sorted({*BOOK_ALIASES.get(language, {}), *BOOK_ALIASES["en"]}, key=len, reverse=True)
    book_pattern = "|".join(re.escape(alias) for alias in aliases)
    match = re.fullmatch(rf"(?P<book>{book_pattern})\s+(?P<chapter>\d+):(?P<start>\d+)(?:-(?P<end>\d+))?", normalized, re.IGNORECASE)
    if not match:
        raise ValueError(f"unsupported scripture reference: {value}")
    return ScriptureReference(
        book=match.group("book"),
        chapter=int(match.group("chapter")),
        verse_start=int(match.group("start")),
        verse_end=int(match.group("end")) if match.group("end") else None,
        language=language,
    )