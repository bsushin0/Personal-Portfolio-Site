"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useChatContext } from '@/context/chat-context';

// ── Section tooltip pools — randomized, no consecutive repeat ─────────────────
type SectionTooltipPool = string[];

const SECTION_POOLS: Record<string, SectionTooltipPool> = {
  about: [
    "Ask me more about this",
    "Want to know what drives me?",
    "There's a story behind each of these",
    "I'm happy to go deeper on any of this",
  ],
  interests: [
    "Ask me more about this",
    "Want to know what drives me?",
    "There's a story behind each of these",
    "I'm happy to go deeper on any of this",
  ],
  experience: [
    "Want to know more about this experience?",
    "Ask me about my time here",
    "I can walk you through what I actually did",
    "There's more behind this role — ask me",
  ],
  projects: [
    "Want me to walk you through Project AiRa?",
    "Ask me anything about these projects",
    "Curious what tech stack I used here?",
    "I built these — ask me how",
  ],
  education: [
    "Want to know more about my academic path?",
    "Ask me about my coursework",
    "There's more to this than grades — ask me",
  ],
  skills: [
    "Curious how I use any of these?",
    "Ask me about any of these skills",
    "Some of these have interesting stories behind them",
    "Want to know which ones I use most?",
  ],
  certifications: [
    "Ask me about any of these certs",
    "Want to know why I got into this?",
    "Some of these changed how I think about AI",
    "Ask me which ones I'd recommend",
  ],
  contact: [
    "Ask me anything",
    "I'm happy to answer any questions",
    "Let's talk — ask me something",
  ],
};

// Per-section last-used index tracking (persists across section re-entries in session)
const lastUsedIndex: Record<string, number> = {};

function pickTooltip(sectionId: string): string {
  const pool = SECTION_POOLS[sectionId];
  if (!pool || pool.length === 0) return "Ask me anything";
  if (pool.length === 1) return pool[0];

  let idx: number;
  do {
    idx = Math.floor(Math.random() * pool.length);
  } while (idx === lastUsedIndex[sectionId]);

  lastUsedIndex[sectionId] = idx;
  return pool[idx];
}

// ── Mini avatar face SVG ──────────────────────────────────────────────────────
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
  );
}

// ── Speech bubble tooltip ─────────────────────────────────────────────────────
interface TooltipBubbleProps {
  message: string;
  onClose: () => void;
  onAskMe: () => void;
  prefersReduced: boolean;
}

function TooltipBubble({ message, onClose, onAskMe, prefersReduced }: TooltipBubbleProps) {
  return (
    <motion.div
      key="avatar-tooltip"
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.92 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      className="absolute bottom-full mb-3 right-0 w-max max-w-[220px]"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="glass-effect border border-border-subtle rounded-2xl px-3.5 py-3 shadow-xl">
        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-2 right-2 text-foreground/40 hover:text-foreground/70 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>

        <button
          onClick={onAskMe}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group pr-4"
        >
          {message}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
      </div>

      {/* Bubble tail pointing down-right */}
      <div
        className="absolute right-6 -bottom-[6px] w-0 h-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid hsl(var(--border-subtle))",
        }}
      />
    </motion.div>
  );
}

