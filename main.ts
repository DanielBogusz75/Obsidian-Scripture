import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";
import { BibleLanguage } from "./src/bible/aliases";
import { EpubReader, EpubResult } from "./src/bible/epubReader";

interface TranslationSetting { name: string; language: BibleLanguage; path: string; }
interface ScripturePluginSettings { translations: [TranslationSetting, TranslationSetting, TranslationSetting]; notesFolder: string; }

const LANGUAGE_LABELS: Record<BibleLanguage, string> = { en: "English", nl: "Dutch", pl: "Polish" };

const DEFAULT_SETTINGS: ScripturePluginSettings = {
	translations: [
		{ name: "Dutch", language: "nl", path: "bibles/nwt_O.epub" },
		{ name: "English", language: "en", path: "bibles/nwt_E.epub" },
		{ name: "Polish", language: "pl", path: "" },
	],
	notesFolder: "Bible",
};

export default class ScripturePlugin extends Plugin {
	settings!: ScripturePluginSettings;
	private reader!: EpubReader;

	async onload(): Promise<void> {
		this.settings = mergeSettings(await this.loadData());
		this.reader = new EpubReader(this.app);
		this.addSettingTab(new ScriptureSettingTab(this.app, this));
		this.addCommand({
			id: "scripture-search",
			name: "Scripture Search",
			callback: () => new BibleLookupModal(this.app, this, this.app.workspace.activeEditor?.editor).open(),
		});
	}

