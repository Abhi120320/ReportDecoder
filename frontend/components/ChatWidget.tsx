import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

import { AnalysisResponse } from "@/lib/types";

interface ChatWidgetProps {
  context: AnalysisResponse | null; // The JSON analysis result
}

export default function ChatWidget({ context }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: JSON.stringify(context, null, 2),
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "model", content: "Sorry, I am having trouble connecting to the server. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-[var(--color-foreground)]">Ask Questions</h3>
                <p className="text-xs text-[var(--color-muted)]">Clarify your report results</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-sm text-[var(--color-muted)] mt-10">
                  <p>I have analyzed your report.</p>
                  <p>Do you have any questions about it?</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === "user" ? "bg-[var(--color-primary)] text-white rounded-br-none" : "bg-[var(--color-surface-alt)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-bl-none"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-muted)] rounded-2xl rounded-bl-none px-4 py-2 text-sm flex gap-1 items-center">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a question..."
                  className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-foreground)]"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="bg-[var(--color-primary)] text-white p-2 rounded-full disabled:opacity-50 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