// ── Unified corner avatar — chat trigger + section guide ──────────────────────
function AvatarCornerButton() {
  const { openChat, isPastHero, setIsPastHero } = useChatContext();
  const [tooltipMsg, setTooltipMsg] = useState<string | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Refs — avoid triggering re-renders on every observer callback
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSectionRef = useRef<string>("");
  const isAnimatingRef = useRef(false); // gate: debounce rapid section crossings

  // Detect reduced motion once on mount
  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Hero intersection — threshold 0.50: avatar only returns to hero when 50% of hero is visible
  useEffect(() => {
    const heroEl = document.querySelector<HTMLElement>("section:first-of-type");
    if (!heroEl) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // Scrolling down: fire as soon as hero begins to leave (intersectionRatio < 0.5)
        // Scrolling up: only snap back once hero is at least 50% visible again
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setIsPastHero(false);
        } else if (!entry.isIntersecting) {
          setIsPastHero(true);
        }
      },
      { threshold: [0, 0.5] }
    );
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, [setIsPastHero]);

  // Show tooltip — ref gate ensures no cascade of re-renders
  const showTooltip = useCallback((msg: string) => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setTooltipMsg(msg);
    tooltipTimerRef.current = setTimeout(() => setTooltipMsg(null), 4500);
  }, []);

  const dismissTooltip = useCallback(() => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setTooltipMsg(null);
  }, []);

  // Section observers — fire tooltip only once per section, debounced via isAnimatingRef
  useEffect(() => {
    if (!isPastHero) return;
    const observers: IntersectionObserver[] = [];

    Object.keys(SECTION_POOLS).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (lastSectionRef.current === id) return; // same section, skip
          if (isAnimatingRef.current) return; // debounce rapid crossings

          isAnimatingRef.current = true;
          lastSectionRef.current = id;
          showTooltip(pickTooltip(id));

          // Unlock after 600ms — prevents firing for every micro-crossing during fast scroll
          setTimeout(() => { isAnimatingRef.current = false; }, 600);
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isPastHero, showTooltip]);

  const handleOpenChat = useCallback(() => {
    dismissTooltip();
    openChat();
  }, [dismissTooltip, openChat]);

  return (
    // Always mounted so the placeholder ring is visible in hero (State 1) and transitions to filled (State 2)
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip speech bubble — only shown when past hero */}
      <AnimatePresence mode="wait">
        {tooltipMsg && isPastHero && (
          <TooltipBubble
            message={tooltipMsg}
            onClose={dismissTooltip}
            onAskMe={handleOpenChat}
            prefersReduced={prefersReduced}
          />
        )}
      </AnimatePresence>

      {/* Avatar container — fixed 64×64 */}
      <div className="relative w-16 h-16" style={{ willChange: "transform, opacity" }}>
        {/* State 1 (in hero): empty outlined ring placeholder — no layoutId, just visual hint */}
        {!isPastHero && (
          <div
            className="absolute inset-0 rounded-full"
            aria-hidden="true"
            style={{
              border: "2px solid hsl(188 100% 50% / 0.40)",
              background: "transparent",
            }}
          >
            {/* Ghost silhouette at 12% opacity — hints at what will land here */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-[0.12]">
              <AvatarFace size={64} />
            </div>
          </div>
        )}

        {/* State 2/3 (past hero): filled avatar button with layoutId — springs in from hero */}
        {isPastHero && (
          <motion.button
            layoutId="aira-avatar"
            onClick={handleOpenChat}
            whileHover={prefersReduced ? {} : { scale: 1.08 }}
            whileTap={prefersReduced ? {} : { scale: 0.94 }}
            className={cn(
              "absolute inset-0 rounded-full",
              "border-2 shadow-xl cursor-pointer select-none",
              "flex items-center justify-center"
            )}
            style={{
              borderColor: "hsl(188 100% 50% / 0.5)",
              boxShadow: "0 0 20px hsl(188 100% 50% / 0.28), 0 4px 20px rgba(0,0,0,0.22)",
              background: "linear-gradient(135deg, hsl(188 100% 50% / 0.18), hsl(239 84% 67%), hsl(278 68% 59%))",
              animation: prefersReduced ? "none" : "corner-avatar-float 3.8s ease-in-out infinite",
              willChange: "transform",
            }}
            aria-label="Open AI chat assistant"
            initial={false}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            {/* Pulse ring lives inside the button so it follows the layoutId animation */}
            <div
              className="absolute rounded-full pointer-events-none"
              aria-hidden="true"
              style={{
                inset: "-4px",
                animation: prefersReduced ? "none" : "corner-avatar-pulse 2.8s ease-in-out infinite",
                willChange: "box-shadow",
              }}
            />
            {/* Inner clip wrapper keeps AvatarFace contained */}
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              <AvatarFace size={52} />
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ── Main chatbot component ────────────────────────────────────────────────────
export function Chatbot() {
  const { isOpen, openChat, closeChat } = useChatContext();
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([
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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* Corner avatar — always mounted; hidden when chat is open (layoutId morphs into header) */}
      {!isOpen && <AvatarCornerButton />}

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
            {/* Header — avatar morphs from corner button into here */}
            <div className="flex items-center justify-between p-4 border-b border-stone-300 dark:border-slate-800 bg-background/70">
              <div className="flex items-center gap-3">
                {/* Avatar — layoutId shared with corner button */}
                <motion.div
                  layoutId="aira-avatar"
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, hsl(188 100% 50% / 0.2), hsl(239 84% 67%), hsl(278 68% 59%))",
                    border: "1.5px solid hsl(188 100% 50% / 0.4)",
                    willChange: "transform",
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
