import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { prisma } from "../../../prisma/prismaClient";
import { infoEmbed, slotEmbed } from "../../utils/resources/embeds";
import {
  Factor,
  Result,
  Rows,
  SlotMachineResult,
} from "../../utils/types/types";
import slotMachineEmojis from "../../utils/resources/slotMachineEmojis";
import { mapChoices } from "../../utils/helpers/mapChoices";
import factors from "../../utils/resources/factors";

export default {
  cooldown: 20,
  data: new SlashCommandBuilder()
    .setName("slot")
    .setDescription("SLOTS! SLOTS! SLOTS!")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount of money you want to bet.")
        .setRequired(true)
        .setMinValue(100)
    )
    .addStringOption((option) =>
      option
        .setName("factor")
        .setDescription("Choose factor.")
        .addChoices(...mapChoices(Object.keys(factors)))
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    const user = (
      await prisma.user.findMany({ where: { id: interaction.user.id } })
    )[0];

    if (!user) {
      return await replyWithProblemInfo(
        interaction,
        "***User don't exists. Try to use `create` command.***"
      );
    }

    const balance = user.balance;

    if (balance <= 0) {
      return await replyWithProblemInfo(interaction, "***You're broke...***");
    }

    await handleSlotCommand(interaction, balance);
  },
};

const replyWithProblemInfo = async (
  interaction: CommandInteraction,
  content: string
): Promise<void> => {
  await interaction.reply({ embeds: [infoEmbed.setDescription(content)] });
};

const handleSlotCommand = async (
  interaction: CommandInteraction,
  balance: number
): Promise<void> => {
  const bet = interaction.options.get("bet")!.value as number;
  const factor = interaction.options.get("factor")!.value as Factor;

  const { result, rows } = getSlotMachineResult(factor);
  await calculateAndUpdateBalance(
    result,
    rows,
    factor,
    bet,
    balance,
    interaction
  );
};

const getSlotMachineResult = (factor: Factor): SlotMachineResult => {
  const iterations = factors[factor].slotsNumber;
  const result: Result = { status: false, winCount: 0 };
  const rows: Rows = {
    upperRow: [],
    middleRow: [],
    lowerRow: [],
  };

  for (const row of Object.keys(rows)) {
    let n = 0;
    while (n < iterations) {
      rows[row as keyof Rows].push(getSlotMachineEmoji(iterations));
      n++;
    }
    if (
      rows[row as keyof Rows].every(
        (slot) => slot === rows[row as keyof Rows][0]
      )
    ) {
      result.status = true;
      result.winCount++;
    }
  }

  return { result, rows };
};

const getSlotMachineEmoji = (iterations: number): string => {
  return slotMachineEmojis[Math.floor(Math.random() * iterations)];
};

const calculateAndUpdateBalance = async (
  result: Result,
  rows: Rows,
  factor: Factor,
  bet: number,
  balance: number,
  interaction: CommandInteraction
): Promise<void> => {
  const formattedSlotResult = `
  -----------> ${rows.upperRow.map((item) => `[${item}]`)} <-----------
  -----------> ${rows.middleRow.map((item) => `[${item}]`)} <-----------
  -----------> ${rows.lowerRow.map((item) => `[${item}]`)} <-----------
  `;
  const prize = Math.floor(
    bet *
      (result.status
        ? factors[factor].factor * result.winCount
        : factors[factor].negativeFactor)
  );

  await prisma.user.update({
    where: { id: interaction.user.id },
    data: { balance: result.status ? balance + prize : balance - prize },
  });

  await interaction.reply({
    embeds: [
      slotEmbed.setDescription(
        result.status
          ? `**YOU WON! Your prize is ${prize}$ 🎉🎊
          ${formattedSlotResult}**`
          : `**Ups... Not this time, you lose ${prize}$ 😥🌧️
      ${formattedSlotResult}
      **`
      ),
    ],
  });
};
