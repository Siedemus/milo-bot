import path from "path";
import { fileURLToPath } from "url";

const getPaths = (URL) => {
  const dirURL = path.dirname(URL);
  const commandsURL = path.join(dirURL, "commands");
  const commandsPath = fileURLToPath(commandsURL);

  return {
    commandsURL,
    commandsPath,
  };
};

export default getPaths;
