import {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

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
  async execute(interaction) {
    const channelId = interaction.member.voice.channelId;
    const guildId = interaction.member.voice.guild.id;
    const adapterCreator = interaction.channel.guild.voiceAdapterCreator;
    const input = interaction.options.getString("nuta");
    const queueFolderPath = fileURLToPath(
      path.join(dirname(import.meta.url), "\\queue")
    );

    try {
      const songInfo = await yts(input);
      const {
        url: songURL,
        title: songTitle,
        videoId: songID,
      } = songInfo.all[0];
      const songPath = `${queueFolderPath}\\${songID}.mp3`;
      ytdl(songURL, { filter: "audioonly" })
        .pipe(fs.createWriteStream(songPath))
        .on("finish", () => {
          const connection = joinVoiceChannel({
            channelId,
            guildId,
            adapterCreator,
          });

          const player = createAudioPlayer({
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Pause,
            },
          });

          const resource = createAudioResource(songPath, {
            inlineVolume: true,
          });
          resource.volume.setVolume(1);
          player.play(resource);
          connection.subscribe(player);

          interaction.reply(`
        # *RADIO WIELKIE C#CE.PL PRZEDSTAWIA:*
        ## ${songTitle}
        ## MIKSUJE DLA WAS DJ <@1203406103837278279> 
        ### *${songURL}*
        `);
        });
    } catch (e) {
      interaction.reply({
        content: "nie znalazłem takiej nutki wariacie",
        ephemeral: true,
      });
      console.log(e);
    }
  },
};
