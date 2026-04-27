"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useChatContext } from '@/context/chat-context';

// ── Mini avatar face (shared visual) ─────────────────────────────────────────
function AvatarFace({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cf-face" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(188 100% 50%)" />
          <stop offset="50%" stopColor="hsl(239 84% 67%)" />
          <stop offset="100%" stopColor="hsl(278 68% 59%)" />
        </radialGradient>
        <radialGradient id="cf-eye" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="hsl(188 100% 50% / 0.5)" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="28" fill="url(#cf-face)" />
      <circle cx="22" cy="22" r="12" fill="rgba(255,255,255,0.12)" />
      <ellipse cx="21" cy="27" rx="6" ry="6.5" fill="url(#cf-eye)" />
      <circle cx="21" cy="27" r="3.5" fill="#0f172a" />
      <circle cx="19.5" cy="25.5" r="1.4" fill="white" opacity="0.9" />
      <circle cx="20" cy="26" r="0.7" fill="hsl(188 100% 70%)" opacity="0.8" />
      <ellipse cx="39" cy="27" rx="6" ry="6.5" fill="url(#cf-eye)" />
      <circle cx="39" cy="27" r="3.5" fill="#0f172a" />
      <circle cx="37.5" cy="25.5" r="1.4" fill="white" opacity="0.9" />
      <circle cx="38" cy="26" r="0.7" fill="hsl(188 100% 70%)" opacity="0.8" />
      <path d="M 22 37 Q 30 43 38 37" stroke="hsl(239 84% 85%)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Floating trigger button (avatar morphs here when closed) ─────────────────
function ChatTrigger({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      layoutId="chat-avatar"
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-16 h-16 rounded-full",
        "overflow-hidden",
        "shadow-lg shadow-indigo-500/30",
        "hover:shadow-xl hover:shadow-indigo-500/40",
        "hover:scale-110 active:scale-95",
        "transition-shadow duration-300",
        "animate-pulse-glow",
        "flex items-center justify-center"
      )}
      style={{
        background: "linear-gradient(135deg, hsl(188 100% 50% / 0.25), hsl(239 84% 67%), hsl(278 68% 59%))",
        border: "2px solid hsl(188 100% 50% / 0.45)",
      }}
      aria-label="Open AI chat"
      initial={false}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
    >
      <AvatarFace size={52} />
    </motion.button>
  )
}

// ── Main chatbot component ────────────────────────────────────────────────────
export function Chatbot() {
  const { isOpen, openChat, closeChat } = useChatContext();
  const [messages, setMessages] = useState<Array<{id: string; role: 'user' | 'assistant'; content: string}>>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Sushin's AI assistant. I can answer questions about his background, skills, and experience in AI/ML and product management. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  // Handle form submission
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Floating trigger — only when closed */}
      <AnimatePresence>
        {!isOpen && <ChatTrigger onClick={openChat} />}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.93, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={cn(
              "fixed z-50",
              "md:bottom-6 md:right-6",
              "bottom-0 right-0 left-0 md:left-auto",
              "md:w-[400px]",
              "w-full h-full md:h-[600px]",
              "flex flex-col",
              "glass-effect backdrop-blur-xl",
              "border border-border-subtle",
              "md:rounded-2xl rounded-none",
              "shadow-2xl shadow-black/10 dark:shadow-black/40",
              "overflow-hidden"
            )}
          >
            {/* Header — avatar morphs from trigger button into here */}
            <div className="flex items-center justify-between p-4 border-b border-stone-300 dark:border-slate-800 bg-background/70">
              <div className="flex items-center gap-3">
                {/* Avatar — layoutId shared with trigger button */}
                <motion.div
                  layoutId="chat-avatar"
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, hsl(188 100% 50% / 0.2), hsl(239 84% 67%), hsl(278 68% 59%))",
                    border: "1.5px solid hsl(188 100% 50% / 0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                >
                  <AvatarFace size={40} />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Sushin&apos;s AI Assistant
                  </h3>
                  <p className="text-xs text-foreground/60">
                    Powered by Gemini
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeChat}
                className="hover:bg-surface-hover/70"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Learning Notice */}
            <div className="px-4 py-2 border-b border-warning-border/40 bg-warning/10">
              <div className="flex items-start gap-2 text-warning-foreground">
                <AlertCircle className="w-4 h-4 mt-0.5 text-warning" />
                <p className="text-xs">
                  This AI assistant was developed in-house. It is still learning and may make mistakes.
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {/* Avatar icon next to assistant messages */}
                  {message.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mb-0.5"
                      style={{
                        background: "linear-gradient(135deg, hsl(188 100% 50%), hsl(278 68% 59%))",
                        border: "1px solid hsl(188 100% 50% / 0.35)",
                      }}
                    >
                      <AvatarFace size={28} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3",
                      "break-words whitespace-pre-wrap",
                      message.role === 'user'
                        ? "bg-indigo-500 dark:bg-indigo-600 text-white"
                        : "glass-effect border border-border-subtle text-foreground"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <div
                    className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mb-0.5"
                    style={{
                      background: "linear-gradient(135deg, hsl(188 100% 50%), hsl(278 68% 59%))",
                      border: "1px solid hsl(188 100% 50% / 0.35)",
                    }}
                  >
                    <AvatarFace size={28} />
                  </div>
                  <div className="glass-effect border border-border-subtle rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-500 dark:text-indigo-400" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-stone-300 dark:border-slate-800 bg-background/70">
              <form onSubmit={onSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Sushin's experience..."
                  disabled={isLoading}
                  className={cn(
                    "flex-1 bg-surface-input/70",
                    "border-border-subtle",
                    "focus:border-indigo-500 dark:focus:border-indigo-400",
                    "placeholder:text-foreground/40"
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "bg-indigo-500 dark:bg-indigo-600",
                    "hover:bg-indigo-600 dark:hover:bg-indigo-700",
                    "transition-all duration-300"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-foreground/50 mt-2 text-center">
                Powered by Google Gemini &bull; Developed In-House
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
