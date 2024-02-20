import { DISCORD_TOKEN } from "./config.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import registerCommands from "./registerCommands.js";
import guildQueues from "./commands/musicCommands/guildQueues.js";
import emptyQueuesFolder from "./utils/emptyQueuesFolder.js";
import createQueuesFolder from "./utils/createQueuesFolder.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

registerCommands(client);
guildQueues.emptyGuildQueues();
createQueuesFolder();
emptyQueuesFolder();

client.on(Events.ClientReady, () =>
  console.log(`${client.user.tag} is ready!`)
);

client.login(DISCORD_TOKEN);
