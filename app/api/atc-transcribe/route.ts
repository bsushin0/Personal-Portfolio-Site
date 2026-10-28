import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextRequest, NextResponse } from "next/server"

// Speech-to-text for the Flight Deck radio. The browser cuts each live ATC transmission into a
// short 8 kHz mono WAV clip and posts it here; Gemini returns the words. Nothing is stored.

export const runtime = "nodejs"
export const maxDuration = 20

const MAX_BYTES = 320_000 // ~20 s of 8 kHz 16-bit mono
const MIN_BYTES = 6_000 // ~0.35 s
const PER_HOUR = parseInt(process.env.ATC_TRANSCRIBE_LIMIT || "150", 10)
const hits = new Map<string, { n: number; reset: number }>()

function allowed(key: string) {
  const now = Date.now()
  const h = hits.get(key)
  if (!h || now > h.reset) {
    hits.set(key, { n: 1, reset: now + 3_600_000 })
    if (hits.size > 5000) for (const [k, v] of hits) if (now > v.reset) hits.delete(k)
    return true
  }
  if (h.n >= PER_HOUR) return false
  h.n++
  return true
}

const prompt = (station: string) =>
  `This is one short clip of live air traffic control radio${station ? ` from ${station}` : ""} (US, VHF, narrowband audio). ` +
  `Transcribe exactly what is said, using normal ATC phraseology: callsigns as spoken (e.g. "Delta 1234", "Cessna 42R"), ` +
  `runways, headings, altitudes and frequencies as numerals. One line, no quotes, no speaker labels, no commentary. ` +
  `If a word is unclear, write your best guess. If there is no intelligible speech (static, silence, tones, carrier only), reply with exactly: NONE`

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 })
  }
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown"
  if (!allowed(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 })

  if (!(req.headers.get("content-type") || "").startsWith("audio/wav")) {
    return NextResponse.json({ error: "expected audio/wav" }, { status: 415 })
  }
  const declared = Number(req.headers.get("content-length") || 0)
  if (declared > MAX_BYTES) return NextResponse.json({ error: "too large" }, { status: 413 })

  const audio = new Uint8Array(await req.arrayBuffer())
  if (audio.byteLength > MAX_BYTES) return NextResponse.json({ error: "too large" }, { status: 413 })
  const tag = (o: number) => String.fromCharCode(audio[o], audio[o + 1], audio[o + 2], audio[o + 3])
  if (audio.byteLength < MIN_BYTES || tag(0) !== "RIFF" || tag(8) !== "WAVE") {
    return NextResponse.json({ error: "bad audio" }, { status: 400 })
  }

  const station = (req.nextUrl.searchParams.get("station") || "").replace(/[^\w .'/-]/g, "").slice(0, 40)

  try {
    const { text } = await generateText({
      model: google(process.env.ATC_TRANSCRIBE_MODEL || process.env.GEMINI_MODEL || "gemini-3.1-flash-lite"),
      temperature: 0,
      maxOutputTokens: 160,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt(station) },
            { type: "file", data: audio, mediaType: "audio/wav" },
          ],
        },
      ],
    })
    let out = text.replace(/\s+/g, " ").replace(/^["'“]|["'”]$/g, "").trim()
    if (/^(none|\[?no (intelligible )?speech\]?\.?)$/i.test(out)) out = ""
    return NextResponse.json({ text: out.slice(0, 400) }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("atc-transcribe failed:", error)
    return NextResponse.json({ error: "transcription failed" }, { status: 502 })
  }
}
