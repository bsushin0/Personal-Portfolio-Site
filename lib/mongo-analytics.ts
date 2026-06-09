/**
 * MongoDB analytics helpers — server-side
 *
 * Stores fine-grained interaction events that Neon's visit_logs doesn't capture.
 * Neon captures page-level visits (IP, geo, UA); MongoDB captures in-session interactions.
 *
 * Collection: "events" in the "portfolio" database
 */

import { getMongoDb } from "./mongodb";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | "page_view"
  | "section_view"
  | "project_click"
  | "briefer_use"
  | "chatbot_open"
  | "chatbot_message"
  | "contact_view"
  | "resume_view"
  | "cert_view";

export interface PortfolioEvent {
  type: EventType;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Insert a single analytics event.
 * Returns the inserted document's _id, or null if MongoDB is not configured.
 */
export async function logEvent(
  event: Omit<PortfolioEvent, "createdAt">
): Promise<string | null> {
  const db = await getMongoDb();
  if (!db) return null;

  try {
    const result = await db.collection<PortfolioEvent>("events").insertOne({
      ...event,
      createdAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (err) {
    console.error("[MongoDB] logEvent failed:", err);
    return null;
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Return per-event-type counts for the past `days` days.
 */
export async function getEventCounts(
  days = 30
): Promise<Array<{ _id: EventType; count: number }> | null> {
  const db = await getMongoDb();
  if (!db) return null;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return db
    .collection("events")
    .aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray() as Promise<Array<{ _id: EventType; count: number }>>;
}

/**
 * Return the most-clicked projects in the past `days` days.
 */
export async function getTopProjects(
  days = 30
): Promise<Array<{ _id: string | number; count: number }> | null> {
  const db = await getMongoDb();
  if (!db) return null;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return db
    .collection<PortfolioEvent>("events")
    .aggregate<{ _id: string | number; count: number }>([
      { $match: { type: "project_click", createdAt: { $gte: since } } },
      { $group: { _id: "$metadata.projectId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray();
}

/**
 * Return the most-briefed airports in the past `days` days.
 */
export async function getTopBrieferAirports(
  days = 30
): Promise<Array<{ _id: string; count: number }> | null> {
  const db = await getMongoDb();
  if (!db) return null;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return db
    .collection<PortfolioEvent>("events")
    .aggregate<{ _id: string; count: number }>([
      { $match: { type: "briefer_use", createdAt: { $gte: since } } },
      { $group: { _id: "$metadata.departure", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])
    .toArray();
}
