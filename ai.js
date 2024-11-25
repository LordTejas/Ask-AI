import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const BYTE_ASSISTANT_ID = "asst_scoY1ZJiyeD0EWIZjJ4iR5cK";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  dangerouslyAllowBrowser: true
});

export const create_ask_ai_assistant = async () => {
  const assistant = await openai.beta.assistants.create({
    name: "Ask AI",
    instructions: "You are a helpful assistant that can answer questions from existing files containing the documention about our application.",
    description: "Ask AI is a helpful assistant that can answer questions from existing files containing the documention about our application.",
    model: "gpt-4o-mini",
    tools: [
      {
        type: "file_search",
      },
    ],
  });

  console.log(JSON.stringify(assistant, null, 2));

  return assistant;
}

export const upload_files_to_assistant = async (assistant_id) => {

  const DIR_PATH = "./docs";

  const file_paths = fs.readdirSync(DIR_PATH);
  const file_paths_with_dir = file_paths.map(file_path => `${DIR_PATH}/${file_path}`);

  const files = await Promise.all(file_paths_with_dir.map(file_path => openai.files.create({
    file: fs.createReadStream(file_path),
    purpose: "assistants",
  })));

  // Write the output in uploaded_files.json
  fs.writeFileSync("uploaded_files.json", JSON.stringify(files, null, 2));

  const assistant = await openai.beta.assistants.update(assistant_id, {
    file_ids: files.map(file => file.id),
  });

  console.log(JSON.stringify(assistant, null, 2));
}


export const list_files_in_assistant = async (assistant_id) => {
  const response = await openai.files.list({
    assistant_id,
  });

  console.log(response.data);
}

export const ask_byte_assistant = async (prompt) => {
  const thread = await openai.beta.threads.create();
  
  const response = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: BYTE_ASSISTANT_ID,
    instructions: prompt,
  }); 

  const run_status = await openai.beta.threads.runs.retrieve(thread.id, run.id);

  console.log(JSON.stringify(run_status, null, 2));

  return run_status;
};

// Create the assistant
// create_ask_ai_assistant();

// Upload files to the assistant
// upload_files_to_assistant(BYTE_ASSISTANT_ID);

// List files in the assistant
// list_files_in_assistant(BYTE_ASSISTANT_ID);
