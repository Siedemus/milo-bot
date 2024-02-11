import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("biseks")
    .setDescription("uniwersalne narzędzie do pingowania biseksa"),

  async execute(interaction) {
    await interaction.reply(":cowboy: :thumbsup:");
    await interaction.deleteReply();
    interaction.channel.send("<@835853457830445067> cho tu k*rwa!");
  },
};
