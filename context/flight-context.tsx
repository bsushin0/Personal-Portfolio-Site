"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { WxResponse } from "@/app/api/wx/route"

export type SkyPhase = "night" | "dawn" | "day" | "dusk"

type FlightState = {
  wx: WxResponse | null
  phase: SkyPhase
  squawk: string
  setSquawk: (code: string) => void
}

const FlightContext = createContext<FlightState | null>(null)

function minutesOf(iso: string | null): number | null {
  if (!iso) return null
  const m = iso.match(/T(\d{2}):(\d{2})/)
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

// Phase is based on the visitor's own clock. Sunrise/sunset come from the
// weather lookup when available, otherwise sensible defaults.
function computePhase(wx: WxResponse | null): SkyPhase {
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  const rise = minutesOf(wx?.sunrise ?? null) ?? 6 * 60 + 45
  const set = minutesOf(wx?.sunset ?? null) ?? 19 * 60 + 15
  if (mins >= rise - 40 && mins < rise + 50) return "dawn"
  if (mins >= rise + 50 && mins < set - 50) return "day"
  if (mins >= set - 50 && mins < set + 40) return "dusk"
  return "night"
}

export function FlightProvider({ children }: { children: ReactNode }) {
  const [wx, setWx] = useState<WxResponse | null>(null)
  const [phase, setPhase] = useState<SkyPhase>("night")
  const [squawk, setSquawk] = useState("1200")

  useEffect(() => {
    let cancelled = false
    fetch("/api/wx")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: WxResponse | null) => {
        if (!cancelled && d && "condition" in d) setWx(d)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const update = () => setPhase(computePhase(wx))
    update()
    const t = setInterval(update, 60_000)
    return () => clearInterval(t)
  }, [wx])

  return <FlightContext.Provider value={{ wx, phase, squawk, setSquawk }}>{children}</FlightContext.Provider>
}

export function useFlight() {
  const ctx = useContext(FlightContext)
  if (!ctx) throw new Error("useFlight must be used inside FlightProvider")
  return ctx
}
