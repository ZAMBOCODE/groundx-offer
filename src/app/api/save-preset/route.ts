/**
 * Dev-only endpoint to persist the active DevPanel snapshot to disk.
 *
 * Why: the snapshot lives in localStorage (per-browser) and the PDF
 * exporter runs in a fresh Playwright session that starts empty. Saving
 * the snapshot to a JSON file lets both fresh page visits AND the PDF
 * script pick up Samy's tuned look without re-tweaking.
 *
 * Guard: writes only when NODE_ENV === "development". In production
 * (Vercel) we return 403 — the filesystem is read-only anyway and we
 * don't want a leaked endpoint to let anyone overwrite per-client
 * presets.
 *
 * Format: { settings, customFonts, variants, copyVariants, meta }
 *   — same shape the DevPanel Export button already produces.
 */
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "dev-only endpoint" }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "expected an object" }, { status: 400 });
  }
  const dataDir = join(process.cwd(), "data");
  const file = join(dataDir, "preset.json");
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(file, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ ok: true, path: "data/preset.json" });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
