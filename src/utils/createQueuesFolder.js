import fs from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const createQueuesFolder = async () => {
  const rootDirPath = resolve(fileURLToPath(import.meta.url), "../../../");
  const rootDir = fs.readdirSync(rootDirPath);

  if (!rootDir.includes("queues")) {
    fs.mkdirSync(resolve(rootDirPath, "queues"));
  }
};

export default createQueuesFolder;
