import { CLIENT_ID, DISCORD_TOKEN } from "./config.js";
import biseks from "./commands/biseks.js";
import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.ClientReady, () =>
  console.log(`${client.user.tag} is ready!`)
);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  biseks.execute(interaction);
});

const commands = [];

const rest = new REST().setToken(DISCORD_TOKEN);

commands.push(biseks.data.toJSON());

try {
  rest
    .put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })
    .then((res) => console.log(`${res.length} commands registered!`));
} catch (e) {
  console.log(e.message);
}

client.login(DISCORD_TOKEN);
