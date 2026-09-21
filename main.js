"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ScripturePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/api/pythonClient.ts
var import_node_child_process = require("node:child_process");
var PythonClient = class {
  constructor(options) {
    this.options = options;
  }
  fetch(reference, language, jwpubPath) {
    const args = [this.options.backendPath, "fetch", reference, "--lang", language];
    if (jwpubPath) {
      args.push("--jwpub", jwpubPath);
    }
    return new Promise((resolve, reject) => {
      const process = (0, import_node_child_process.spawn)(this.options.pythonExecutable, args, {
        cwd: this.options.workingDirectory,
        stdio: ["ignore", "pipe", "pipe"]
      });
      let stdout = "";
      let stderr = "";
      process.stdout.setEncoding("utf8");
      process.stderr.setEncoding("utf8");
      process.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      process.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      process.on("error", reject);
      process.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(stderr.trim() || `Python backend exited with code ${code}`));
          return;
        }
        try {
          resolve(JSON.parse(stdout));
        } catch (error) {
          reject(new Error(`Invalid Python backend response: ${String(error)}`));
        }
      });
    });
  }
};

// main.ts
var DEFAULT_SETTINGS = {
  language: "en",
  pythonExecutable: "python3",
  backendPath: "py_backend/main.py",
  jwpubPath: ""
};
var ScripturePlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new ScriptureSettingTab(this.app, this));
    this.addCommand({
      id: "fetch-scripture-reference",
      name: "Fetch scripture reference",
      callback: async () => {
        const reference = "John 3:16";
        try {
          const result = await this.client().fetch(reference, this.settings.language, this.settings.jwpubPath || void 0);
          new import_obsidian.Notice(result.text || result.jw_url);
        } catch (error) {
          new import_obsidian.Notice(`Scripture lookup failed: ${String(error)}`);
        }
      }
    });
  }
  client() {
    return new PythonClient({
      pythonExecutable: this.settings.pythonExecutable,
      backendPath: this.settings.backendPath,
      workingDirectory: "."
    });
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var ScriptureSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Language").addDropdown((dropdown) => dropdown.addOptions({ en: "English", nl: "Dutch", pl: "Polish" }).setValue(this.plugin.settings.language).onChange(async (value) => {
      this.plugin.settings.language = value;
      await this.plugin.saveSettings();
    }));
    this.textSetting(containerEl, "Python executable", "pythonExecutable");
    this.textSetting(containerEl, "Backend path", "backendPath");
    this.textSetting(containerEl, "JW PUB path", "jwpubPath");
  }
  textSetting(container, name, key) {
    new import_obsidian.Setting(container).setName(name).addText((text) => text.setValue(this.plugin.settings[key]).onChange(async (value) => {
      this.plugin.settings[key] = value;
      await this.plugin.saveSettings();
    }));
  }
};
