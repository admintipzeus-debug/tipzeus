import { NextResponse } from "next/server";
import { listTips, createTip } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const tips = await listTips();
  return NextResponse.json(tips);
}

export async function POST(request) {
  const body = await request.json();

  if (!body.home?.trim() || !body.away?.trim() || !body.pick?.trim() || !body.odds?.trim()) {
    return NextResponse.json({ error: "home, away, pick, and odds are required" }, { status: 400 });
  }

  const newTip = await createTip(body);
  return NextResponse.json(newTip, { status: 201 });
}
