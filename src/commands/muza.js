import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("muza")
    .setDescription("gdzie ta muza?")
    .addStringOption((option) =>
      option
        .setName("nuta")
        .setDescription("podaj tytuł nutki wariacie")
        .setRequired(true)
    ),
  execute(interaction) {
    const channelId = interaction.member.voice.channelId;
    const guildId = interaction.member.voice.guild.id;
    const adapterCreator = interaction.channel.guild.voiceAdapterCreator;

    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
    });

    console.log(connection);
  },
};
