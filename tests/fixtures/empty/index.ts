import * as core from "@actions/core";

async function run(): Promise<void> {
	core.info("hello world!");
}

run().catch((err) => {
	console.error(err);
	core.setFailed(err.message);
});
