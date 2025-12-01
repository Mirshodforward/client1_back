// token.js
import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

export const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_IDS = process.env.ADMIN_IDS.split(",").map(id => Number(id));
const APP_URL = process.env.WEBAPP_URL;
const CHANNEL = "@PremiumFastChannel";


// ==========================
//   SAFE CHECK SUBSCRIBE
// ==========================
async function checkSubscription(ctx) {
  try {
    const userId = ctx.from?.id;

    if (!userId) return false; // block qilgan user bo‘lishi mumkin

    // getChatMember — user block qilgan bo‘lsa error beradi
    const member = await ctx.telegram.getChatMember(CHANNEL, userId);

    if (!member) return false;

    if (member.status === "left" || member.status === "kicked") {
      return false;
    }

    return true;
  } catch (err) {
    console.log("❌ checkSubscription error:", err.message);
    return false;
  }
}


// ==========================
//        /start
// ==========================
bot.start(async (ctx) => {
  try {
    const userId = ctx.from.id;
    const fullName = ctx.from.first_name || "foydalanuvchi";

    // 1) Majburiy obuna
    const subscribed = await checkSubscription(ctx);

    if (!subscribed) {
      return ctx.reply(
        `📢 Bizning kanalga obuna bo‘ling!\n\nSo‘ngra *START* tugmasini qaytadan bosing.`,
        {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.url("📌 Kanalga obuna bo‘lish", "https://t.me/PremiumFastChannel")],
            [Markup.button.callback("♻️ Obunani tekshirish", "check_sub")]
          ])
        }
      );
    }

    // 2) ADMIN
    if (ADMIN_IDS.includes(userId)) {
      return ctx.reply(
        `👑 Admin, xush kelibsiz — ${fullName}!`,
        Markup.inlineKeyboard([
          [
            Markup.button.webApp("⭐ Stars Admin", APP_URL + "/starsadmin"),
            Markup.button.webApp("💎 Premium Admin", APP_URL + "/premiumadmin")
          ],
          [
            Markup.button.webApp("📘 Admin Information", "https://premiumfaster.uz/secret")
          ]
        ])
      );
    }

    // 3) USER
    return ctx.reply(
      `🌟 PremiumFaster botiga xush kelibsiz, ${fullName}!`,
      Markup.inlineKeyboard([
        [Markup.button.webApp("⭐ Stars / 💎 Premium olish", "https://premiumfaster.uz/")],
        [
          Markup.button.url(
            "💎 1 oylik premium",
            "https://t.me/username_sn?text=Assalomu%20aleykum%2C%201%20oylik%20premium%20narxi%2044000%20so%27m%20ekan%20akkauntimga%20kirib%20olib%20berasizmi%3F"
          )
        ],
        [
          Markup.button.url(
            "💎 1 yillik premium",
            "https://t.me/username_sn?text=Assalomu%20aleykum%2C%201%20yillik%20premium%20narxi%20299000%20so%27m%20ekan%20akkauntimga%20kirib%20olib%20berasizmi%3F"
          )
        ]
      ])
    );

  } catch (err) {
    console.log("❌ start ERROR:", err.message);
  }
});


// ==========================
//   CALLBACK: check_sub
// ==========================
bot.action("check_sub", async (ctx) => {
  try {
    const subscribed = await checkSubscription(ctx);

    // User hali obuna bo‘lmagan
    if (!subscribed) {
      try { await ctx.answerCbQuery("❌ Siz hali obuna bo‘lmagansiz!"); } catch (e) {}
      
      return ctx.reply(
        `📢 Obuna bo‘lmagansiz!\n\nIltimos kanalga obuna bo‘ling.`,
        Markup.inlineKeyboard([
          [Markup.button.url("📌 Kanalga obuna bo‘lish", "https://t.me/PremiumFastChannel")],
          [Markup.button.callback("♻️ Tekshirish", "check_sub")]
        ])
      );
    }

    // Obuna bo‘lgan
    try { await ctx.answerCbQuery("✅ Obuna tasdiqlandi!"); } catch (e) {}

    return ctx.reply(
      "✔️ Endi PremiumFaster xizmatlaridan foydalanishingiz mumkin!",
      Markup.inlineKeyboard([
        [
          Markup.button.webApp("⭐ Stars / 💎 Premium olish", "https://premiumfaster.uz/")
        ],
        [
          Markup.button.url(
            "💎 1 oylik premium",
            "https://t.me/username_sn?text=Assalomu%20aleykum%2C%201%20oylik%20premium%20narxi%2044000%20so%27m%20ekan%20akkauntimga%20kirib%20olib%20berasizmi%3F"
          )
        ],
        [
          Markup.button.url(
            "💎 1 yillik premium",
            "https://t.me/username_sn?text=Assalomu%20aleykum%2C%201%20yillik%20premium%20narxi%20299000%20so%27m%20ekan%20akkauntimga%20kirib%20olib%20berasizmi%3F"
          )
        ]
      ])
    );

  } catch (err) {
    console.log("❌ check_sub ERROR:", err.message);
  }
});


// ==========================
//    SAFELY LAUNCH BOT
// ==========================
bot.launch()
  .then(() => console.log("🚀 Bot ishlayapti..."))
  .catch(err => console.log("❌ Botni ishga tushirishda xato:", err));
