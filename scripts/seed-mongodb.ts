/**
 * Standalone MongoDB seed script
 * Run: pnpm tsx scripts/seed-mongodb.ts
 *
 * Populates the "portfolio" database with projects + certifications from static data.
 * Safe to re-run — uses upsert (no duplicates).
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local before anything else
config({ path: resolve(process.cwd(), ".env.local") });

import { MongoClient } from "mongodb";
import { projects } from "../lib/projects";
import { certifications } from "../lib/certifications";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌  MONGODB_URI not set in .env.local");
    process.exit(1);
  }

  console.log("🔌  Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("portfolio");

  // ── Projects ────────────────────────────────────────────────────────────
  console.log(`\n📦  Seeding ${projects.length} projects...`);
  for (const project of projects) {
    await db.collection("projects").updateOne(
      { id: project.id },
      { $set: { ...project, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log(`   ✓ ${project.title}`);
  }

  // ── Certifications ──────────────────────────────────────────────────────
  console.log(`\n🏅  Seeding ${certifications.length} certifications...`);
  for (const cert of certifications) {
    await db.collection("certifications").updateOne(
      { id: cert.id },
      { $set: { ...cert, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log(`   ✓ ${cert.title}`);
  }

  await client.close();
  console.log("\n✅  Seed complete — MongoDB CMS is live.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
