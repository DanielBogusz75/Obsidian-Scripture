import { unzipSync } from "fflate";

// Abstracte opslag zodat de lezer zowel in Obsidian als in tests werkt.
export interface Opslag {
	lijst(map: string): Promise<{ bestanden: string[]; mappen: string[] }>;
	leesTekst(pad: string): Promise<string>;
	leesBinair(pad: string): Promise<Uint8Array>;
}

export interface Vers {
	nummer: number;
	tekst: string;
	spans: string[];
}

export interface Fragment {
	bestand: string;
	begin: number;
	einde: number;
}

export interface Hoofdstuk {
	nummer: number;
	verzen: Vers[];
	// Audiofragment per span-id, in afspeelvolgorde.
	spans: Array<{ id: string; fragment: Fragment }>;
}

interface BoekBron {
	lees(bestand: string): Promise<string>;
	leesBinair(bestand: string): Promise<Uint8Array>;
}

const PAD_SCHEIDING = /\/+$/;

/*
 * Een DAISY-boek bestaat uit één set bestanden per hoofdstuk (0001.xml = hoofdstuk 1):
 * - NNNN.xml  tekst; elke <span id="pN"> bevat één (zelden meer) vers, beginnend met "hoofdstuk:vers"
 * - NNNN.smil koppelt elke span-id aan een tijdsfragment (clipBegin/clipEnd) in NNNN.mp3
 * - NNNN.mp3  audio van het hele hoofdstuk
 * Een boek staat in de Bijbelmap als uitgepakte map "nwt_NN_xx_O.daisy" of als "nwt_NN_xx_O.daisy.zip".
 */
export class DaisyLezer {
	private bronnen = new Map<number, BoekBron>();
	private hoofdstukken = new Map<string, Hoofdstuk>();
	private zipCache?: { pad: string; data: Uint8Array };

	constructor(private readonly opslag: Opslag, private map: () => string, private readonly letter: string) {}

	wis(): void {
		this.bronnen.clear();
		this.hoofdstukken.clear();
		this.zipCache = undefined;
	}

	async hoofdstuk(boek: number, nummer: number): Promise<Hoofdstuk> {
		const sleutel = `${this.map()}|${boek}|${nummer}`;
		const bekend = this.hoofdstukken.get(sleutel);
		if (bekend) return bekend;
		const bron = await this.bron(boek);
		const naam = bestandsnaam(nummer);
		let xml: string;
		let smil: string;
		try {
			[xml, smil] = await Promise.all([bron.lees(`${naam}.xml`), bron.lees(`${naam}.smil`)]);
		} catch {
			throw new Error(`Hoofdstuk ${nummer} bestaat niet in dit Bijbelboek`);
		}
		const resultaat = parseerHoofdstuk(nummer, xml, smil);
		this.hoofdstukken.set(sleutel, resultaat);
		return resultaat;
	}

	async audio(boek: number, bestand: string): Promise<Uint8Array> {
		return (await this.bron(boek)).leesBinair(bestand);
	}

	private async bron(boek: number): Promise<BoekBron> {
		const bekend = this.bronnen.get(boek);
		if (bekend) return bekend;
		const map = this.map().replace(PAD_SCHEIDING, "");
		const inhoud = await this.opslag.lijst(map).catch(() => {
			throw new Error(`De Bijbelmap "${map}" is niet gevonden. Stel de juiste map in bij de instellingen.`);
		});
		const voorvoegsel = `nwt_${String(boek).padStart(2, "0")}_`;
		const basis = (pad: string) => pad.split("/").pop() ?? pad;
		const eind = `_${this.letter}.daisy`;
		const uitgepakt = inhoud.mappen.find((pad) => basis(pad).startsWith(voorvoegsel) && basis(pad).endsWith(eind));
		let bron: BoekBron;
		if (uitgepakt) {
			bron = {
				lees: (bestand) => this.opslag.leesTekst(`${uitgepakt}/${bestand}`),
				leesBinair: (bestand) => this.opslag.leesBinair(`${uitgepakt}/${bestand}`),
			};
		} else {
			const zip = inhoud.bestanden.find((pad) => basis(pad).startsWith(voorvoegsel) && basis(pad).endsWith(`${eind}.zip`));
			if (!zip) throw new Error(`Geen DAISY-bestand gevonden voor boek ${boek} in "${map}"`);
			bron = {
				lees: async (bestand) => new TextDecoder("utf-8").decode(await this.uitZip(zip, bestand)),
				leesBinair: (bestand) => this.uitZip(zip, bestand),
			};
		}
		this.bronnen.set(boek, bron);
		return bron;
	}

