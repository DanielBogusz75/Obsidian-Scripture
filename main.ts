import { Notice, Plugin, PluginSettingTab, Setting } from "obsidian";

import { PythonClient } from "./src/api/pythonClient";

interface ScripturePluginSettings {
	language: "en" | "nl" | "pl";
	pythonExecutable: string;
	backendPath: string;
	jwpubPath: string;
}

const DEFAULT_SETTINGS: ScripturePluginSettings = {
	language: "en",
	pythonExecutable: "python3",
	backendPath: "py_backend/main.py",
	jwpubPath: "",
};

export default class ScripturePlugin extends Plugin {
	settings!: ScripturePluginSettings;

	async onload(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.addSettingTab(new ScriptureSettingTab(this.app, this));
		this.addCommand({
			id: "fetch-scripture-reference",
			name: "Fetch scripture reference",
			callback: async () => {
				const reference = "John 3:16";
				try {
					const result = await this.client().fetch(reference, this.settings.language, this.settings.jwpubPath || undefined);
					new Notice(result.text || result.jw_url);
				} catch (error) {
					new Notice(`Scripture lookup failed: ${String(error)}`);
				}
			},
		});
	}

	private client(): PythonClient {
		return new PythonClient({
			pythonExecutable: this.settings.pythonExecutable,
			backendPath: this.settings.backendPath,
			workingDirectory: ".",
		});
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

class ScriptureSettingTab extends PluginSettingTab {
	constructor(app: ConstructorParameters<typeof PluginSettingTab>[0], private readonly plugin: ScripturePlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		new Setting(containerEl).setName("Language").addDropdown((dropdown) => dropdown
			.addOptions({ en: "English", nl: "Dutch", pl: "Polish" })
			.setValue(this.plugin.settings.language)
			.onChange(async (value) => {
				this.plugin.settings.language = value as ScripturePluginSettings["language"];
				await this.plugin.saveSettings();
			}));
		this.textSetting(containerEl, "Python executable", "pythonExecutable");
		this.textSetting(containerEl, "Backend path", "backendPath");
		this.textSetting(containerEl, "JW PUB path", "jwpubPath");
	}

	private textSetting(container: HTMLElement, name: string, key: "pythonExecutable" | "backendPath" | "jwpubPath"): void {
		new Setting(container).setName(name).addText((text) => text
			.setValue(this.plugin.settings[key])
			.onChange(async (value) => {
				this.plugin.settings[key] = value;
				await this.plugin.saveSettings();
			}));
	}
}