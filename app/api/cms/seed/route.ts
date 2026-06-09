/**
 * POST /api/cms/seed
 *
 * One-time operation: populates MongoDB "projects" and "certifications" collections
 * from the static TypeScript data files. Run this once after connecting your Atlas cluster.
 *
 * Requires:  x-cms-secret: <CMS_SECRET env var>
 * Safe to re-run — uses upsert so existing documents are updated, not duplicated.
 */

import { NextRequest, NextResponse } from "next/server";
import { upsertProject, upsertCertification } from "@/lib/mongo-cms";
import { projects } from "@/lib/projects";
import { certifications } from "@/lib/certifications";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cms-secret");
  if (!process.env.CMS_SECRET || secret !== process.env.CMS_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    projects: { seeded: 0, failed: 0 },
    certifications: { seeded: 0, failed: 0 },
  };

  for (const project of projects) {
    const ok = await upsertProject(project);
    if (ok) results.projects.seeded++;
    else results.projects.failed++;
  }

  for (const cert of certifications) {
    const ok = await upsertCertification(cert);
    if (ok) results.certifications.seeded++;
    else results.certifications.failed++;
  }

  return NextResponse.json({
    message: "Seed complete",
    results,
  });
}
