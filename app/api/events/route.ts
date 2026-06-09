/**
 * POST /api/events
 *
 * Receives client-side interaction events and stores them in MongoDB.
 * Body: { type: EventType, sessionId?: string, metadata?: Record<string, unknown> }
 *
 * Returns 200 OK in all non-error cases (including when MongoDB is not configured),
 * so client-side analytics never causes visible failures.
 */

import { NextRequest, NextResponse } from "next/server";
import { logEvent, type EventType } from "@/lib/mongo-analytics";

const VALID_EVENT_TYPES: Set<string> = new Set([
  "page_view",
  "section_view",
  "project_click",
  "briefer_use",
  "chatbot_open",
  "chatbot_message",
  "contact_view",
  "resume_view",
  "cert_view",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.type !== "string") {
      return NextResponse.json({ ok: false, error: "Missing type" }, { status: 400 });
    }

    // Validate event type
    if (!VALID_EVENT_TYPES.has(body.type)) {
      return NextResponse.json({ ok: false, error: "Unknown event type" }, { status: 400 });
    }

    // Sanitize metadata — only plain key/value pairs, max 20 keys
    const metadata: Record<string, unknown> = {};
    if (body.metadata && typeof body.metadata === "object") {
      for (const [k, v] of Object.entries(body.metadata).slice(0, 20)) {
        if (typeof k === "string" && ["string", "number", "boolean"].includes(typeof v)) {
          metadata[k] = v;
        }
      }
    }

    await logEvent({
      type: body.type as EventType,
      sessionId: typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : undefined,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/events] Error:", err);
    // Return 200 so client-side doesn't retry endlessly
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
