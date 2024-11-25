import { ask_byte_assistant } from "./ai.js";

const prompt = "How can we create a quiz?";

const BYTE_ASSISTANT_ID = "asst_scoY1ZJiyeD0EWIZjJ4iR5cK";

const main = async () => {
  console.time("[Ask AI]");
  const response = await ask_byte_assistant(prompt);
  console.timeEnd("[Ask AI]");
  console.log(JSON.stringify(response, null, 2));
};

main();