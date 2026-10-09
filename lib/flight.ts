// v4 "Flight Deck" — the page is a flight plan. Scrolling climbs through
// waypoints; each section is one fix on the route.

export type Waypoint = {
  id: string // DOM id of the section (kept stable for anchors + AiRa tooltips)
  ident: string // 5-letter fix name shown in the header
  name: string
  altitude: number // feet, shown when the fix is active
  freq: string
}

export const CALLSIGN = "N-BANDHA"

export const waypoints: Waypoint[] = [
  { id: "top", ident: "KLAF", name: "Departure", altitude: 606, freq: "120.70" },
  { id: "about", ident: "CREWS", name: "Crew Briefing", altitude: 3500, freq: "121.80" },
  { id: "experience", ident: "LOGBK", name: "Logbook", altitude: 5500, freq: "124.35" },
  { id: "projects", ident: "GATES", name: "Departures", altitude: 7500, freq: "126.10" },
  { id: "education", ident: "GRNDS", name: "Ground School", altitude: 9500, freq: "127.25" },
  { id: "skills", ident: "RADAR", name: "Radar", altitude: 11500, freq: "128.60" },
  { id: "certifications", ident: "PATCH", name: "Patches & Stamps", altitude: 13500, freq: "132.45" },
  { id: "contact", ident: "CENTR", name: "Center", altitude: 18000, freq: "134.87" },
]

export const RESUME_URL = "/sushin-bandha-resume.pdf"
export const GITHUB_URL = "https://github.com/bsushin0"
export const LINKEDIN_URL = "https://linkedin.com/in/sushin-bandha"

export function formatAltitude(ft: number) {
  return ft >= 18000 ? `FL${Math.round(ft / 100)}` : `${ft.toLocaleString("en-US")} FT`
}

// Squawk codes the transponder reacts to. Anything else is just "set".
export const SQUAWKS: Record<string, { label: string; message: string; target?: string }> = {
  "1200": { label: "VFR", message: "Squawking VFR. Enjoy the flight." },
  "7700": {
    label: "EMERG",
    message: "Squawk 7700 — good news, there's an NREMT-certified EMT on board.",
    target: "experience",
  },
  "7600": {
    label: "NORDO",
    message: "Squawk 7600 — lost comms? The radio in Center still works.",
    target: "contact",
  },
  "2027": { label: "GRAD", message: "Squawk 2027 — expected B.S. AI, Purdue, May 2027.", target: "education" },
}
