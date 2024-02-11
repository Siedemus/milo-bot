import path from "path";
import { fileURLToPath } from "url";

const getCommandsUrlAndPath = (URL) => {
  const dirURL = path.dirname(URL);
  const commandsURL = path.join(dirURL, "commands");
  const commandsPath = fileURLToPath(commandsURL);

  return {
    commandsURL,
    commandsPath,
  };
};

export default getCommandsUrlAndPath;
