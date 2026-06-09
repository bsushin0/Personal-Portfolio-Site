/**
 * GET  /api/cms/certifications  — returns certifications from MongoDB (falls back to static data)
 * POST /api/cms/certifications  — upsert a certification (requires CMS_SECRET header)
 */

import { NextRequest, NextResponse } from "next/server";
import { getCmsCertifications, upsertCertification } from "@/lib/mongo-cms";
import { certifications as staticCerts } from "@/lib/certifications";

export async function GET() {
  const cmsData = await getCmsCertifications();
  const data = cmsData ?? staticCerts;

  return NextResponse.json({ source: cmsData ? "mongodb" : "static", certifications: data });
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cms-secret");
  if (!process.env.CMS_SECRET || secret !== process.env.CMS_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "number") {
    return NextResponse.json({ error: "Invalid certification payload" }, { status: 400 });
  }

  const ok = await upsertCertification(body);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
