export type BibleLanguage = "en" | "nl" | "pl";

// Full book names, used to derive the canonical display name (BOOK_NAMES below).
const BOOK_FULL_NAMES: Record<BibleLanguage, Record<string, number>> = {
	en: { genesis: 1, exodus: 2, leviticus: 3, numbers: 4, deuteronomy: 5, joshua: 6, judges: 7, ruth: 8, "1 samuel": 9, "2 samuel": 10, "1 kings": 11, "2 kings": 12, "1 chronicles": 13, "2 chronicles": 14, ezra: 15, nehemiah: 16, esther: 17, job: 18, psalms: 19, psalm: 19, proverbs: 20, ecclesiastes: 21, "song of solomon": 22, isaiah: 23, jeremiah: 24, lamentations: 25, ezekiel: 26, daniel: 27, hosea: 28, joel: 29, amos: 30, obadiah: 31, jonah: 32, micah: 33, nahum: 34, habakkuk: 35, zephaniah: 36, haggai: 37, zechariah: 38, malachi: 39, matthew: 40, mark: 41, luke: 42, john: 43, jhon: 43, acts: 44, romans: 45, "1 corinthians": 46, "2 corinthians": 47, galatians: 48, ephesians: 49, philippians: 50, colossians: 51, "1 thessalonians": 52, "2 thessalonians": 53, "1 timothy": 54, "2 timothy": 55, titus: 56, philemon: 57, hebrews: 58, james: 59, "1 peter": 60, "2 peter": 61, "1 john": 62, "2 john": 63, "3 john": 64, jude: 65, revelation: 66 },
	nl: { genesis: 1, exodus: 2, leviticus: 3, numeri: 4, deuteronomium: 5, jozua: 6, richteren: 7, ruth: 8, "1 samuel": 9, "2 samuel": 10, "1 koningen": 11, "2 koningen": 12, "1 kronieken": 13, "2 kronieken": 14, ezra: 15, nehemia: 16, esther: 17, job: 18, psalmen: 19, spreuken: 20, prediker: 21, hooglied: 22, jesaja: 23, jeremia: 24, klaagliederen: 25, ezechiël: 26, daniel: 27, hosea: 28, joël: 29, amos: 30, obadja: 31, jona: 32, micha: 33, nahum: 34, habakuk: 35, zefanja: 36, haggaï: 37, zacharia: 38, maleachi: 39, mattheüs: 40, markus: 41, lukas: 42, johannes: 43, joh: 43, handelingen: 44, romeinen: 45, "1 korinthiërs": 46, "2 korinthiërs": 47, galaten: 48, efeziërs: 49, filipenzen: 50, kolossenzen: 51, "1 thessalonicenzen": 52, "2 thessalonicenzen": 53, "1 timotheüs": 54, "2 timotheüs": 55, titus: 56, filemon: 57, hebreeën: 58, jakobus: 59, "1 petrus": 60, "2 petrus": 61, "1 johannes": 62, "2 johannes": 63, "3 johannes": 64, judas: 65, openbaring: 66 },
	pl: { "rodzaju": 1, "wyjścia": 2, "kapłańska": 3, liczb: 4, "powtórzonego prawa": 5, jozuego: 6, "sędziów": 7, rut: 8, "1 samuela": 9, "2 samuela": 10, "1 królewska": 11, "2 królewska": 12, "1 kronik": 13, "2 kronik": 14, ezdrasza: 15, nehemiasza: 16, estery: 17, hioba: 18, "psalmów": 19, "przysłów": 20, kaznodziei: 21, "pieśń nad pieśniami": 22, izajasza: 23, jeremiasza: 24, lamentacji: 25, ezechiela: 26, daniela: 27, ozeasza: 28, joela: 29, amosa: 30, abdiasza: 31, jonasza: 32, micheasza: 33, nahuma: 34, habakuka: 35, sofoniasza: 36, aggeusza: 37, zachariasza: 38, malachiasza: 39, mateusza: 40, marka: 41, łukasza: 42, jana: 43, dzieje: 44, rzymian: 45, "1 koryntian": 46, "2 koryntian": 47, galatów: 48, efezjan: 49, filipian: 50, kolosan: 51, "1 tesaloniczan": 52, "2 tesaloniczan": 53, "1 tymoteusza": 54, "2 tymoteusza": 55, tytusa: 56, filemona: 57, hebrajczyków: 58, jakuba: 59, "1 piotra": 60, "2 piotra": 61, "1 jana": 62, "2 jana": 63, "3 jana": 64, judy: 65, objawienie: 66 },
};

