# Obsidian Scripture

Obsidian Scripture is a desktop-only Obsidian plugin prototype for looking up Bible references from local JW PUB files. It currently combines:

- A TypeScript Obsidian plugin entrypoint.
- A typed Node.js child-process client.
- A Python citation and scripture backend.
- Local `.jwpub` ZIP/SQLite reading, including the encrypted `z-a` content format used by compatible archives.
- English, Dutch, and Polish book aliases.
- JW.org chapter links with verse anchors.

The current release is an early integration milestone. The plugin exposes a command that fetches the fixed demonstration reference `John 3:16`; automatic Markdown detection, hover previews, pinned panes, insertion commands, and cross-reference views are planned but are not implemented yet.

## Requirements

- Obsidian 1.5 or newer.
- Obsidian Desktop. Mobile is not supported because the plugin starts a local Python process.
- Node.js 18 or newer and npm, for building from source.
- Python 3.12 or newer for the backend.
- A compatible `.jwpub` Bible file if local text is required. JW PUB files are not included in this repository and must be obtained independently from JW.org or another authorized distribution point.

## Install From Source

This is the recommended method for development.

1. Clone or download this repository.
2. Open a terminal in the repository root.
3. Install the Node.js dependencies:

	 ```bash
	 npm install
	 ```

4. Build the plugin bundle:

	 ```bash
	 npm run build
	 ```

5. Verify the Python backend with a lawfully obtained JW PUB file:

	 ```bash
	 /usr/bin/python py_backend/main.py fetch "Johannes 3:16" \
		 --lang nl --jwpub /absolute/path/to/nwtsty_O.jwpub
	 ```

	 The command prints one JSON object containing the reference, extracted verse text, source type, and JW.org URL.

6. Copy the plugin files into your vault's plugin directory. Replace `<vault>` with the path to your Obsidian vault:

	 ```bash
	 mkdir -p "<vault>/.obsidian/plugins/obsidian-scripture"
	 cp main.js manifest.json "<vault>/.obsidian/plugins/obsidian-scripture/"
	 cp -r py_backend "<vault>/.obsidian/plugins/obsidian-scripture/"
	 ```

	Do not copy a JW PUB file into the plugin distribution. Keep your lawfully obtained Bible file outside the distribution, or copy it only where the publisher's terms permit. Configure its absolute path in Obsidian:

	 ```bash
	 # Example only; obtain the file independently and use its actual path.
	 # /absolute/path/to/nwtsty_O.jwpub
	 ```

7. Restart Obsidian or reload the application.
8. Open **Settings > Community plugins**, enable restricted mode off if prompted, and enable **Obsidian Scripture**.
9. Open the plugin settings and configure:

	 - **Language:** `English`, `Dutch`, or `Polish`.
	 - **Python executable:** an executable name such as `python3`, or an absolute path such as `/usr/bin/python`.
	 - **Backend path:** the absolute path to `py_backend/main.py` inside the installed plugin folder. An absolute path is recommended for the current prototype.
	 - **JW PUB path:** the absolute path to a `.jwpub` file.

10. Run **Obsidian Scripture: Fetch scripture reference** from the command palette.

### Linux example

For a vault at `/home/daniel/Notes/MyVault` and this repository at `/home/daniel/Programming/Obsidian-Scripture`:

```bash
mkdir -p /home/daniel/Notes/MyVault/.obsidian/plugins/obsidian-scripture
cp main.js manifest.json /home/daniel/Notes/MyVault/.obsidian/plugins/obsidian-scripture/
cp -r py_backend /home/daniel/Notes/MyVault/.obsidian/plugins/obsidian-scripture/
```

Then use these settings:

```text
Python executable: /usr/bin/python
Backend path: /home/daniel/Notes/MyVault/.obsidian/plugins/obsidian-scripture/py_backend/main.py
JW PUB path: /absolute/path/to/nwtsty_O.jwpub
```

## Install As A Packaged Plugin

There is not yet a published installer, Community Plugins listing, or release archive. Obsidian plugins are normally distributed as a folder containing at least:

```text
obsidian-scripture/
├── main.js
├── manifest.json
└── py_backend/
```

To create a transferable development package after building:

