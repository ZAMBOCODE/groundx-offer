"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./language-context";

/* "How Ground X could feel" — variant: surface tabs + tilted stack.
 *
 * Samy 2026-06-02 spec:
 *  - Tabs ON TOP (Website / Configurator / Dashboard), not inside the browser
 *    chrome. Clickable + cyclable. "Website" is the default.
 *  - Website tab = a 3D-tilted, staggered stack of 4 images that AUTO-CYCLES
 *    (even without scroll) and reacts to hover. Enough spacing in the tilted
 *    space that each image stays readable. A (slightly bigger) phone sits next
 *    to it for the mobile version.
 *  - Configurator + Dashboard = a single tilted browser mockup each (different
 *    images from Website).
 *  - Palette: gray / silver / black instead of gold — switchable on top
 *    (3 options), persisted under groundx.brandPalette (part of the saved look).
 *
 * Every image carries a stable data-img-id so the DevPanel ImagePicker can
 * override it per slot. A hidden scan-block renders every slot so the picker
 * always sees them regardless of the active tab.
 */

type PaletteKey = "silver" | "graphite" | "noir";
type Palette = {
  key: PaletteKey;
  label: string;
  accent: string;
  accentHi: string;
  frame: string;
  glow: string;
  grid: string;
  chrome: string;
};

const PALETTES: Record<PaletteKey, Palette> = {
  silver: {
    key: "silver",
    label: "Silver",
    accent: "#c9ced6",
    accentHi: "#eef1f5",
    frame: "rgba(201,206,214,0.20)",
    glow: "rgba(201,206,214,0.10)",
    grid: "rgba(201,206,214,0.05)",
    chrome: "#0c0d0f",
  },
  graphite: {
    key: "graphite",
    label: "Graphite",
    accent: "#8b9099",
    accentHi: "#c4c9d1",
    frame: "rgba(139,144,153,0.18)",
    glow: "rgba(139,144,153,0.08)",
    grid: "rgba(139,144,153,0.05)",
    chrome: "#0a0a0b",
  },
  noir: {
    key: "noir",
    label: "Noir",
    accent: "#e9e9ee",
    accentHi: "#ffffff",
    frame: "rgba(255,255,255,0.16)",
    glow: "rgba(255,255,255,0.06)",
    grid: "rgba(255,255,255,0.04)",
    chrome: "#050506",
  },
};
const PALETTE_ORDER: PaletteKey[] = ["silver", "graphite", "noir"];
const PALETTE_STORAGE = "groundx.brandPalette";

type TabKey = "website" | "configurator" | "dashboard";
const TABS: { key: TabKey; note: string; en: string; de: string }[] = [
  { key: "website", note: "groundx.ae", en: "Website", de: "Website" },
  { key: "configurator", note: "groundx.ae/configure", en: "Configurator", de: "Konfigurator" },
  { key: "dashboard", note: "app.groundx.ae", en: "Dashboard", de: "Owner-Dashboard" },
];

// 4 default images for the Website stack; single defaults for the others.
const WEBSITE_DEFAULTS = ["/assets/gx-web-1.png", "/assets/gx-web-2.png", "/assets/gx-web-3.png", "/assets/gx-web-1.png"];
const CONFIGURATOR_DEFAULT = "/assets/gx-web-2.png";
const DASHBOARD_DEFAULT = "/assets/gx-web-3.png";
const MOBILE_DEFAULT = "/assets/gx-web-1.png";

