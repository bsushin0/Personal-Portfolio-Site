"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
      // Refocus input field after response
      inputRef.current?.focus();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-16 h-16 rounded-full",
            "bg-gradient-to-br from-cyan-500 to-blue-600",
            "dark:from-cyan-400 dark:to-purple-600",
            "shadow-lg shadow-cyan-500/50 dark:shadow-cyan-400/30",
            "hover:shadow-xl hover:shadow-cyan-500/60 dark:hover:shadow-cyan-400/40",
            "hover:scale-110 active:scale-95",
            "transition-all duration-300",
            "flex items-center justify-center",
            "animate-pulse-glow"
          )}
          aria-label="Open chat"
        >
          <Sparkles className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300",
            "md:bottom-6 md:right-6",
            "bottom-0 right-0 left-0 md:left-auto",
            "md:w-[400px] md:h-[600px]",
            "w-full h-full md:h-[600px]",
            "flex flex-col",
            "glass-dark backdrop-blur-xl",
            "border border-cyan-500/20 dark:border-cyan-400/20",
            "md:rounded-2xl rounded-none",
            "shadow-2xl shadow-cyan-500/20 dark:shadow-cyan-400/10",
            "overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 dark:border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-cyan-900 dark:text-cyan-100">
                  Sushin&apos;s AI Assistant
                </h3>
                <p className="text-xs text-cyan-700 dark:text-cyan-300">
                  Powered by Gemini
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Learning Notice */}
          <div className="px-4 py-2 border-b border-yellow-200 dark:border-yellow-800/40 bg-yellow-50 dark:bg-yellow-900/30">
            <div className="flex items-start gap-2 text-yellow-900 dark:text-yellow-100">
              <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-700 dark:text-yellow-300" />
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
                  "flex",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    "break-words whitespace-pre-wrap",
                    message.role === 'user'
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-purple-600 text-white"
                      : "glass-effect dark:glass-dark border border-cyan-500/20 dark:border-cyan-400/20 text-cyan-900 dark:text-cyan-100"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-effect dark:glass-dark border border-cyan-500/20 dark:border-cyan-400/20 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-cyan-500/20 dark:border-cyan-400/20 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
            <form onSubmit={onSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Sushin&apos;s experience..."
                disabled={isLoading}
                className={cn(
                  "flex-1 bg-white/50 dark:bg-gray-900/50",
                  "border-cyan-500/20 dark:border-cyan-400/20",
                  "focus:border-cyan-500 dark:focus:border-cyan-400",
                  "placeholder:text-cyan-600/50 dark:placeholder:text-cyan-400/50"
                )}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                  "bg-gradient-to-br from-cyan-500 to-blue-600",
                  "dark:from-cyan-400 dark:to-purple-600",
                  "hover:shadow-lg hover:shadow-cyan-500/50",
                  "dark:hover:shadow-cyan-400/30",
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
            <p className="text-xs text-cyan-600/70 dark:text-cyan-400/70 mt-2 text-center">
              Powered by Google Gemini • Developed In-House
            </p>
          </div>
        </div>
      )}
    </>
  );
}
