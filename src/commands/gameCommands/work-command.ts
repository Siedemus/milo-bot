import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { prisma } from "../../../prisma/prismaClient";
import { infoEmbed, successEmbed } from "../../utils/resources/embeds";
import { User } from "@prisma/client";
import works from "../../utils/resources/works";

export default {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to earn some money."),
  execute: async (interaction: CommandInteraction) => {
    const user = (
      await prisma.user.findMany({ where: { id: interaction.user.id } })
    )[0];

    if (!user) {
      return await replyWithProblemInfo(
        interaction,
        "***User don't exists. Try to use `create` command.***"
      );
    }

    await updateUserBalance(interaction, user);
  },
};

const replyWithProblemInfo = async (
  interaction: CommandInteraction,
  content: string
) => {
  await interaction.reply({ embeds: [infoEmbed.setDescription(content)] });
};

const updateUserBalance = async (
  interaction: CommandInteraction,
  user: User
) => {
  const randomAmount = Math.floor(Math.random() * 550);
  const userBalance = user.balance;
  const newUserbalance = userBalance + randomAmount;

  await prisma.user.update({
    where: { id: interaction.user.id },
    data: { balance: newUserbalance },
  });

  const formattedContent = `***${
    works[Math.floor(Math.random() * works.length)]
  }, you earned ${randomAmount}$. Now your balance is ${newUserbalance}$***`;

  await replyWithSuccesInfo(interaction, formattedContent);
};

const replyWithSuccesInfo = async (
  interaction: CommandInteraction,
  content: string
) => {
  await interaction.reply({ embeds: [successEmbed.setDescription(content)] });
};