export function BrandSurfaceTabs() {
  const { lang } = useLang();
  const [tab, setTab] = useState<TabKey>("website");
  const [palette, setPalette] = useState<PaletteKey>("silver");

  // restore saved palette
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PALETTE_STORAGE);
      if (saved && saved in PALETTES) setPalette(saved as PaletteKey);
    } catch {}
  }, []);
  const setPalettePersist = (k: PaletteKey) => {
    setPalette(k);
    try {
      localStorage.setItem(PALETTE_STORAGE, k);
    } catch {}
  };
  const cyclePalette = () => {
    const i = PALETTE_ORDER.indexOf(palette);
    setPalettePersist(PALETTE_ORDER[(i + 1) % PALETTE_ORDER.length]!);
  };

  const p = PALETTES[palette];
  const t = (en: string, de: string) => (lang === "de" ? de : en);

  return (
    <div
      className="mt-10"
      style={
        {
          // expose palette as local vars so children stay declarative
          "--bs-accent": p.accent,
          "--bs-accent-hi": p.accentHi,
          "--bs-frame": p.frame,
        } as React.CSSProperties
      }
    >
      {/* ---- top bar: surface tabs (left) + palette switch (right) ---- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: p.frame }}>
        <div className="flex items-center gap-1">
          {TABS.map((tb) => {
            const on = tb.key === tab;
            return (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className="meta rounded-full px-4 py-2 text-[0.62rem] tracking-[0.22em] transition-colors"
                style={{
                  color: on ? "#0a0a0b" : p.accent,
                  background: on ? p.accent : "transparent",
                  border: `1px solid ${on ? p.accent : p.frame}`,
                }}
              >
                {t(tb.en, tb.de).toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* palette switch — 3 swatches + cycle */}
        <div className="flex items-center gap-2">
          <span className="meta text-faint text-[0.55rem] tracking-[0.3em]">{t("PALETTE", "PALETTE")}</span>
          {PALETTE_ORDER.map((k) => {
            const pl = PALETTES[k];
            const on = k === palette;
            return (
              <button
                key={k}
                onClick={() => setPalettePersist(k)}
                title={pl.label}
                aria-label={pl.label}
                className="h-5 w-5 rounded-full transition-transform"
                style={{
                  background: pl.accent,
                  border: `2px solid ${on ? pl.accentHi : "transparent"}`,
                  transform: on ? "scale(1.15)" : "scale(1)",
                }}
              />
            );
          })}
          <button
            onClick={cyclePalette}
            className="meta ml-1 rounded-full px-2.5 py-1 text-[0.55rem] tracking-[0.2em]"
            style={{ color: p.accent, border: `1px solid ${p.frame}` }}
          >
            {p.label.toUpperCase()}
          </button>
        </div>
      </div>

      {/* ---- stage ---- */}
      <div className="relative mt-10">
        {tab === "website" ? (
          <WebsiteStage palette={p} />
        ) : (
          <SingleSurface
            palette={p}
            img={tab === "configurator" ? CONFIGURATOR_DEFAULT : DASHBOARD_DEFAULT}
            id={tab === "configurator" ? "brand.configurator.0" : "brand.dashboard.0"}
            note={TABS.find((x) => x.key === tab)!.note}
            label={tab === "configurator" ? t("Configurator", "Konfigurator") : t("Dashboard", "Owner-Dashboard")}
          />
        )}
      </div>

      <p className="meta mt-8 text-center text-[0.6rem] tracking-[0.4em]" style={{ color: p.accent }}>
        {t("ONE BRAND — THREE SURFACES", "EINE MARKE — DREI OBERFLÄCHEN")}
      </p>

      {/* hidden scan-block so the DevPanel ImagePicker always sees every slot */}
      <div aria-hidden style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", visibility: "hidden" }}>
        {WEBSITE_DEFAULTS.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`scan-web-${i}`} src={src} data-img-id={`brand.website.${i}`} alt="" />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MOBILE_DEFAULT} data-img-id="brand.mobile.0" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CONFIGURATOR_DEFAULT} data-img-id="brand.configurator.0" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DASHBOARD_DEFAULT} data-img-id="brand.dashboard.0" alt="" />
      </div>
    </div>
  );
}

