import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* Link-share preview card (WhatsApp / iMessage / etc). Samy 2026-06-02:
 * dark, branded card with the ZamboDezigns logo (the old preview pulled the
 * white logo onto WhatsApp's white card → invisible). */

export const runtime = "nodejs";
export const alt = "Ground X — Visual & Marketing Partnership";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Embed the ZamboDezigns logo as a data-URL (read from /public at runtime).
  let logoSrc: string | null = null;
  try {
    const buf = await readFile(join(process.cwd(), "public", "assets", "zambo-logo.png"));
    logoSrc = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    logoSrc = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "90px",
          background:
            "radial-gradient(1100px 700px at 72% 18%, rgba(249,115,22,0.18), transparent 60%), #060606",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* ZamboDezigns logo lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {logoSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} width={84} height={84} alt="ZamboDezigns" />
          )}
          <span style={{ display: "flex", fontSize: 30, letterSpacing: 10, color: "rgba(255,255,255,0.85)" }}>
            ZAMBODEZIGNS
          </span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 24,
            letterSpacing: 8,
            color: "#fb923c",
            textTransform: "uppercase",
          }}
        >
          Visual &amp; Marketing Partnership
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 16,
            fontSize: 132,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          GROUND
          <span style={{ color: "#f97316", marginLeft: 16 }}>X</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 900,
          }}
        >
          A proposal — brand, AI visuals, web &amp; content as one system.
        </div>
      </div>
    ),
    { ...size },
  );
}
