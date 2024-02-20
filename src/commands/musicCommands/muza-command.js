import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import guildQueues from "./guildQueues.js";
import yts from "yt-search";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import ytdl from "ytdl-core";
import fs, { createWriteStream } from "fs";
import waitingMessages from "../../assets/waitingMessages.js";

export default {
  data: new SlashCommandBuilder()
    .setName("muza")
    .setDescription("tym se puszczasz/skipujesz lub loopujesz muze")
    .addStringOption((option) =>
      option
        .setName("nutka")
        .setDescription("podaj tytuł lub link do nutki")
        .setRequired(true)
    ),
  async execute(interaction) {
    const channelId = interaction.member.voice.channelId;

    if (!channelId) {
      interaction.reply({
        content: "## Nie ma cie na kanale kaszalocie",
        ephemeral: true,
      });
      return;
    }

    const guildId = interaction.guildId;
    const adapterCreator = interaction.guild.voiceAdapterCreator;

    await commandHandler(interaction, guildId, channelId, adapterCreator);
  },
};

const commandHandler = async (
  interaction,
  guildId,
  channelId,
  adapterCreator
) => {
  try {
    await interaction.reply(`# ${getRandomWaitingMessage()}`);

    const { title, url, videoId } = await getSongDetails(interaction);
    const guildQueuePath = await createGuildQueueFolderIfNeeded(
      guildId,
      interaction
    );

    const songPath = `${guildQueuePath}/${videoId}.mp3`;

    ytdl(url, { filter: "audioonly" })
      .pipe(createWriteStream(songPath))
      .on("finish", () =>
        playSong(
          songPath,
          guildId,
          channelId,
          adapterCreator,
          title,
          url,
          interaction
        )
      );
  } catch (error) {
    console.error(error);
    interaction.editReply({
      content:
        "## Coś poszło nie tak z puszczeniem muzy (więcej info w konsoli)",
      ephemeral: true,
    });
  }
};

//
//
// ** Functions **
//
//

function getRandomWaitingMessage() {
  const waitingMessagesLength = waitingMessages.length;

  return waitingMessages[Math.floor(Math.random() * waitingMessagesLength)];
}

const getSongDetails = async (interaction) => {
  const input = interaction.options.getString("nutka");
  return (await yts(input)).all[0];
};

const createGuildQueueFolderIfNeeded = async (guildId, interaction) => {
  const queuesPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../../queues"
  );
  const queues = await fs.promises.readdir(queuesPath);
  const guildQueueName = `queue-${guildId}`;
  const guildQueuePath = `${queuesPath}/${guildQueueName}`;

  if (!queues.includes(guildQueueName)) {
    try {
      await fs.promises.mkdir(guildQueuePath);
    } catch (error) {
      console.error(error);
      interaction.editReply(
        `## Nie udało się utworzyć folderu dla kolejki ${guildId}`
      );
    }
  }

  return guildQueuePath;
};

const playSong = (
  songPath,
  guildId,
  channelId,
  adapterCreator,
  title,
  url,
  interaction
) => {
  const guildQueue = createGuildQueueIfNeeded(
    guildId,
    channelId,
    adapterCreator
  );

  guildQueues.addNewSongToGuildQueue(guildId, {
    title,
    url,
    songPath,
  });

  if (guildQueue.player.state.status !== AudioPlayerStatus.Playing) {
    const resource = createAudioResource(songPath);
    guildQueue.player.play(resource);
    guildQueue.connection.subscribe(guildQueue.player);
    handleNextSong(guildQueue, guildId);
  }

  interaction.editReply(`
# RADIO WIELKIE CY*E.PL PRZEDSTAWIA: ${title}

## MIKSUJE DLA WAS DJ MILO Z PIOTRKOWA TRYBUNALSKIEGO

### ZAPNIJCIE PASY BĘDZIE OSTRA JAZDA

***${url}***
`);
};

const createGuildQueueIfNeeded = (guildId, channelId, adapterCreator) => {
  let guildQueue = guildQueues.getGuildQueue(guildId);

  if (!guildQueue) {
    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
    });

    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    guildQueues.createGuildQueue(guildId, connection, player);
    guildQueue = guildQueues.getGuildQueue(guildId);
  }

  return guildQueue;
};

const handleNextSong = (guildQueue, guildId) => {
  guildQueue.player.on(AudioPlayerStatus.Idle, () => {
    if (guildQueue.loop === true) {
      const song = guildQueue.songQueue[0];

      const resource = createAudioResource(song.songPath);
      guildQueue.player.play(resource);
      return;
    }

    guildQueues.removeSongFromGuildQueue(guildId);

    if (guildQueue.songQueue.length > 0) {
      const nextSong = guildQueue.songQueue[0];

      const resource = createAudioResource(nextSong.songPath);
      guildQueue.player.play(resource);
    }
  });
};
