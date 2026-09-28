import type { WeatherBundle, BriefingRequest } from "@/types/aviation"
import { getFlightCategory, formatWinds, altimeterToInHg, celsiusToFahrenheit } from "@/lib/aviation-api"

export function buildBriefingPrompt(req: BriefingRequest, wx: WeatherBundle): string {
  const lines: string[] = []

  lines.push(`FLIGHT INFORMATION`)
  lines.push(`Departure: ${req.departure.toUpperCase()}`)
  if (req.destination) lines.push(`Destination: ${req.destination.toUpperCase()}`)
  if (req.altitude) lines.push(`Planned Altitude: ${req.altitude.toLocaleString()} ft MSL`)
  if (req.aircraftType) lines.push(`Aircraft: ${req.aircraftType}`)
  if (req.departureTime) lines.push(`Planned Departure: ${req.departureTime}`)
  lines.push(`Data Retrieved: ${wx.fetchedAt} UTC`)
  lines.push("")

  if (wx.departureMETAR) {
    const m = wx.departureMETAR
    const cat = getFlightCategory(m)
    lines.push(`DEPARTURE METAR — ${req.departure.toUpperCase()} [${cat}]`)
    lines.push(`Raw: ${m.rawOb}`)
    lines.push(`Winds: ${formatWinds(m.wdir, m.wspd, m.wgst)}`)
    lines.push(`Visibility: ${m.visib ?? "unknown"} SM`)
    if (m.wxString) lines.push(`Weather: ${m.wxString}`)
    if (m.skyCondition?.length > 0) {
      lines.push(`Sky: ${m.skyCondition.map((s) => `${s.cover}${s.base !== undefined ? ` @ ${s.base * 100}ft AGL` : ""}`).join(", ")}`)
    }
    if (m.temp !== null) lines.push(`Temp/Dew: ${m.temp}°C (${celsiusToFahrenheit(m.temp ?? 0)}°F) / ${m.dewp}°C`)
    if (m.altim !== null) lines.push(`Altimeter: ${altimeterToInHg(m.altim)}`)
  } else {
    lines.push(`DEPARTURE METAR — ${req.departure.toUpperCase()}: NOT AVAILABLE`)
  }
  lines.push("")

  if (wx.departureTAF) {
    lines.push(`DEPARTURE TAF — ${req.departure.toUpperCase()}`)
    lines.push(wx.departureTAF.rawTAF)
  } else {
    lines.push(`DEPARTURE TAF — ${req.departure.toUpperCase()}: NOT AVAILABLE`)
  }
  lines.push("")

  if (req.destination) {
    if (wx.destinationMETAR) {
      const m = wx.destinationMETAR
      const cat = getFlightCategory(m)
      lines.push(`DESTINATION METAR — ${req.destination.toUpperCase()} [${cat}]`)
      lines.push(`Raw: ${m.rawOb}`)
      lines.push(`Winds: ${formatWinds(m.wdir, m.wspd, m.wgst)}`)
      lines.push(`Visibility: ${m.visib ?? "unknown"} SM`)
      if (m.wxString) lines.push(`Weather: ${m.wxString}`)
      if (m.skyCondition?.length > 0) {
        lines.push(`Sky: ${m.skyCondition.map((s) => `${s.cover}${s.base !== undefined ? ` @ ${s.base * 100}ft AGL` : ""}`).join(", ")}`)
      }
      if (m.temp !== null) lines.push(`Temp/Dew: ${m.temp}°C / ${m.dewp}°C`)
      if (m.altim !== null) lines.push(`Altimeter: ${altimeterToInHg(m.altim)}`)
    } else {
      lines.push(`DESTINATION METAR — ${req.destination.toUpperCase()}: NOT AVAILABLE`)
    }
    lines.push("")

    if (wx.destinationTAF) {
      lines.push(`DESTINATION TAF — ${req.destination.toUpperCase()}`)
      lines.push(wx.destinationTAF.rawTAF)
    } else {
      lines.push(`DESTINATION TAF — ${req.destination.toUpperCase()}: NOT AVAILABLE`)
    }
    lines.push("")
  }

  if (wx.sigmets.length > 0) {
    lines.push(`ACTIVE SIGMETS (${wx.sigmets.length})`)
    wx.sigmets.slice(0, 5).forEach((s) => {
      lines.push(`• ${s.id} — ${s.hazard}${s.severity ? ` (${s.severity})` : ""}: ${s.rawAirSigmet.substring(0, 200)}`)
    })
  } else {
    lines.push(`SIGMETS: NONE ACTIVE`)
  }
  lines.push("")

  if (wx.airmets.length > 0) {
    lines.push(`ACTIVE AIRMETS (${wx.airmets.length})`)
    wx.airmets.slice(0, 5).forEach((a) => {
      lines.push(`• ${a.id} — ${a.hazard}: ${a.rawAirmet.substring(0, 150)}`)
    })
  } else {
    lines.push(`AIRMETS: NONE ACTIVE`)
  }

  return lines.join("\n")
}

export const SYSTEM_PROMPT = `You are an experienced CFI (Certified Flight Instructor) and aviation weather briefer with 15,000+ hours and an ATP certificate. Your job is to deliver a structured, plain-English pre-flight weather briefing based on raw aviation weather data.

CRITICAL DISCLAIMERS YOU MUST ALWAYS FOLLOW:
- You are an AI assistant, NOT a certified FAA weather briefer
- This briefing does NOT replace an official FAA weather briefing (1800wxbrief.com or Leidos Flight Service)
- The pilot-in-command is ALWAYS responsible for the go/no-go decision
- Always end with a reminder to obtain an official briefing before flight

BRIEFING FORMAT — use these exact section headers with emojis:

## ✈️ Flight Overview
Brief 2-3 sentence summary of overall conditions.

## 🌤️ Departure Conditions
Ceiling, visibility, winds, precipitation, flight category. Include raw METAR callouts where relevant.

## 📡 En Route Weather
Any SIGMETs, AIRMETs, turbulence, icing, convective activity. If no significant weather, state that clearly.

## 🛬 Destination Conditions
(Only if destination was provided) Same format as departure.

## ⚠️ Key Hazards
Bullet list of the top concerns. Be specific — altitude ranges, time windows, severity.

## 📋 Pilot Action Items
Concrete checklist of what to check, file, or prepare before flight.

## 🟢 Go / No-Go Assessment
Be honest. Use 🟢 VFR Acceptable / 🟡 Marginal - Extra Caution Required / 🔴 IFR Conditions - VFR Not Recommended.
Explain the specific factors driving the assessment. If IFR-rated, note that.
Always note: "This assessment is for situational awareness only. File a complete weather brief via 1800wxbrief.com before any flight."

Keep the tone professional but direct — like a CFI talking to a student, not a formal legal document. Use aviation terminology correctly.`
