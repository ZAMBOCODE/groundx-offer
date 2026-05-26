"use client";

import { TiltCard } from "./TiltCard";
import { useLang } from "./language-context";

/* "How Ground X could feel" — variant: print magazine spread.
   Two-page layout. Left page is the screenshot bleeding to the gutter,
   right page is the editorial: masthead, headline, body, palette band,
   page numbers. Cream-paper background, subtle binding shadow. */

const PALETTE = ["#0a0907", "#1a1714", "#8a5a1c", "#c8862e", "#e8b563"];

export function MagazineSpread() {
  const { lang } = useLang();
  const t = (en: string, de: string) => (lang === "de" ? de : en);
  return (
    <div className="mt-12">
      <TiltCard className="overflow-hidden p-0">
        <div className="grid min-h-[620px] grid-cols-1 md:grid-cols-2">
          {/* LEFT PAGE — screenshot full-bleed */}
          <div className="relative bg-black md:border-r md:border-[var(--stroke-card)]">
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:block"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.8) 100%)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/gx-web-1.png"
              alt="Ground X website spread"
              className="h-full w-full object-cover object-top"
            />
            <span
              className="meta absolute bottom-4 left-5 z-20 text-[0.55rem] tracking-[0.35em]"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {t("FIG. 01 — DIGITAL PRESENCE", "ABB. 01 — DIGITALE PRÄSENZ")}
            </span>
          </div>

          {/* RIGHT PAGE — editorial */}
          <div
            className="relative flex flex-col p-9 sm:p-12"
            style={{
              background:
                "linear-gradient(180deg, #f5ecd9 0%, #ebe0c4 100%)",
              color: "#1a1208",
            }}
          >
            {/* paper grain */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(60,40,10,0.5) 0.6px, transparent 0.6px)",
                backgroundSize: "3px 3px",
              }}
            />

            {/* masthead */}
            <div className="flex items-baseline justify-between border-b border-[rgba(26,18,8,0.25)] pb-3">
              <span
                className="meta text-[0.55rem] tracking-[0.4em]"
                style={{ color: "rgba(26,18,8,0.7)" }}
              >
                {t("GROUND X · ISSUE 01", "GROUND X · AUSGABE 01")}
              </span>
              <span
                className="meta text-[0.55rem] tracking-[0.4em]"
                style={{ color: "rgba(26,18,8,0.7)" }}
              >
                {t("BRAND BOOK", "MARKEN-BUCH")}
              </span>
            </div>

            {/* headline */}
            <h3
              className="display mt-10 text-[2.4rem] leading-[1.02] sm:text-[3rem]"
              style={{
                fontFamily: "var(--highlight-font, inherit)",
                color: "#0a0907",
              }}
            >
              {t("Underground.", "Untertage.")}
              <br />
              <em
                style={{
                  color: "#8a5a1c",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {t("Above standards.", "Über jedem Standard.")}
              </em>
            </h3>

            <p
              className="mt-7 max-w-md text-[0.96rem] leading-relaxed"
              style={{ color: "rgba(26,18,8,0.78)" }}
            >
              {t(
                "A villa lives on top. A sanctuary lives beneath. The brand never shouts. It carries a calm, twilight confidence — cognac leather, brushed gold, dark walnut. Never the word that begins with B.",
                "Oben lebt die Villa. Unten lebt das Refugium. Die Marke schreit nie. Sie trägt eine ruhige, dämmrige Souveränität — Cognac-Leder, Brushed Gold, dunkler Walnuss. Nie das Wort, das mit B beginnt.",
              )}
            </p>

            {/* palette strip */}
            <div className="mt-10">
              <span
                className="meta text-[0.55rem] tracking-[0.4em]"
                style={{ color: "rgba(26,18,8,0.55)" }}
              >
                {t("PALETTE", "PALETTE")}
              </span>
              <div className="mt-3 flex h-9 w-full overflow-hidden rounded-[2px] border border-[rgba(26,18,8,0.2)]">
                {PALETTE.map((c) => (
                  <div key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <div className="mt-2 flex justify-between">
                {PALETTE.map((c) => (
                  <span
                    key={c}
                    className="meta text-[0.5rem]"
                    style={{ color: "rgba(26,18,8,0.55)" }}
                  >
                    {c.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* page footer */}
            <div className="mt-auto flex items-end justify-between pt-10">
              <span
                className="meta text-[0.55rem] tracking-[0.4em]"
                style={{ color: "rgba(26,18,8,0.55)" }}
              >
                {t("— DISCREET · MODULAR · UNCOMPROMISING", "— DISKRET · MODULAR · KOMPROMISSLOS")}
              </span>
              <span
                className="display text-[1.6rem] leading-none"
                style={{ color: "#8a5a1c" }}
              >
                003
              </span>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
