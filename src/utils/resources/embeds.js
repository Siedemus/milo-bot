import { EmbedBuilder } from "discord.js";
import {
  errorImage,
  infoImage,
  queueImage,
  skipImage,
  waitingImage,
} from "../../utils/resources/imageLinks.js";

export const waitingEmbed = new EmbedBuilder()
  .setColor("#757575")
  .setImage(waitingImage)
  .setTitle("Wait a sec... ⌚")
  .setFooter({
    text: "© Milo Driven Development, All rights reserved.",
  })
  .setTimestamp();

export const errorEmbed = new EmbedBuilder()
  .setColor("#FF0000")
  .setImage(errorImage)
  .setTitle("ERROR ❌")
  .setFooter({
    text: "© Milo Driven Development, All rights reserved.",
  })
  .setTimestamp();

export const successEmbed = new EmbedBuilder()
  .setColor("#00FF91")
  .setTitle("Success ✅")
  .setFooter({
    text: "© Milo Driven Development, All rights reserved.",
  })
  .setTimestamp();

export const infoEmbed = new EmbedBuilder()
  .setColor("#0d1ac6")
  .setImage(infoImage)
  .setTitle("BOT INFO ⚠️")
  .setFooter({
    text: "© Milo Driven Development, All rights reserved.",
  })
  .setTimestamp();

export const loopEmbed = new EmbedBuilder()
  .setColor("#FCF811")
  .setDescription("Song queue loop status changed.")
  .setFooter({
    text: "© Milo Driven Development, All rights reserved.",
  })
  .setTimestamp();

export const skipEmebed = new EmbedBuilder()
  .setColor("#f47302")
  .setImage(skipImage)
  .setDescription("Song skipped.")
  .setFooter({
    text: "© Milo Driven Development, All rights reserved.",
  })
  .setTimestamp();

export const queueEmbed = new EmbedBuilder()
  .setColor("#c9224c")
  .setTitle("***Current song queue:***")
  .setImage(queueImage)
  .setFooter({
    text: "© Milo Driven Development, All rights reserved.",
  })
  .setTimestamp();

export const slotEmbed = new EmbedBuilder()
  .setTitle("***🍒🍹🎈🐉🚀 SLOT MACHINE 🍒🍹🎈🐉🚀***")
  .setColor("#Ff3457")
  .setFooter({
    text: "© Milo Driven Development, All rights reserved.",
  })
  .setTimestamp();
