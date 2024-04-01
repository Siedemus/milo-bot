import { SlashCommandBuilder } from "discord.js";
import { Song, VoiceExtendedCommandInteraction } from "../../utils/types/types";
import guildQueues from "./guildQueues";
import { infoEmbed, queueEmbed } from "./musicEmbeds";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Get the first 5 songs from song queue."),
  execute: async (interaction: VoiceExtendedCommandInteraction) => {
    const guildId = interaction.guildId!;
    const songQueue = guildQueues.getGuildSongQueue(guildId);

    if (!songQueue || songQueue.length === 0) {
      return await replyWithProblemInfo(interaction, "Song queue is empty.");
    }

    const formattedSongQueue = songQueue.slice(0, 5);

    handleCommandExecution(interaction, formattedSongQueue);
  },
};

const replyWithProblemInfo = async (
  interaction: VoiceExtendedCommandInteraction,
  content: string
) => {
  await interaction.reply({
    embeds: [infoEmbed.setDescription(content)],
    ephemeral: true,
  });
};

const handleCommandExecution = async (
  interaction: VoiceExtendedCommandInteraction,
  songQueue: Song[]
) => {
  await interaction.reply({
    embeds: [
      queueEmbed.setFields(
        songQueue.map((song, index) => {
          return { name: `[${index +1}]. ${song.title}`, value: song.url };
        })
      ),
    ],
  });
};
