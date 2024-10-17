import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { build } from "vite";
import { describe, expect, it } from "vitest";
import { fromFileSystem, testdir } from "vitest-testdirs";
import ActionKitPlugin from "../src/vite";

it("expect no `actions-kit.d.ts` file generated if plugin not in use", async () => {
	const directoryJson = await fromFileSystem("./tests/fixtures/basic");
	const testdirPath = await testdir(directoryJson);

	expect(testdirPath).toBeDefined();

	const result = await build({
		build: {
			lib: {
				entry: join(testdirPath, "index.ts"),
				formats: ["cjs"],
				fileName: "bundle",
				name: "bundle",
			},
			rollupOptions: {
				external: ["@actions/core"],
			},
			minify: false,
		},
	});

	if (!Array.isArray(result)) {
		expect.fail("result is not an array");
	}

	expect(result).toBeDefined();

	const firstResult = result[0];

	expect(firstResult).toBeDefined();
	expect(firstResult?.output).toBeDefined();
	expect(firstResult?.output[0]).toBeDefined();
	expect(firstResult?.output[0].code).toBeDefined();
	expect(firstResult?.output[0].code).toMatchSnapshot();

	const files = await readdir(testdirPath);
	expect(files).not.toContain("actions-kit.d.ts");
});

it("expect `actions-kit.d.ts` to be generated", async () => {
	const directoryJson = await fromFileSystem("./tests/fixtures/basic");
	const testdirPath = await testdir(directoryJson);

	expect(testdirPath).toBeDefined();

	const result = await build({
		build: {
			lib: {
				entry: join(testdirPath, "index.ts"),
				formats: ["cjs"],
				fileName: "bundle",
				name: "bundle",
			},
			rollupOptions: {
				external: ["@actions/core"],
			},
			minify: false,
		},
		plugins: [
			ActionKitPlugin({
				actionPath: join(testdirPath, "action.yaml"),
			}),
		],
	});

	if (!Array.isArray(result)) {
		expect.fail("result is not an array");
	}

	expect(result).toBeDefined();

	const firstResult = result[0];

	expect(firstResult).toBeDefined();
	expect(firstResult?.output).toBeDefined();
	expect(firstResult?.output[0]).toBeDefined();
	expect(firstResult?.output[0].code).toBeDefined();
	expect(firstResult?.output[0].code).toMatchSnapshot();

	const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

	expect(dtsOutput).toMatchSnapshot();
});

describe("augmentations", () => {
	it("expect only inputs to be augmented", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-inputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			build: {
				lib: {
					entry: join(testdirPath, "index.ts"),
					formats: ["cjs"],
					fileName: "bundle",
					name: "bundle",
				},
				rollupOptions: {
					external: ["@actions/core"],
				},
				minify: false,
			},
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
				}),
			],
		});

		if (!Array.isArray(result)) {
			expect.fail("result is not an array");
		}

		expect(result).toBeDefined();

		const firstResult = result[0];

		expect(firstResult).toBeDefined();
		expect(firstResult?.output).toBeDefined();
		expect(firstResult?.output[0]).toBeDefined();
		expect(firstResult?.output[0].code).toBeDefined();
		expect(firstResult?.output[0].code).toMatchSnapshot();

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(dtsOutput).not.toContain("ActionOutputName");
		expect(dtsOutput).toContain("ActionInputName");
		expect(dtsOutput).toMatchSnapshot();
	});

	it("expect only outputs to be augmented", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-outputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			build: {
				lib: {
					entry: join(testdirPath, "index.ts"),
					formats: ["cjs"],
					fileName: "bundle",
					name: "bundle",
				},
				rollupOptions: {
					external: ["@actions/core"],
				},
				minify: false,
			},
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
				}),
			],
		});

		if (!Array.isArray(result)) {
			expect.fail("result is not an array");
		}

		expect(result).toBeDefined();

		const firstResult = result[0];

		expect(firstResult).toBeDefined();
		expect(firstResult?.output).toBeDefined();
		expect(firstResult?.output[0]).toBeDefined();
		expect(firstResult?.output[0].code).toBeDefined();
		expect(firstResult?.output[0].code).toMatchSnapshot();

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(dtsOutput).toContain("ActionOutputName");
		expect(dtsOutput).not.toContain("ActionInputName");
		expect(dtsOutput).toMatchSnapshot();
	});

	it("expect no augmentations", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/empty");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			build: {
				lib: {
					entry: join(testdirPath, "index.ts"),
					formats: ["cjs"],
					fileName: "bundle",
					name: "bundle",
				},
				rollupOptions: {
					external: ["@actions/core"],
				},
				minify: false,
			},
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
				}),
			],
		});

		if (!Array.isArray(result)) {
			expect.fail("result is not an array");
		}

		expect(result).toBeDefined();

		const firstResult = result[0];

		expect(firstResult).toBeDefined();
		expect(firstResult?.output).toBeDefined();
		expect(firstResult?.output[0]).toBeDefined();
		expect(firstResult?.output[0].code).toBeDefined();
		expect(firstResult?.output[0].code).toMatchSnapshot();

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(dtsOutput).not.toContain("ActionOutputName");
		expect(dtsOutput).not.toContain("ActionInputName");
		expect(dtsOutput).toMatchSnapshot();
	});
});

