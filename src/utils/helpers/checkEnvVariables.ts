import { CLIENT_ID, DISCORD_TOKEN } from "../configs/config";

export const checkEnvVariables = (): never | void => {
  if (!(CLIENT_ID !== undefined && DISCORD_TOKEN !== undefined)) {
    throw new Error("[WARNING] ENV variables not found or some are missing!");
  }
};
