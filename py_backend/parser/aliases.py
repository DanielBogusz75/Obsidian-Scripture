"""Localized Bible book aliases and canonical book numbers."""

BOOK_ALIASES: dict[str, dict[str, int]] = {
    "en": {
        "genesis": 1, "exodus": 2, "leviticus": 3, "numbers": 4, "deuteronomy": 5,
        "joshua": 6, "judges": 7, "ruth": 8, "1 samuel": 9, "2 samuel": 10,
        "1 kings": 11, "2 kings": 12, "1 chronicles": 13, "2 chronicles": 14,
        "ezra": 15, "nehemiah": 16, "esther": 17, "job": 18, "psalms": 19,
        "psalm": 19, "proverbs": 20, "ecclesiastes": 21, "song of solomon": 22,
        "isaiah": 23, "jeremiah": 24, "lamentations": 25, "ezekiel": 26,
        "daniel": 27, "hosea": 28, "joel": 29, "amos": 30, "obadiah": 31,
        "jonah": 32, "micah": 33, "nahum": 34, "habakkuk": 35, "zephaniah": 36,
        "haggai": 37, "zechariah": 38, "malachi": 39, "matthew": 40, "mark": 41,
        "luke": 42, "john": 43, "acts": 44, "romans": 45, "1 corinthians": 46,
        "2 corinthians": 47, "galatians": 48, "ephesians": 49, "philippians": 50,
        "colossians": 51, "1 thessalonians": 52, "2 thessalonians": 53,
        "1 timothy": 54, "2 timothy": 55, "titus": 56, "philemon": 57,
        "hebrews": 58, "james": 59, "1 peter": 60, "2 peter": 61, "1 john": 62,
        "2 john": 63, "3 john": 64, "jude": 65, "revelation": 66,
    },
    "nl": {
        "genesis": 1, "exodus": 2, "leviticus": 3, "numeri": 4, "deuteronomium": 5,
        "jozua": 6, "richteren": 7, "ruth": 8, "1 samuel": 9, "2 samuel": 10,
        "1 koningen": 11, "2 koningen": 12, "1 kronieken": 13, "2 kronieken": 14,
        "ezra": 15, "nehemia": 16, "esther": 17, "job": 18, "psalmen": 19,
        "spreuken": 20, "prediker": 21, "hooglied": 22, "jesaja": 23,
        "jeremia": 24, "klaagliederen": 25, "ezechiël": 26, "daniel": 27,
        "hosea": 28, "joël": 29, "amos": 30, "obadja": 31, "jona": 32,
        "micha": 33, "nahum": 34, "habakuk": 35, "zefanja": 36, "haggaï": 37,
        "zacharia": 38, "maleachi": 39, "mattheüs": 40, "markus": 41, "lukas": 42,
        "johannes": 43, "handelingen": 44, "romeinen": 45, "1 korinthiërs": 46,
        "2 korinthiërs": 47, "galaten": 48, "efeziërs": 49, "filippenzen": 50,
        "kolossenzen": 51, "1 thessalonicenzen": 52, "2 thessalonicenzen": 53,
        "1 timotheüs": 54, "2 timotheüs": 55, "titus": 56, "filemon": 57,
        "hebreën": 58, "jakobus": 59, "1 petrus": 60, "2 petrus": 61,
        "1 johannes": 62, "2 johannes": 63, "3 johannes": 64, "judas": 65,
        "openbaring": 66,
    },
    "pl": {
        "rodzaju": 1, "wyjścia": 2, "kapłańska": 3, "liczb": 4, "powtórzonego prawa": 5,
        "jozuego": 6, "sędziów": 7, "rut": 8, "1 samuela": 9, "2 samuela": 10,
        "1 królewska": 11, "2 królewska": 12, "1 kronik": 13, "2 kronik": 14,
        "ezdrasza": 15, "nehemiasza": 16, "estery": 17, "hioba": 18, "psalmów": 19,
        "przysłów": 20, "kaznodziei": 21, "pieśń nad pieśniami": 22, "izajasza": 23,
        "jeremiasza": 24, "lamentacji": 25, "jehowy": 26, "daniela": 27,
        "mateusza": 40, "marka": 41, "łukasza": 42, "jana": 43, "dzieje": 44,
        "rzymian": 45, "1 koryntian": 46, "2 koryntian": 47, "galatów": 48,
        "efezjan": 49, "filipian": 50, "kolosan": 51, "1 tesaloniczan": 52,
        "2 tesaloniczan": 53, "1 tymoteusza": 54, "2 tymoteusza": 55, "tytusa": 56,
        "filemona": 57, "hebrajczyków": 58, "Jakuba": 59, "1 Piotra": 60,
        "2 Piotra": 61, "1 Jana": 62, "2 Jana": 63, "3 Jana": 64, "Judy": 65,
        "objawienie": 66,
    },
}

CANONICAL_NAMES = {number: name for name, number in BOOK_ALIASES["en"].items() if " " not in name or name[0].isdigit()}


def book_number(book: str, language: str) -> int:
    normalized = " ".join(book.casefold().split())
    for aliases in (BOOK_ALIASES.get(language, {}), BOOK_ALIASES["en"]):
        if normalized in aliases:
            return aliases[normalized]
    raise ValueError(f"unknown Bible book: {book}")