```bash
rm -rf release/obsidian-scripture
mkdir -p release/obsidian-scripture
cp main.js manifest.json release/obsidian-scripture/
cp -r py_backend release/obsidian-scripture/
```

Copy `release/obsidian-scripture` into `<vault>/.obsidian/plugins/`, then configure the absolute backend and JW PUB paths. Do not distribute `node_modules`, TypeScript source maps, or the repository's development database caches.

### Future installer options

The simplest distribution path is a GitHub Release ZIP containing `main.js`, `manifest.json`, and `py_backend/`. Users would extract that folder into their vault's `.obsidian/plugins` directory.

For a better Obsidian workflow, publish the repository and release through [BRAT](https://github.com/TfTHacker/obsidian42-brat) during development. For a public release, submit the plugin to the Obsidian community plugins repository after adding stable settings migration, tests, documentation, and a release process.

An operating-system installer is not recommended for the first release. It would need to bundle or install Python, handle permissions, locate vaults, and keep the backend executable compatible across Linux, macOS, and Windows. A self-contained backend executable built with PyInstaller or Nuitka could remove the Python prerequisite later.

## Supported References

The backend currently accepts references in the form `Book chapter:verse` and `Book chapter:start-end`, including examples such as:

```text
John 3:16
Johannes 3:16
1 Corinthians 13:1-8
Matteus 5:3-10
```

Language is selected with `--lang en`, `--lang nl`, or `--lang pl`. A lawfully obtained Dutch archive can also resolve English aliases because the parser uses canonical Bible book numbers.

The current model supports ranges within one chapter. Cross-chapter references such as `Genesis 1:1-2:3` are a planned extension.

## Backend CLI

The backend can be used independently of Obsidian:

```bash
python py_backend/main.py fetch "John 3:16" --lang en
python py_backend/main.py fetch "Johannes 3:16" --lang nl \
	--jwpub /absolute/path/to/nwtsty_O.jwpub
```

Without `--jwpub`, the command returns a JW.org URL and an empty local text field. With `--jwpub`, it reads the local archive and returns extracted text when the requested verse is present.

Errors are written as JSON to stderr and the command exits with status `1`.

## Development Commands

```bash
npm install
npm run build
npx tsc --noEmit
/usr/bin/python -m compileall -q py_backend
```

The build writes the Obsidian bundle to `main.js`. `node_modules/`, Python bytecode, and other generated files are ignored by Git.

## Project Layout

```text
main.ts                         Obsidian plugin entrypoint
src/api/pythonClient.ts         TypeScript to Python process bridge
py_backend/main.py              JSON command-line interface
py_backend/models/verse.py      Typed scripture models
py_backend/parser/              Localized aliases and citation parsing
py_backend/sources/jwpub_reader.py
																ZIP, SQLite, AES, zlib, and HTML extraction
py_backend/sources/jw_bridge.py JW.org URL generation
bibles/                         Local development Bible archives
manifest.json                   Obsidian plugin metadata
```

## Troubleshooting

### The plugin does not appear in Obsidian

Confirm that `main.js`, `manifest.json`, and `py_backend/` are directly inside:

```text
<vault>/.obsidian/plugins/obsidian-scripture/
```

The files must not be one directory deeper inside another extracted folder. Reload Obsidian after copying them.

### Python cannot be started

Run the configured executable directly:

```bash
/usr/bin/python --version
```

If the executable is not on `PATH`, put its absolute path in the plugin settings.

### The backend path cannot be found

Use an absolute path to the installed `py_backend/main.py`. The current prototype launches Python from an Obsidian process context, so relative paths depend on the host application's working directory.

### A local lookup returns no verse

Check that the selected language matches an alias supported by the parser, that the `.jwpub` file is readable, and that the reference exists in that publication. Test the backend directly from a terminal to see its JSON error:

```bash
/usr/bin/python /absolute/path/to/py_backend/main.py fetch \
	"Johannes 3:16" --lang nl --jwpub /absolute/path/to/nwtsty_O.jwpub
```

## Future Development Recommendations

### 1. Finish the reference model and parser

- Represent a reference as one or more chapter segments so `Genesis 1:1-2:3` is lossless.
- Support abbreviated book names, punctuation, optional spaces, verse lists such as `John 3:16,18`, and localized ordinal forms.
- Add parser tests for English, Dutch, Polish, invalid input, ambiguous aliases, and Unicode book names.
- Return structured parse errors so the UI can distinguish an unrecognized reference from a missing verse.

### 2. Make the Python bridge production-ready

- Replace the fixed demonstration reference in `main.ts` with a request supplied by the editor or Markdown post-processor.
- Move process execution behind a long-lived local service or a managed worker to avoid starting Python for every lookup.
- Add request timeouts, cancellation, bounded output, and clear process cleanup.
- Validate every JSON response against a shared schema, such as JSON Schema or generated TypeScript/Python models.
- Make backend and JW PUB paths vault-relative where possible, while retaining absolute-path support.

### 3. Implement the Obsidian experience

- Add a Markdown post-processor or editor extension that identifies references without changing the original note text.
- Render references as accessible links with hover previews.
- Add a pinned `ItemView` for persistent scripture reading.
- Add commands for inserting a formatted callout:

	```markdown
	> [!quote] John 3:16
	> Verse text goes here.
	```

- Add copy, insert, open-on-jw.org, pin, and refresh actions.
- Use Obsidian's workspace and hover APIs rather than custom global DOM listeners.

### 4. Add source fallback and caching

- Keep the local JW PUB reader as the primary source.
- Add a separate online provider with explicit user consent, rate limiting, and offline behavior.
- Cache lookups by archive path, file modification time, language, and normalized reference.
- Expose the selected source in the UI when local text and online text differ.

### 5. Add cross-references and translation comparison

- Model cross-references separately from verse content.
- Extract study notes and references from NWT study editions where available.
- Allow two configured local archives to be compared side by side.
- Clearly label translation and publication metadata in every preview.

### 6. Improve packaging and release engineering

- Add a release script that builds `main.js`, copies the backend, validates `manifest.json`, and creates a ZIP.
- Add GitHub Actions for TypeScript typechecking, Python tests, bundle creation, and release artifacts.
- Pin or lock dependency versions for reproducible builds.
- Add a `versions.json` file when publishing multiple Obsidian compatibility versions.
- Decide whether the backend should remain a Python prerequisite or be shipped as a platform-specific executable.

### 7. Add tests before public release

- Unit-test aliases, parsing, URL generation, HTML cleanup, and JSON serialization.
- Use small synthetic JW PUB fixtures so tests do not need to open a large user-provided archive every time.
- Add an integration test against a lawfully obtained local archive for Dutch verse extraction and range lookup.
- Add TypeScript tests for process failures, malformed JSON, non-zero exit codes, and paths containing spaces.
- Test Linux, macOS, and Windows path handling before claiming cross-platform support.

### 8. Document content and licensing boundaries

- Explain that Bible text and JW PUB files remain governed by their respective rights holders.
- Avoid redistributing additional copyrighted publication archives in releases unless distribution is permitted.
- Add a clear privacy statement if online lookup or telemetry is introduced.

## Copyright and Content Distribution Notice

This repository distributes software only. It does not distribute, grant a license to, or convey any ownership interest in JW PUB archives, Bible text, publication text, images, or other publisher content.

All `.jwpub` files are excluded from version control and release packages by the repository's `.gitignore` rules. No JW PUB archive is part of the official plugin distribution. The `bibles/` directory is reserved for local development files and must not be treated as a source of distributable content.

Users who require local scripture lookup must obtain the relevant `.jwpub` file independently from [JW.org](https://www.jw.org/) or another official and authorized distribution point. Users are solely responsible for verifying the authenticity, licensing terms, geographic availability, and permitted use of any file they download. The file must be used and stored in accordance with the publisher's applicable terms, copyright law, and other relevant laws and regulations.

Do not commit, upload, package, mirror, or redistribute a JW PUB file or extracted publisher content with this project unless you have obtained the necessary permission or an applicable license. The plugin's ability to read a local file does not establish permission to copy, modify, publish, or distribute that file or its contents.

Before publishing a release, verify that the release archive contains only the software files required by the plugin, such as `main.js`, `manifest.json`, and `py_backend/`, and contains no `.jwpub` archives or extracted copyrighted content.
