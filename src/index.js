import { DISCORD_TOKEN } from "./config.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import registerCommands from "./registerCommands.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

registerCommands(client);

client.on(Events.ClientReady, () =>
  console.log(`${client.user.tag} is ready!`)
);

client.login(DISCORD_TOKEN);
