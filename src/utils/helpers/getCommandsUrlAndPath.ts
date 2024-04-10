import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { CommandsURLAndPATH } from "../types/types";

export const getCommandsURLAndPATH = (url: string): CommandsURLAndPATH => {
  const URLDirName = dirname(url);
  const commandsURL = path.join(URLDirName, "../../commands");
  const commandsPATH = fileURLToPath(commandsURL);

  return { commandsURL, commandsPATH };
};
