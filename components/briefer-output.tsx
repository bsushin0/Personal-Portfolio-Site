"use client"

import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrieferOutputProps {
  text: string
  isStreaming: boolean
  className?: string
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^[•\-\*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (match) => `<ul>${match}</ul>`)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^(?!<[hul])(.+)$/gm, (line) => (line ? `<p>${line}</p>` : ""))
    .replace(/<p><\/p>/g, "")
}

export function BrieferOutput({ text, isStreaming, className }: BrieferOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isStreaming) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [text, isStreaming])

  if (!text && !isStreaming) return null

  return (
    <div className={cn("rounded-lg border border-zinc-800/80 bg-[#0f1318] overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">AI Weather Briefing</span>
        </div>
        {isStreaming ? (
          <div className="flex items-center gap-1.5 text-xs text-amber-500/70">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="font-mono">Generating…</span>
          </div>
        ) : (
          <span className="text-xs font-mono text-green-500/60">Complete</span>
        )}
      </div>

      <div className="p-5 overflow-y-auto max-h-[600px]">
        <div
          className="briefer-prose text-sm"
          style={proseStyles}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
        />
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-amber-500 animate-pulse ml-0.5 align-middle" />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// Inline styles so we don't pollute global CSS
const proseStyles: React.CSSProperties = {
  // handled via className overrides below — kept as object for TS
}

// Inject scoped styles once
if (typeof document !== "undefined") {
  const id = "briefer-prose-styles"
  if (!document.getElementById(id)) {
    const style = document.createElement("style")
    style.id = id
    style.textContent = `
      .briefer-prose h2 { font-size:.95rem; font-weight:600; color:#f59e0b; margin-top:1.4rem; margin-bottom:.4rem; }
      .briefer-prose h2:first-child { margin-top:0; }
      .briefer-prose p { color:#cbd5e1; line-height:1.7; margin-bottom:.65rem; font-size:.875rem; }
      .briefer-prose ul { margin-left:1.2rem; margin-bottom:.65rem; }
      .briefer-prose li { color:#cbd5e1; line-height:1.7; font-size:.875rem; margin-bottom:.15rem; }
      .briefer-prose strong { color:#e2e8f0; font-weight:600; }
      .briefer-prose code { background:rgba(245,158,11,.1); color:#fbbf24; padding:.1em .35em; border-radius:3px; font-family:monospace; font-size:.8em; }
    `
    document.head.appendChild(style)
  }
}
