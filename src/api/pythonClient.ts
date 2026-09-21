import { spawn } from "node:child_process";

export interface ScriptureReference {
	book: string;
	chapter: number;
	verse_start: number;
	verse_end: number | null;
	language: string;
}

export interface VerseContent {
	reference: ScriptureReference;
	text: string;
	source_type: string;
	jw_url: string;
}

export interface PythonClientOptions {
	pythonExecutable: string;
	backendPath: string;
	workingDirectory: string;
}

export class PythonClient {
	constructor(private readonly options: PythonClientOptions) {}

	fetch(reference: string, language: string, jwpubPath?: string): Promise<VerseContent> {
		const args = [this.options.backendPath, "fetch", reference, "--lang", language];
		if (jwpubPath) {
			args.push("--jwpub", jwpubPath);
		}
		return new Promise((resolve, reject) => {
			const process = spawn(this.options.pythonExecutable, args, {
				cwd: this.options.workingDirectory,
				stdio: ["ignore", "pipe", "pipe"],
			});
			let stdout = "";
			let stderr = "";
			process.stdout.setEncoding("utf8");
			process.stderr.setEncoding("utf8");
			process.stdout.on("data", (chunk: string) => { stdout += chunk; });
			process.stderr.on("data", (chunk: string) => { stderr += chunk; });
			process.on("error", reject);
			process.on("close", (code) => {
				if (code !== 0) {
					reject(new Error(stderr.trim() || `Python backend exited with code ${code}`));
					return;
				}
				try {
					resolve(JSON.parse(stdout) as VerseContent);
				} catch (error) {
					reject(new Error(`Invalid Python backend response: ${String(error)}`));
				}
			});
		});
	}
}