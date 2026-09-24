# Obsidian Scripture

An Obsidian plugin for looking up Bible references from EPUB files stored inside your vault. It reads the EPUB navigation and verse anchors directly, entirely in TypeScript — no Python or external service required.

## Getting Bible files

This plugin does not bundle or distribute any Bible text. Download the New World Translation EPUB for each language you want directly from [jw.org](https://www.jw.org) (**Library > Bible**, then choose the EPUB download for your language), and place the files in a `bibles/` folder in your vault, for example:

- `bibles/nwt_E.epub` — English
- `bibles/nwt_O.epub` — Dutch
- `bibles/nwt_P.epub` — Polish

The local `bibles/` folder in this repository is gitignored, since these publications are copyrighted.

## Installation

### Option A — use the prebuilt release

Copy the contents of `release/obsidian-scripture/` into your vault:

```text
<vault>/.obsidian/plugins/obsidian-scripture/
  main.js
  manifest.json
  styles.css
```

### Option B — build from source

```bash
npm install
npm run build
```

Then copy `main.js`, `manifest.json`, and `styles.css` into `<vault>/.obsidian/plugins/obsidian-scripture/`.

### Bible files

Copy the EPUB(s) you downloaded from jw.org into the vault as well, for example:

```text
<vault>/bibles/nwt_E.epub
<vault>/bibles/nwt_O.epub
```

Enable **Obsidian Scripture** under **Settings > Community plugins**, then reload Obsidian after updating the plugin files.

## Configuration

Open **Settings > Obsidian Scripture**:

- **Bible notes folder** — base folder for created notes; each translation gets its own subfolder (e.g. `Bible/English`).
- **Scripture Search** button — opens the same lookup modal as the command.
- Three fixed translation slots (Dutch, English, Polish). Only the **Bible file** (dropdown of vault EPUBs) and **Bible file or folder** (vault-relative path) are configurable per slot; the name and language of each slot are fixed.

## Using the plugin

Run the **Scripture Search** command from the command palette (or use the button in settings). Enter one or more references — separated by a newline or `;` — pick a default translation, and press **Look up**. Three actions are then available:

- **Insert** *(only with an active editor)* — inserts the looked-up text at the cursor. Each book/chapter gets a `### Book Chapter` heading, followed by the verses (grouped by consecutive ranges) as `(verse) text`. Footnote markers are stripped from inserted text.
- **Reference** *(only with an active editor)* — creates any missing verse note(s) silently, then inserts a link per verse at the cursor: `[[Book Chapter.Verse|Book Chapter:Verse]]` the first time a book appears (or whenever the book changes), and `[[Book Chapter.Verse|Verse]]` for subsequent verses of the same book.
- **Note** — creates one note per verse. If a note already exists it is left untouched (and reported as already existing) instead of being overwritten.

### Reference format

References use a book name (or abbreviation) followed by a chapter and verse:

```text
John 3:16
Joh 3:16
1 Corinthians 13:1-8
```

Multiple verses or ranges in one reference are supported and combined:

```text
Genesis 4:4,7,10
Genesis 1:1-3,8
```

Book names accept:

- The full name in the selected language (e.g. `Genesis`, `Johannes`, `Rodzaju`).
- The official New World Translation / JW.org abbreviation (e.g. `Ge`, `Joh`, `Mt`, `Ap`).
- Common abbreviations used by other translations (e.g. `Gen.`, `Matt`, `Rev`).

For a translation other than the selected default, prefix the reference with its language:

```text
Dutch Johannes 3:16
Polish Jana 3:16
```

The accepted language prefixes are `English`, `Dutch`, `Polish`, `en`, `nl`, and `pl`.

## Notes created by the plugin

Notes are saved as `<notes folder>/<translation>/<Book> <Chapter>.<Verse>.md`, one note per verse, for example:

```text
Bible/Dutch/Genesis 1.5.md
```

The note contains YAML frontmatter and the verse text:

```yaml
---
Type: Bijbel
Bijbelboek: Genesis
Hoofdstuk: 1
Vers: 5
Aliases: Genesis 1:5
Taal: Dutch
---
```

`Aliases` always uses the full canonical book name, even if you searched using an abbreviation. Footnote markers in the verse text are kept, together with a footnote definition list at the end of the note.

## Project structure

```text
main.ts                 Plugin entry point, commands, settings, lookup modal
src/bible/aliases.ts     Book name/abbreviation parsing per language
src/bible/epubReader.ts  Reads verses directly from vault EPUB files
bibles/                  Local, gitignored folder for EPUB Bibles downloaded from jw.org
release/                 Prebuilt, ready-to-install plugin files
```

## Troubleshooting

### No EPUB file is available

Confirm the EPUB is inside the vault, not only in the plugin source folder. Reopen the plugin settings and select it under **Choose Bible file**.

### The reference is not found

Use a supported book name or abbreviation in the selected language, e.g. `John 3:16` for English and `Johannes 3:16` (or `Joh 3:16`) for Dutch.

### The old PDF path is still shown

The plugin converts saved `.pdf` paths to matching `.epub` paths when it loads settings. Select the EPUB manually if the filenames do not match.

### The plugin still shows old behavior

Copy the newly built `main.js`, `manifest.json`, and `styles.css` to the vault plugin folder, then disable and re-enable the plugin or restart Obsidian.

