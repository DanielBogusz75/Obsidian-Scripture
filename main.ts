import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, normalizePath } from "obsidian";
import { Passage, TAAL_INFO, TALEN, Taal, formatteerVerzen, parseerVerwijzing, parseerVerwijzingen } from "./src/bible/boeken";
import { DaisyLezer, Fragment, Opslag, Vers, audioFragmenten, vindDaisyMappen, zoekVerzen } from "./src/bible/daisy";

interface TaalInstellingen {
	bijbelMap: string;
	notitieMap: string;
}

interface ScriptuurInstellingen {
	talen: Record<Taal, TaalInstellingen>;
	// Extra map waarin automatisch naar DAISY-bestanden wordt gezocht.
	zoekMap: string;
	laatsteTaal: Taal;
	// Taal waarin de verwijzing wordt ingevoerd; leeg betekent dezelfde taal als de weergavetaal.
	laatsteZoekTaal: Taal | "";
}

function standaardInstellingen(): ScriptuurInstellingen {
	const talen = {} as Record<Taal, TaalInstellingen>;
	for (const taal of TALEN) talen[taal] = { bijbelMap: TAAL_INFO[taal].bijbelMap, notitieMap: TAAL_INFO[taal].notitieMap };
	return { talen, zoekMap: "", laatsteTaal: "nl", laatsteZoekTaal: "" };
}

// Zet opgeslagen gegevens (ook uit versie 0.2 met één bijbelMap/notitieMap) om naar de huidige vorm.
function laadInstellingen(data: any): ScriptuurInstellingen {
	const instellingen = standaardInstellingen();
	if (!data) return instellingen;
	if (typeof data.bijbelMap === "string" && data.bijbelMap.trim()) instellingen.talen.nl.bijbelMap = data.bijbelMap.trim();
	if (typeof data.notitieMap === "string" && data.notitieMap.trim()) instellingen.talen.nl.notitieMap = data.notitieMap.trim();
	for (const taal of TALEN) {
		const opgeslagen = data.talen?.[taal];
		if (typeof opgeslagen?.bijbelMap === "string" && opgeslagen.bijbelMap.trim()) instellingen.talen[taal].bijbelMap = opgeslagen.bijbelMap.trim();
		if (typeof opgeslagen?.notitieMap === "string" && opgeslagen.notitieMap.trim()) instellingen.talen[taal].notitieMap = opgeslagen.notitieMap.trim();
	}
	if (typeof data.zoekMap === "string") instellingen.zoekMap = data.zoekMap.trim();
	if (TALEN.includes(data.laatsteTaal)) instellingen.laatsteTaal = data.laatsteTaal;
	if (TALEN.includes(data.laatsteZoekTaal)) instellingen.laatsteZoekTaal = data.laatsteZoekTaal;
	return instellingen;
}

interface Resultaat {
	passage: Passage;
	verzen: Vers[];
	fragmenten: Fragment[];
}

export default class ScripturePlugin extends Plugin {
	settings!: ScriptuurInstellingen;
	private lezers = {} as Record<Taal, DaisyLezer>;
	private opslag!: Opslag;
	private extern!: (pad: string) => boolean;
	private speler = new AudioSpeler(this);

	async onload(): Promise<void> {
		this.settings = laadInstellingen(await this.loadData());
		const adapter = this.app.vault.adapter;
		// Een absoluut pad (bijv. /home/naam/Bijbel of C:\\Bijbel) wordt rechtstreeks van schijf gelezen, ook buiten de kluis.
		const fs = (window as any).require?.("fs/promises");
		const extern = (pad: string) => Boolean(fs) && /^([a-zA-Z]:[\\/]|\/)/.test(pad);
		this.extern = extern;
		const opslag: Opslag = {
			lijst: async (map) => {
				if (extern(map)) {
					const items = await fs.readdir(map, { withFileTypes: true });
					return {
						bestanden: items.filter((item: any) => item.isFile()).map((item: any) => `${map}/${item.name}`),
						mappen: items.filter((item: any) => item.isDirectory()).map((item: any) => `${map}/${item.name}`),
					};
				}
				const inhoud = await adapter.list(map);
				return { bestanden: inhoud.files, mappen: inhoud.folders };
			},
			leesTekst: (pad) => (extern(pad) ? fs.readFile(pad, "utf8") : adapter.read(pad)),
			leesBinair: async (pad) => new Uint8Array(extern(pad) ? await fs.readFile(pad) : await adapter.readBinary(pad)),
		};
		this.opslag = opslag;
		for (const taal of TALEN) {
			const bijbelMap = () => {
				const map = this.settings.talen[taal].bijbelMap.trim() || TAAL_INFO[taal].bijbelMap;
				return extern(map) ? map : normalizePath(map);
			};
			this.lezers[taal] = new DaisyLezer(opslag, bijbelMap, TAAL_INFO[taal].letter);
		}
		this.addSettingTab(new ScriptuurInstellingenTab(this.app, this));
		this.addCommand({
			id: "bijbeltekst",
			name: "Bijbeltekst opzoeken",
			callback: () => new BijbelModal(this.app, this, this.app.workspace.activeEditor?.editor).open(),
		});
		for (const taal of TALEN) this.registerMarkdownCodeBlockProcessor(TAAL_INFO[taal].audioBlok, (bron, element) => this.toonAudioKnoppen(bron, element, taal));
	}

