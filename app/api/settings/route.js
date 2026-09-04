import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const body = await request.json();

  if (body.hitRate !== undefined && (typeof body.hitRate !== "string" || !body.hitRate.trim())) {
    return NextResponse.json({ error: "hitRate must be a non-empty string" }, { status: 400 });
  }
  if (body.leagues !== undefined && (!Array.isArray(body.leagues) || body.leagues.some((l) => typeof l !== "string"))) {
    return NextResponse.json({ error: "leagues must be an array of strings" }, { status: 400 });
  }

  const updated = await updateSettings(body);
  return NextResponse.json(updated);
}
