import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:5000";
const POLL_INTERVAL = 2000;

function parseMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-emerald-300 px-1.5 py-0.5 rounded text-[0.85em] font-mono">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-zinc-100 font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-zinc-300">$1</em>')
    .replace(/\n/g, "<br/>");
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-[#f7c63f] flex items-center justify-center shadow-lg shadow-emerald-500/20">
      <img src="/logo.png" alt="ChatBot Logo" className="h-6"/>
        {/* <svg className="w-4 h-4 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg> */}
      </div>
      <span className="text-xl font-bold bg-[#f7c63f] bg-clip-text text-transparent"
        style={{fontFamily:"'Syne',sans-serif"}}>ChatBot</span>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";

  if (isUser) return (
    <div className="flex justify-end gap-3" style={{animation:"fadeUp 0.3s ease forwards"}}>
      <div className="max-w-[75%] flex flex-col items-end gap-1">
        <p className="text-[11px] text-zinc-500 px-1">{msg.username}</p>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </div>
        <p className="text-[10px] text-zinc-600 px-1">{msg.time}</p>
      </div>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-5">
        {msg.username?.[0]?.toUpperCase() || "U"}
      </div>
    </div>
  );

  // Typing indicator bubble
  if (msg.typing) return (
    <div className="flex gap-3" style={{animation:"fadeUp 0.3s ease forwards"}}>
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 mt-5">
        <svg className="w-3.5 h-3.5 text-zinc-950" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0 max-w-[75%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-emerald-400" style={{fontFamily:"'Syne',sans-serif"}}>ChatBot Bot</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 inline-flex gap-1.5 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" style={{animation:"bounce 1s infinite 0ms"}}/>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" style={{animation:"bounce 1s infinite 150ms"}}/>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" style={{animation:"bounce 1s infinite 300ms"}}/>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex gap-3" style={{animation:"fadeUp 0.3s ease forwards"}}>
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 mt-5 shadow-md shadow-emerald-500/20">
        <svg className="w-3.5 h-3.5 text-zinc-950" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0 max-w-[75%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-emerald-400" style={{fontFamily:"'Syne',sans-serif"}}>
            {msg.username || "ChatBot Bot"}
          </span>
          <span className="text-[10px] text-zinc-600">{msg.time}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="text-sm text-zinc-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}/>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ status }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-4"
      style={{animation:"fadeUp 0.4s ease forwards"}}>
      <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-zinc-200 mb-2" style={{fontFamily:"'Syne',sans-serif"}}>
          Chat with ChatBot
        </h2>
        <p className="text-zinc-500 text-sm max-w-xs">
          {status === "error"
            ? "Cannot connect to server. Make sure server.js is running."
            : "Type a message below to start chatting…"}
        </p>
      </div>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${
        status === "connected"
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : status === "error"
          ? "bg-red-500/10 border-red-500/30 text-red-400"
          : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${
          status === "connected" ? "bg-emerald-400 animate-pulse" :
          status === "error"     ? "bg-red-400" :
                                   "bg-yellow-400 animate-pulse"
        }`}/>
        {status === "connected" ? "Bot connected" :
         status === "error"     ? "Bot offline" : "Connecting…"}
      </div>
    </div>
  );
}

export default function ChatUI() {
  const [messages,  setMessages]  = useState([]);
  const [status,    setStatus]    = useState("connecting");
  const [input,     setInput]     = useState("");
  const [username,  setUsername]  = useState("WebUser");
  const [sending,   setSending]   = useState(false);
  const [isTyping,  setIsTyping]  = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const lastCountRef   = useRef(0);

  // ── Poll for new messages ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res  = await fetch(`${API_BASE}/messages`);
        const data = await res.json();
        // If new bot message arrived, remove typing indicator
        if (data.length > lastCountRef.current) {
          setIsTyping(false);
        }
        lastCountRef.current = data.length;
        setMessages(data);
        setStatus("connected");
      } catch {
        setStatus("error");
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");

    // Optimistically add user message to UI immediately
    const optimisticMsg = {
      id: Date.now(),
      role: "user",
      username,
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setIsTyping(true); // show bot typing indicator

    try {
      // POST to server → server stores it → discord_bot.js picks it up
      await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: text }),
      });
    } catch (err) {
      console.error("Failed to send:", err);
      setIsTyping(false);
    }

    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const displayMessages = isTyping
    ? [...messages, { id: "typing", typing: true }]
    : messages;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
      `}</style>

      <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden"
        style={{fontFamily:"'DM Sans',sans-serif"}}>

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm shrink-0">
          <Logo />
          <div className="flex items-center gap-3">
            {/* Username pill — click to change */}
            <button
              onClick={() => {
                const name = prompt("Enter your display name:", username);
                if (name?.trim()) setUsername(name.trim());
              }}
              className="text-xs text-zinc-400 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {username}
            </button>
            
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              status === "connected"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : status === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
            }`} style={{fontFamily:"'Syne',sans-serif"}}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                status === "connected" ? "bg-emerald-400 animate-pulse" :
                status === "error"     ? "bg-red-400" :
                                         "bg-yellow-400 animate-pulse"
              }`}/>
              {status === "connected" ? "Live" : status === "error" ? "Offline" : "Connecting"}
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto"
          style={{scrollbarWidth:"thin", scrollbarColor:"#3f3f46 transparent"}}>
          {messages.length === 0
            ? <EmptyState status={status}/>
            : <>
                {displayMessages.map(msg => <MessageBubble key={msg.id} msg={msg}/>)}
                <div ref={messagesEndRef}/>
              </>
          }
          {messages.length > 0 && <div ref={messagesEndRef}/>}
        </div>

        {/* Input bar */}
        <div className="px-4 py-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-sm shrink-0">
          <div className="max-w-3xl mx-auto flex gap-3 items-end">
            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 focus-within:border-emerald-500/50 transition-colors">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Message ChatBot… (Enter to send)"
                disabled={status === "error"}
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-600 resize-none outline-none leading-relaxed"
                style={{minHeight:"24px", maxHeight:"120px"}}
              />
            </div>
            {/* Send button */}
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending || status === "error"}
              className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
            >
              {sending
                ? <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                : <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                  </svg>
              }
            </button>
          </div>
          <p className="text-center text-[11px] text-zinc-700 mt-2">
            Chatting via <span className="text-zinc-500 font-mono">r3dhummingbird/DialoGPT-medium-joshua</span>
          </p>
        </div>
      </div>
    </>
  );
}