export type Taal = "nl" | "en" | "pl";

export const TALEN: Taal[] = ["nl", "en", "pl"];

export interface TaalInfo {
	naam: string;
	// Laatste letter in de DAISY-bestandsnaam, bijv. nwt_01_Ge_O.daisy.zip.
	letter: string;
	bijbelMap: string;
	notitieMap: string;
	audioBlok: string;
	voorbeeld: string;
}

export const TAAL_INFO: Record<Taal, TaalInfo> = {
	nl: { naam: "Nederlands", letter: "O", bijbelMap: "Bijbel", notitieMap: "Bijbelnotities/Nederlands", audioBlok: "bijbelaudio", voorbeeld: "Joh 3:16\n1 Kor 13:1-8\nGe 1:1-3,8" },
	en: { naam: "Engels", letter: "E", bijbelMap: "Bible", notitieMap: "Bijbelnotities/Engels", audioBlok: "bijbelaudio-en", voorbeeld: "John 3:16\n1 Cor 13:1-8\nGe 1:1-3,8" },
	pl: { naam: "Pools", letter: "P", bijbelMap: "Biblia", notitieMap: "Bijbelnotities/Pools", audioBlok: "bijbelaudio-pl", voorbeeld: "J 3:16\n1 Kor 13:1-8\nRdz 1:1-3,8" },
};

export interface Boek {
	nummer: number;
	naam: string;
	afkortingen: string[];
}

