import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import YAML from "js-yaml";
import { createUnplugin, type UnpluginFactory, type UnpluginInstance } from "unplugin";
import { ACTION_SCHEMA, writeAugmentationTypes, writeTypeInjects } from "./utils";
import type { ActionsKitOptions } from "./types";

/**
 * A unplugin factory, used by Unplugin to create a new plugin instance.
 */
export const unpluginFactory: UnpluginFactory<ActionsKitOptions | undefined> = (options = {}) => {
	let entryPoint: string | undefined;
	let actionInputs: Record<string, unknown> | undefined;
	let actionOutputs: Record<string, unknown> | undefined;

	return {
		name: "unplugin-actions-kit",
		enforce: "pre",
		resolveId(id, _, options) {
			if (options.isEntry) {
				entryPoint = id;
			}
			return null;
		},
		transformInclude(id) {
			if (entryPoint == null) {
				throw new Error("entryPoint is not set");
			}

			if (!join(process.cwd(), entryPoint).endsWith(id)) {
				return false;
			}

			return true;
		},
		transform(code, id) {
			if (entryPoint == null) {
				throw new Error("entryPoint is not set");
			}

			let modifiedId = id;
			if (modifiedId.startsWith("./")) {
				// remove the "./" prefix
				modifiedId = modifiedId.slice(2);
			}

			if (!join(process.cwd(), entryPoint).endsWith(modifiedId)) {
				return;
			}

			if (options.inject != null && options.inject !== false) {
				let injectCode = "";

				if (options.inject === "inputs") {
					if (actionInputs == null) {
						throw new Error("no `inputs` found in action file.");
					}

					injectCode += `globalThis.ACTION_INPUTS = ${JSON.stringify(actionInputs)};\n`;
				} else if (options.inject === "outputs") {
					if (actionOutputs == null) {
						throw new Error("no `outputs` found in action file.");
					}

					injectCode += `globalThis.ACTION_OUTPUTS = ${JSON.stringify(actionOutputs)};\n`;
				} else {
					if (actionInputs == null) {
						throw new Error("no `inputs` found in action file.");
					}

					if (actionOutputs == null) {
						throw new Error("no `outputs` found in action file.");
					}

					injectCode += `globalThis.ACTION_INPUTS = ${JSON.stringify(actionInputs)};\n`;
					injectCode += `globalThis.ACTION_OUTPUTS = ${JSON.stringify(actionOutputs)};\n`;
				}

				return `${injectCode};\n${code};`;
			}

			return code;
		},
		buildStart() {
			if (options.actionPath == null) {
				// check if either action.yml or action.yaml exists
				const actionYmlPath = join(process.cwd(), "action.yml");
				const actionYamlPath = join(process.cwd(), "action.yaml");

				if (existsSync(actionYmlPath)) {
					options.actionPath = actionYmlPath;
				} else if (existsSync(actionYamlPath)) {
					options.actionPath = actionYamlPath;
				} else {
					throw new Error("action.yml or action.yaml is required");
				}
			}

			// read the file
			const parseResult = ACTION_SCHEMA.safeParse(
				YAML.load(readFileSync(options.actionPath, "utf8")),
			);

			if (!parseResult.success) {
				throw new Error("action.yml or action.yaml is invalid");
			}

			const yaml = parseResult.data;

			if (yaml == null) {
				throw new Error("action.yml or action.yaml is empty");
			}

			if (typeof yaml !== "object") {
				throw new TypeError("action.yml or action.yaml is not an object");
			}

			actionInputs = yaml.inputs;
			actionOutputs = yaml.outputs;

			const outputPath =
				options.outputPath == null ? dirname(options.actionPath) : options.outputPath;

			if (!existsSync(outputPath)) {
				mkdirSync(outputPath, { recursive: true });
			}

			writeFileSync(
				join(outputPath, "actions-kit.d.ts"),
				/* typescript */ `/* eslint-disable */
// @ts-nocheck
// generated by 'actions-kit'

import type * as core from "@actions/core";

${writeTypeInjects(yaml, options)}

declare module "@actions/core" {

${writeAugmentationTypes(yaml)}
}
`,
			);
		},
	};
};

/**
 * The main unplugin instance.
 */
export const unplugin: UnpluginInstance<ActionsKitOptions | undefined, boolean> =
	/* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
