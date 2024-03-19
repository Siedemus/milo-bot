import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { rimraf } from "rimraf";

export const createQueuesFolder = () => {
  const rootURL = import.meta.url;
  const rootPATH = fileURLToPath(rootURL);
  const directionPATH = path.join(rootPATH, "../../../../Queues");

  if (!fs.existsSync(directionPATH)) {
    fs.mkdirSync(directionPATH);
  } else {
    fs.readdirSync(directionPATH).forEach((file) => {
      rimraf(`${directionPATH}//${file}`);
    });
  }
};
