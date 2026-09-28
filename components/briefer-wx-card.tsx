"use client"

import { Wind, Eye, Thermometer, Gauge, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getFlightCategory,
  flightCategoryBg,
  formatWinds,
  altimeterToInHg,
  celsiusToFahrenheit,
} from "@/lib/aviation-api"
import type { MetarData } from "@/types/aviation"

interface WxCardProps {
  label: string
  metar: MetarData | null
  className?: string
}

export function BrieferWxCard({ label, metar, className }: WxCardProps) {
  if (!metar) {
    return (
      <div className={cn("rounded-lg border border-zinc-800 bg-zinc-900/50 p-4", className)}>
        <p className="text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xs text-zinc-600">No METAR available for this station</p>
      </div>
    )
  }

  const cat = getFlightCategory(metar)
  const catStyle = flightCategoryBg(cat)

  return (
    <div className={cn("rounded-lg border border-zinc-800/80 bg-[#0f1318] p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{label}</p>
          <p className="text-lg font-bold text-white font-mono">{metar.icaoId}</p>
        </div>
        <span className={cn("text-xs font-mono font-bold px-2.5 py-1 rounded border", catStyle)}>
          {cat}
        </span>
      </div>

      <div className="bg-black/30 rounded px-3 py-2 font-mono text-[10px] text-amber-400/80 leading-relaxed break-all">
        {metar.rawOb}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <DataRow icon={<Wind className="h-3 w-3" />} label="Winds">
          {formatWinds(metar.wdir, metar.wspd, metar.wgst)}
        </DataRow>
        <DataRow icon={<Eye className="h-3 w-3" />} label="Visibility">
          {metar.visib ? `${metar.visib} SM` : "—"}
        </DataRow>
        <DataRow icon={<Cloud className="h-3 w-3" />} label="Sky">
          {metar.skyCondition?.length
            ? metar.skyCondition.map((s) => `${s.cover}${s.base !== undefined ? ` ${s.base * 100}` : ""}`).join(" ")
            : "CLR"}
        </DataRow>
        <DataRow icon={<Gauge className="h-3 w-3" />} label="Altimeter">
          {altimeterToInHg(metar.altim)}
        </DataRow>
        {metar.temp !== null && (
          <DataRow icon={<Thermometer className="h-3 w-3" />} label="Temp / Dew">
            {metar.temp}°C / {metar.dewp}°C ({celsiusToFahrenheit(metar.temp ?? 0)}°F)
          </DataRow>
        )}
        {metar.wxString && (
          <DataRow icon={<Cloud className="h-3 w-3" />} label="Wx">
            {metar.wxString}
          </DataRow>
        )}
      </div>
    </div>
  )
}

function DataRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1 text-zinc-500">
        {icon}
        <span className="uppercase tracking-wider font-mono" style={{ fontSize: "9px" }}>{label}</span>
      </div>
      <span className="text-zinc-200 font-mono text-[11px]">{children}</span>
    </div>
  )
}
