/**
 * MongoDB Atlas connection utility
 *
 * Database: "portfolio"
 * Collections:
 *   - events        → client-side interaction analytics (page views, clicks, briefer uses, etc.)
 *   - projects      → CMS mirror of static lib/projects.ts (editable without code deploys)
 *   - certifications → CMS mirror of static lib/certifications.ts
 *
 * Connection string: MONGODB_URI env var (MongoDB Atlas M0 free tier)
 * Falls back gracefully when MONGODB_URI is not set — all helpers return null and
 * the app continues using static data / skips analytics writes.
 */

import { MongoClient, Db } from "mongodb";

declare global {
  // Preserve singleton across Next.js hot-reloads in development
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || "";

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise ?? null;
  } else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

/**
 * Returns the "portfolio" Db instance, or null if MONGODB_URI is not configured.
 * Always check for null before using — callers should degrade gracefully.
 */
export async function getMongoDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db("portfolio");
  } catch (err) {
    console.error("[MongoDB] Connection failed:", err);
    return null;
  }
}

export { clientPromise };
