/**
 * MongoDB CMS helpers — server-side
 *
 * Provides a database-backed layer for portfolio content (projects, certifications)
 * that can be updated without code deploys. Falls back to static data when MongoDB
 * is not configured or the collection is empty.
 *
 * Collections in the "portfolio" database:
 *   - projects       → mirrors lib/projects.ts Project type
 *   - certifications → mirrors lib/certifications.ts Certification type
 *
 * Seeding: POST /api/cms/seed  (one-time setup, populates from static data)
 * Reading: GET  /api/cms/projects | /api/cms/certifications
 */

import { getMongoDb } from "./mongodb";
import type { Project } from "./projects";
import type { Certification } from "./certifications";

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Fetch all projects from MongoDB.
 * Returns null if MongoDB is not configured or the collection is empty,
 * signalling to the caller to fall back to static data.
 */
export async function getCmsProjects(): Promise<Project[] | null> {
  const db = await getMongoDb();
  if (!db) return null;

  try {
    const docs = await db
      .collection("projects")
      .find({})
      .sort({ id: 1 })
      .toArray();

    if (docs.length === 0) return null;

    // Strip MongoDB _id before returning
    return docs.map(({ _id, updatedAt, ...rest }) => rest as Project);
  } catch (err) {
    console.error("[MongoDB CMS] getCmsProjects failed:", err);
    return null;
  }
}

/**
 * Upsert a single project by its numeric id.
 */
export async function upsertProject(project: Project): Promise<boolean> {
  const db = await getMongoDb();
  if (!db) return false;

  try {
    await db.collection("projects").updateOne(
      { id: project.id },
      { $set: { ...project, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error("[MongoDB CMS] upsertProject failed:", err);
    return false;
  }
}

// ─── Certifications ───────────────────────────────────────────────────────────

/**
 * Fetch all certifications from MongoDB.
 * Returns null if not configured or collection is empty → caller uses static data.
 */
export async function getCmsCertifications(): Promise<Certification[] | null> {
  const db = await getMongoDb();
  if (!db) return null;

  try {
    const docs = await db
      .collection("certifications")
      .find({})
      .sort({ id: 1 })
      .toArray();

    if (docs.length === 0) return null;

    return docs.map(({ _id, updatedAt, ...rest }) => rest as Certification);
  } catch (err) {
    console.error("[MongoDB CMS] getCmsCertifications failed:", err);
    return null;
  }
}

/**
 * Upsert a single certification by its numeric id.
 */
export async function upsertCertification(cert: Certification): Promise<boolean> {
  const db = await getMongoDb();
  if (!db) return false;

  try {
    await db.collection("certifications").updateOne(
      { id: cert.id },
      { $set: { ...cert, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error("[MongoDB CMS] upsertCertification failed:", err);
    return false;
  }
}
