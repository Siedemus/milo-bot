import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody as CommandJSONBody,
  Routes,
} from "discord.js";
import { Command, CommandsURLAndPATH } from "../types/types";
import { getCommandsURLAndPATH } from "../helpers/getCommandsUrlAndPath";
import { CLIENT_ID, DISCORD_TOKEN } from "../configs/config.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";

const handleCommandsRegistration = async (): Promise<Command[] | null> => {
  const rest = new REST().setToken(DISCORD_TOKEN!);
  const commands: Command[] = [];
  const commandsJSON: CommandJSONBody[] = [];
  const { commandsURL, commandsPATH }: CommandsURLAndPATH =
    getCommandsURLAndPATH(import.meta.url);
  const commandFolders = fs.readdirSync(commandsPATH);

  for (const folder of commandFolders) {
    const folderPATH = path.join(commandsPATH, folder);
    const folderURL = path.join(commandsURL, folder);
    const commandFiles = fs
      .readdirSync(folderPATH)
      .filter((file) => file.includes("-command"));

    for (const file of commandFiles) {
      const fileUrl = path.join(folderURL, file);
      const command: Command = await import(fileUrl);
      const { data } = command.default;

      if (data.name && data.description) {
        commands.push(command);
      } else {
        throw new Error(`[WARNING] There's a problem with ${file} command.`);
      }
    }
  }

  try {
    console.log(
      chalk.bold.blueBright(
        "[PENDING] Started refreshing application (/) commands."
      )
    );

    for (const command of commands) {
      commandsJSON.push(command.default.data.toJSON());
    }

    rest.put(Routes.applicationCommands(CLIENT_ID!), {
      body: commandsJSON,
    });

    console.log(
      chalk.bold.greenBright(
        `[SUCCESS] All (${commands.length}) application (/) commands successfully refreshed.`
      )
    );
  } catch {
    throw new Error("[WARNING] There's a problem with command refreshing!");
  }

  return commands;
};

export default handleCommandsRegistration;
