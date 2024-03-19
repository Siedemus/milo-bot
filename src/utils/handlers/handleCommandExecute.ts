import { Client, Events } from "discord.js";
import { Command } from "../types/types";

const handleCommandExecution = (
  client: Client,
  commands: Command[] | null
): void => {
  if (typeof commands === null) {
    throw new Error("[WARNING] Commands List is empty!");
  }

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) {
      return;
    }

    const { commandName } = interaction;
    const matchingCommand = commands?.filter((command) => {
      return command.default.data.name === commandName;
    })[0];

    matchingCommand?.default.execute(interaction, client);
  });
};

export default handleCommandExecution;