// Per taal: volledige naam gevolgd door afkortingen (alle 66 boeken, in Bijbelse volgorde).
// Afkortingen worden genormaliseerd (kleine letters, zonder accenten, spaties en punten) voordat ze vergeleken worden.
const DATA: Record<Taal, string[]> = {
	nl: [
		"Genesis|ge|gen", "Exodus|ex|exod", "Leviticus|le|lev", "Numeri|nu|num", "Deuteronomium|de|deut", "Jozua|joz", "Rechters|re|ri|recht|richteren", "Ruth|ru",
		"1 Samuël|1sa|1sam", "2 Samuël|2sa|2sam", "1 Koningen|1kon|1kn", "2 Koningen|2kon|2kn", "1 Kronieken|1kr|1kron", "2 Kronieken|2kr|2kron", "Ezra|ezr", "Nehemia|ne|neh", "Esther|es|est",
		"Job", "Psalmen|ps|psalm", "Spreuken|spr|sp", "Prediker|pr|pred", "Hooglied|hgl|hoogl", "Jesaja|jes", "Jeremia|jer", "Klaagliederen|klg|klaagl", "Ezechiël|eze|ez", "Daniël|da|dan", "Hosea|ho|hos",
		"Joël|joe", "Amos|am", "Obadja|ob", "Jona|jon", "Micha|mi|mic", "Nahum|na|nah", "Habakuk|hab", "Zefanja|zef", "Haggaï|hag", "Zacharia|zac|zach", "Maleachi|mal",
		"Mattheüs|mt|mat|matt|matteus", "Markus|mr|mar|mrk", "Lukas|lu|luk", "Johannes|joh", "Handelingen|han|hand", "Romeinen|ro|rom", "1 Korinthiërs|1ko|1kor|1korinthiers", "2 Korinthiërs|2ko|2kor|2korinthiers",
		"Galaten|ga|gal", "Efeziërs|ef|efe", "Filippenzen|fil|filip|filipenzen", "Kolossenzen|kol", "1 Thessalonicenzen|1th|1thes", "2 Thessalonicenzen|2th|2thes", "1 Timotheüs|1ti|1tim", "2 Timotheüs|2ti|2tim",
		"Titus|tit", "Filemon|flm|filem", "Hebreeën|heb", "Jakobus|jak", "1 Petrus|1pe|1petr", "2 Petrus|2pe|2petr", "1 Johannes|1jo|1joh", "2 Johannes|2jo|2joh", "3 Johannes|3jo|3joh", "Judas|jud", "Openbaring|op|opb|openb",
	],
	en: [
		"Genesis|ge|gen", "Exodus|ex|exod", "Leviticus|le|lev", "Numbers|nu|num", "Deuteronomy|de|deut", "Joshua|jos|josh", "Judges|jg|judg", "Ruth|ru",
		"1 Samuel|1sa|1sam", "2 Samuel|2sa|2sam", "1 Kings|1ki|1kgs", "2 Kings|2ki|2kgs", "1 Chronicles|1ch|1chron", "2 Chronicles|2ch|2chron", "Ezra|ezr", "Nehemiah|ne|neh", "Esther|es|esth",
		"Job", "Psalms|ps|psa|psalm", "Proverbs|pr|prov", "Ecclesiastes|ec|eccl", "Song of Solomon|ca|song|sos", "Isaiah|isa", "Jeremiah|jer", "Lamentations|la|lam", "Ezekiel|eze|ezek", "Daniel|da|dan", "Hosea|ho|hos",
		"Joel|joe", "Amos|am", "Obadiah|ob|obad", "Jonah|jon", "Micah|mic", "Nahum|na|nah", "Habakkuk|hab", "Zephaniah|zep|zeph", "Haggai|hag", "Zechariah|zec|zech", "Malachi|mal",
		"Matthew|mt|matt", "Mark|mr|mk", "Luke|lu|lk", "John|joh|jn", "Acts|ac", "Romans|ro|rom", "1 Corinthians|1co|1cor", "2 Corinthians|2co|2cor",
		"Galatians|ga|gal", "Ephesians|eph", "Philippians|php|phil", "Colossians|col", "1 Thessalonians|1th|1thess", "2 Thessalonians|2th|2thess", "1 Timothy|1ti|1tim", "2 Timothy|2ti|2tim",
		"Titus|tit", "Philemon|phm|philem", "Hebrews|heb", "James|jas", "1 Peter|1pe|1pet", "2 Peter|2pe|2pet", "1 John|1jo|1jn", "2 John|2jo|2jn", "3 John|3jo|3jn", "Jude", "Revelation|re|rev",
	],
	pl: [
		"Rodzaju|rdz", "Wyjścia|wj", "Kapłańska|kpł|kpl", "Liczb|lb", "Powtórzonego Prawa|pwt", "Jozuego|joz", "Sędziów|sdz", "Rut|rt",
		"1 Samuela|1sm", "2 Samuela|2sm", "1 Królów|1krl", "2 Królów|2krl", "1 Kronik|1krn", "2 Kronik|2krn", "Ezdrasza|ezd", "Nehemiasza|ne", "Estery|est",
		"Hioba|hi", "Psalmy|ps", "Przysłów|prz", "Kaznodziei|kzn|koh", "Pieśń nad Pieśniami|pnp|pieśń|piesn", "Izajasza|iz", "Jeremiasza|jer|jr", "Lamentacje|lm", "Ezechiela|ez", "Daniela|dn", "Ozeasza|oz",
		"Joela|jl", "Amosa|am", "Abdiasza|ab|abd", "Jonasza|jon", "Micheasza|mi", "Nahuma|na", "Habakuka|ha|hab", "Sofoniasza|so|sof", "Aggeusza|ag", "Zachariasza|za", "Malachiasza|ml",
		"Mateusza|mt", "Marka|mk", "Łukasza|łk|lk", "Jana|j", "Dzieje|dz", "Rzymian|rz", "1 Koryntian|1ko|1kor", "2 Koryntian|2ko|2kor",
		"Galatów|ga", "Efezjan|ef", "Filipian|flp", "Kolosan|kol", "1 Tesaloniczan|1ts", "2 Tesaloniczan|2ts", "1 Tymoteusza|1tm", "2 Tymoteusza|2tm",
		"Tytusa|tt", "Filemona|flm", "Hebrajczyków|hbr", "Jakuba|jak|jk", "1 Piotra|1p", "2 Piotra|2p", "1 Jana|1j", "2 Jana|2j", "3 Jana|3j", "Judy|jud", "Objawienie|ap|obj",
	],
};

