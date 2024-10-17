import * as core from "@actions/core";

async function run(): Promise<void> {
  core.setOutput("message", "Hello, World!");
}

run().catch((err) => {
  console.error(err);
  core.setFailed(err.message);
});
