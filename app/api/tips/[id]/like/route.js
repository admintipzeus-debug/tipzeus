import { NextResponse } from "next/server";
import { incrementLikes } from "../../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const id = Number(params.id);
  const body = await request.json();
  const delta = body.liked ? 1 : -1;

  const updated = await incrementLikes(id, delta);
  if (!updated) {
    return NextResponse.json({ error: "Tip not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
