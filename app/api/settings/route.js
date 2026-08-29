import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const body = await request.json();
  if (typeof body.hitRate !== "string" || !body.hitRate.trim()) {
    return NextResponse.json({ error: "hitRate is required" }, { status: 400 });
  }
  const updated = await updateSettings(body);
  return NextResponse.json(updated);
}
