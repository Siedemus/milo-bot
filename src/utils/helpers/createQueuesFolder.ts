import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { rimraf } from "rimraf";

export const createQueuesFolder = (): void => {
  const rootURL = import.meta.url;
  const rootPATH = fileURLToPath(rootURL);
  const directionPATH = path.join(rootPATH, "../../../../queues");

  if (!fs.existsSync(directionPATH)) {
    fs.mkdirSync(directionPATH);
  } else {
    fs.readdirSync(directionPATH).forEach((file) => {
      rimraf(`${directionPATH}//${file}`);
    });
  }
};
