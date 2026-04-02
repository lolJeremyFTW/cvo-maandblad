import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// DELETE /api/editions/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM editions WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/editions/[id] error:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
