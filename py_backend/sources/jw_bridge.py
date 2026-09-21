"""Build language-aware links to the public JW.org Bible."""

from urllib.parse import quote

from py_backend.models.verse import ScriptureReference
from py_backend.parser.aliases import book_number

_BOOK_SLUGS = {
    "en": {40: "matthew", 41: "mark", 42: "luke", 43: "john", 46: "1-corinthians"},
    "nl": {40: "matteus", 41: "markus", 42: "lukas", 43: "johannes", 46: "1-korinthiers"},
    "pl": {40: "mateusza", 41: "marka", 42: "lukasza", 43: "jana", 46: "1-koryntian"},
}


def build_jw_url(reference: ScriptureReference) -> str:
    """Return a stable chapter URL, adding verse anchors for precision."""
    number = book_number(reference.book, reference.language)
    slug = _BOOK_SLUGS.get(reference.language, {}).get(number, f"book-{number}")
    language = quote(reference.language, safe="")
    url = f"https://www.jw.org/{language}/library/bible/nwt/books/{slug}/{reference.chapter}/"
    return f"{url}#v{reference.verse_start}"