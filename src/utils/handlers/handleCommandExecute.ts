import { Client, Events } from "discord.js";
import { Command } from "../types/types";
import { v5 as uuidV5 } from "uuid";
import { COOLDOWN_NAMESPACE } from "../resources/namespaces";

const cooldowns: Map<string, { commandName: string; now: number }> = new Map();

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
      const prefix = uuidV5(
        interaction.user.id + commandName,
        COOLDOWN_NAMESPACE
      );
      const now = Date.now();
      const cooldownAmount = matchingCommand.default.cooldown * 1000;
      const timeStamp = cooldowns.get(prefix);

      if (timeStamp) {
        const expirationTime = timeStamp.now + cooldownAmount;

        if (now < expirationTime && timeStamp.commandName === commandName) {
          const timeLeft = (expirationTime - now) / 1000;
          await interaction.reply(
            `***Please wait ${timeLeft.toFixed(
              0
            )} more second(s) before reusing the \`${commandName}\` command.***`
          );
          return;
        }
      }

      cooldowns.set(prefix, {
        commandName: commandName,
        now: now,
      });
      setTimeout(() => cooldowns.delete(interaction.user.id), cooldownAmount);
    }

    matchingCommand?.default.execute(interaction, client);
  });
};

export default handleCommandExecution;
