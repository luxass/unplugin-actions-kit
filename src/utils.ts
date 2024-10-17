import type { ActionsKitOptions } from "./types";

export function writeTypeInjects(
	yaml: Record<string, unknown>,
	options: ActionsKitOptions,
): string {
	if (options.inject === false || options.inject == null) {
		return "";
	}

	let code = `declare global {\n`;

	if (options.inject === "inputs") {
		if (yaml.inputs == null) {
			throw new Error("inputs is not defined in action.yml");
		}

		code = writeActionType(code, "ACTION_INPUTS", yaml.inputs as Record<string, unknown>);
	} else if (options.inject === "outputs") {
		if (yaml.outputs == null) {
			throw new Error("outputs is not defined in action.yml");
		}

		code = writeActionType(code, "ACTION_OUTPUTS", yaml.outputs as Record<string, unknown>);
	} else {
		if (yaml.inputs == null) {
			throw new Error("inputs is not defined in action.yml");
		}

		if (yaml.outputs == null) {
			throw new Error("outputs is not defined in action.yml");
		}

		code = writeActionType(code, "ACTION_INPUTS", yaml.inputs as Record<string, unknown>);
		code = writeActionType(code, "ACTION_OUTPUTS", yaml.outputs as Record<string, unknown>);
	}

	code += `}`;

	return code;
}

function writeActionType(code: string, name: string, obj: Record<string, unknown>): string {
	code += `  export const ${name} = {\n`;

	for (const objName of Object.keys(obj)) {
		code += `    "${objName}": "${objName}",\n`;
	}

	code += `  };\n\n`;
	return code;
}

export function writeAugmentationTypes(yaml: Record<string, unknown>): string {
	let code = ``;

	if (yaml.inputs != null) {
		code += `  type ActionInputName = ${Object.keys(yaml.inputs)
			.map((name) => `"${name}"`)
			.join(" | ")};\n\n`;

		code += `  export function getInput(name: ActionInputName, options?: core.InputOptions): string;\n\n`;
	}

	if (yaml.outputs != null) {
		code += `  type ActionOutputName = ${Object.keys(yaml.outputs)
			.map((name) => `"${name}"`)
			.join(" | ")};\n\n`;

		code += `  export function setOutput(name: ActionOutputName, value: any): void;\n\n`;
	}

	return code;
}