// Official New World Translation book abbreviations (as used on JW.org), mapped to the same book numbers as BOOK_FULL_NAMES.
const BOOK_ABBREVIATIONS: Record<BibleLanguage, Record<string, number>> = {
	en: { ge: 1, ex: 2, le: 3, nu: 4, de: 5, jos: 6, jg: 7, ru: 8, "1sa": 9, "2sa": 10, "1ki": 11, "2ki": 12, "1ch": 13, "2ch": 14, ezr: 15, ne: 16, es: 17, ps: 19, pr: 20, ec: 21, ca: 22, isa: 23, jer: 24, la: 25, eze: 26, da: 27, ho: 28, joe: 29, am: 30, ob: 31, jon: 32, mic: 33, na: 34, hab: 35, zep: 36, hag: 37, zec: 38, mal: 39, mt: 40, mr: 41, lu: 42, joh: 43, ac: 44, ro: 45, "1co": 46, "2co": 47, ga: 48, eph: 49, php: 50, col: 51, "1th": 52, "2th": 53, "1ti": 54, "2ti": 55, tit: 56, phm: 57, heb: 58, jas: 59, "1pe": 60, "2pe": 61, "1jo": 62, "2jo": 63, "3jo": 64, re: 66 },
	nl: { ge: 1, ex: 2, le: 3, nu: 4, de: 5, joz: 6, ri: 7, ru: 8, "1sa": 9, "2sa": 10, "1kon": 11, "2kon": 12, "1kr": 13, "2kr": 14, ezr: 15, ne: 16, est: 17, ps: 19, sp: 20, pred: 21, hgl: 22, jes: 23, jer: 24, kl: 25, ez: 26, da: 27, ho: 28, joe: 29, am: 30, ob: 31, jon: 32, mi: 33, na: 34, hab: 35, sef: 36, hag: 37, za: 38, mal: 39, mt: 40, mr: 41, lu: 42, joh: 43, han: 44, ro: 45, "1kor": 46, "2kor": 47, ga: 48, ef: 49, fil: 50, kol: 51, "1th": 52, "2th": 53, "1tim": 54, "2tim": 55, tit: 56, flm: 57, heb: 58, jak: 59, "1pe": 60, "2pe": 61, "1joh": 62, "2joh": 63, "3joh": 64, jud: 65, opb: 66 },
	pl: { rdz: 1, wj: 2, "kpł": 3, lb: 4, pwt: 5, joz: 6, sdz: 7, rt: 8, "1sm": 9, "2sm": 10, "1krl": 11, "2krl": 12, "1krn": 13, "2krn": 14, ezd: 15, ne: 16, est: 17, hi: 18, ps: 19, prz: 20, kzn: 21, pnp: 22, iz: 23, jer: 24, lm: 25, ez: 26, dn: 27, oz: 28, jl: 29, am: 30, ab: 31, jon: 32, mi: 33, na: 34, ha: 35, so: 36, ag: 37, za: 38, ml: 39, mt: 40, mk: 41, "łk": 42, j: 43, dz: 44, rz: 45, "1ko": 46, "2ko": 47, ga: 48, ef: 49, flp: 50, kol: 51, "1ts": 52, "2ts": 53, "1tm": 54, "2tm": 55, tt: 56, flm: 57, hbr: 58, jak: 59, "1p": 60, "2p": 61, "1j": 62, "2j": 63, "3j": 64, jud: 65, ap: 66 },
};

