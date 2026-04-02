import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/editions — list all editions (newest first)
export async function GET() {
  try {
    const rows = await sql`
      SELECT id, name, saved_at, content
      FROM editions
      ORDER BY created_at DESC
    `;
    const editions = rows.map((r) => ({
      id: r.id,
      name: r.name,
      savedAt: r.saved_at,
      content: r.content,
    }));
    return NextResponse.json(editions);
  } catch (e) {
    console.error("GET /api/editions error:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/editions — create or update (upsert) an edition
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, savedAt, content } = body;

    if (!id || !name || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO editions (id, name, saved_at, content)
      VALUES (${id}, ${name}, ${savedAt || new Date().toISOString()}, ${JSON.stringify(content)})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        saved_at = EXCLUDED.saved_at,
        content = EXCLUDED.content
    `;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/editions error:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
