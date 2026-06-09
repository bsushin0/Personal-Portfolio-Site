/**
 * GET  /api/cms/projects  — returns projects from MongoDB (falls back to static data)
 * POST /api/cms/projects  — upsert a project (requires CMS_SECRET header)
 */

import { NextRequest, NextResponse } from "next/server";
import { getCmsProjects, upsertProject } from "@/lib/mongo-cms";
import { projects as staticProjects } from "@/lib/projects";

export async function GET() {
  const cmsData = await getCmsProjects();
  const data = cmsData ?? staticProjects;

  return NextResponse.json({ source: cmsData ? "mongodb" : "static", projects: data });
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cms-secret");
  if (!process.env.CMS_SECRET || secret !== process.env.CMS_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "number") {
    return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
  }

  const ok = await upsertProject(body);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