	/*
	 * Bible references are intentionally command-only. Obsidian owns wiki-link
	 * rendering, so automatic link interception is avoided here.
	 */
	private async decorateBibleLinks(element: HTMLElement, _context: any): Promise<void> {
		this.repairBibleElements(element);
		this.convertRawBibleText(element);
		const textNodes: Text[] = [];
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		let node: Node | null;
		while ((node = walker.nextNode())) {
			if (!node.parentElement?.closest("a, .internal-embed")) textNodes.push(node as Text);
		}
		for (const textNode of textNodes) {
			const pattern = /(!?)\[\[(bible\d*:[^\]|]+)(?:\|([^\]]+))?\]\]|(!?)\[([^\]]+)\]\((#?bible\d*:[^)]+)\)/gi;
			if (!pattern.test(textNode.nodeValue ?? "")) continue;
			pattern.lastIndex = 0;
			const fragment = document.createDocumentFragment();
			let lastIndex = 0;
			for (const match of textNode.nodeValue!.matchAll(pattern)) {
				fragment.append(textNode.nodeValue!.slice(lastIndex, match.index));
				const isEmbed = Boolean(match[1] || match[4]);
				const target = match[2] ?? match[6];
				if (isEmbed) {
					const inline = document.createElement("span");
					inline.addClass("obsidian-scripture-inline");
					inline.setText("Loading verse...");
					fragment.append(inline);
					void this.loadVerse(inline, target, true);
				} else {
					const link = document.createElement("a");
					link.textContent = match[3] ?? match[5] ?? target.replace(/^#?bible\d*:/i, "");
					link.setAttribute("href", "#");
					link.setAttribute("data-bible-href", target);
					fragment.append(link);
				}
				lastIndex = match.index! + match[0].length;
			}
			fragment.append(textNode.nodeValue!.slice(lastIndex));
			textNode.replaceWith(fragment);
		}

		for (const link of Array.from(element.querySelectorAll<HTMLAnchorElement>('a[data-bible-href], a.internal-link, a[href^="bible"], a[href^="#bible"]'))) {
			const bibleHref = link.dataset.bibleHref ?? link.getAttribute("data-href") ?? link.getAttribute("href")?.replace(/^#/, "") ?? "";
			const parsed = parseBibleLink(bibleHref);
			if (!parsed) continue;
			const controlledLink = link.dataset.bibleControlled === "true" ? link : this.replaceBibleLink(link, bibleHref);
			let popup: HTMLElement | undefined;
			const show = async () => {
				if (popup) return;
				popup = document.createElement("div");
				popup.addClass("obsidian-scripture-preview");
				document.body.appendChild(popup);
				const rect = controlledLink.getBoundingClientRect();
				popup.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 420))}px`;
				popup.style.top = `${rect.bottom + 6}px`;
				await this.loadVerse(popup, bibleHref, false);
			};
			const hide = () => { popup?.remove(); popup = undefined; };
			this.registerDomEvent(controlledLink, "mouseenter", () => void show());
			this.registerDomEvent(controlledLink, "mouseleave", () => window.setTimeout(hide, 250));
			this.registerDomEvent(controlledLink, "click", (event) => {
				event.preventDefault();
				void show();
			});
		}
		for (const embed of Array.from(element.querySelectorAll<HTMLElement>(".internal-embed"))) {
			const bibleHref = embed.dataset.bibleHref ?? embed.getAttribute("src") ?? embed.getAttribute("href") ?? embed.textContent ?? "";
			if (!parseBibleLink(bibleHref)) continue;
			const inline = document.createElement("span");
			inline.addClass("obsidian-scripture-inline");
			inline.setText("Loading verse...");
			embed.replaceWith(inline);
			void this.loadVerse(inline, bibleHref, true);
		}
	}

	private convertRawBibleText(root: HTMLElement): void {
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		const nodes: Text[] = [];
		let node: Node | null;
		while ((node = walker.nextNode())) {
			if (node.parentElement?.closest("a, .internal-embed, .cm-editor")) continue;
			if (/!?\[[^\]]+\]\((?:#?bible\d*):[^)]+\)/i.test(node.nodeValue ?? "") || /(?:^|\n)\s*(?:#?bible\d*):.+\s*$/im.test(node.nodeValue ?? "")) nodes.push(node as Text);
		}
		for (const textNode of nodes) {
			const pattern = /(!?)\[([^\]]+)\]\(((?:#?bible\d*):[^)]+)\)|(^|\n)(\s*)((?:#?bible\d*):.+?)(?=\n|$)/gi;
			const value = textNode.nodeValue ?? "";
			const fragment = document.createDocumentFragment();
			let lastIndex = 0;
			for (const match of value.matchAll(pattern)) {
				fragment.append(value.slice(lastIndex, match.index));
				const target = match[3] ?? match[6];
				const label = match[2] ?? target.replace(/^#?bible\d*:/i, "");
				if (match[1] || match[4] !== undefined) {
					const inline = document.createElement("span");
					inline.addClass("obsidian-scripture-inline");
					inline.setText("Loading verse...");
					fragment.append(inline);
					void this.loadVerse(inline, target, true);
				} else {
					const link = document.createElement("a");
					link.textContent = label;
					link.setAttribute("href", "#");
					link.dataset.bibleHref = target;
					fragment.append(link);
				}
				lastIndex = match.index! + match[0].length;
			}
			fragment.append(value.slice(lastIndex));
			textNode.replaceWith(fragment);
		}
	}

	private repairBibleElements(root: HTMLElement): void {
		const candidates = [root, ...Array.from(root.querySelectorAll<HTMLElement>("a, .internal-link, .internal-embed"))];
		for (const candidate of candidates) {
			if (candidate.dataset.bibleRepaired === "true") continue;
			const href = candidate.dataset.bibleHref ?? candidate.getAttribute("data-href") ?? candidate.getAttribute("href") ?? candidate.getAttribute("src") ?? "";
			const text = candidate.textContent?.trim() ?? "";
			const bibleHref = parseBibleLink(href) ? href : extractBibleTarget(text);
			if (!bibleHref) continue;
			candidate.dataset.bibleRepaired = "true";
			if (candidate.matches(".internal-embed")) {
				const inline = document.createElement("span");
				inline.addClass("obsidian-scripture-inline");
				inline.setText("Loading verse...");
				candidate.replaceWith(inline);
				void this.loadVerse(inline, bibleHref, true);
			} else if (candidate instanceof HTMLAnchorElement) {
				this.replaceBibleLink(candidate, bibleHref);
			} else if (candidate.matches(".internal-link")) {
				const link = document.createElement("a");
				link.textContent = text.replace(/^.*?bible\d*:/i, "").replace(/".*$/, "").trim();
				link.setAttribute("href", "#");
				link.dataset.bibleHref = bibleHref;
				link.dataset.bibleControlled = "true";
				link.addClass("obsidian-scripture-link");
				candidate.replaceWith(link);
			}
		}
	}

	private replaceBibleLink(link: HTMLAnchorElement, bibleHref: string): HTMLAnchorElement {
		const replacement = document.createElement("a");
		replacement.textContent = link.textContent || bibleHref.replace(/^bible\d*:/i, "");
		replacement.setAttribute("href", "#");
		replacement.setAttribute("data-bible-href", bibleHref);
		replacement.dataset.bibleControlled = "true";
		replacement.addClass("obsidian-scripture-link");
		replacement.setAttr("title", "Hover or Alt-click to show the verse");
		link.replaceWith(replacement);
		return replacement;
	}

	async fetchBibleText(reference: string, language: BibleLanguage, biblePath: string): Promise<EpubResult> {
		return this.reader.fetch(reference, language, biblePath);
	}

	private async loadVerse(container: HTMLElement, href: string, inline: boolean): Promise<void> {
		const parsed = parseBibleLink(href);
		if (!parsed) return;
		try {
			const translation = this.settings.translations[parsed.translation];
			const biblePath = await this.findConfiguredBible(translation.path);
			if (!biblePath) throw new Error(`No EPUB file found for ${translation.name}`);
			const result = await this.fetchBibleText(parsed.reference, translation.language, biblePath);
			container.setText(inline ? result.text : `${translation.name}: ${result.text}`);
		} catch (error) {
			container.setText(`Scripture lookup failed: ${String(error)}`);
		}
	}

	async findConfiguredBible(configuredPath: string): Promise<string | undefined> {
		const path = configuredPath.trim().replace(/^\/+/, "");
		const file = this.app.vault.getAbstractFileByPath(path);
		if (file instanceof TFile && file.extension.toLowerCase() === "epub") return file.path;
		return this.app.vault.getFiles().find((candidate) => candidate.extension.toLowerCase() === "epub" && (!path || candidate.path.startsWith(`${path}/`)))?.path;
	}

	async saveSettings(): Promise<void> { await this.saveData(this.settings); }
}

class BibleLookupModal extends Modal {
	private input!: HTMLTextAreaElement;
	private translationSelect!: HTMLSelectElement;
	private resultEl!: HTMLElement;
	private results: Array<EpubResult & { reference: string; path: string; translation: string }> = [];

	constructor(app: App, private readonly plugin: ScripturePlugin, private readonly editor: Editor | undefined) { super(app); }

	onOpen(): void {
		this.titleEl.setText("Scripture Search");
		const controls = this.contentEl.createDiv("obsidian-scripture-lookup-controls");
		this.input = controls.createEl("textarea", { placeholder: "Genesis 4:4,7,10" });
		this.input.addClass("obsidian-scripture-reference-input");
		this.translationSelect = controls.createEl("select");
		this.plugin.settings.translations.forEach((translation, index) => this.translationSelect.add(new Option(translation.name, String(index))));
		this.translationSelect.value = "0";
		const lookupButton = controls.createEl("button", { text: "Look up" });
		lookupButton.addEventListener("click", () => void this.lookup());
		this.input.addEventListener("keydown", (event) => { if (event.key === "Enter") void this.lookup(); });
		this.resultEl = this.contentEl.createEl("pre");
		this.resultEl.addClass("obsidian-scripture-lookup-result");
		this.input.focus();
	}

	private async lookup(): Promise<void> {
		const references = this.input.value.split(/\r?\n|;/).map((value) => value.trim()).filter(Boolean);
		if (!references.length) return;
		this.resultEl.setText("Loading EPUB text...");
		try {
			const defaultTranslation = Number(this.translationSelect.value);
			this.results = [];
			for (const value of references) {
				const parsed = parseBibleLink(`bible:${value}`);
				const translationIndex = parsed?.translation === 0 && !/^(english|dutch|polish|en|nl|pl)\s+/i.test(value) ? defaultTranslation : parsed?.translation ?? defaultTranslation;
				const reference = parsed?.reference ?? value;
				const translation = this.plugin.settings.translations[translationIndex];
				const path = await this.plugin.findConfiguredBible(translation.path);
				if (!path) throw new Error(`No EPUB file found for ${translation.name}`);
				const result = await this.plugin.fetchBibleText(reference, translation.language, path);
				this.results.push({ reference: value, ...result, path, translation: translation.name });
			}
				this.resultEl.setText(this.results.map((result) => result.text).join("\n\n"));
				this.contentEl.querySelectorAll(".obsidian-scripture-lookup-actions").forEach((actions) => actions.remove());
			const actions = this.contentEl.createDiv("obsidian-scripture-lookup-actions");
			if (this.editor) {
				const insertButton = actions.createEl("button", { text: "Insert" });
				insertButton.addClass("mod-cta");
				insertButton.addEventListener("click", () => this.insertText());
				const referenceButton = actions.createEl("button", { text: "Reference" });
				referenceButton.addClass("mod-cta");
				referenceButton.addEventListener("click", () => void this.insertReference());
			}
			const noteButton = actions.createEl("button", { text: "Note" });
			noteButton.addClass("mod-cta");
			noteButton.addEventListener("click", () => void this.createNote());
		} catch (error) { this.results = []; this.resultEl.setText(`Scripture lookup failed: ${String(error)}`); }
	}

	private insertText(): void {
		if (!this.results.length || !this.editor) return;
		this.editor.replaceSelection(this.results.map(formatInsertedResult).join("\n\n"));
		this.close();
	}

	private flattenNoteResults(): Array<EpubResult & { reference: string; path: string; translation: string }> {
		return this.results.flatMap((result) => splitNoteResults(result));
	}

	private notePath(noteResult: EpubResult & { reference: string; path: string; translation: string }): string {
		const folder = `${this.plugin.settings.notesFolder.trim().replace(/^\/+|\/+$/g, "")}/${noteResult.translation}`;
		const safeReference = `${noteResult.book} ${noteResult.chapter}.${formatVerseFilename(noteResult.verses)}`;
		return `${folder}/${safeReference}.md`;
	}

	private noteContent(noteResult: EpubResult & { reference: string; path: string; translation: string }): string {
		const reference = noteResult.reference.replace(/^(english|dutch|polish|en|nl|pl)\s+/i, "");
		const firstVerse = noteResult.verses[0];
		const lastVerse = noteResult.verses[noteResult.verses.length - 1];
		const endVerse = noteResult.verses.length > 1 ? `Eindvers: ${lastVerse}\n` : "";
		const noteText = noteResult.verses.map((verse, index) => `(${verse}) ${noteResult.verseTexts[index] ?? ""}`).join(" ");
		return `---\nType: Bijbel\nBijbelboek: ${noteResult.book}\nHoofdstuk: ${noteResult.chapter}\nVers: ${firstVerse}\n${endVerse}Aliases: ${reference}\nTaal: ${noteResult.translation}\n---\n${noteText}${formatFootnotes(noteResult.footnotes)}\n`;
	}

	private async ensureNote(noteResult: EpubResult & { reference: string; path: string; translation: string }): Promise<{ filePath: string; existed: boolean }> {
		const filePath = this.notePath(noteResult);
		await this.ensureFolder(filePath.slice(0, filePath.lastIndexOf("/")));
		const existing = this.app.vault.getAbstractFileByPath(filePath);
		const existed = existing instanceof TFile;
		if (!existed) await this.app.vault.create(filePath, this.noteContent(noteResult));
		return { filePath, existed };
	}

	private async createNote(): Promise<void> {
		try {
			let created = 0;
			let alreadyExisting = 0;
			for (const noteResult of this.flattenNoteResults()) {
				const { existed } = await this.ensureNote(noteResult);
				if (existed) alreadyExisting++;
				else created++;
			}
			if (!created) new Notice("Note already exists");
			else if (alreadyExisting) new Notice(`Created ${created} Bible note${created === 1 ? "" : "s"}; ${alreadyExisting} already exist${alreadyExisting === 1 ? "s" : ""}`);
			else new Notice(`Created ${created} Bible note${created === 1 ? "" : "s"}`);
			this.close();
		} catch (error) { this.resultEl.setText(`Could not create note: ${String(error)}`); }
	}

	private async insertReference(): Promise<void> {
		if (!this.editor) return;
		try {
			let previousBook: string | undefined;
			const links: string[] = [];
			for (const noteResult of this.flattenNoteResults()) {
				await this.ensureNote(noteResult);
				const verse = noteResult.verses[0];
				const target = `${noteResult.book} ${noteResult.chapter}.${verse}`;
				const isNewBook = noteResult.book !== previousBook;
				const alias = isNewBook ? `${noteResult.book} ${noteResult.chapter}:${verse}` : String(verse);
				links.push(`[[${target}|${alias}]]`);
				previousBook = noteResult.book;
			}
			this.editor.replaceSelection(links.join(" "));
			this.close();
		} catch (error) { this.resultEl.setText(`Could not insert reference: ${String(error)}`); }
	}

	private async ensureFolder(folder: string): Promise<void> {
		const parts = folder.split("/");
		let current = "";
		for (const part of parts) {
			current = current ? `${current}/${part}` : part;
			if (!this.app.vault.getAbstractFileByPath(current)) await this.app.vault.createFolder(current);
		}
	}
}

function splitNoteResults(result: EpubResult & { reference: string; path: string; translation: string }): Array<EpubResult & { reference: string; path: string; translation: string }> {
	// Rebuild the reference from the canonical book name rather than the raw (possibly abbreviated) search text.
	return result.verses.map((verse, index) => ({ ...result, reference: `${result.book} ${result.chapter}:${verse}`, verses: [verse], verseTexts: [result.verseTexts[index] ?? ""], text: `${verse} ${result.verseTexts[index] ?? ""}` }));
}

function formatVerseFilename(verses: number[]): string {
	if (verses.length > 1 && verses.every((verse, index) => verse === verses[0] + index)) return `${verses[0]}-${verses[verses.length - 1]}`;
	return verses.join(",");
}

function formatInsertedResult(result: EpubResult & { reference: string; path: string; translation: string }): string {
	const groups: string[][] = [];
	let current: string[] = [];
	let previousVerse: number | undefined;
	for (const [index, verse] of result.verses.entries()) {
		if (previousVerse !== undefined && verse < previousVerse) {
			if (current.length) groups.push(current);
			current = [];
		}
		if (previousVerse !== undefined && verse > previousVerse + 1) current.push("…");
		const verseText = (result.verseTexts[index] ?? "").replace(/\[\^\d+\]/g, "").replace(/\s+/g, " ").trim();
		current.push(`(${verse}) ${verseText}`);
		previousVerse = verse;
	}
	if (current.length) groups.push(current);
	return groups.map((group) => `### ${result.book} ${result.chapter}\n${group.join(" ")}`).join("\n\n");
}

function formatFootnotes(footnotes: string[]): string {
	return footnotes.length ? `\n---\n${footnotes.map((footnote, index) => `[^${index + 1}]: ${footnote}`).join("\n")}` : "";
}

class ScriptureSettingTab extends PluginSettingTab {
	constructor(app: App, private readonly plugin: ScripturePlugin) { super(app, plugin); }

	display(): void {
		this.containerEl.empty();
		this.containerEl.createEl("p", { text: "Set a vault-relative EPUB file path or folder for each translation. A blank path searches the whole vault." });
		new Setting(this.containerEl)
			.setName("Bible notes folder")
			.setDesc("Base folder; notes are created inside a language subfolder")
			.addText((text) => text.setValue(this.plugin.settings.notesFolder).onChange(async (value) => { this.plugin.settings.notesFolder = value.trim() || "Bible"; await this.plugin.saveSettings(); }));
		new Setting(this.containerEl)
			.setName("Bible tools")
			.setDesc("Search scripture to insert text or create a Bible verse note from the active EPUB")
			.addButton((button) => button.setButtonText("Scripture Search").onClick(() => new BibleLookupModal(this.app, this.plugin, this.app.workspace.activeEditor?.editor).open()));
		const bibleFiles = this.app.vault.getFiles().filter((file) => file.extension.toLowerCase() === "epub").sort((left, right) => left.path.localeCompare(right.path));
		this.plugin.settings.translations.forEach((translation) => {
			new Setting(this.containerEl).setName(translation.name).setDesc(`Language: ${LANGUAGE_LABELS[translation.language]}`).setHeading();
			new Setting(this.containerEl).setName("Choose Bible file").addDropdown((dropdown) => {
				dropdown.addOption("", "Search whole vault");
				for (const file of bibleFiles) dropdown.addOption(file.path, file.path);
				dropdown.setValue(translation.path);
				dropdown.onChange(async (value) => { translation.path = value; await this.plugin.saveSettings(); });
			});
			new Setting(this.containerEl).setName("Bible file or folder").setDesc("Vault-relative path").addText((text) => text.setValue(translation.path).onChange(async (value) => { translation.path = value; await this.plugin.saveSettings(); }));
		});
	}
}

function parseBibleLink(href: string): { reference: string; translation: number } | null {
	try {
		const prefix = /bible(\d*):(?:\/\/)?/i.exec(href.replace(/^#/, ""));
		if (!prefix) return null;
		const value = decodeURIComponent(href.slice((prefix.index ?? 0) + prefix[0].length).replace(/\+/g, " "));
		const suffix = /(?:\?|\s+)translation=(\d+)\s*$/i.exec(value);
		const referenceValue = (suffix ? value.slice(0, suffix.index) : value).trim();
		const prefixTranslation = prefix[1] ? Number(prefix[1]) - 1 : 0;
		const languagePrefix = /^(english|dutch|polish|en|nl|pl)\s+/i.exec(referenceValue);
		const languageTranslation = languagePrefix ? { english: 0, en: 0, dutch: 1, nl: 1, polish: 2, pl: 2 }[languagePrefix[1].toLowerCase() as "english" | "en" | "dutch" | "nl" | "polish" | "pl"] : undefined;
		const reference = (languagePrefix ? referenceValue.slice(languagePrefix[0].length) : referenceValue).trim();
		const translation = suffix ? Number(suffix[1]) : languageTranslation ?? prefixTranslation;
		return { reference, translation: Number.isInteger(translation) && translation >= 0 && translation < 3 ? translation : 0 };
	} catch { return null; }
}

function extractBibleTarget(value: string): string | null {
	const match = /(?:#?bible\d*:[^)|\]]+)/i.exec(value);
	return match?.[0]?.trim() ?? null;
}

function mergeSettings(data: Partial<ScripturePluginSettings> | null): ScripturePluginSettings {
	// Name and language are fixed per translation slot; only the vault path is user-configurable.
	const translations = Array.isArray(data?.translations) ? data.translations : [];
	const saved = DEFAULT_SETTINGS.translations.map((defaultTranslation, index) => ({ ...defaultTranslation, path: translations[index]?.path ?? defaultTranslation.path }));
	return { translations: saved.map((setting) => {
		if (setting.path.toLowerCase().endsWith(".pdf")) setting.path = setting.path.replace(/\.pdf$/i, ".epub");
		return setting;
	}) as ScripturePluginSettings["translations"], notesFolder: data?.notesFolder?.trim() || "Bible" };
}
