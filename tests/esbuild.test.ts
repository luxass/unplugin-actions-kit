import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { build } from "esbuild";
import { describe, expect, it } from "vitest";
import { fromFileSystem, testdir } from "vitest-testdirs";
import ActionKitPlugin from "../src/esbuild";

it("expect no `actions-kit.d.ts` file generated if plugin not in use", async () => {
	const directoryJson = await fromFileSystem("./tests/fixtures/basic");
	const testdirPath = await testdir(directoryJson);

	expect(testdirPath).toBeDefined();

	const result = await build({
		entryPoints: [join(testdirPath, "index.ts")],
		platform: "node",
		format: "cjs",
		write: false,
		bundle: false,
		minifySyntax: false,
	});

	expect(result).toBeDefined();
	expect(result.outputFiles).toBeDefined();
	const output = result.outputFiles[0];
	expect(output).toBeDefined();
	expect(output?.text).toBeDefined();
	expect(output?.text).toMatchSnapshot();

	const files = await readdir(testdirPath);
	expect(files).not.toContain("actions-kit.d.ts");
});

it("expect `actions-kit.d.ts` to be generated", async () => {
	const directoryJson = await fromFileSystem("./tests/fixtures/basic");
	const testdirPath = await testdir(directoryJson);

	expect(testdirPath).toBeDefined();

	const result = await build({
		entryPoints: [join(testdirPath, "index.ts")],
		platform: "node",
		format: "cjs",
		write: false,
		bundle: false,
		minifySyntax: false,
		plugins: [
			ActionKitPlugin({
				actionPath: join(testdirPath, "action.yaml"),
			}),
		],
	});

	const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

	expect(result).toBeDefined();
	expect(result.outputFiles).toBeDefined();
	const output = result.outputFiles[0];
	expect(output).toBeDefined();
	expect(output?.text).toBeDefined();
	expect(dtsOutput).toMatchSnapshot();
	expect(output?.text).toMatchSnapshot();
});

describe("augmentations", () => {
	it("expect only inputs to be augmented", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-inputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			entryPoints: [join(testdirPath, "index.ts")],
			platform: "node",
			format: "cjs",
			write: false,
			bundle: false,
			minifySyntax: false,
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
				}),
			],
		});

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(result).toBeDefined();
		expect(result.outputFiles).toBeDefined();
		const output = result.outputFiles[0];
		expect(output).toBeDefined();
		expect(output?.text).toBeDefined();

		expect(dtsOutput).not.toContain("ActionOutputName");
		expect(dtsOutput).toContain("ActionInputName");

		expect(dtsOutput).toMatchSnapshot();
		expect(output?.text).toMatchSnapshot();
	});

	it("expect only outputs to be augmented", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-outputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			entryPoints: [join(testdirPath, "index.ts")],
			platform: "node",
			format: "cjs",
			write: false,
			bundle: false,
			minifySyntax: false,
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
				}),
			],
		});

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(result).toBeDefined();
		expect(result.outputFiles).toBeDefined();
		const output = result.outputFiles[0];
		expect(output).toBeDefined();
		expect(output?.text).toBeDefined();

		expect(dtsOutput).toContain("ActionOutputName");
		expect(dtsOutput).not.toContain("ActionInputName");

		expect(dtsOutput).toMatchSnapshot();
		expect(output?.text).toMatchSnapshot();
	});

	it("expect no augmentations", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/empty");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			entryPoints: [join(testdirPath, "index.ts")],
			platform: "node",
			format: "cjs",
			write: false,
			bundle: false,
			minifySyntax: false,
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
				}),
			],
		});

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(result).toBeDefined();
		expect(result.outputFiles).toBeDefined();
		const output = result.outputFiles[0];
		expect(output).toBeDefined();
		expect(output?.text).toBeDefined();

		expect(dtsOutput).not.toContain("ActionOutputName");
		expect(dtsOutput).not.toContain("ActionInputName");

		expect(dtsOutput).toMatchSnapshot();
		expect(output?.text).toMatchSnapshot();
	});
});

