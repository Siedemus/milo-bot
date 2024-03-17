class guildQueues {
  constructor() {
    this.guildQueues = [];
  }

  getGuildQueue(guildId) {
    return this.guildQueues.find((queue) => queue.guildId === guildId);
  }

  createGuildQueue(guildId, connection, player) {
    const guildQueue = this.getGuildQueue(guildId);

    if (!guildQueue) {
      this.guildQueues.push({
        guildId,
        connection,
        player,
        songQueue: [],
        loop: false,
      });
    } else {
      throw new Error(`Queue for ${guildId} already exists`);
    }
  }

  deleteGuildQueue(guildId) {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      this.guildQueues = this.guildQueues.filter(
        (queue) => queue.guildId !== guildId
      );
    } else {
      throw new Error(`Queue for ${guildId} does not exist`);
    }
  }

  addNewSongToGuildQueue(guildId, song) {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      guildQueue.songQueue.push(song);
    } else {
      throw new Error(`We can't add song to ${guildId} queue`);
    }
  }

  removeSongFromGuildQueue(guildId) {
    const guildQueue = this.getGuildQueue(guildId);

    if (guildQueue) {
      guildQueue.songQueue.shift();
    } else {
      throw new Error(
        `We can't remove song from ${guildId} queue because it doesn't exist`
      );
    }
  }

  switchLoopState(guildId) {
    const guildQueue = this.getGuildQueue(guildId);
    guildQueue.loop = !guildQueue.loop;
  }

  getLoopState(guildId) {
    const guildQueue = this.getGuildQueue(guildId);
    return guildQueue.loop;
  }

  emptyGuildQueues() {
    this.guildQueues = [];
  }
}

export default new guildQueues();
