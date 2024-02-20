import path, { dirname } from "path";
import { fileURLToPath } from "url";

const getCommandsUrlAndPath = (url) => {
  const urlDirname = dirname(url);
  const commandsURL = path.join(urlDirname, "../src/commands");
  const commandsPath = fileURLToPath(commandsURL);

  return { commandsURL, commandsPath };
};

export default getCommandsUrlAndPath;
