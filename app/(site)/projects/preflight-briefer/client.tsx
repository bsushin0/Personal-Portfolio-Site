"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Plane, RefreshCw, ArrowLeft, Github, Wind, Eye, Thermometer, Gauge, Cloud, AlertTriangle, Info, Loader2 } from "lucide-react"
import { cn, isValidICAO } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"
import {
  getFlightCategory,
  flightCategoryBg,
  formatWinds,
  altimeterToInHg,
  celsiusToFahrenheit,
} from "@/lib/aviation-api"
import type { WeatherBundle, BriefingRequest, MetarData, SigmetData, AirmetData } from "@/types/aviation"

// ─── Inline WxCard ─────────────────────────────────────────────────────────────
function WxCard({ label, metar }: { label: string; metar: MetarData | null }) {
  if (!metar) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xs text-zinc-600">No METAR available</p>
      </div>
    )
  }
  const cat = getFlightCategory(metar)
  const catStyle = flightCategoryBg(cat)

  return (
    <div className="rounded-lg border border-zinc-800/80 bg-[#0f1318] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{label}</p>
          <p className="text-lg font-bold text-white font-mono">{metar.icaoId}</p>
        </div>
        <span className={cn("text-xs font-mono font-bold px-2.5 py-1 rounded border", catStyle)}>{cat}</span>
      </div>
      <div className="bg-black/30 rounded px-3 py-2 font-mono text-[10px] text-amber-400/80 leading-relaxed break-all">
        {metar.rawOb}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Row icon={<Wind className="h-3 w-3"/>} label="Winds">{formatWinds(metar.wdir, metar.wspd, metar.wgst)}</Row>
        <Row icon={<Eye className="h-3 w-3"/>} label="Visibility">{metar.visib ? `${metar.visib} SM` : "—"}</Row>
        <Row icon={<Cloud className="h-3 w-3"/>} label="Sky">
          {metar.skyCondition?.length ? metar.skyCondition.map((s) => `${s.cover}${s.base !== undefined ? ` ${s.base * 100}` : ""}`).join(" ") : "CLR"}
        </Row>
        <Row icon={<Gauge className="h-3 w-3"/>} label="Altimeter">{altimeterToInHg(metar.altim)}</Row>
        {metar.temp !== null && (
          <Row icon={<Thermometer className="h-3 w-3"/>} label="Temp / Dew">
            {metar.temp}°C / {metar.dewp}°C ({celsiusToFahrenheit(metar.temp ?? 0)}°F)
          </Row>
        )}
        {metar.wxString && <Row icon={<Cloud className="h-3 w-3"/>} label="Wx">{metar.wxString}</Row>}
      </div>
    </div>
  )
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1 text-zinc-500">{icon}<span className="uppercase tracking-wider font-mono" style={{fontSize:"9px"}}>{label}</span></div>
      <span className="text-zinc-200 font-mono text-[11px]">{children}</span>
    </div>
  )
}

