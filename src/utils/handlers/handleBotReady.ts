import chalk from "chalk";
import { Client, Events } from "discord.js";
import activityStatuses from "../resources/activityStatuses";

const handleBotReady = (client: Client) => {
  client.once(Events.ClientReady, () => {
    console.log(chalk.bold.green("[SUCCESS] Milo's ready to go!"));
    const activitiesLength = activityStatuses.length;

    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * activitiesLength);

      client.user?.setActivity({
        name: activityStatuses[randomIndex],
      });
    }, 5000);
  });
};

export default handleBotReady;
