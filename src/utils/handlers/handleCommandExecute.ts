import { Client, Events } from "discord.js";
import { Command } from "../types/types";

const cooldowns: Map<string, number> = new Map();

const handleCommandExecution = async (
  client: Client,
  commands: Command[] | null
): Promise<void> => {
  if (commands === null) {
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

    if (matchingCommand.default.cooldown !== undefined) {
      const now = Date.now();
      const cooldownAmount = matchingCommand.default.cooldown * 1000;
      const timeStamp = cooldowns.get(interaction.user.id);

      if (timeStamp) {
        const expirationTime = timeStamp + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          await interaction.reply(
            `***Please wait ${timeLeft.toFixed(
              0
            )} more second(s) before reusing the \`${commandName}\` command.***`
          );
          return;
        }
      }

      cooldowns.set(interaction.user.id, now);
      setTimeout(() => cooldowns.delete(interaction.user.id), cooldownAmount);
    }

    matchingCommand?.default.execute(interaction, client);
  });
};

export default handleCommandExecution;
