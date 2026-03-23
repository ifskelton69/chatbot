import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

dotenv.config({ path: "./src/.env" });

const BRIDGE_URL = "http://localhost:5000/messages";
const HF_URL     = "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL   = "meta-llama/Llama-3.1-8B-Instruct:cerebras";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function pushMessage({ role, username, content }) {
  try {
    await fetch(BRIDGE_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ role, username, content }),
    });
  } catch (err) {
    console.warn("⚠️  Could not push to bridge server:", err.message);
  }
}

async function queryModel(userText) {
  const response = await fetch(HF_URL, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
    },
    body: JSON.stringify({
      model:      HF_MODEL,
      messages:   [{ role: "user", content: userText }],
      max_tokens: 200,
    }),
  });

  const data = await response.json();
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  if (data.error) return `⚠️ ${typeof data.error === "object" ? data.error.message : data.error}`;
  return "⚠️ Unexpected response from model.";
}

client.on("ready", () => {
  console.log(`✅  Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userText = message.content;
  const username = message.author.username;

  await pushMessage({ role: "user", username, content: userText });
  await message.channel.sendTyping();

  let botReply;
  try {
    botReply = await queryModel(userText);
  } catch (err) {
    botReply = "Sorry, I couldn't reach the AI model right now.";
  }

  await pushMessage({ role: "bot", username: "ChatBot", content: botReply });
  await message.reply(botReply);
});

client.login(process.env.DISCORD_TOKEN);