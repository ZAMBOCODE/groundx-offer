/**
 * Static 1:1 PDF export of the running deck — seed for the Techne PDF exporter.
 *
 * Why screenshots + Pillow instead of page.pdf(): the deck uses framer-motion
 * whileInView reveals that never trigger in a headless print render, so page.pdf
 * produces blank sections. Scrolling the viewport reliably triggers them, so we
 * capture one screenshot per viewport and stitch them into a multi-page PDF.
 *
 * Requirements: a running dev/preview server, Playwright (local or global) with
 * the Chrome channel, and Python 3 with Pillow for the stitch step.
 *
 * Usage:  node scripts/export-pdf.mjs [url] [outfile]
 *   defaults: http://localhost:3939  ->  groundx-offer.pdf
 */
import { createRequire } from "node:module";
import { execSync, spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL = process.argv[2] || "http://localhost:3939";
const OFFER = process.argv[4] || "";
// Append ?pdf=1 so usePdfMode() picks it up — sticky-scroll sections
// (Capabilities sticky-stack, BrandScrollThrough, …) swap to a vertical
// static fallback that renders correctly without scroll-driven motion.
function withFlags(u) {
  const sep = u.includes("?") ? "&" : "?";
  let next = `${u}${sep}pdf=1`;
  if (OFFER) next += `&offer=${encodeURIComponent(OFFER)}`;
  return next;
}
const TARGET = withFlags(URL);
const OUT = process.argv[3] || (OFFER ? `offer-${OFFER}.pdf` : "groundx-offer.pdf");

// resolve playwright locally, else from the global npm root
function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try {
    return require("playwright");
  } catch {
    const root = execSync("npm root -g").toString().trim();
    return require(join(root, "playwright"));
  }
}

const { chromium } = loadPlaywright();
const VW = 1440;
const VH = 900;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: 2,
});
await page.goto(TARGET, { waitUntil: "networkidle" });
// neutral defaults for the static export, hide the dev-panel FAB
await page.evaluate(() => {
  localStorage.removeItem("groundx.variants");
  localStorage.removeItem("groundx.devpanel");
});
await page.reload({ waitUntil: "networkidle" });
// give usePdfMode()'s useEffect time to flip dynamic→static fallbacks
// (BrandScrollThrough, CapabilitiesStickyStack, …). The swap renders
// after first paint; without this wait the screenshot can land on the
// dynamic layout still showing only phase 1.
await page.waitForTimeout(900);
await page.addStyleTag({
  // hide the dev-panel FAB + everything explicitly marked as interactive-only
  // (Calendly pill, WhatsApp float, …). Samy 2026-05-24: "pdf-version braucht
  // eine alternative" — handled via data-pdf-hide.
  content: '[aria-label="Toggle design panel"], [data-pdf-hide]{display:none !important;}',
});

const dir = mkdtempSync(join(tmpdir(), "deckpdf-"));
const total = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += VH) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(750); // let whileInView reveals settle
  await page.screenshot({ path: join(dir, `pg-${String(i).padStart(2, "0")}.png`) });
  i++;
}
await browser.close();

// stitch with Pillow
const py = `
from PIL import Image
import glob, sys
files = sorted(glob.glob(${JSON.stringify(join(dir, "pg-*.png"))}))
imgs = [Image.open(f).convert('RGB') for f in files]
imgs[0].save(${JSON.stringify(OUT)}, save_all=True, append_images=imgs[1:], resolution=150)
print('wrote', ${JSON.stringify(OUT)}, 'pages:', len(imgs))
`;
const r = spawnSync("python3", ["-c", py], { stdio: "inherit" });
process.exit(r.status ?? 0);
