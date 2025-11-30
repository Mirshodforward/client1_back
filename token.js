// bot.js
import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

export const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_IDS = process.env.ADMIN_IDS.split(',').map(id => Number(id));
const APP_URL = process.env.WEBAPP_URL;

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const fullName = ctx.from.first_name;

  if (ADMIN_IDS.includes(userId)) {
    return ctx.reply(
      `👑 Admin aka, xush kelibsiz, ${fullName}!`,
      Markup.inlineKeyboard([
        [
          Markup.button.webApp("⭐ Stars panel", APP_URL + "/starsadmin"),
          Markup.button.webApp("💎 Premium panel", APP_URL + "/premiumadmin")
        ]
      ])
    );
  }

  return ctx.reply(
    `🌟 PremiumFaster botiga xush kelibsiz, ${fullName}!`,
    Markup.inlineKeyboard([
      [
        Markup.button.webApp("Web app", "https://premiumfaster.uz/"),
        
      ]
    ])
  );
});

bot.launch();
console.log("🚀 Bot ishlayapti...");
