/**
 * Read-side for the disk-persisted DevPanel snapshot (see save-preset).
 * Returns { ok: true, preset } if data/preset.json exists, or 204 No
 * Content. The PDF script and a future OfferProvider hook can pull it
 * to seed localStorage before render.
 */
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";

export async function GET() {
  const file = join(process.cwd(), "data", "preset.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    return NextResponse.json({ ok: true, preset: JSON.parse(raw) });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
