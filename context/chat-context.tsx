"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface ChatContextValue {
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  isPastHero: boolean
  setIsPastHero: (v: boolean) => void
  /** True once the scroll traveler has reached the corner position (~90–95% scroll). Gates corner button visibility. */
  isCornerReady: boolean
  setIsCornerReady: (v: boolean) => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const [isCornerReady, setIsCornerReady] = useState(false)

  const openChat = useCallback(() => setIsOpen(true), [])
  const closeChat = useCallback(() => setIsOpen(false), [])
  const toggleChat = useCallback(() => setIsOpen((v) => !v), [])

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat, isPastHero, setIsPastHero, isCornerReady, setIsCornerReady }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider")
  return ctx
}
