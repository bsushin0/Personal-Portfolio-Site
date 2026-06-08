import type { MetarData, TafData, SigmetData, AirmetData } from "@/types/aviation"

const AW_BASE = "https://aviationweather.gov/api/data"

export async function fetchMETAR(icao: string): Promise<MetarData | null> {
  try {
    const res = await fetch(`${AW_BASE}/metar?ids=${icao.toUpperCase()}&format=json&hours=2`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null
    return data[0] as MetarData
  } catch {
    return null
  }
}

export async function fetchTAF(icao: string): Promise<TafData | null> {
  try {
    const res = await fetch(`${AW_BASE}/taf?ids=${icao.toUpperCase()}&format=json`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null
    return data[0] as TafData
  } catch {
    return null
  }
}

export async function fetchSIGMETs(): Promise<SigmetData[]> {
  try {
    const res = await fetch(`${AW_BASE}/airsigmet?format=json&type=sigmet`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? (data as SigmetData[]) : []
  } catch {
    return []
  }
}

export async function fetchAIRMETs(): Promise<AirmetData[]> {
  try {
    const res = await fetch(`${AW_BASE}/airsigmet?format=json&type=airmet`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? (data as AirmetData[]) : []
  } catch {
    return []
  }
}

export function getFlightCategory(metar: MetarData): string {
  if (metar.fltcat) return metar.fltcat
  const vis = metar.visib ? parseFloat(metar.visib) : 10
  const ceiling = metar.skyCondition
    ? metar.skyCondition
        .filter((s) => s.cover === "BKN" || s.cover === "OVC" || s.cover === "OVX")
        .reduce((min, s) => (s.base !== undefined && s.base < min ? s.base : min), 9999) * 100
    : 9999
  if (vis < 1 || ceiling < 500) return "LIFR"
  if (vis < 3 || ceiling < 1000) return "IFR"
  if (vis < 5 || ceiling < 3000) return "MVFR"
  return "VFR"
}

export function flightCategoryBg(cat: string): string {
  switch (cat) {
    case "VFR":  return "bg-green-500/10 border-green-500/30 text-green-400"
    case "MVFR": return "bg-blue-500/10 border-blue-500/30 text-blue-400"
    case "IFR":  return "bg-red-500/10 border-red-500/30 text-red-400"
    case "LIFR": return "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400"
    default:     return "bg-zinc-500/10 border-zinc-500/30 text-zinc-400"
  }
}

export function formatWinds(wdir: number | string | null, wspd: number | null, wgst: number | null): string {
  if (!wdir || wspd === null) return "Calm"
  const dir = wdir === "VRB" ? "VRB" : `${String(wdir).padStart(3, "0")}°`
  const gust = wgst ? ` G${wgst}` : ""
  return `${dir} @ ${wspd}${gust} kt`
}

export function altimeterToInHg(altim: number | null): string {
  if (!altim) return "—"
  return (altim / 100).toFixed(2) + " inHg"
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}
