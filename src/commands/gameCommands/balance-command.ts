import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { prisma } from "../../../prisma/prismaClient";
import { balanceEmbed, infoEmbed } from "../../utils/resources/embeds";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance."),
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

    interaction.reply({
      embeds: [balanceEmbed.setDescription(`${user.balance}$`)],
    });
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
