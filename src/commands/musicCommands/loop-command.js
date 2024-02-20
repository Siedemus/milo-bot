import { SlashCommandBuilder } from "discord.js";
import guildQueues from "./guildQueues.js";

export default {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("loopujesz se muze"),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const guildQueue = guildQueues.getGuildQueue(guildId);

    guildQueues.switchLoopState(guildId);

    if (guildQueue.loop) {
      interaction.reply(`## Loop włączony`);
    } else {
      interaction.reply(`## Loop wyłączony`);
    }
  },
};