	onunload(): void {
		this.speler.stop();
	}

	async slaInstellingenOp(): Promise<void> {
		await this.saveData(this.settings);
		for (const taal of TALEN) this.lezers[taal].wis();
	}

	async zoek(passage: Passage): Promise<Resultaat> {
		const hoofdstuk = await this.lezers[passage.taal].hoofdstuk(passage.boek.nummer, passage.hoofdstuk);
		const verzen = zoekVerzen(hoofdstuk, passage.verzen);
		return { passage: { ...passage, verzen: verzen.map((vers) => vers.nummer) }, verzen, fragmenten: audioFragmenten(hoofdstuk, verzen) };
	}

	async zoekAlles(invoer: string, taal: Taal, zoekTaal: Taal = taal): Promise<Resultaat[]> {
		const passages = parseerVerwijzingen(invoer, taal, zoekTaal);
		if (!passages.length) throw new Error("Vul een verwijzing in, bijvoorbeeld Joh 3:16");
		const resultaten: Resultaat[] = [];
		for (const passage of passages) resultaten.push(await this.zoek(passage));
		return resultaten;
	}

	laadAudio(taal: Taal, boek: number, bestand: string): Promise<Uint8Array> {
		return this.lezers[taal].audio(boek, bestand);
	}

	// Zoekt in de kluis, de zoekmap en de mappen naast de ingestelde absolute paden naar DAISY-bestanden.
	async herkenPaden(): Promise<Taal[]> {
		const wortels = [""];
		const voeg = (pad: string) => {
			const schoon = pad.trim().replace(/\/+$/, "");
			if (schoon && !wortels.includes(schoon)) wortels.push(schoon);
		};
		voeg(this.settings.zoekMap);
		for (const taal of TALEN) {
			const map = this.settings.talen[taal].bijbelMap.trim();
			if (this.extern(map) && map.lastIndexOf("/") > 0) voeg(map.slice(0, map.lastIndexOf("/")));
		}
		const gevonden = await vindDaisyMappen(this.opslag, wortels);
		const herkend: Taal[] = [];
		for (const taal of TALEN) {
			const map = gevonden.get(TAAL_INFO[taal].letter);
			if (!map) continue;
			this.settings.talen[taal].bijbelMap = map;
			herkend.push(taal);
		}
		await this.slaInstellingenOp();
		return herkend;
	}

	// Maakt per vers een notitie aan als die nog niet bestaat. Geeft het aantal nieuwe notities terug.
	async maakNotities(resultaten: Resultaat[]): Promise<{ nieuw: number; bestaand: number }> {
		let nieuw = 0;
		let bestaand = 0;
		for (const resultaat of resultaten) {
			for (const vers of resultaat.verzen) {
				const pad = this.notitiePad(resultaat.passage, vers.nummer);
				if (this.app.vault.getAbstractFileByPath(pad) instanceof TFile) {
					bestaand++;
					continue;
				}
				await this.maakMap(pad.slice(0, pad.lastIndexOf("/")));
				await this.app.vault.create(pad, notitieInhoud(resultaat.passage, vers));
				nieuw++;
			}
		}
		return { nieuw, bestaand };
	}

	notitieNaam(passage: Passage, vers: number): string {
		return `${passage.boek.naam} ${passage.hoofdstuk}.${vers}`;
	}

