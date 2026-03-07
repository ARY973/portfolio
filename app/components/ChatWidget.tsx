"use client";

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I can provide a concise evaluation of Aryan’s skills, modeling capability, and hiring fit. What role are you considering?",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    const currentInput = input; // store before clearing
    const userMessage: Message = { role: "user", content: currentInput };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "There was an issue generating a response. Please try again.",
        },
      ]);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg"
      >
        Evaluate Candidate
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-[420px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
          
          <div className="px-4 py-3 border-b font-medium">
            Candidate Evaluation Assistant
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
              placeholder="Ask about skills, hiring fit, modeling strength..."
              className="flex-1 border rounded-md px-2 py-1 text-sm outline-none text-black placeholder-gray-400"
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
};