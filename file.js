import fs from "fs";
import mime from "mime";


/**
 * Read a text file
 * @param {string} file_path - The path to the file
 * @returns {string} - The contents of the file
 */
const read_text = (file_path) => {

  const mime_type = mime.lookup(file_path);

  switch (mime_type) {
    case "text/plain":
      const text = fs.readFileSync(file_path, "utf8");
      return text;
    case "application/json":
      const json_text = fs.readFileSync(file_path, "utf8");
      return JSON.parse(json_text);
    default:
      throw new Error(`Unsupported file type: ${mime_type}`);
  }
};

export default read_text;