	// Pad zonder .md; links gebruiken het hele pad omdat dezelfde boeknaam in meerdere talen voorkomt (bijv. Job).
	notitieLinkDoel(passage: Passage, vers: number): string {
		const map = this.settings.talen[passage.taal].notitieMap.trim() || TAAL_INFO[passage.taal].notitieMap;
		return normalizePath(`${map}/${this.notitieNaam(passage, vers)}`);
	}

	private notitiePad(passage: Passage, vers: number): string {
		return `${this.notitieLinkDoel(passage, vers)}.md`;
	}

	private async maakMap(map: string): Promise<void> {
		let huidig = "";
		for (const deel of map.split("/").filter(Boolean)) {
			huidig = huidig ? `${huidig}/${deel}` : deel;
			if (!this.app.vault.getAbstractFileByPath(huidig)) await this.app.vault.createFolder(huidig);
		}
	}

	private toonAudioKnoppen(bron: string, element: HTMLElement, taal: Taal): void {
		const container = element.createDiv("scriptuur-audio");
		const regels = bron.split(/\r?\n/).map((regel) => regel.trim()).filter(Boolean);
		for (const regel of regels) {
			const knop = container.createEl("button", { cls: "scriptuur-audio-knop", text: `🔊 ${regel}` });
			knop.addEventListener("click", async () => {
				try {
					await this.speler.speel(knop, taal, regel);
				} catch (fout) {
					new Notice(foutTekst(fout));
				}
			});
		}
	}
}

function foutTekst(fout: unknown): string {
	return fout instanceof Error ? fout.message : String(fout);
}

function notitieInhoud(passage: Passage, vers: Vers): string {
	const verwijzing = `${passage.boek.naam} ${passage.hoofdstuk}:${vers.nummer}`;
	return `---\nType: Bijbel\nBijbelboek: ${passage.boek.naam}\nHoofdstuk: ${passage.hoofdstuk}\nVers: ${vers.nummer}\nAliases: ${verwijzing}\nTaal: ${TAAL_INFO[passage.taal].naam}\n---\n${vers.tekst}\n`;
}

// Eén blok per passage: kop met boek en hoofdstuk, gevolgd door "(vers) tekst"; "…" markeert overgeslagen verzen.
function schrijfUit(resultaat: Resultaat, metKop: boolean): string {
	const { passage, verzen } = resultaat;
	const delen: string[] = [];
	verzen.forEach((vers, index) => {
		if (index > 0 && vers.nummer > verzen[index - 1].nummer + 1) delen.push("…");
		delen.push(`(${vers.nummer}) ${vers.tekst}`);
	});
	const tekst = delen.join(" ");
	return metKop ? `### ${passage.boek.naam} ${passage.hoofdstuk}\n${tekst}` : tekst;
}

function lopendeTekst(resultaat: Resultaat): string {
	const { verzen } = resultaat;
	if (verzen.length === 1) return verzen[0].tekst;
	return schrijfUit(resultaat, false);
}

function verwijzingTekst(passage: Passage): string {
	return `${passage.boek.naam} ${passage.hoofdstuk}:${formatteerVerzen(passage.verzen)}`;
}

function maakLinks(plugin: ScripturePlugin, resultaten: Resultaat[]): string {
	let vorige: string | undefined;
	const links: string[] = [];
	for (const resultaat of resultaten) {
		for (const vers of resultaat.verzen) {
			const voorvoegsel = `${resultaat.passage.boek.naam} ${resultaat.passage.hoofdstuk}`;
			const alias = voorvoegsel === vorige ? String(vers.nummer) : `${voorvoegsel}:${vers.nummer}`;
			links.push(`[[${plugin.notitieLinkDoel(resultaat.passage, vers.nummer)}|${alias}]]`);
			vorige = voorvoegsel;
		}
	}
	return links.join(" ");
}

class BijbelModal extends Modal {
	private invoer!: HTMLTextAreaElement;
	private taalKeuze!: HTMLSelectElement;
	private zoekTaalKeuze!: HTMLSelectElement;
	private uitvoer!: HTMLElement;
	private verwijzingMetTekst?: HTMLInputElement;
	private audioMetTekst?: HTMLInputElement;

	constructor(app: App, private readonly plugin: ScripturePlugin, private readonly editor: Editor | undefined) {
		super(app);
	}

