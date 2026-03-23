import express from "express";
import cors    from "cors";
import fetch   from "node-fetch";
import dotenv  from "dotenv";

dotenv.config({ path: "../.env" });
console.log("Token loaded:", process.env.HUGGINGFACE_TOKEN ? "✅ Yes" : "❌ Missing");

const app      = express();
const PORT     = 5000;
const HF_URL   = "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct:novita";

app.use(cors());
app.use(express.json());

let messages = [];
let nextId   = 1;

function makeMsg({ role, username, content }) {
  return {
    id:       nextId++,
    role,
    username: username || (role === "bot" ? "ChatBot" : "WebUser"),
    content,
    time:     new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

app.get("/messages", (req, res) => res.json(messages));

app.post("/messages", (req, res) => {
  const { role, username, content } = req.body;
  if (!role || !content) return res.status(400).json({ error: "role and content required" });
  const msg = makeMsg({ role, username, content });
  messages.push(msg);
  res.status(201).json(msg);
});

app.post("/chat", async (req, res) => {
  const { username, content } = req.body;
  if (!content) return res.status(400).json({ error: "content required" });

  messages.push(makeMsg({ role: "user", username: username || "WebUser", content }));
  res.status(202).json({ received: true });

  try {
    const aiRes = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
      },
      body: JSON.stringify({
        model:      HF_MODEL,
        messages:   [{ role: "user", content }],
        max_tokens: 200,
      }),
    });

    const data  = await aiRes.json();
    const reply = data.choices?.[0]?.message?.content
      ?? (data.error ? `⚠️ ${typeof data.error === "object" ? data.error.message : data.error}` : "No response.");

    messages.push(makeMsg({ role: "bot", username: "ChatBot", content: reply }));

  } catch {
    messages.push(makeMsg({ role: "bot", username: "ChatBot", content: "Sorry, couldn't reach the AI model." }));
  }
});

app.delete("/messages", (req, res) => {
  messages = []; nextId = 1;
  res.json({ cleared: true });
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`✅  Server running at http://localhost:${PORT}`));