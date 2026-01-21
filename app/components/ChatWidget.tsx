"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const presetReplies: Record<string, string> = {
  "roles": "Aryan is best suited for Data Analyst, Business Intelligence, Product Analytics, and early-career Machine Learning roles. He combines strong technical depth with business context.",
  "skills": "Aryan’s core skills include Python, SQL, Power BI, Machine Learning, Data Visualization, and Systems Thinking, with hands-on experience across analytics and fintech concepts.",
  "projects": "Aryan has worked on data analytics, machine learning models, simulation-based finance projects, and real-world business intelligence use cases.",
  "dc": "Aryan participated in a leadership-focused Washington DC experience that emphasized policy, global perspective, and professional growth.",
  "education": "Aryan holds a Bachelor’s in Information Technology and is pursuing a Master’s in Information Systems in the United States."
};

function getReply(input: string) {
  const text = input.toLowerCase().trim();

  // Politeness
  if (["thanks", "thank you", "thx"].some(w => text.includes(w))) {
    return "You’re very welcome! 😊 Happy to help — feel free to ask about projects, skills, or career fit.";
  }

  if (["hi", "hello", "hey"].some(w => text.startsWith(w))) {
    return "Hi there! 👋 I’m Aryan’s AI assistant. What would you like to know?";
  }

  // Career intent
  if (text.includes("hire") || text.includes("fit") || text.includes("role")) {
    return "Aryan is a strong fit for Data Analyst, Business Intelligence, Product Analytics, and entry-level Machine Learning roles. He brings both technical depth and strong business intuition.";
  }

  // Skills
  if (text.includes("skill") || text.includes("tools")) {
    return "Aryan’s core skills include Python, SQL, Power BI, machine learning, data visualization, and systems thinking — with hands-on experience across analytics and fintech use cases.";
  }

  // Projects
  if (text.includes("project") || text.includes("work")) {
    return "Aryan has worked on machine learning models, data analytics pipelines, simulation-based finance projects, and real-world business intelligence dashboards.";
  }

  // Education
  if (text.includes("education") || text.includes("degree")) {
    return "Aryan holds a Bachelor’s in Information Technology and is currently pursuing a Master’s in Information Systems in the United States.";
  }

  // Default intelligent fallback
  return "That’s a great question. I can help with Aryan’s skills, projects, education, or career alignment — just let me know what you’d like to explore.";
}


export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I’m Aryan’s AI assistant. Ask me about his skills, projects, or career fit."
    }
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const assistantMessage: Message = {
      role: "assistant",
      content: getReply(input)
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput("");
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg"
      >
        Ask AI
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-[420px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
          
          <div className="px-4 py-3 border-b font-medium">
            Aryan’s AI Assistant
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "ml-auto bg-black text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about skills, roles, projects..."
              className="flex-1 border rounded-md px-2 py-1 text-sm outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-black text-white px-3 rounded-md text-sm"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}