	onOpen(): void {
		this.titleEl.setText("Bijbeltekst");
		const bediening = this.contentEl.createDiv("scriptuur-bediening");
		bediening.createEl("small", { text: "Weergavetaal (tekst en notities)" });
		this.taalKeuze = bediening.createEl("select", { cls: "dropdown" });
		for (const taal of TALEN) this.taalKeuze.add(new Option(TAAL_INFO[taal].naam, taal));
		this.taalKeuze.value = this.plugin.settings.laatsteTaal;
		bediening.createEl("small", { text: "Zoektaal (taal van de boeknaam in je invoer)" });
		this.zoekTaalKeuze = bediening.createEl("select", { cls: "dropdown" });
		this.zoekTaalKeuze.add(new Option("Zelfde als weergavetaal", ""));
		for (const taal of TALEN) this.zoekTaalKeuze.add(new Option(TAAL_INFO[taal].naam, taal));
		this.zoekTaalKeuze.value = this.plugin.settings.laatsteZoekTaal;
		this.invoer = bediening.createEl("textarea", { cls: "scriptuur-invoer" });
		const werkBij = () => this.invoer.setAttribute("placeholder", TAAL_INFO[this.zoekTaal()].voorbeeld);
		this.taalKeuze.addEventListener("change", () => {
			this.plugin.settings.laatsteTaal = this.taal();
			void this.plugin.slaInstellingenOp();
			werkBij();
		});
		this.zoekTaalKeuze.addEventListener("change", () => {
			this.plugin.settings.laatsteZoekTaal = this.zoekTaalKeuze.value as Taal | "";
			void this.plugin.slaInstellingenOp();
			werkBij();
		});
		werkBij();
		this.invoer.addEventListener("keydown", (gebeurtenis) => {
			if (gebeurtenis.key === "Enter" && (gebeurtenis.ctrlKey || gebeurtenis.metaKey)) void this.toonVoorbeeld();
		});
		bediening.createEl("small", { text: "Eén verwijzing per regel (of gescheiden door ;). Zonder vers wordt het hele hoofdstuk gebruikt." });
		const voorbeeldKnop = bediening.createEl("button", { text: "Voorbeeld" });
		voorbeeldKnop.addEventListener("click", () => void this.toonVoorbeeld());
		this.uitvoer = this.contentEl.createEl("pre", { cls: "scriptuur-voorbeeld" });

		const acties = this.contentEl.createDiv("scriptuur-acties");
		const heeftEditor = Boolean(this.editor);
		if (heeftEditor) {
			this.actie(acties, "Invoegen", () => this.invoegen());
			this.verwijzingMetTekst = this.actie(acties, "Verwijzen", () => this.verwijzen(), "Tekst uitschrijven");
			this.audioMetTekst = this.actie(acties, "Audio invoer", () => this.audioInvoer(), "Tekst uitschrijven");
		}
		this.actie(acties, "Notitie", () => this.notitie());
		this.invoer.focus();
	}

	private taal(): Taal {
		return this.taalKeuze.value as Taal;
	}

	private zoekTaal(): Taal {
		return (this.zoekTaalKeuze.value || this.taalKeuze.value) as Taal;
	}

	private actie(houder: HTMLElement, titel: string, uitvoeren: () => Promise<void>, vinkje?: string): HTMLInputElement | undefined {
		const rij = houder.createDiv("scriptuur-actie");
		const knop = rij.createEl("button", { text: titel, cls: "mod-cta" });
		knop.addEventListener("click", async () => {
			try {
				await uitvoeren();
			} catch (fout) {
				this.uitvoer.setText(foutTekst(fout));
			}
		});
		if (!vinkje) return undefined;
		const label = rij.createEl("label", { cls: "scriptuur-vinkje" });
		const selectie = label.createEl("input", { type: "checkbox" });
		label.createSpan({ text: vinkje });
		return selectie;
	}

	private async toonVoorbeeld(): Promise<void> {
		try {
			this.uitvoer.setText("Laden...");
			const resultaten = await this.plugin.zoekAlles(this.invoer.value, this.taal(), this.zoekTaal());
			this.uitvoer.setText(resultaten.map((resultaat) => schrijfUit(resultaat, true)).join("\n\n"));
		} catch (fout) {
			this.uitvoer.setText(foutTekst(fout));
		}
	}

