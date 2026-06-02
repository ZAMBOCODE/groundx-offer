/**
 * look.ts — the per-client "visual look" layer for multi-tenant offers.
 *
 * One domain, many clients (/:slug). Samy tunes a deck in the DevPanel, hits
 * "Für diesen Kunden speichern", and the full look is written to the backend
 * (offers.config.look). When the client opens /:slug in a fresh browser, we
 * seed localStorage from that saved look BEFORE the providers mount, so all
 * the existing localStorage-reading logic just works unchanged.
 *
 * We persist the RAW localStorage string per key, so the round-trip is exact
 * regardless of each value's shape (object vs plain string like lang).
 */

const API =
  process.env.NEXT_PUBLIC_AETHER_API || "https://178.104.134.120.sslip.io/api";

/** Every localStorage key that together forms a client's complete look.
 *  Keep in sync with: DevPanel.tsx, design-context.tsx, copyVariants.ts,
 *  language-context.tsx. */
export const LOOK_KEYS = [
  "groundx.devpanel", // accent, radius, fonts, cursorFx, shader, buttonStyle, uiScale, ...
  "groundx.variants", // per-section layout variant index
  "groundx.sectionEnabled", // per-section on/off
  "groundx.sectionHeight", // per-section vh-override
  "groundx.workProjects", // which cases are shown
  "groundx.imageOverrides", // uploaded/replaced images (base64 data-URIs) — "die Bilder die ich eingefügt habe"
  "groundx.heroButtons", // which hero CTA buttons render
  "groundx.heroOverride", // edited hero copy
  "groundx.customFonts", // runtime-added Google fonts
  "groundx.copyVariants", // per-section copy-variant selection
  "groundx.brandPalette", // brand surface-tabs palette (silver/graphite/noir)
  "groundx.brandPaletteWall", // palette-wall choice (gold/silber/noir)
  "groundx.lang", // en / de
] as const;

export type Look = Record<string, string>;

/** Snapshot the current look from localStorage (raw string values). */
export function collectLook(): Look {
  const out: Look = {};
  for (const k of LOOK_KEYS) {
    try {
      const v = localStorage.getItem(k);
      if (v !== null) out[k] = v;
    } catch {}
  }
  return out;
}

/** Write a saved look into localStorage. Per-key, only when the key is absent,
 *  so Samy's in-progress edits (?dev=1) are never clobbered — a fresh visitor
 *  (the client) has none set, so they get the full saved look. */
export function seedLookIfEmpty(look: Look | null | undefined, force = false): void {
  if (!look || typeof look !== "object") return;
  for (const k of LOOK_KEYS) {
    const v = look[k];
    if (typeof v !== "string") continue;
    try {
      // force = client view: always reflect the latest saved look (overwrite),
      // so selections/sections/images are never stale. Dev mode keeps in-progress edits.
      if (force || localStorage.getItem(k) === null) localStorage.setItem(k, v);
    } catch {}
  }
}

/** Fetch an offer by slug/id and seed its saved look into localStorage.
 *  Resolves whether or not a look exists; never throws. */
export async function seedLookFromBackend(offerId: string, force = false): Promise<void> {
  try {
    const r = await fetch(`${API}/offers/${encodeURIComponent(offerId)}`);
    if (!r.ok) return;
    const row = (await r.json()) as { config?: { look?: Look } } | null;
    seedLookIfEmpty(row?.config?.look, force);
  } catch {}
}

/** Save the current look to the backend for this client. */
export async function saveLookToBackend(
  offerId: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch(`${API}/offers/${encodeURIComponent(offerId)}/look`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ look: collectLook() }),
    });
    if (!r.ok) {
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: j.error ?? `HTTP ${r.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
