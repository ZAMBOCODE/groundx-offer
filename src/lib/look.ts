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

/** Seed the look for an offer into localStorage.
 *  Two sources, in order:
 *    1. A same-origin baked snapshot at /looks/<slug>.json. Always reachable
 *       (served from this deployment's own CDN), so the saved look renders
 *       even when the VPS API is unreachable (e.g. networks that block the
 *       sslip.io host). This is what makes a Vercel mirror look identical.
 *    2. The live VPS API, best-effort, so any newer DevPanel edits still win
 *       when the host is reachable.
 *  Resolves whether or not a look exists; never throws. */
export async function seedLookFromBackend(offerId: string, force = false): Promise<void> {
  // 1. baked same-origin snapshot — the ONLY thing the first paint waits on.
  //    It is tiny (a few KB; images live as normal lazy <img> files), so this
  //    resolves fast even on mobile.
  let snapshotHasImages = false;
  try {
    const r = await fetch(`/looks/${encodeURIComponent(offerId)}.json`);
    if (r.ok) {
      const snap = (await r.json()) as Look;
      seedLookIfEmpty(snap, force);
      snapshotHasImages = typeof snap["groundx.imageOverrides"] === "string";
    }
  } catch {}

  // 2. live VPS overlay — fire-and-forget, NOT awaited. On networks that block
  //    the sslip.io host this request can hang for many seconds; we must never
  //    let it delay the first paint. It only matters for picking up newer
  //    DevPanel edits, which can apply a beat late.
  //
  //    When the baked snapshot already carries image overrides, we keep THOSE
  //    (lightweight file paths served from this deploy's CDN) and let the VPS
  //    update only the other look keys. Otherwise the VPS would clobber them
  //    with the original multi-MB base64 data-URIs and re-download them in the
  //    background on every visit.
  void fetch(`${API}/offers/${encodeURIComponent(offerId)}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((row: { config?: { look?: Look } } | null) => {
      const look = row?.config?.look;
      if (!look) return;
      if (snapshotHasImages) {
        const { "groundx.imageOverrides": _drop, ...rest } = look;
        seedLookIfEmpty(rest, force);
      } else {
        seedLookIfEmpty(look, force);
      }
    })
    .catch(() => {});
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