	private async verwerk(): Promise<Resultaat[]> {
		const resultaten = await this.plugin.zoekAlles(this.invoer.value, this.taal(), this.zoekTaal());
		const { nieuw } = await this.plugin.maakNotities(resultaten);
		if (nieuw) new Notice(`${nieuw} ${nieuw === 1 ? "notitie" : "notities"} aangemaakt`);
		return resultaten;
	}

	private plaats(tekst: string): void {
		this.editor?.replaceSelection(tekst);
		this.close();
	}

	private async invoegen(): Promise<void> {
		const resultaten = await this.verwerk();
		this.plaats(resultaten.map((resultaat) => schrijfUit(resultaat, true)).join("\n\n"));
	}

	private async verwijzen(): Promise<void> {
		const resultaten = await this.verwerk();
		if (!this.verwijzingMetTekst?.checked) return this.plaats(maakLinks(this.plugin, resultaten));
		const blokken = resultaten.map((resultaat) => `${lopendeTekst(resultaat)} — ${maakLinks(this.plugin, [resultaat])}`);
		this.plaats(blokken.join("\n\n"));
	}

	private async notitie(): Promise<void> {
		const resultaten = await this.plugin.zoekAlles(this.invoer.value, this.taal(), this.zoekTaal());
		const { nieuw, bestaand } = await this.plugin.maakNotities(resultaten);
		if (!nieuw) new Notice(bestaand === 1 ? "De notitie bestaat al" : "De notities bestaan al");
		else if (bestaand) new Notice(`${nieuw} aangemaakt; ${bestaand} bestonden al`);
		else new Notice(`${nieuw} ${nieuw === 1 ? "notitie" : "notities"} aangemaakt`);
		this.close();
	}

	private async audioInvoer(): Promise<void> {
		const resultaten = await this.verwerk();
		const metTekst = Boolean(this.audioMetTekst?.checked);
		const blokken = resultaten.map((resultaat) => {
			const knop = `\`\`\`${TAAL_INFO[resultaat.passage.taal].audioBlok}\n${verwijzingTekst(resultaat.passage)}\n\`\`\``;
			return metTekst ? `${schrijfUit(resultaat, true)}\n\n${knop}` : knop;
		});
		this.plaats(blokken.join("\n\n"));
	}
}

class AudioSpeler {
	private audio?: HTMLAudioElement;
	private knop?: HTMLButtonElement;
	private bronUrls = new Map<string, string>();
	private ronde = 0;
	private beeindig?: () => void;

	constructor(private readonly plugin: ScripturePlugin) {}

	stop(): void {
		this.ronde++;
		this.beeindig?.();
		this.beeindig = undefined;
		if (this.audio) {
			this.audio.pause();
			this.audio.src = "";
			this.audio = undefined;
		}
		if (this.knop) {
			this.knop.removeClass("is-actief");
			this.knop.setText(this.knop.dataset.label ?? this.knop.getText());
			this.knop = undefined;
		}
		for (const url of this.bronUrls.values()) URL.revokeObjectURL(url);
		this.bronUrls.clear();
	}

	async speel(knop: HTMLButtonElement, taal: Taal, verwijzing: string): Promise<void> {
		const wasActief = this.knop === knop;
		this.stop();
		if (wasActief) return;

		const label = knop.getText();
		knop.dataset.label = label;
		this.knop = knop;
		knop.addClass("is-actief");
		knop.setText(`⏳ ${verwijzing}`);
		const ronde = this.ronde;
		try {
			const resultaat = await this.plugin.zoek(parseerVerwijzing(verwijzing, taal));
			const boek = resultaat.passage.boek.nummer;
			for (let i = 0; i < resultaat.fragmenten.length; i++) {
				if (ronde !== this.ronde) return;
				const fragment = resultaat.fragmenten[i];
				const url = await this.url(taal, boek, fragment.bestand);
				if (ronde !== this.ronde) return;
				if (i === 0) knop.setText(`⏹ ${verwijzing}`);
				await this.afspelen(url, fragment, ronde);
			}
		} finally {
			if (ronde === this.ronde) this.stop();
		}
	}

	private async url(taal: Taal, boek: number, bestand: string): Promise<string> {
		const sleutel = `${taal}/${boek}/${bestand}`;
		const bekend = this.bronUrls.get(sleutel);
		if (bekend) return bekend;
		const data = await this.plugin.laadAudio(taal, boek, bestand);
		const url = URL.createObjectURL(new Blob([data as BlobPart], { type: "audio/mpeg" }));
		this.bronUrls.set(sleutel, url);
		return url;
	}

