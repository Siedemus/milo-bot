import { SlashCommandBuilder } from "discord.js";
import guildQueues from "./guildQueues.js";
import { createAudioResource } from "@discordjs/voice";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skipujesz se muze"),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const guildQueue = guildQueues.getGuildQueue(guildId);
    let songQueueLength = guildQueue.songQueue.length;
    if (songQueueLength > 0) {
      if (guildQueue.loop === true) {
        guildQueues.switchLoopState(guildId);
      }

      guildQueue.player.stop();
      guildQueues.removeSongFromGuildQueue(guildId);
      interaction.reply(`## Skipnieto nutke`);
      songQueueLength = guildQueue.songQueue.length;

      if (songQueueLength !== 0) {
        const song = guildQueue.songQueue[0].songPath;
        const resource = createAudioResource(song);
        guildQueue.player.play(resource);
      }
    } else {
      interaction.reply(`## Nie ma co skipować`);
    }
  },
};
