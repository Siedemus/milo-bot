import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  InternalDiscordGatewayAdapterCreator,
  SlashCommandBuilder,
} from "discord.js";
import {
  ExtendedSearchResult,
  VoiceExtendedCommandInteraction,
} from "../../utils/types/types";
import {
  errorEmbed,
  infoEmbed,
  successEmbed,
  waitingEmbed,
} from "../../utils/resources/embeds.js";
import waitingMessages from "../../utils/resources/waitingMessages.js";
import yts from "yt-search";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v5 as uuidV5 } from "uuid";
import ytdl from "ytdl-core";
import guildQueues from "./guildQueues.js";
import chalk from "chalk";
import { placeholderImage } from "../../utils/resources/imageLinks.js";
import { PLAY_NAMESPACE } from "../../utils/resources/namespaces.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play selected song from youtube.")
    .addStringOption((option) =>
      option.setName("url").setDescription("Your song url.").setRequired(true)
    ),
  execute: async (interaction: VoiceExtendedCommandInteraction) => {
    await handleCommandExecution(interaction);
  },
};

const handleCommandExecution = async (
  interaction: VoiceExtendedCommandInteraction
): Promise<void> => {
  try {
    const channelId = interaction.member?.voice.channelId;
    if (!channelId) {
      return await replyWithProblemInfo(
        interaction,
        "You're not on the voice channel."
      );
    }

    const guildId = interaction.guildId!;
    const adapterCreator = interaction.guild.voiceAdapterCreator;

    await replyWithWaitingMessage(interaction);
    const { url, title, thumbnail } = await fetchSongDetails(interaction);

    if (url.includes("playlist")) {
      return await replyWithProblemInfo(
        interaction,
        "We're not providing playlist handling."
      );
    }

    const guildQueueFolderPath = createGuildQueueFolderIfNeeded(guildId);
    const songPath = createSongPath(title, guildQueueFolderPath);
    await downloadSongIfNeeded(url, songPath);
    createGuildQueueIfNeeded(guildId, channelId, adapterCreator);
    handleAudioPlayer(guildId, title, url, songPath, thumbnail, interaction);
  } catch (error) {
    await replyWithErrorInfo(interaction);
    console.log(chalk.bold.red(error));
  }
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

const replyWithWaitingMessage = async (
  interaction: VoiceExtendedCommandInteraction
) => {
  const waitingMessage =
    waitingMessages[Math.floor(Math.random() * waitingMessages.length)];
  await interaction.reply({
    embeds: [waitingEmbed.setDescription(waitingMessage)],
  });
};

const fetchSongDetails = async (
  interaction: VoiceExtendedCommandInteraction
): Promise<ExtendedSearchResult> => {
  const input = interaction.options.data[0].value as string;
  return (await yts(input)).all[0];
};

const createGuildQueueFolderIfNeeded = (guildId: string): string => {
  const queuesFolderPath = path.join(
    fileURLToPath(import.meta.url),
    "../../../../queues"
  );
  const queues = fs.readdirSync(queuesFolderPath);
  const guildQueueName = `queue-${guildId}`;
  const guildQueuePath = `${queuesFolderPath}\\${guildQueueName}`;

  if (!queues.includes(guildQueueName)) {
    fs.mkdirSync(guildQueuePath);
  }

  return guildQueuePath;
};

const createSongPath = (title: string, guildQueueFolderPath: string) => {
  const songId = uuidV5(title, PLAY_NAMESPACE);
  const songPath = `${guildQueueFolderPath}\\${songId}.mp3`;
  return songPath;
};

const downloadSongIfNeeded = async (
  url: string,
  songPath: string
): Promise<void> => {
  if (!fs.existsSync(songPath)) {
    const songStream = ytdl(url, { filter: "audioonly" });

    return new Promise((resolve, reject) => {
      songStream
        .pipe(fs.createWriteStream(songPath))
        .on("finish", resolve)
        .on("error", reject);
    });
  }
};

const createGuildQueueIfNeeded = (
  guildId: string,
  channelId: string,
  adapterCreator: InternalDiscordGatewayAdapterCreator
): void => {
  if (!guildQueues.guildQueueExists(guildId)) {
    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
    });

    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    guildQueues.createGuildQueue(guildId, connection, player);
    return;
  }

  checkConnection(guildId, channelId, adapterCreator);
};

const checkConnection = (
  guildId: string,
  channelId: string,
  adapterCreator: InternalDiscordGatewayAdapterCreator
): void => {
  const connectionStatus =
    guildQueues.getGuildQueueConnection(guildId)!.state.status;

  if (
    connectionStatus === VoiceConnectionStatus.Destroyed ||
    connectionStatus === VoiceConnectionStatus.Disconnected
  ) {
    const newConnection = joinVoiceChannel({
      guildId,
      channelId,
      adapterCreator,
    });

    const newAudioPlayer = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    guildQueues.setGuildQueuePlayer(guildId, newAudioPlayer);
    guildQueues.setGuildQueueConnection(guildId, newConnection);
  }
};

const handleAudioPlayer = async (
  guildId: string,
  title: string,
  url: string,
  songPath: string,
  thumbnail: string | undefined,
  interaction: VoiceExtendedCommandInteraction
) => {
  guildQueues.addSongToGuildSongQueue(guildId, { title, url, songPath });

  const guildQueuePlayer = guildQueues.getGuildQueuePlayer(guildId)!;
  const guildQueueConnection = guildQueues.getGuildQueueConnection(guildId)!;

  if (guildQueuePlayer.state.status !== AudioPlayerStatus.Playing) {
    const resource = createAudioResource(songPath);
    guildQueuePlayer.play(resource);
    guildQueueConnection.subscribe(guildQueuePlayer);
    handleNextSong(guildId);
  }

  await replyWithSongInfo(interaction, title, thumbnail, url);
};

const handleNextSong = (guildId: string) => {
  const guildQueuePlayer = guildQueues.getGuildQueuePlayer(guildId)!;

  guildQueuePlayer.on(AudioPlayerStatus.Idle, () => {
    const songQueue = guildQueues.getGuildSongQueue(guildId)!;

    if (songQueue.length > 0) {
      const guildQueueLoopStatus =
        guildQueues.getGuildQueueLoopStatus(guildId)!;

      if (guildQueueLoopStatus === true) {
        const { songPath } = songQueue[0];

        const resource = createAudioResource(songPath);
        guildQueuePlayer.play(resource);
        return;
      }

      guildQueues.removeSongFromGuildSongQueue(guildId);

      if (songQueue.length > 0) {
        const { songPath } = songQueue[0];

        const resource = createAudioResource(songPath);
        guildQueuePlayer.play(resource);
      } else {
        const guildQueueConnection =
          guildQueues.getGuildQueueConnection(guildId)!;
        guildQueueConnection.disconnect();
      }
    }
  });
};

const replyWithSongInfo = async (
  interaction: VoiceExtendedCommandInteraction,
  title: string,
  thumbnail: string | undefined,
  url: string
) => {
  await interaction.editReply({
    embeds: [
      successEmbed
        .setDescription(
          `***${interaction.user.username} added ${title} to song queue.***`
        )
        .setImage(thumbnail ? thumbnail : placeholderImage)
        .setURL(url),
    ],
  });
};

const replyWithErrorInfo = async (
  interaction: VoiceExtendedCommandInteraction
) => {
  await interaction.editReply({
    embeds: [
      errorEmbed.setDescription(
        "Ohh! We found a problem during the proccess, more info in console."
      ),
    ],
  });
};
