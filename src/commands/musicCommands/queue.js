class SongQueues {
  constructor() {
    this.queues = [];
  }

  getQueues() {
    return this.queues;
  }

  getQueue(guildId) {
    const guildQueue = this.queues.filter(
      (guildQueue) => guildQueue.guildId === guildId
    )[0];
    return guildQueue;
  }

  addSongToQueue(guildId, { title, path, url }) {
    const guildQueue = this.queues.filter(
      (queue) => queue.guildId === guildId
    )[0];

    if (!guildQueue) {
      this.queues.push({ guildId, queue: [{ title, path, url }] });
      return;
    }

    guildQueue.queue.push({ title, path, url });
  }

  removeSongFromQueue(guildId) {
    const queue = this.queues.filter((queue) => queue.guildId === guildId);
    queue.shift();
  }

  clearQueue(guildId) {
    const queue = this.queues.filter((queue) => queue.guildId === guildId);
    queue.queue = [];
  }

  clearQueues() {
    this.queues = [];
  }
}


export default new SongQueues();