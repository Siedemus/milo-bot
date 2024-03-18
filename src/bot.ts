import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from "./utils/configs/config";
import handleBotReady from "./utils/handlers/handleBotReady";

(async () => {
  const client: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  handleBotReady(client);

  client.login(DISCORD_TOKEN);
})();
