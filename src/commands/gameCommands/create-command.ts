import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { prisma } from "../../../prisma/prismaClient";
import { infoEmbed, successEmbed } from "../../utils/resources/embeds";
import { GameClass } from "../../utils/types/types";
import { mapChoices } from "../../utils/helpers/mapChoices";
import { gameClasses } from "../../utils/resources/gameClasses";

export default {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Creating users profile.")
    .addStringOption((option) =>
      option
        .setName("class")
        .setDescription("Choose your class")
        .setRequired(true)
        .addChoices(...mapChoices(gameClasses))
    )
    .addStringOption((option) =>
      option.setName("title").setDescription("You can set your game's title.")
    ),
  execute: async (interaction: CommandInteraction) => {
    let user = (
      await prisma.user.findMany({
        where: { id: interaction.user.id },
      })
    )[0];

    if (user) {
      return await replyWithProblemInfo(
        interaction,
        "***User with this id already exists.***"
      );
    }

    const title =
      interaction.options.get("title")?.value === undefined
        ? null
        : (interaction.options.get("title")!.value as string);
    const gameClass = interaction.options.get("class")!.value as GameClass;

    await createNewUser(interaction, title, gameClass);
  },
};

const replyWithProblemInfo = async (
  interaction: CommandInteraction,
  content: string
) => {
  await interaction.reply({
    embeds: [infoEmbed.setDescription(content)],
  });
};

const createNewUser = async (
  interaction: CommandInteraction,
  title: string | null,
  gameClass: GameClass
) => {
  await prisma.user.create({
    data: {
      id: interaction.user.id,
      title: title,
      balance: 1000,
      class: gameClass,
      level: 1,
      deathCount: 0,
    },
  });

  await replyWithSuccesInfo(interaction, title, gameClass);
};

const replyWithSuccesInfo = async (
  interaction: CommandInteraction,
  title: string | null,
  gameClass: GameClass
) => {
  await interaction.reply({
    embeds: [
      successEmbed.setDescription(
        `***User ${
          title ? `with title ${title}` : ""
        } created. Your starting level is (1) and your balance is 1000$. Have fun as the ${gameClass}! 🎉🎊🎈***`
      ),
    ],
  });
};
