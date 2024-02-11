import { SlashCommandBuilder } from "discord.js";
import breeds from "../../assets/breeds.js";

export default {
  data: new SlashCommandBuilder()
    .setName("pies")
    .setDescription("Milo wyciąga psa z plecaka")
    .addStringOption((option) =>
      option
        .setName("rasa")
        .setDescription("Wybierz se rasę ziomuś")
        .addChoices(...breeds)
    ),
  async execute(interaction) {
    const breed = interaction.options.getString("rasa");

    if (!breed) {
      try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();
        interaction.reply(data.message);
      } catch (error) {
        interaction.reply("Sorki ale pieski poszły na spacer :/");
      }
    } else {
      try {
        const response = await fetch(
          `https://dog.ceo/api/breed/${breed}/images/random`
        );
        const data = await response.json();
        interaction.reply(data.message);
      } catch (error) {
        interaction.reply("Sorki ale pieski poszły na spacer :/");
      }
    }
  },
};