// ─── Inline SigmetStrip ────────────────────────────────────────────────────────
function SigmetStrip({ sigmets, airmets }: { sigmets: SigmetData[]; airmets: AirmetData[] }) {
  if (!sigmets.length && !airmets.length) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-500/70 font-mono px-1">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        No active SIGMETs or AIRMETs
      </div>
    )
  }
  return (
    <div className="space-y-1.5">
      {sigmets.slice(0, 4).map((s, i) => (
        <div key={i} className="flex items-start gap-2 rounded border border-red-500/20 bg-red-500/5 px-3 py-2">
          <AlertTriangle className="h-3 w-3 text-red-400 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono font-bold text-red-400 uppercase">SIGMET</span>
            <span className="text-[10px] font-mono text-zinc-400 ml-2">{s.id} — {s.hazard}</span>
            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{s.rawAirSigmet.slice(0, 120)}…</p>
          </div>
        </div>
      ))}
      {airmets.slice(0, 3).map((a, i) => (
        <div key={i} className="flex items-start gap-2 rounded border border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
          <Info className="h-3 w-3 text-yellow-400 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase">AIRMET</span>
            <span className="text-[10px] font-mono text-zinc-400 ml-2">{a.id} — {a.hazard}</span>
            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{a.rawAirmet.slice(0, 120)}…</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Inline BriefingOutput ─────────────────────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^[•\-\*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^(?!<[hul])(.+)$/gm, (l) => (l ? `<p>${l}</p>` : ""))
    .replace(/<p><\/p>/g, "")
}

function BriefingOutput({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  if (!text && !isStreaming) return null
  return (
    <div className="rounded-lg border border-zinc-800/80 bg-[#0f1318] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">AI Weather Briefing</span>
        </div>
        {isStreaming
          ? <div className="flex items-center gap-1.5 text-xs text-amber-500/70"><Loader2 className="h-3 w-3 animate-spin"/><span className="font-mono">Generating…</span></div>
          : <span className="text-xs font-mono text-green-500/60">Complete</span>
        }
      </div>
      <div className="p-5 overflow-y-auto max-h-[600px]">
        <style>{`
          .bp-prose h2{font-size:.95rem;font-weight:600;color:#f59e0b;margin-top:1.4rem;margin-bottom:.4rem}
          .bp-prose h2:first-child{margin-top:0}
          .bp-prose p{color:#cbd5e1;line-height:1.7;margin-bottom:.65rem;font-size:.875rem}
          .bp-prose ul{margin-left:1.2rem;margin-bottom:.65rem}
          .bp-prose li{color:#cbd5e1;line-height:1.7;font-size:.875rem;margin-bottom:.15rem}
          .bp-prose strong{color:#e2e8f0;font-weight:600}
          .bp-prose code{background:rgba(245,158,11,.1);color:#fbbf24;padding:.1em .35em;border-radius:3px;font-family:monospace;font-size:.8em}
        `}</style>
        <div className="bp-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
        {isStreaming && <span className="inline-block w-1.5 h-4 bg-amber-500 animate-pulse ml-0.5 align-middle" />}
      </div>
    </div>
  )
}

// ─── Input field ───────────────────────────────────────────────────────────────
function InputField({ label, placeholder, value, onChange, onKeyDown, maxLength, type = "text" }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void; maxLength?: number; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="rounded-lg border border-zinc-700/60 bg-black/40 px-3 py-2 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
      />
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export function PreflightBrieferClient() {
  const [departure, setDeparture] = useState("")
  const [destination, setDestination] = useState("")
  const [altitude, setAltitude] = useState("")
  const [aircraftType, setAircraftType] = useState("")
  const [wx, setWx] = useState<WeatherBundle | null>(null)
  const [briefing, setBriefing] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestBriefing = useCallback(async () => {
    const dep = departure.trim().toUpperCase()
    const dest = destination.trim().toUpperCase() || undefined

    if (!dep || !isValidICAO(dep)) {
      setError("Enter a valid 4-letter ICAO code (e.g. KLAF, KORD, KJFK)")
      return
    }
    if (dest && !isValidICAO(dest)) {
      setError("Destination must be a valid 4-letter ICAO code")
      return
    }

    setError(null); setIsLoading(true); setIsStreaming(false); setBriefing(""); setWx(null)

    const body: BriefingRequest = {
      departure: dep,
      destination: dest,
      altitude: altitude ? parseInt(altitude) : undefined,
      aircraftType: aircraftType || undefined,
    }

    // Track briefer usage in MongoDB analytics
    trackEvent("briefer_use", {
      departure: dep,
      destination: dest || null,
      hasAltitude: !!altitude,
      hasAircraftType: !!aircraftType,
    })

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Request failed") }
      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      setIsLoading(false); setIsStreaming(true)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""
        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const msg = JSON.parse(line)
            if (msg.type === "wx_data") setWx(msg.data as WeatherBundle)
            else if (msg.type === "text") setBriefing((prev) => prev + msg.text)
          } catch { /* partial line */ }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    } finally {
      setIsStreaming(false)
    }
  }, [departure, destination, altitude, aircraftType])

  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") requestBriefing() }

  return (
    <div className="min-h-screen bg-[#0a0d12] text-slate-200">
      {/* Nav */}
      <nav className="border-b border-zinc-800/60 bg-black/40 px-5 py-3 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/#projects" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
            <ArrowLeft className="h-3 w-3" />
            portfolio
          </Link>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Plane className="h-3 w-3 text-amber-400" />
            </div>
            <span className="font-semibold text-sm text-white">Pre-Flight AI Briefer</span>
          </div>
        </div>
        <a
          href="https://github.com/bsushin0/Preflight-AI-Briefer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          <Github className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">source</span>
        </a>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.3em] mb-3 bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Live FAA Weather Data
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Pre-Flight AI Briefer</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-lg mx-auto">
            Enter your departure airport to get a plain-English weather briefing powered by live METAR, TAF, SIGMET, and AIRMET data.
          </p>
          <p className="text-[11px] text-red-400/60 mt-2 font-mono">
            ⚠ For situational awareness only. Always obtain an official FAA briefing at{" "}
            <a href="https://www.1800wxbrief.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-400">1800wxbrief.com</a>{" "}
            before any flight.
          </p>
        </div>

        {/* Input panel */}
        <div className="rounded-xl border border-zinc-800/80 bg-[#0f1318] p-5 space-y-4">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Flight Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <InputField label="Departure *" placeholder="KLAF" value={departure} onChange={(v) => setDeparture(v.toUpperCase())} onKeyDown={onKey} maxLength={4} />
            <InputField label="Destination" placeholder="KORD (optional)" value={destination} onChange={(v) => setDestination(v.toUpperCase())} onKeyDown={onKey} maxLength={4} />
            <InputField label="Altitude (ft MSL)" placeholder="5500" value={altitude} onChange={setAltitude} onKeyDown={onKey} type="number" />
            <InputField label="Aircraft Type" placeholder="C172 (optional)" value={aircraftType} onChange={setAircraftType} onKeyDown={onKey} />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-mono bg-red-500/5 border border-red-500/20 rounded px-3 py-2">{error}</p>
          )}

          <button
            onClick={requestBriefing}
            disabled={isLoading || isStreaming}
            className="flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-semibold px-6 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            {isLoading || isStreaming
              ? <><RefreshCw className="h-4 w-4 animate-spin" />{isLoading ? "Fetching weather…" : "Generating briefing…"}</>
              : <><Plane className="h-4 w-4" />Request Briefing</>
            }
          </button>
        </div>

        {/* Results */}
        {wx && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 space-y-4">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1">Raw Weather</p>
              <WxCard label="Departure" metar={wx.departureMETAR} />
              {wx.destinationMETAR && <WxCard label="Destination" metar={wx.destinationMETAR} />}
              <div className="rounded-lg border border-zinc-800/80 bg-[#0f1318] p-4">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">SIGMETs / AIRMETs</p>
                <SigmetStrip sigmets={wx.sigmets} airmets={wx.airmets} />
              </div>
              <p className="text-[10px] font-mono text-zinc-600 px-1">Data fetched: {wx.fetchedAt} UTC</p>
            </div>
            <div className="lg:col-span-2">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1 mb-3">AI Briefing</p>
              <BriefingOutput text={briefing} isStreaming={isStreaming} />
            </div>
          </div>
        )}

        {!wx && !isLoading && !isStreaming && (
          <div className="text-center py-16 text-zinc-700">
            <Plane className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-mono">Enter a departure ICAO and request your briefing</p>
            <p className="text-xs font-mono mt-1 opacity-60">Try: KLAF, KORD, KJFK, KSFO, KDEN</p>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800/60 py-4 px-6 text-center mt-8">
        <p className="text-[10px] font-mono text-zinc-600">
          Weather data from{" "}
          <a href="https://aviationweather.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">aviationweather.gov</a>
          {" · "}AI by{" "}
          <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">Anthropic Claude</a>
          {" · "}Built by{" "}
          <Link href="/" className="underline hover:text-zinc-400">Sushin Bandha</Link>
        </p>
      </footer>
    </div>
  )
}
