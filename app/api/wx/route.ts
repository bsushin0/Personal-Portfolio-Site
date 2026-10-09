import { NextRequest, NextResponse } from "next/server"

// Visitor-local weather for the sky background. Location comes from Vercel's
// IP geolocation headers (no browser permission prompt); falls back to KLAF.
// Open-Meteo needs no API key.

const KLAF = { lat: 40.4123, lon: -86.9369, city: "West Lafayette" }

export type WxCondition = "clear" | "cloudy" | "overcast" | "fog" | "rain" | "snow" | "storm"

export type WxResponse = {
  city: string
  condition: WxCondition
  cloudCover: number
  tempC: number | null
  windKt: number | null
  windDir: number | null
  visibilityM: number | null
  sunrise: string | null // ISO local time of the visitor's location
  sunset: string | null
  utcOffsetSec: number
}

function classify(code: number, cloudCover: number): WxCondition {
  if (code >= 95) return "storm"
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow"
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain"
  if (code === 45 || code === 48) return "fog"
  if (code === 3 || cloudCover > 85) return "overcast"
  if (code === 2 || cloudCover > 35) return "cloudy"
  return "clear"
}

function num(v: string | null) {
  if (!v) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export async function GET(request: NextRequest) {
  const lat = num(request.headers.get("x-vercel-ip-latitude")) ?? KLAF.lat
  const lon = num(request.headers.get("x-vercel-ip-longitude")) ?? KLAF.lon
  const rawCity = request.headers.get("x-vercel-ip-city")
  const city = rawCity ? decodeURIComponent(rawCity) : KLAF.city

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}` +
    `&current=weather_code,cloud_cover,temperature_2m,wind_speed_10m,wind_direction_10m,visibility` +
    `&daily=sunrise,sunset&wind_speed_unit=kn&timezone=auto&forecast_days=1`

  try {
    const res = await fetch(url, { next: { revalidate: 900 }, signal: AbortSignal.timeout(3500) })
    if (!res.ok) throw new Error(`open-meteo ${res.status}`)
    const data = await res.json()
    const c = data.current ?? {}
    const body: WxResponse = {
      city,
      condition: classify(Number(c.weather_code ?? 0), Number(c.cloud_cover ?? 0)),
      cloudCover: Number(c.cloud_cover ?? 0),
      tempC: typeof c.temperature_2m === "number" ? c.temperature_2m : null,
      windKt: typeof c.wind_speed_10m === "number" ? c.wind_speed_10m : null,
      windDir: typeof c.wind_direction_10m === "number" ? c.wind_direction_10m : null,
      visibilityM: typeof c.visibility === "number" ? c.visibility : null,
      sunrise: data.daily?.sunrise?.[0] ?? null,
      sunset: data.daily?.sunset?.[0] ?? null,
      utcOffsetSec: Number(data.utc_offset_seconds ?? 0),
    }
    return NextResponse.json(body, {
      headers: { "Cache-Control": "private, max-age=900" },
    })
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 })
  }
}