describe("inject", () => {
	it("expect `ACTION_INPUTS` in global scope", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-inputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			entryPoints: [join(testdirPath, "index.ts")],
			platform: "node",
			format: "cjs",
			write: false,
			bundle: false,
			minifySyntax: false,
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
					inject: "inputs",
				}),
			],
		});

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(result).toBeDefined();
		expect(result.outputFiles).toBeDefined();
		const output = result.outputFiles[0];
		expect(output).toBeDefined();
		expect(output?.text).toBeDefined();

		expect(dtsOutput).not.toContain("ActionOutputName");
		expect(dtsOutput).not.toContain("ACTION_OUTPUTS");
		expect(dtsOutput).toContain("ActionInputName");
		expect(dtsOutput).toContain("ACTION_INPUTS");

		expect(dtsOutput).toMatchSnapshot();
		expect(output?.text).toMatchSnapshot();
	});

	it("throw if missing `inputs`", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-outputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		expect(
			async () =>
				await build({
					entryPoints: [join(testdirPath, "index.ts")],
					platform: "node",
					format: "cjs",
					write: false,
					bundle: false,
					minifySyntax: false,
					plugins: [
						ActionKitPlugin({
							actionPath: join(testdirPath, "action.yaml"),
							inject: "inputs",
						}),
					],
				}),
		).rejects.toThrow("inputs is not defined in action.yml");
	});

	it("expect `ACTION_OUTPUTS` in global scope", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-outputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			entryPoints: [join(testdirPath, "index.ts")],
			platform: "node",
			format: "cjs",
			write: false,
			bundle: false,
			minifySyntax: false,
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
					inject: "outputs",
				}),
			],
		});

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(result).toBeDefined();
		expect(result.outputFiles).toBeDefined();
		const output = result.outputFiles[0];
		expect(output).toBeDefined();
		expect(output?.text).toBeDefined();

		expect(dtsOutput).toContain("ActionOutputName");
		expect(dtsOutput).toContain("ACTION_OUTPUTS");
		expect(dtsOutput).not.toContain("ActionInputName");
		expect(dtsOutput).not.toContain("ACTION_INPUTS");

		expect(dtsOutput).toMatchSnapshot();
		expect(output?.text).toMatchSnapshot();
	});

	it("throw if missing `outputs`", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-inputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		expect(
			async () =>
				await build({
					entryPoints: [join(testdirPath, "index.ts")],
					platform: "node",
					format: "cjs",
					write: false,
					bundle: false,
					minifySyntax: false,
					plugins: [
						ActionKitPlugin({
							actionPath: join(testdirPath, "action.yaml"),
							inject: "outputs",
						}),
					],
				}),
		).rejects.toThrow("outputs is not defined in action.yml");
	});

	it("expect `ACTION_INPUTS` & `ACTION_OUTPUTS` in global scope", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/basic");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			entryPoints: [join(testdirPath, "index.ts")],
			platform: "node",
			format: "cjs",
			write: false,
			bundle: false,
			minifySyntax: false,
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
					inject: true,
				}),
			],
		});

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(result).toBeDefined();
		expect(result.outputFiles).toBeDefined();
		const output = result.outputFiles[0];
		expect(output).toBeDefined();
		expect(output?.text).toBeDefined();

		expect(dtsOutput).toContain("ActionOutputName");
		expect(dtsOutput).toContain("ACTION_OUTPUTS");
		expect(dtsOutput).toContain("ActionInputName");
		expect(dtsOutput).toContain("ACTION_INPUTS");

		expect(dtsOutput).toMatchSnapshot();
		expect(output?.text).toMatchSnapshot();
	});

	it("expect no change in global scope", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/basic");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			entryPoints: [join(testdirPath, "index.ts")],
			platform: "node",
			format: "cjs",
			write: false,
			bundle: false,
			minifySyntax: false,
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
					inject: false,
				}),
			],
		});

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(result).toBeDefined();
		expect(result.outputFiles).toBeDefined();
		const output = result.outputFiles[0];
		expect(output).toBeDefined();
		expect(output?.text).toBeDefined();

		expect(dtsOutput).toContain("ActionOutputName");
		expect(dtsOutput).not.toContain("ACTION_OUTPUTS");
		expect(dtsOutput).toContain("ActionInputName");
		expect(dtsOutput).not.toContain("ACTION_INPUTS");

		expect(dtsOutput).toMatchSnapshot();
		expect(output?.text).toMatchSnapshot();
	});
});

it("custom output path", async () => {
	const directoryJson = await fromFileSystem("./tests/fixtures/basic");
	const testdirPath = await testdir(directoryJson);

	expect(testdirPath).toBeDefined();

	const result = await build({
		entryPoints: [join(testdirPath, "index.ts")],
		platform: "node",
		format: "cjs",
		write: false,
		bundle: false,
		minifySyntax: false,
		plugins: [
			ActionKitPlugin({
				actionPath: join(testdirPath, "action.yaml"),
				outputPath: join(testdirPath, "custom"),
			}),
		],
	});

	const dtsOutput = await readFile(join(testdirPath, "custom", "actions-kit.d.ts"), "utf-8");

	expect(result).toBeDefined();
	expect(result.outputFiles).toBeDefined();
	const output = result.outputFiles[0];
	expect(output).toBeDefined();
	expect(output?.text).toBeDefined();
	expect(dtsOutput).toMatchSnapshot();
	expect(output?.text).toMatchSnapshot();
});
