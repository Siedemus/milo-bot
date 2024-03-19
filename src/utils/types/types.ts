import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
  default: {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction, client: Client) => Promise<void>;
  };
}

export interface CommandsURLAndPATH {
  commandsURL: string;
  commandsPATH: string;
}
