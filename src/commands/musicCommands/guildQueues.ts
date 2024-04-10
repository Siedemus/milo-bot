import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { GuildQueue, Song } from "../../utils/types/types";

class guildQueues {
  private _guildQueues: GuildQueue[];

  constructor() {
    this._guildQueues = [];
  }

  private getGuildQueue(guildId: string): GuildQueue | undefined {
    return this._guildQueues.find(
      (guildQueue) => guildQueue.guildId === guildId
    );
  }

  public createGuildQueue(
    guildId: string,
    connection: VoiceConnection,
    player: AudioPlayer
  ): void {
    const guildQueue = this.getGuildQueue(guildId);

    if (!guildQueue) {
      this._guildQueues.push({
        guildId,
        connection,
        player,
        songQueue: [],
        loop: false,
      });
    } else {
      throw new Error(
        "You're trying to create guild queue that already exists."
      );
    }
  }

  public removeSongFromGuildSongQueue(guildId: string): void {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      if (guildQueue.songQueue.length > 0) {
        guildQueue.songQueue.shift();
      } else {
        throw new Error(
          "You're trying to remove a song from guild queue that is empty."
        );
      }
    } else {
      throw new Error(
        "You're trying to remove a song from guild queue that not exist."
      );
    }
  }

  public addSongToGuildSongQueue(guildId: string, song: Song): void {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      guildQueue.songQueue.push(song);
    } else {
      throw new Error(
        "You're trying to add a song to guild queue that not exist."
      );
    }
  }

  public changeGuildQueueLoopStatus(guildId: string): void {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      guildQueue.loop = !guildQueue.loop;
    } else {
      throw new Error(
        "You're trying to change loop status of guild queue that not exist."
      );
    }
  }

  public getGuildQueueLoopStatus(guildId: string): boolean | undefined {
    const guildQueue = this.getGuildQueue(guildId);

    return guildQueue?.loop;
  }

  public getGuildSongQueue(guildId: string): Song[] | undefined {
    const guildQueue = this.getGuildQueue(guildId);

    return guildQueue?.songQueue;
  }

  public setGuildQueuePlayer(guildId: string, audioPlayer: AudioPlayer): void {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      guildQueue.player = audioPlayer;
    } else {
      throw new Error(
        "You're trying to set audio player of guild queue that not exist."
      );
    }
  }

  public getGuildQueuePlayer(guildId: string): AudioPlayer | undefined {
    const guildQueue = this.getGuildQueue(guildId);

    return guildQueue?.player;
  }

  public setGuildQueueConnection(
    guildId: string,
    connection: VoiceConnection
  ): void {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      guildQueue.connection = connection;
    } else {
      throw new Error(
        "You're trying to set connection of guild queue that not exist."
      );
    }
  }

  public getGuildQueueConnection(guildId: string): VoiceConnection | undefined {
    const guildQueue = this.getGuildQueue(guildId);

    return guildQueue?.connection;
  }

  public guildQueueExists(guildId: string): boolean {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      return true;
    } else {
      return false;
    }
  }
}

export default new guildQueues();
