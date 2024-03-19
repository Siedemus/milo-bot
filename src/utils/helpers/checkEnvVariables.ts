import { CLIENT_ID, DISCORD_TOKEN } from "../configs/config";

export const checkEnvVariables = (): boolean => {
  return CLIENT_ID !== undefined && DISCORD_TOKEN !== undefined;
};
