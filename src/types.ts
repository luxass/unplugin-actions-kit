export interface ActionsKitOptions {
	/**
	 * The path to the action.yml or action.yaml file.
	 * If not provided, it will look for action.yml or action.yaml in the root directory.
	 */
	actionPath?: string;

	/**
	 * Inject `inputs` and `outputs` into the global scope.
	 */
	inject?: boolean | "inputs" | "outputs";

	/**
	 * The output path for the generated typescript file.
	 * If not provided, it will use the directory where the action.yml or action.yaml file is located.
	 */
	outputPath?: string;
}
