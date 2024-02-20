import fs from "fs/promises";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import { rimraf } from "rimraf";

const emptyQueuesFolder = async () => {
  const queuesFolderPath = resolve(
    fileURLToPath(import.meta.url),
    "../../../queues"
  );
  const queues = await fs.readdir(queuesFolderPath);
  if (queues.length > 0) {
    for (const queue of queues) {
      const queuePath = path.join(queuesFolderPath, queue);
      rimraf(queuePath);
    }
  }
};

export default emptyQueuesFolder;
