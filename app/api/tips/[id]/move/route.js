import { NextResponse } from "next/server";
import { moveTip } from "../../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const id = Number(params.id);
  const body = await request.json();
  const direction = body.direction === "up" ? "up" : "down";

  const tips = await moveTip(id, direction);
  if (!tips) {
    return NextResponse.json({ error: "Tip not found" }, { status: 404 });
  }
  return NextResponse.json(tips);
}
