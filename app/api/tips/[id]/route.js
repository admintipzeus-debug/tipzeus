import { NextResponse } from "next/server";
import { updateTip, deleteTip } from "../../../../lib/db";

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const body = await request.json();

  const updated = await updateTip(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Tip not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const id = Number(params.id);

  const ok = await deleteTip(id);
  if (!ok) {
    return NextResponse.json({ error: "Tip not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
