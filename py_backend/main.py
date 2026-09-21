"""Command-line JSON interface used by the Obsidian plugin."""

import argparse
import json
import sys
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from py_backend.models.verse import VerseContent
from py_backend.parser.matcher import parse_reference
from py_backend.sources.jw_bridge import build_jw_url
from py_backend.sources.jwpub_reader import JWPubReader


def fetch(reference_text: str, language: str, jwpub_path: str | None) -> VerseContent:
    reference = parse_reference(reference_text, language)
    if jwpub_path:
        with JWPubReader(jwpub_path) as reader:
            return reader.fetch(reference)
    return VerseContent(reference, "", "jw.org", build_jw_url(reference))


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch scripture from a local JW PUB file.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    fetch_parser = subparsers.add_parser("fetch")
    fetch_parser.add_argument("reference")
    fetch_parser.add_argument("--lang", default="en", choices=("en", "nl", "pl"))
    fetch_parser.add_argument("--jwpub", help="Path to a local .jwpub archive")
    arguments = parser.parse_args()
    try:
        result = fetch(arguments.reference, arguments.lang, arguments.jwpub)
    except (FileNotFoundError, LookupError, ValueError, OSError) as error:
        print(json.dumps({"error": str(error)}), file=sys.stderr)
        return 1
    print(json.dumps(result.to_dict(), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())