/* Website: a tilted, auto-cycling stack of 4 browser mockups + a phone. */
function WebsiteStage({ palette }: { palette: Palette }) {
  const total = WEBSITE_DEFAULTS.length;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  // auto-cycle which image is in front (pauses on hover)
  useEffect(() => {
    if (hovering) return;
    const iv = window.setInterval(() => setActive((a) => (a + 1) % total), 3200);
    return () => window.clearInterval(iv);
  }, [hovering, total]);

  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
      {/* tilted stack */}
      <div
        className="relative"
        style={{ perspective: "1600px", perspectiveOrigin: "center 40%", height: "clamp(320px, 44vh, 480px)" }}
        onMouseLeave={() => setHovering(false)}
      >
        {/* depth grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${palette.grid} 1px, transparent 1px), linear-gradient(90deg, ${palette.grid} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            transform: "perspective(900px) rotateX(60deg) translateY(18%)",
            transformOrigin: "center",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
        {WEBSITE_DEFAULTS.map((src, i) => {
          const rank = (i - active + total) % total; // 0 = front
          const x = rank * 46;
          const y = rank * 30;
          const rotateY = rank * -9;
          const rotateZ = rank * 1.6;
          const scale = 1 - rank * 0.06;
          const opacity = 1 - rank * 0.16;
          return (
            <div
              key={`web-${i}`}
              onMouseEnter={() => {
                setHovering(true);
                setActive(i);
              }}
              className="absolute left-1/2 top-1/2 w-[clamp(280px,62%,640px)] cursor-pointer"
              style={{
                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${-rank * 40}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                opacity,
                zIndex: total - rank,
                transformStyle: "preserve-3d",
                transition: "transform 650ms cubic-bezier(0.2,0.8,0.2,1), opacity 650ms ease",
              }}
            >
              <Chrome img={src} id={`brand.website.${i}`} note="groundx.ae" palette={palette} label={`Website ${i + 1}`} />
            </div>
          );
        })}
        {/* cycle dots */}
        <div className="absolute bottom-2 left-1/2 z-50 flex -translate-x-1/2 gap-1.5">
          {WEBSITE_DEFAULTS.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setActive(i)}
              aria-label={`Image ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === active ? 16 : 6, background: i === active ? palette.accent : palette.frame }}
            />
          ))}
        </div>
      </div>

      {/* phone — the mobile version, a bit bigger */}
      <Phone img={MOBILE_DEFAULT} id="brand.mobile.0" palette={palette} />
    </div>
  );
}

/* Configurator / Dashboard: a single, gently tilted browser mockup. */
function SingleSurface({
  palette,
  img,
  id,
  note,
  label,
}: {
  palette: Palette;
  img: string;
  id: string;
  note: string;
  label: string;
}) {
  return (
    <div className="flex justify-center" style={{ perspective: "1600px" }}>
      <div
        className="w-[clamp(300px,80%,860px)]"
        style={{ transform: "rotateY(-7deg) rotateZ(1.2deg)", transformStyle: "preserve-3d" }}
      >
        <Chrome img={img} id={id} note={note} palette={palette} label={label} />
      </div>
    </div>
  );
}

/* Shared browser chrome (mac dots + url note), palette-themed. */
function Chrome({
  img,
  id,
  note,
  palette,
  label,
}: {
  img: string;
  id: string;
  note: string;
  palette: Palette;
  label: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[12px] border"
      style={{
        borderColor: palette.frame,
        background: palette.chrome,
        boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${palette.frame}, 0 10px 40px ${palette.glow}`,
      }}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: palette.frame, background: "rgba(0,0,0,0.35)" }}>
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
        </span>
        <span
          className="ml-2 rounded-full px-2.5 py-0.5 text-[0.58rem]"
          style={{ background: "rgba(255,255,255,0.05)", color: palette.accent, fontFamily: "var(--font-mono)" }}
        >
          {note}
        </span>
      </div>
      <div className="aspect-[16/10] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} data-img-id={id} alt={label} className="h-full w-full object-cover object-top" />
      </div>
    </div>
  );
}

/* Phone mockup for the mobile version of the website. */
function Phone({ img, id, palette }: { img: string; id: string; palette: Palette }) {
  return (
    <div className="mx-auto shrink-0" style={{ width: "clamp(190px, 18vw, 260px)" }}>
      <div
        className="overflow-hidden rounded-[2.2rem] border-[7px]"
        style={{
          borderColor: "#0a0a0b",
          background: "#000",
          boxShadow: `0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px ${palette.frame}, 0 8px 30px ${palette.glow}`,
        }}
      >
        <div className="aspect-[9/19] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} data-img-id={id} alt="mobile" className="h-full w-full object-cover object-top" />
        </div>
      </div>
    </div>
  );
}
