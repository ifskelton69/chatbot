AI Chatbot Application

An AI-powered chatbot application that enables real-time conversations using modern web technologies and state-of-the-art language models from Hugging Face.

This project supports both a web-based chat interface and optional integration with Discord, allowing users to interact with the bot across multiple platforms.

✨ Features
💬 Real-time chat system using Express.js
🧠 AI-generated responses via Hugging Face Inference API
🔐 Secure API handling using environment variables
🌐 RESTful API endpoints (/chat, /messages)
📦 In-memory message storage
🤖 Optional Discord bot integration
⚡ Fast and lightweight backend architecture 

🛠️ Tech Stack
Backend: Node.js, Express.js
AI Model: LLaMA / Hugging Face Inference API
API Calls: node-fetch
Environment Management: dotenv
Optional Integration: Discord Bot
📡 API Endpoints
Method	Endpoint	Description
GET	/messages	Get all chat messages
POST	/messages	Add a message
POST	/chat	Send message & get AI response
DELETE	/messages	Clear chat history
GET	/health	Server health check
🔄 How It Works

User sends a message
Backend receives input via /chat
Request is sent to Hugging Face model
AI generates response
Response is stored and returned
🔐 Environment Variables

Create a .env file:

## HUGGINGFACE_TOKEN=your_token_here
## DISCORD_TOKEN=your_discord_token (optional)

▶️ Run Locally
## git clone <your-repo-url>
## cd chatbot-app
## npm install
## npm run dev

📈 Future Improvements
🧠 Chat memory (context-based responses)
🎨 Frontend UI (React + Tailwind)
⚡ Streaming responses
☁️ Deployment (Render / Vercel)
🔍 Resume screening integration (AI-based)
