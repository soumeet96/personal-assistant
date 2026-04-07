"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Loader2, Trash2 } from "lucide-react";

export default function Home() {
  const { messages, sendMessage, status, setMessages } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const clearChat = () => setMessages([]);

  const suggestions = [
    "Give me 5 startup ideas for 2025",
    "Explain Kubernetes in simple terms",
    "Write a LinkedIn post about DevOps",
    "What is the best way to learn system design?",
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h1 className="font-semibold text-white">Personal Assistant</h1>
            <p className="text-xs text-gray-400">Powered by Llama 3.3 · Groq</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-800"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Bot size={32} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">How can I help you?</h2>
              <p className="text-gray-400 text-sm max-w-sm">
                Ask me anything — ideas, explanations, writing help, or just a quick question.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 max-w-md w-full">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    textareaRef.current?.focus();
                  }}
                  className="text-left text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const text = m.parts
              .filter((p) => p.type === "text")
              .map((p) => (p as { type: "text"; text: string }).text)
              .join("");

            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl mx-auto ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    m.role === "user" ? "bg-indigo-600" : "bg-gray-700"
                  }`}
                >
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-gray-800 text-gray-100 rounded-tl-sm"
                  }`}
                >
                  {text}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-3 max-w-3xl mx-auto items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700 max-h-32 overflow-y-auto"
            style={{ minHeight: "48px" }}
          />
          <button
            onClick={submit}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">
          Free · Open source · Built by Soumeet
        </p>
      </div>
    </div>
  );
}
