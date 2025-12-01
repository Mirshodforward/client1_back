// token.js
import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

export const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_IDS = process.env.ADMIN_IDS.split(",").map(id => Number(id));
const APP_URL = process.env.WEBAPP_URL;

const CHANNEL = "@PremiumFastChannel"; // Majburiy obuna kanali

// === Obunani tekshirish funksiyasi ===
async function checkSubscription(ctx) {
  try {
    const userId = ctx.from.id;

    const member = await ctx.telegram.getChatMember(CHANNEL, userId);

    // Agar user left bo‘lsa — obuna emas
    if (
      member.status === "left" ||
      member.status === "kicked"
    ) {
      return false;
    }
    return true;
  } catch (e) {
    console.log("Check sub error:", e);
    return false;
  }
}

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const fullName = ctx.from.first_name;

  // === 1) Avval obunani tekshiramiz ===
  const subscribed = await checkSubscription(ctx);

  if (!subscribed) {
    return ctx.reply(
      `📢 Bizning kanalga obuna bo‘ling!\n\nKeyin *START* ni qayta bosing.`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [
            Markup.button.url("📌 Kanalga obuna bo'lish", "https://t.me/PremiumFastChannel")
          ],
          [
            Markup.button.callback("♻️ Tekshirish", "check_sub")
          ]
        ])
      }
    );
  }

  // === 2) Agar admin bo‘lsa ===
  if (ADMIN_IDS.includes(userId)) {
    return ctx.reply(
      `👑 Admin aka, xush kelibsiz, ${fullName}!`,
      Markup.inlineKeyboard([
        [
          Markup.button.webApp("⭐ Admin panel", APP_URL + "/starsadmin"),
          Markup.button.webApp("💎 Admin panel", APP_URL + "/premiumadmin")
        ],
        [
          Markup.button.webApp("Admin information", "https://premiumfaster.uz/secret")
        ]
      ])
    );
  }

  // === 3) Oddiy user uchun ===
  return ctx.reply(
    `🌟 PremiumFaster botiga xush kelibsiz, ${fullName}!`,
    Markup.inlineKeyboard([
      [
        Markup.button.webApp("Web app", "https://premiumfaster.uz/")
      ]
    ])
  );
});

// === Obunani qayta tekshirish tugmasi ===
bot.action("check_sub", async (ctx) => {
  const subscribed = await checkSubscription(ctx);

  if (!subscribed) {
    return ctx.answerCbQuery("❌ Siz hali obuna bo‘lgani ko‘rinmayapti!");
  }

  await ctx.answerCbQuery("✅ Obuna tasdiqlandi!");

  return ctx.reply(
    "✔️ Endi WebApp’dan foydalanishingiz mumkin!",
    Markup.inlineKeyboard([
      [Markup.button.webApp("⭐️ Stars/💎 Premium olish", "https://premiumfaster.uz/")],
      [Markup.button.webApp("💎 1 oylik premium", "https://t.me/username_sn?text=Assalomu%20aleykum%2C%201%20oylik%20premium%20narxi%2044000%20so%27m%20ekan%20akkauntimga%20kirib%20olib%20berasizmi"),
      Markup.button.webApp("💎 1 yillik premium", "https://t.me/username_sn?text=Assalomu%20aleykum%2C%201%20yillik%20premium%20narxi%20299000%20so%27m%20ekan%20akkauntimga%20kirib%20olib%20berasizmi")]

    ])
  );
});

bot.launch();
console.log("🚀 Bot ishlayapti...");
