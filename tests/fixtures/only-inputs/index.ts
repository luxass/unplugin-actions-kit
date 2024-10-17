import * as core from "@actions/core";

async function run(): Promise<void> {
  const type = core.getInput("type");
  const whoToGreet = core.getInput("who-to-greet");

  const message = `Hello ${whoToGreet}!`;
  core.info(message);

  if (type === "error") {
    core.setFailed("This is an error!");
  }
}

run().catch((err) => {
  console.error(err);
  core.setFailed(err.message);
});
