import { getVoiceConnection } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("idz").setDescription("ić stont"),
  execute(interaction) {
    const guildId = interaction.guild.id;
    const connection = getVoiceConnection(guildId);

    if (!connection) {
      interaction.reply({
        content:
          "ej ej ej, kolego zbastuj bajerke, milo aktualnie nie ma w robocie :sunny: :coconut: :cocktail:",
        ephemeral: true,
      });
      return;
    }

    connection.destroy();
  },
};
