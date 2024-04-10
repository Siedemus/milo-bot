import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import breeds from "../../utils/resources/breeds";
import { mapChoices } from "../../utils/helpers/mapChoices";
import { DogApiResponse } from "../../utils/types/types";
import { infoEmbed, successEmbed } from "../../utils/resources/embeds";

export default {
  data: new SlashCommandBuilder()
    .setName("doggy")
    .setDescription("Get a random doggy picture.")
    .addStringOption((option) =>
      option
        .setName("breed")
        .setDescription("Choose dog breed if you want.")
        .addChoices(...mapChoices(breeds))
    ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    const breed = interaction.options.get("breed")?.value;

    if (!breed) {
      try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = (await response.json()) as DogApiResponse;
        await replywithSuccessInfo(
          interaction,
          "***Your cute doggy.***",
          data.message
        );
      } catch {
        await replyProblemInfo(
          interaction,
          "***Something went wrong. Probably `https://dog.ceo/dog-api/` is shutdown.***"
        );
      }
    } else {
      try {
        const response = await fetch(
          `https://dog.ceo/api/breed/${breed}/images/random`
        );
        const data = (await response.json()) as DogApiResponse;
        await replywithSuccessInfo(
          interaction,
          `***Your cute ${breed} doggy.***`,
          data.message
        );
      } catch {
        await replyProblemInfo(
          interaction,
          "***Something went wrong. Probably `https://dog.ceo/dog-api/` is shutdown.***"
        );
      }
    }
  },
};

const replywithSuccessInfo = async (
  interaction: CommandInteraction,
  content: string,
  image: string
) => {
  await interaction.reply({
    embeds: [successEmbed.setDescription(content).setImage(image)],
  });
};

const replyProblemInfo = async (
  interaction: CommandInteraction,
  content: string
) => {
  await interaction.reply({
    embeds: [infoEmbed.setDescription(content)],
  });
};