describe("inject", () => {
	it("expect `ACTION_INPUTS` in global scope", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-inputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			build: {
				lib: {
					entry: join(testdirPath, "index.ts"),
					formats: ["cjs"],
					fileName: "bundle",
					name: "bundle",
				},
				rollupOptions: {
					external: ["@actions/core"],
				},
				minify: false,
			},
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
					inject: "inputs",
				}),
			],
		});

		if (!Array.isArray(result)) {
			expect.fail("result is not an array");
		}

		expect(result).toBeDefined();

		const firstResult = result[0];

		expect(firstResult).toBeDefined();
		expect(firstResult?.output).toBeDefined();
		expect(firstResult?.output[0]).toBeDefined();
		expect(firstResult?.output[0].code).toBeDefined();
		expect(firstResult?.output[0].code).toMatchSnapshot();

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(dtsOutput).not.toContain("ActionOutputName");
		expect(dtsOutput).not.toContain("ACTION_OUTPUTS");
		expect(dtsOutput).toContain("ActionInputName");
		expect(dtsOutput).toContain("ACTION_INPUTS");

		expect(dtsOutput).toMatchSnapshot();
	});

	it("throw if missing `inputs`", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-outputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		expect(
			async () =>
				await build({
					build: {
						lib: {
							entry: join(testdirPath, "index.ts"),
							formats: ["cjs"],
							fileName: "bundle",
							name: "bundle",
						},
						rollupOptions: {
							external: ["@actions/core"],
						},
						minify: false,
					},
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
			build: {
				lib: {
					entry: join(testdirPath, "index.ts"),
					formats: ["cjs"],
					fileName: "bundle",
					name: "bundle",
				},
				rollupOptions: {
					external: ["@actions/core"],
				},
				minify: false,
			},
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
					inject: "outputs",
				}),
			],
		});

		if (!Array.isArray(result)) {
			expect.fail("result is not an array");
		}

		expect(result).toBeDefined();

		const firstResult = result[0];

		expect(firstResult).toBeDefined();
		expect(firstResult?.output).toBeDefined();
		expect(firstResult?.output[0]).toBeDefined();
		expect(firstResult?.output[0].code).toBeDefined();
		expect(firstResult?.output[0].code).toMatchSnapshot();

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(dtsOutput).toContain("ActionOutputName");
		expect(dtsOutput).toContain("ACTION_OUTPUTS");
		expect(dtsOutput).not.toContain("ActionInputName");
		expect(dtsOutput).not.toContain("ACTION_INPUTS");

		expect(dtsOutput).toMatchSnapshot();
	});

	it("throw if missing `outputs`", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/only-inputs");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		expect(
			async () =>
				await build({
					build: {
						lib: {
							entry: join(testdirPath, "index.ts"),
							formats: ["cjs"],
							fileName: "bundle",
							name: "bundle",
						},
						rollupOptions: {
							external: ["@actions/core"],
						},
						minify: false,
					},
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
			build: {
				lib: {
					entry: join(testdirPath, "index.ts"),
					formats: ["cjs"],
					fileName: "bundle",
					name: "bundle",
				},
				rollupOptions: {
					external: ["@actions/core"],
				},
				minify: false,
			},
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
					inject: true,
				}),
			],
		});

		if (!Array.isArray(result)) {
			expect.fail("result is not an array");
		}

		expect(result).toBeDefined();

		const firstResult = result[0];

		expect(firstResult).toBeDefined();
		expect(firstResult?.output).toBeDefined();
		expect(firstResult?.output[0]).toBeDefined();
		expect(firstResult?.output[0].code).toBeDefined();
		expect(firstResult?.output[0].code).toMatchSnapshot();

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(dtsOutput).toContain("ActionOutputName");
		expect(dtsOutput).toContain("ACTION_OUTPUTS");
		expect(dtsOutput).toContain("ActionInputName");
		expect(dtsOutput).toContain("ACTION_INPUTS");

		expect(dtsOutput).toMatchSnapshot();
	});

	it("expect no change in global scope", async () => {
		const directoryJson = await fromFileSystem("./tests/fixtures/basic");
		const testdirPath = await testdir(directoryJson);

		expect(testdirPath).toBeDefined();

		const result = await build({
			build: {
				lib: {
					entry: join(testdirPath, "index.ts"),
					formats: ["cjs"],
					fileName: "bundle",
					name: "bundle",
				},
				rollupOptions: {
					external: ["@actions/core"],
				},
				minify: false,
			},
			plugins: [
				ActionKitPlugin({
					actionPath: join(testdirPath, "action.yaml"),
					inject: false,
				}),
			],
		});

		if (!Array.isArray(result)) {
			expect.fail("result is not an array");
		}

		expect(result).toBeDefined();

		const firstResult = result[0];

		expect(firstResult).toBeDefined();
		expect(firstResult?.output).toBeDefined();
		expect(firstResult?.output[0]).toBeDefined();
		expect(firstResult?.output[0].code).toBeDefined();
		expect(firstResult?.output[0].code).toMatchSnapshot();

		const dtsOutput = await readFile(join(testdirPath, "actions-kit.d.ts"), "utf-8");

		expect(dtsOutput).toContain("ActionOutputName");
		expect(dtsOutput).not.toContain("ACTION_OUTPUTS");
		expect(dtsOutput).toContain("ActionInputName");
		expect(dtsOutput).not.toContain("ACTION_INPUTS");

		expect(dtsOutput).toMatchSnapshot();
	});
});

it("custom output path", async () => {
	const directoryJson = await fromFileSystem("./tests/fixtures/basic");
	const testdirPath = await testdir(directoryJson);

	expect(testdirPath).toBeDefined();

	const result = await build({
		build: {
			lib: {
				entry: join(testdirPath, "index.ts"),
				formats: ["cjs"],
				fileName: "bundle",
				name: "bundle",
			},
			rollupOptions: {
				external: ["@actions/core"],
			},
			minify: false,
		},
		plugins: [
			ActionKitPlugin({
				actionPath: join(testdirPath, "action.yaml"),
				outputPath: join(testdirPath, "custom"),
			}),
		],
	});

	if (!Array.isArray(result)) {
		expect.fail("result is not an array");
	}

	expect(result).toBeDefined();

	const firstResult = result[0];

	expect(firstResult).toBeDefined();
	expect(firstResult?.output).toBeDefined();
	expect(firstResult?.output[0]).toBeDefined();
	expect(firstResult?.output[0].code).toBeDefined();
	expect(firstResult?.output[0].code).toMatchSnapshot();

	const dtsOutput = await readFile(join(testdirPath, "custom", "actions-kit.d.ts"), "utf-8");

	expect(dtsOutput).toMatchSnapshot();
});
