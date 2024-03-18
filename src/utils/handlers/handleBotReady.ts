import chalk from "chalk";
import { ActivityType, Client, Events } from "discord.js";

const handleBotReady = (client: Client) => {
  client.once(Events.ClientReady, () => {
    console.log(chalk.bold.green("Milo's ready to go!"));

    client.user?.setActivity({
      name: "Anarcho-capitalism",
      type: ActivityType.Watching,
      state: "Femboy's heaven",
    });
  });
};

export default handleBotReady;
