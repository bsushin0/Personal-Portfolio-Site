import Anthropic from "@anthropic-ai/sdk"
import { fetchMETAR, fetchTAF, fetchSIGMETs, fetchAIRMETs } from "@/lib/aviation-api"
import { buildBriefingPrompt, SYSTEM_PROMPT } from "@/lib/briefing-prompt"
import type { BriefingRequest, WeatherBundle } from "@/types/aviation"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: Request) {
  const body = (await req.json()) as BriefingRequest

  if (!body.departure || !/^[A-Z]{4}$/i.test(body.departure.trim())) {
    return Response.json({ error: "Invalid departure ICAO code" }, { status: 400 })
  }

  const dep = body.departure.trim().toUpperCase()
  const dest = body.destination?.trim().toUpperCase() || undefined

  const [departureMETAR, departureTAF, destinationMETAR, destinationTAF, sigmets, airmets] =
    await Promise.all([
      fetchMETAR(dep),
      fetchTAF(dep),
      dest ? fetchMETAR(dest) : Promise.resolve(null),
      dest ? fetchTAF(dest) : Promise.resolve(null),
      fetchSIGMETs(),
      fetchAIRMETs(),
    ])

  const wx: WeatherBundle = {
    departureMETAR,
    departureTAF,
    destinationMETAR,
    destinationTAF,
    sigmets,
    airmets,
    fetchedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
  }

  const weatherContext = buildBriefingPrompt(body, wx)
  const client = new Anthropic()

  const stream = client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Please provide a complete pre-flight weather briefing for this flight.\n\n${weatherContext}`,
      },
    ],
  })

  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify({ type: "wx_data", data: wx }) + "\n"))
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "text", text: event.delta.text }) + "\n"))
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  })
}