	private afspelen(url: string, fragment: Fragment, ronde: number): Promise<void> {
		return new Promise((klaar, fout) => {
			const audio = new Audio(url);
			this.audio = audio;
			const einde = () => {
				this.beeindig = undefined;
				audio.removeEventListener("timeupdate", controle);
				audio.pause();
				klaar();
			};
			this.beeindig = einde;
			const controle = () => {
				if (ronde !== this.ronde || audio.currentTime >= fragment.einde - 0.03) einde();
			};
			audio.addEventListener("timeupdate", controle);
			audio.addEventListener("ended", einde);
			audio.addEventListener("error", () => fout(new Error("De audio kan niet worden afgespeeld")));
			audio.addEventListener("loadedmetadata", () => {
				audio.currentTime = fragment.begin;
				audio.play().catch(fout);
			});
		});
	}
}

class ScriptuurInstellingenTab extends PluginSettingTab {
	constructor(app: App, private readonly plugin: ScripturePlugin) {
		super(app, plugin);
	}

	display(): void {
		this.containerEl.empty();
		new Setting(this.containerEl)
			.setName("Paden automatisch herkennen")
			.setDesc("Zoekt in de kluis (en in de zoekmap hieronder) naar DAISY-bestanden en stelt per taal de Bijbelmap in. Mappen naast een al ingesteld absoluut pad worden ook doorzocht.")
			.addButton((knop) =>
				knop.setButtonText("Herkennen").setCta().onClick(async () => {
					knop.setDisabled(true);
					try {
						const herkend = await this.plugin.herkenPaden();
						const gemist = TALEN.filter((taal) => !herkend.includes(taal)).map((taal) => TAAL_INFO[taal].naam);
						new Notice(herkend.length ? `Herkend: ${herkend.map((taal) => TAAL_INFO[taal].naam).join(", ")}${gemist.length ? `. Niet gevonden: ${gemist.join(", ")}` : ""}` : "Geen DAISY-bestanden gevonden. Vul een zoekmap in en probeer opnieuw.");
						this.display();
					} catch (fout) {
						new Notice(foutTekst(fout));
					} finally {
						knop.setDisabled(false);
					}
				}),
			);
		new Setting(this.containerEl)
			.setName("Zoekmap (optioneel)")
			.setDesc("Extra map om in te zoeken, relatief aan de kluis of een absoluut pad, bijvoorbeeld /home/daniel/Programming/Obsidian-Scripture.")
			.addText((tekst) =>
				tekst.setValue(this.plugin.settings.zoekMap).onChange(async (waarde) => {
					this.plugin.settings.zoekMap = waarde.trim();
					await this.plugin.slaInstellingenOp();
				}),
			);
		for (const taal of TALEN) {
			const info = TAAL_INFO[taal];
			new Setting(this.containerEl).setName(info.naam).setHeading();
			new Setting(this.containerEl)
				.setName("Bijbelmap (DAISY)")
				.setDesc(`Map met de ${info.naam.toLowerCase()}e DAISY-bestanden (nwt_01_Ge_${info.letter}.daisy.zip of een uitgepakte map). Relatief aan de kluis, of een absoluut pad.`)
				.addText((tekst) =>
					tekst.setValue(this.plugin.settings.talen[taal].bijbelMap).onChange(async (waarde) => {
						this.plugin.settings.talen[taal].bijbelMap = waarde.trim() || info.bijbelMap;
						await this.plugin.slaInstellingenOp();
					}),
				);
			new Setting(this.containerEl)
				.setName("Notitiemap")
				.setDesc("Map waarin de Bijbelnotities (één per vers) worden aangemaakt.")
				.addText((tekst) =>
					tekst.setValue(this.plugin.settings.talen[taal].notitieMap).onChange(async (waarde) => {
						this.plugin.settings.talen[taal].notitieMap = waarde.trim() || info.notitieMap;
						await this.plugin.slaInstellingenOp();
					}),
				);
		}
		new Setting(this.containerEl)
			.setName("Bijbeltekst opzoeken")
			.addButton((knop) => knop.setButtonText("Openen").onClick(() => new BijbelModal(this.app, this.plugin, this.app.workspace.activeEditor?.editor).open()));
	}
}
