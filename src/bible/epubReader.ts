import { App, TFile } from "obsidian";
import { unzipSync } from "fflate";
import { parseReference, BibleLanguage } from "./aliases";

export interface EpubResult { text: string; verseTexts: string[]; footnotes: string[]; location: string; book: string; chapter: number; verses: number[]; }

export class EpubReader {
	private readonly books = new Map<string, Promise<Record<string, Uint8Array>>>();

	constructor(private readonly app: App) {}

	async fetch(referenceText: string, language: BibleLanguage, epubPath: string): Promise<EpubResult> {
		const reference = parseReference(referenceText, language);
		const files = await this.open(epubPath);
		const navigation = this.decode(files[`OEBPS/biblechapternav${reference.bookNumber}.xhtml`]);
		const navigationDocument = new DOMParser().parseFromString(navigation, "application/xhtml+xml");
		const chapterLink = [...navigationDocument.querySelectorAll("a")].find((link) => link.textContent?.trim() === String(reference.chapter));
		if (!chapterLink) throw new Error(`Chapter not found in ${epubPath}: ${referenceText}`);
		const chapterPath = resolvePath("OEBPS/biblechapternav", chapterLink.getAttribute("href") ?? "", files);
		const chapterDocument = new DOMParser().parseFromString(this.decode(files[chapterPath]), "application/xhtml+xml");
		const footnotes: string[] = [];
		const verses = reference.verses.map((verseNumber) => {
			const verseId = `chapter${reference.chapter}_verse${verseNumber}`;
			const verse = chapterDocument.getElementById(verseId);
			if (!verse) throw new Error(`Verse not found in ${epubPath}: ${referenceText}`);
			const text: string[] = [];
			let node: Node | null = verse.nextSibling;
			while (node) {
				if (node.nodeType === Node.ELEMENT_NODE && (node as Element).id?.startsWith(`chapter${reference.chapter}_verse`)) break;
				text.push(nodeToText(node, chapterDocument, footnotes));
				node = node.nextSibling;
			}
			const verseText = cleanVerseText(text.join(" "), verseNumber);
			return { verseNumber, text: verseText };
		});
		return { text: verses.map((verse) => `${verse.verseNumber} ${verse.text}`).join(" "), verseTexts: verses.map((verse) => verse.text), footnotes, location: `${chapterPath}#chapter${reference.chapter}_verse${reference.verses[0]}`, book: reference.book, chapter: reference.chapter, verses: reference.verses };
	}

	private async open(epubPath: string): Promise<Record<string, Uint8Array>> {
		let archive = this.books.get(epubPath);
		if (!archive) {
			const file = this.app.vault.getAbstractFileByPath(epubPath);
			if (!(file instanceof TFile) || file.extension.toLowerCase() !== "epub") throw new Error(`EPUB file not found in the vault: ${epubPath}`);
			archive = this.app.vault.readBinary(file).then((bytes) => unzipSync(new Uint8Array(bytes)));
			this.books.set(epubPath, archive);
		}
		return archive;
	}

	private decode(bytes: Uint8Array | undefined): string {
		if (!bytes) throw new Error("EPUB content file is missing");
		return new TextDecoder("utf-8").decode(bytes);
	}
}

function cleanVerseText(value: string, verseNumber: number): string {
	const normalized = value.replace(/\s+/g, " ").trim();
	return normalized.replace(/^\d+(?:\s+\d+)*\s+/, "").trim();
}

function nodeToText(node: Node, document: Document, footnotes: string[]): string {
	if (node.nodeType !== Node.ELEMENT_NODE) return node.textContent ?? "";
	const element = node as Element;
	const children = [...element.childNodes].map((child) => nodeToText(child, document, footnotes)).join("");
	const href = element.getAttribute("href") ?? "";
	if (/^https?:\/\//i.test(href)) return `[${children}](${href})`;
	if (href.startsWith("#")) {
		const target = document.getElementById(href.slice(1));
		if (target?.getAttribute("epub:type") === "footnote") {
			const content = (target.textContent ?? "").replace(/\s+/g, " ").trim();
			let index = footnotes.indexOf(content);
			if (index < 0) { footnotes.push(content); index = footnotes.length - 1; }
			return `[^${index + 1}]`;
		}
	}
	return children;
}

function resolvePath(_base: string, href: string, files: Record<string, Uint8Array>): string {
		const path = href.split("#")[0];
		if (files[`OEBPS/${path}`]) return `OEBPS/${path}`;
		const match = Object.keys(files).find((name) => name.endsWith(`/${path}`));
		if (!match) throw new Error(`EPUB chapter file is missing: ${path}`);
		return match;
}