	private async uitZip(zip: string, bestand: string): Promise<Uint8Array> {
		if (this.zipCache?.pad !== zip) this.zipCache = { pad: zip, data: await this.opslag.leesBinair(zip) };
		const uitgepakt = unzipSync(this.zipCache.data, { filter: (item) => item.name === bestand });
		const data = uitgepakt[bestand];
		if (!data) throw new Error(`"${bestand}" ontbreekt in ${zip}`);
		return data;
	}
}

function bestandsnaam(hoofdstuk: number): string {
	return String(hoofdstuk).padStart(4, "0");
}

function tijd(waarde: string): number {
	const delen = waarde.split(":").map(Number);
	return delen.reduce((totaal, deel) => totaal * 60 + deel, 0);
}

function decodeer(tekst: string): string {
	return tekst
		.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
		.replace(/&#(\d+);/g, (_, getal) => String.fromCodePoint(Number(getal)))
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, "&");
}

// Regels met alleen een Hebreeuwse letter (acrostichon, bijv. "נ [noen]") horen niet bij de tekst.
const HEBREEUWSE_REGEL = /^[\u0590-\u05FF]+\s*(\[[^\]]*\])?$/;

function schoonTekst(html: string): string {
	const regels = decodeer(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).split(/\r?\n/);
	return regels
		.map((regel) => regel.replace(/\s+/g, " ").trim())
		.filter((regel) => regel && !HEBREEUWSE_REGEL.test(regel))
		.join(" ");
}

export function parseerHoofdstuk(nummer: number, xml: string, smil: string): Hoofdstuk {
	const fragmenten = new Map<string, Fragment>();
	const volgorde: string[] = [];
	const par = /src="[^"#]*#([^"]+)"[^>]*\/>\s*<audio\s+src="([^"]+)"\s+clipBegin="([^"]+)"\s+clipEnd="([^"]+)"/g;
	for (const treffer of smil.matchAll(par)) {
		fragmenten.set(treffer[1], { bestand: treffer[2], begin: tijd(treffer[3]), einde: tijd(treffer[4]) });
		volgorde.push(treffer[1]);
	}

	const lichaam = xml.slice(xml.indexOf("<bodymatter>"));
	const verzen: Vers[] = [];
	let hoofdstukNummer: number | undefined;
	for (const span of lichaam.matchAll(/<span\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g)) {
		const id = span[1];
		if (!fragmenten.has(id)) continue;
		const tekst = schoonTekst(span[2]);
		// Een versmarkering is "hoofdstuk:vers" aan het begin of na een spatie, en loopt op binnen het hoofdstuk.
		let vorige = verzen[verzen.length - 1]?.nummer ?? 0;
		const markeringen = [...tekst.matchAll(/(?:^|\s)(\d+):(\d+)(?=\s|$)/g)].filter((markering) => {
			const vers = Number(markering[2]);
			if ((hoofdstukNummer !== undefined && Number(markering[1]) !== hoofdstukNummer) || vers <= vorige) return false;
			vorige = vers;
			return true;
		});
		const voorloop = (markeringen.length ? tekst.slice(0, markeringen[0].index) : tekst).trim();
		const laatste = verzen[verzen.length - 1];
		if (voorloop && laatste) {
			laatste.tekst = `${laatste.tekst} ${voorloop}`.trim();
			if (!laatste.spans.includes(id)) laatste.spans.push(id);
		}
		markeringen.forEach((markering, index) => {
			hoofdstukNummer ??= Number(markering[1]);
			const start = (markering.index ?? 0) + markering[0].length;
			const eind = markeringen[index + 1]?.index ?? tekst.length;
			let vers = tekst.slice(start, eind).trim();
			// Psalmen herhalen het hoofdstuknummer aan het begin van het eerste vers.
			if (!verzen.length) vers = vers.replace(new RegExp(`^${hoofdstukNummer}\\s+(?=\\D)`), "");
			verzen.push({ nummer: Number(markering[2]), tekst: vers, spans: [id] });
		});
	}
	const spans = volgorde.filter((id) => fragmenten.has(id)).map((id) => ({ id, fragment: fragmenten.get(id)! }));
	return { nummer, verzen, spans };
}

