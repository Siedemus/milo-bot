import { Collection, Events, REST, Routes } from "discord.js";
import getPaths from "./utils/getPaths.js";
import fs from "fs";
import path from "path";
import { CLIENT_ID, DISCORD_TOKEN } from "./config.js";

const registerCommands = async (client) => {
  client.commands = new Collection();
  const commandsList = [];
  const { commandsURL, commandsPath } = getPaths(import.meta.url);
  const rest = new REST().setToken(DISCORD_TOKEN);

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const fileURL = path.join(commandsURL, file);
    const command = await import(fileURL);
    const commandName = command.default.data.name;
    const commandExecute = command.default.execute;
    if (commandName && commandExecute) {
      client.commands.set(commandName, command);
      commandsList.push(command.default.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${fileURL} is missing a required "data" or "execute" property.`
      );
    }
  }

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.log(
        `[WARNING] The command ${interaction.commandName} probably doesn't exist.`
      );
      return;
    }

    try {
      await command.default.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  });

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commandsList,
    });

    console.log(`Successfully reloaded  application (/) commands.`);
  } catch (error) {
    console.error(`Faile to reload application (/) commands: ${error.message}`);
  }
};

export default registerCommands;
