import { SlashCommandBuilder } from "discord.js";
import { Song, VoiceExtendedCommandInteraction } from "../../utils/types/types";
import guildQueues from "./guildQueues.js";
import { infoEmbed, skipEmebed } from "../../utils/resources/embeds.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip current song."),
  execute: async (interaction: VoiceExtendedCommandInteraction) => {
    const channelId = interaction.member?.voice.channelId;

    if (!channelId) {
      return await replyWithProblemInfo(
        interaction,
        "You're not on the voice channel."
      );
    }

    const guildId = interaction.guildId!;
    const songQueue = guildQueues.getGuildSongQueue(guildId);
    const songQueueLength = songQueue?.length;

    if (!songQueue || songQueueLength === 0) {
      return await replyWithProblemInfo(
        interaction,
        "There's nothing to skip."
      );
    }

    handleSongSkip(guildId, songQueue, interaction);
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

const handleSongSkip = async (
  guildId: string,
  songQueue: Song[],
  interaction: VoiceExtendedCommandInteraction
) => {
  const guildQueuePlayer = guildQueues.getGuildQueuePlayer(guildId)!;
  const currentSongTitle = songQueue[0].title;

  guildQueuePlayer.stop();
  await replyWithSkipInfo(currentSongTitle, interaction);
};

const replyWithSkipInfo = async (
  currentSongTitle: string,
  interaction: VoiceExtendedCommandInteraction
) => {
  await interaction.reply({
    embeds: [skipEmebed.setTitle(`Successfully skipped: ${currentSongTitle}`)],
  });
};
