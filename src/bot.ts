import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from "./utils/configs/config.js";
import handleBotReady from "./utils/handlers/handleBotReady.js";
import handleCommandRegistration from "./utils/handlers/handleCommandsRegistration.js";
import handleCommandExecution from "./utils/handlers/handleCommandExecute.js";
import { checkEnvVariables } from "./utils/helpers/checkEnvVariables.js";
import chalk from "chalk";
import { createQueuesFolder } from "./utils/helpers/createQueuesFolder.js";

(async () => {
  try {
    checkEnvVariables();

    const client: Client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });

    const commands = await handleCommandRegistration();
    handleCommandExecution(client, commands);
    createQueuesFolder();
    handleBotReady(client);

    client.login(DISCORD_TOKEN);
  } catch (error) {
    console.log(chalk.bold.red(error));
  }
})();
