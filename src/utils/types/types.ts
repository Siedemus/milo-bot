import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  VoiceState,
} from "discord.js";
import fs from "fs";
import yts from "yt-search";

export interface Command {
  default: {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction, client: Client) => Promise<void>;
  };
}

export interface CommandsURLAndPATH {
  commandsURL: string;
  commandsPATH: string;
}

export type VoiceExtendedCommandInteraction = CommandInteraction & VoiceState;

export interface Song {
  title: string;
  url: string;
  songPath: string;
}

export interface GuildQueue {
  guildId: string;
  connection: VoiceConnection;
  player: AudioPlayer;
  songQueue: Song[];
  loop: boolean;
}

export type ExtendedSearchResult =
  | yts.VideoSearchResult
  | yts.LiveSearchResult
  | yts.PlaylistSearchResult
  | yts.ChannelSearchResult;

export interface EmbedModifier {
  [key: string]: any;
  color?: string;
  title?: string;
  url?: string;
  author?: { name: string; iconURL: string };
  description?: string;
  thumbnail?: string;
  fields?: { name: string; value: string; inline?: string }[];
  image?: string;
  timeStamp?: true;
  footer?: { text: string; iconURL: string };
}
