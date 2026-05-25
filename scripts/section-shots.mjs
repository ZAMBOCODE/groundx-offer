/**
 * Per-section screenshot capture for design-review.
 * Opens localhost:4000, jumps to each section id, takes a 1440x900 shot,
 * writes to /tmp/groundx-sections/. Run: node scripts/section-shots.mjs
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try {
    return require("playwright");
  } catch {
    const root = execSync("npm root -g").toString().trim();
    return require(join(root, "playwright"));
  }
}

const URL = process.argv[2] || "http://localhost:4000";
const OUT = "/tmp/groundx-sections";
mkdirSync(OUT, { recursive: true });

const { chromium } = loadPlaywright();
const VW = 1440;
const VH = 900;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: 1,
});
await page.goto(URL, { waitUntil: "networkidle" });
await page.addStyleTag({
  content:
    '[aria-label="Toggle design panel"], [data-pdf-hide], [data-scroll-progress]{display:none !important;}',
});
await page.waitForTimeout(800);

const SECTIONS = ["hero", "about", "angle", "capabilities", "work", "brand", "offer", "process", "contact"];

for (const id of SECTIONS) {
  await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  }, id);
  await page.waitForTimeout(900);
  const path = join(OUT, `${id}.png`);
  await page.screenshot({ path });
  console.log(`→ ${path}`);
}

await browser.close();
console.log(`\nDone. ${SECTIONS.length} screenshots in ${OUT}`);