export const BOEKEN: Record<Taal, Boek[]> = { nl: [], en: [], pl: [] };
for (const taal of TALEN) {
	BOEKEN[taal] = DATA[taal].map((regel, index) => {
		const [naam, ...afkortingen] = regel.split("|");
		return { nummer: index + 1, naam, afkortingen };
	});
}

export interface Passage {
	taal: Taal;
	boek: Boek;
	hoofdstuk: number;
	// Lege lijst betekent: het hele hoofdstuk.
	verzen: number[];
}

export function normaliseer(waarde: string): string {
	return waarde.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\s.]/g, "");
}

const AFKORTING_INDEX = {} as Record<Taal, Map<string, Boek>>;
for (const taal of TALEN) {
	const index = new Map<string, Boek>();
	for (const boek of BOEKEN[taal]) {
		index.set(normaliseer(boek.naam), boek);
		for (const afkorting of boek.afkortingen) index.set(normaliseer(afkorting), boek);
	}
	AFKORTING_INDEX[taal] = index;
}

export function zoekBoek(invoer: string, taal: Taal): Boek {
	const sleutel = normaliseer(invoer);
	const exact = AFKORTING_INDEX[taal].get(sleutel);
	if (exact) return exact;
	const kandidaten = BOEKEN[taal].filter((boek) => normaliseer(boek.naam).startsWith(sleutel));
	if (sleutel.length >= 2 && kandidaten.length === 1) return kandidaten[0];
	if (kandidaten.length > 1) throw new Error(`"${invoer}" is dubbelzinnig: ${kandidaten.map((boek) => boek.naam).join(", ")}`);
	throw new Error(`Onbekend Bijbelboek (${TAAL_INFO[taal].naam}): "${invoer}"`);
}

export function parseerVerzen(spec: string): number[] {
	const verzen: number[] = [];
	for (const deel of spec.split(",")) {
		const bereik = /^\s*(\d+)\s*(?:[-–]\s*(\d+))?\s*$/.exec(deel);
		if (!bereik) throw new Error(`Ongeldige versaanduiding: "${spec}"`);
		const begin = Number(bereik[1]);
		const eind = bereik[2] ? Number(bereik[2]) : begin;
		if (eind < begin) throw new Error(`Ongeldig bereik: "${deel.trim()}"`);
		if (eind - begin > 500) throw new Error(`Bereik te groot: "${deel.trim()}"`);
		for (let vers = begin; vers <= eind; vers++) if (!verzen.includes(vers)) verzen.push(vers);
	}
	return verzen;
}

// Voorbeelden: "Joh 3:16", "1 Kor 13:1-8", "Gen 1:1-3,8", "Ps 23" (heel hoofdstuk).
export function parseerVerwijzing(waarde: string, taal: Taal): Passage {
	const tekst = waarde.trim().replace(/\s+/g, " ");
	const treffer = /^((?:[1-3]\s*)?[^\d:;,]+?)\.?\s*(\d+)(?:\s*:\s*(.+))?$/.exec(tekst);
	if (!treffer) throw new Error(`Ongeldige verwijzing: "${waarde}"`);
	const boek = zoekBoek(treffer[1].trim(), taal);
	const hoofdstuk = Number(treffer[2]);
	if (hoofdstuk < 1) throw new Error(`Ongeldig hoofdstuk: "${waarde}"`);
	return { taal, boek, hoofdstuk, verzen: treffer[3] ? parseerVerzen(treffer[3]) : [] };
}

export function parseerVerwijzingen(waarde: string, taal: Taal): Passage[] {
	return waarde.split(/\r?\n|;/).map((deel) => deel.trim()).filter(Boolean).map((deel) => parseerVerwijzing(deel, taal));
}

export function formatteerVerzen(verzen: number[]): string {
	const delen: string[] = [];
	for (let i = 0; i < verzen.length; ) {
		let j = i;
		while (j + 1 < verzen.length && verzen[j + 1] === verzen[j] + 1) j++;
		delen.push(j > i ? `${verzen[i]}-${verzen[j]}` : String(verzen[i]));
		i = j + 1;
	}
	return delen.join(",");
}