// Common abbreviations used by other Bible translations and online tools (e.g. "Gen." for Genesis), mapped to the same book numbers as BOOK_FULL_NAMES.
const COMMON_ABBREVIATIONS: Record<BibleLanguage, Record<string, number>> = {
	en: { gen: 1, exod: 2, lev: 3, num: 4, deut: 5, josh: 6, judg: 7, "1 sam": 9, "2 sam": 10, "1 kgs": 11, "2 kgs": 12, "1 chron": 13, "2 chron": 14, neh: 16, esth: 17, psa: 19, prov: 20, eccl: 21, song: 22, isa: 23, jer: 24, lam: 25, ezek: 26, dan: 27, hos: 28, obad: 31, mic: 33, nah: 34, zeph: 36, zech: 38, mal: 39, matt: 40, rom: 45, "1 cor": 46, "2 cor": 47, gal: 48, phil: 50, "1 thess": 52, "2 thess": 53, "1 tim": 54, "2 tim": 55, philem: 57, heb: 58, james: 59, "1 pet": 60, "2 pet": 61, rev: 66 },
	nl: { gen: 1, lev: 3, num: 4, deut: 5, joz: 6, recht: 7, "1 sam": 9, "2 sam": 10, "1 kon": 11, "2 kon": 12, "1 kron": 13, "2 kron": 14, neh: 16, spr: 20, hoogl: 22, klaagl: 25, nah: 34, zach: 38, matt: 40, marc: 41, luc: 42, hand: 44, rom: 45, "1 kor": 46, "2 kor": 47, gal: 48, filip: 50, "1 tess": 52, "2 tess": 53, "1 tim": 54, "2 tim": 55, tit: 56, filem: 57, "1 petr": 60, "2 petr": 61, "1 joh": 62, "2 joh": 63, "3 joh": 64, openb: 66 },
	pl: { koh: 21, jr: 24, abd: 31, hab: 35, sof: 36, jk: 59 },
};

export const BOOK_ALIASES: Record<BibleLanguage, Record<string, number>> = {
	en: { ...BOOK_FULL_NAMES.en, ...BOOK_ABBREVIATIONS.en, ...COMMON_ABBREVIATIONS.en },
	nl: { ...BOOK_FULL_NAMES.nl, ...BOOK_ABBREVIATIONS.nl, ...COMMON_ABBREVIATIONS.nl },
	pl: { ...BOOK_FULL_NAMES.pl, ...BOOK_ABBREVIATIONS.pl, ...COMMON_ABBREVIATIONS.pl },
};

export function parseReference(value: string, language: BibleLanguage): { book: string; bookNumber: number; chapter: number; verseStart: number; verseEnd: number | null; verses: number[] } {
	const normalized = value.trim().replace(/\.(?=\s+\d+:)/, "").replace(/\s+/g, " ");
	const aliases = [...new Set([...Object.keys(BOOK_ALIASES[language]), ...Object.keys(BOOK_ALIASES.en)])].sort((a, b) => b.length - a.length);
	const match = new RegExp(`^(${aliases.map(escapeRegExp).join("|")})\\s+(\\d+):(\\d+(?:[-,]\\d+)*)$`, "i").exec(normalized);
	if (!match) throw new Error(`Unsupported scripture reference: ${value}`);
	const normalizedBook = match[1].toLocaleLowerCase();
	const bookNumber = BOOK_ALIASES[language][normalizedBook] ?? BOOK_ALIASES.en[normalizedBook];
	const book = BOOK_NAMES[language][bookNumber] ?? BOOK_NAMES.en[bookNumber] ?? titleCase(match[1]);
	const verseParts = match[3].split(",").flatMap((part) => {
		const [start, end] = part.split("-").map(Number);
		return end ? Array.from({ length: end - start + 1 }, (_, index) => start + index) : [start];
	});
	return { book, bookNumber, chapter: Number(match[2]), verseStart: verseParts[0], verseEnd: verseParts.length > 1 ? verseParts[verseParts.length - 1] : null, verses: [...new Set(verseParts)] };
}

function escapeRegExp(value: string): string { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Full display name per book number, derived from the first (unabbreviated) alias listed for that book.
const BOOK_NAMES: Record<BibleLanguage, Record<number, string>> = (Object.keys(BOOK_FULL_NAMES) as BibleLanguage[]).reduce((languages, language) => {
	const names: Record<number, string> = {};
	for (const [alias, number] of Object.entries(BOOK_FULL_NAMES[language])) {
		if (!(number in names)) names[number] = titleCase(alias);
	}
	languages[language] = names;
	return languages;
}, {} as Record<BibleLanguage, Record<number, string>>);

function titleCase(value: string): string {
	const lowercaseWords = new Set(["of"]);
	return value.split(" ").map((word, index) => (index > 0 && lowercaseWords.has(word) ? word : word.charAt(0).toLocaleUpperCase() + word.slice(1))).join(" ");
}