import { bot } from "./token.js";
import dotenv from "dotenv";
dotenv.config();

export async function sendLog(text) {
  try {
    await bot.telegram.sendMessage(
      process.env.LOG_CHANNEL_ID,
      text,
      { parse_mode: "HTML" }
    );
  } catch (err) {
    console.error("❌ sendLog xato:", err);
  }
}
