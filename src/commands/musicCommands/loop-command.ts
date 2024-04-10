import { SlashCommandBuilder } from "discord.js";
import { VoiceExtendedCommandInteraction } from "../../utils/types/types";
import guildQueues from "./guildQueues.js";
import { infoEmbed, loopEmbed } from "../../utils/resources/embeds.js";
import {
  loopStatusFalse,
  loopStatusTrue,
} from "../../utils/resources/imageLinks.js";

export default {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop current song."),
  execute: async (
    interaction: VoiceExtendedCommandInteraction
  ): Promise<void> => {
    const channelId = interaction.member?.voice.channelId;

    if (!channelId) {
      return await replyWithProblemInfo(
        interaction,
        "You're not on the voice channel."
      );
    }

    const guildId = interaction.guildId!;
    const guildQueueState = guildQueues.guildQueueExists(guildId);
    const songQueueLength = guildQueues.getGuildSongQueue(guildId)?.length;

    if (!guildQueueState || !songQueueLength) {
      return await replyWithProblemInfo(interaction, "Empty queue!");
    }

    toggleLoopStatusChange(guildId, interaction);
  },
};

const replyWithProblemInfo = async (
  interaction: VoiceExtendedCommandInteraction,
  content: string
): Promise<void> => {
  await interaction.reply({
    embeds: [infoEmbed.setDescription(content)],
    ephemeral: true,
  });
};

const toggleLoopStatusChange = async (
  guildId: string,
  interaction: VoiceExtendedCommandInteraction
): Promise<void> => {
  guildQueues.changeGuildQueueLoopStatus(guildId);
  const loopStatus = guildQueues.getGuildQueueLoopStatus(guildId)!;

  if (loopStatus) {
    await statusChangeReply(interaction, "Loop status: ON", loopStatus);
  } else {
    await statusChangeReply(interaction, "Loop status: OFF", loopStatus);
  }
};

const statusChangeReply = async (
  interaction: VoiceExtendedCommandInteraction,
  content: string,
  status: boolean
): Promise<void> => {
  await interaction.reply({
    embeds: [
      loopEmbed
        .setTitle(content)
        .setImage(status ? loopStatusTrue : loopStatusFalse),
    ],
  });
};