export function zoekVerzen(hoofdstuk: Hoofdstuk, gevraagd: number[]): Vers[] {
	if (!gevraagd.length) return hoofdstuk.verzen;
	return gevraagd.map((nummer) => {
		const vers = hoofdstuk.verzen.find((kandidaat) => kandidaat.nummer === nummer);
		if (!vers) throw new Error(`Vers ${nummer} bestaat niet in hoofdstuk ${hoofdstuk.nummer}`);
		return vers;
	});
}

// Voegt aansluitende spans uit hetzelfde audiobestand samen tot één fragment.
export function audioFragmenten(hoofdstuk: Hoofdstuk, verzen: Vers[]): Fragment[] {
	const ids = new Set(verzen.flatMap((vers) => vers.spans));
	const fragmenten: Fragment[] = [];
	for (const { id, fragment } of hoofdstuk.spans) {
		if (!ids.has(id)) continue;
		const vorige = fragmenten[fragmenten.length - 1];
		if (vorige && vorige.bestand === fragment.bestand && Math.abs(vorige.einde - fragment.begin) < 0.05) vorige.einde = fragment.einde;
		else fragmenten.push({ ...fragment });
	}
	return fragmenten;
}

const DAISY_NAAM = /^nwt_\d{2}_[^_]+_([A-Za-z])\.daisy(?:\.zip)?$/;
const OVERSLAAN = new Set(["node_modules", "release"]);

// Zoekt (recursief) naar mappen met DAISY-boeken en geeft per taalletter de map met de meeste boeken terug.
export async function vindDaisyMappen(opslag: Opslag, wortels: string[], maxDiepte = 4): Promise<Map<string, string>> {
	const telling = new Map<string, Map<string, number>>();
	const bezocht = new Set<string>();
	const basis = (pad: string) => pad.split("/").pop() ?? pad;
	async function loop(map: string, diepte: number): Promise<void> {
		if (bezocht.has(map)) return;
		bezocht.add(map);
		const inhoud = await opslag.lijst(map).catch(() => undefined);
		if (!inhoud) return;
		const mappen = inhoud.mappen.filter((pad) => !DAISY_NAAM.test(basis(pad)));
		for (const pad of [...inhoud.bestanden, ...inhoud.mappen]) {
			const treffer = DAISY_NAAM.exec(basis(pad));
			if (!treffer) continue;
			const letter = treffer[1].toUpperCase();
			const perMap = telling.get(letter) ?? new Map<string, number>();
			perMap.set(map, (perMap.get(map) ?? 0) + 1);
			telling.set(letter, perMap);
		}
		if (diepte >= maxDiepte) return;
		for (const pad of mappen) {
			const naam = basis(pad);
			if (!naam.startsWith(".") && !OVERSLAAN.has(naam)) await loop(pad, diepte + 1);
		}
	}
	for (const wortel of wortels) await loop(wortel, 0);
	const resultaat = new Map<string, string>();
	for (const [letter, perMap] of telling) {
		const beste = [...perMap.entries()].sort((a, b) => b[1] - a[1])[0];
		resultaat.set(letter, beste[0]);
	}
	return resultaat;
}
