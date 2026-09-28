"use client"

import { AlertTriangle, Info } from "lucide-react"
import type { SigmetData, AirmetData } from "@/types/aviation"

export function BrieferSigmetStrip({ sigmets, airmets }: { sigmets: SigmetData[]; airmets: AirmetData[] }) {
  if (sigmets.length === 0 && airmets.length === 0) {
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
