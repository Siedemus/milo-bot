import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from "./utils/configs/config";
import handleBotReady from "./utils/handlers/handleBotReady";
import handleCommandRegistration from "./utils/handlers/handleCommandsRegistration";
import handleCommandExecution from "./utils/handlers/handleCommandExecute";
import { checkEnvVariables } from "./utils/helpers/checkEnvVariables";
import chalk from "chalk";
import { createQueuesFolder } from "./utils/helpers/createQueuesFolder";

(async () => {
  try {
    if (!checkEnvVariables()) {
      throw new Error("[WARNING] ENV variables not found!");
    }

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
