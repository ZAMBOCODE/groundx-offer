import { ImageResponse } from "next/og";

/* Link-share preview card (WhatsApp / iMessage / etc). Samy 2026-06-02:
 * the old preview pulled the white ZamboDezigns logo onto WhatsApp's white
 * card → invisible. This renders a proper dark, branded card instead. */

export const alt = "Ground X — Visual & Marketing Partnership";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
            "radial-gradient(1100px 700px at 70% 20%, rgba(249,115,22,0.18), transparent 60%), #060606",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
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
            marginTop: 24,
            fontSize: 150,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          GROUND
          <span style={{ color: "#f97316", marginLeft: 18 }}>X</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 34,
            color: "rgba(255,255,255,0.72)",
            maxWidth: 900,
          }}
        >
          A proposal by ZamboDezigns — brand, AI visuals, web &amp; content as one system.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            height: 6,
            width: 220,
            background: "linear-gradient(90deg, #f97316, transparent)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
