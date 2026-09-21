"""Typed models exchanged by the scripture backend."""

from dataclasses import asdict, dataclass
from typing import Any


SUPPORTED_LANGUAGES = frozenset({"en", "nl", "pl"})


@dataclass(frozen=True, slots=True)
class ScriptureReference:
    """A single verse or contiguous verse range."""

    book: str
    chapter: int
    verse_start: int
    verse_end: int | None = None
    language: str = "en"

    def __post_init__(self) -> None:
        if not self.book.strip():
            raise ValueError("book must not be empty")
        if self.chapter < 1 or self.verse_start < 1:
            raise ValueError("chapter and verse_start must be positive")
        if self.verse_end is not None and self.verse_end < self.verse_start:
            raise ValueError("verse_end must be greater than or equal to verse_start")
        if self.language not in SUPPORTED_LANGUAGES:
            raise ValueError(f"unsupported language: {self.language}")

    @property
    def display(self) -> str:
        verse = str(self.verse_start)
        if self.verse_end is not None:
            verse += f"-{self.verse_end}"
        return f"{self.book} {self.chapter}:{verse}"


@dataclass(frozen=True, slots=True)
class VerseContent:
    """Scripture text and its source metadata."""

    reference: ScriptureReference
    text: str
    source_type: str
    jw_url: str

    def to_dict(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["reference"] = asdict(self.reference)
        return payload