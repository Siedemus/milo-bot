import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  VoiceState,
} from "discord.js";
import yts from "yt-search";

export interface Command {
  default: {
    cooldown: number;
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

export type GameClass = "Warrior" | "Assassin" | "Mage" | "Archer" | "Thief";

export interface DogApiResponse {
  message: string;
  status: string;
}

export type Factor = "x2" | "x4" | "x6";

export interface Rows {
  upperRow: string[];
  middleRow: string[];
  lowerRow: string[];
}

export interface Result {
  status: boolean;
  winCount: number;
}

export type SlotMachineResult = { result: Result; rows: Rows };
