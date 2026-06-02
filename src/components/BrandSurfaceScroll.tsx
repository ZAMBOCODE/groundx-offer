"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "motion/react";
import { usePdfMode } from "@/lib/pdfMode";
import { useLang } from "./language-context";

/* "How Ground X could feel" — surfaces, sticky-scroll.
 *
 * Samy 2026-06-02 spec: scroll-driven. First Website + a (bigger) phone next
 * to it; the website screenshot steps through image 1 → 2 → 3 as you scroll.
 * Then it switches to Configurator (near-fullscreen, centered, no phone), then
 * to Dashboard (near-fullscreen, centered). Tabs on top show the active surface.
 *
 * Replaces the old MockupShowcase inside the brand scroll-through (v1). Every
 * image carries a stable data-img-id so the DevPanel ImagePicker can override
 * it; a hidden scan-block exposes every slot regardless of the active phase.
 */

const WEBSITE_IMGS = ["/assets/gx-web-1.png", "/assets/gx-web-2.png", "/assets/gx-web-3.png"];
const MOBILE_IMG = "/assets/gx-web-1.png";
const CONFIG_IMG = "/assets/gx-web-2.png";
const DASHBOARD_IMG = "/assets/gx-web-3.png";

type Phase = "website" | "configurator" | "dashboard";
const PHASES: { key: Phase; en: string; de: string; note: string }[] = [
  { key: "website", en: "Website", de: "Website", note: "groundx.ae" },
  { key: "configurator", en: "Configurator", de: "Konfigurator", note: "groundx.ae/configure" },
  { key: "dashboard", en: "Dashboard", de: "Owner-Dashboard", note: "app.groundx.ae" },
];

export function BrandSurfaceScroll() {
  const pdf = usePdfMode();
  if (pdf) return <SurfaceStatic />;
  return <SurfaceScroll />;
}

function SurfaceScroll() {
  const { lang } = useLang();
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const [phase, setPhase] = useState<Phase>("website");
  const [webIdx, setWebIdx] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (p) => {
      if (p < 0.5) {
        setPhase("website");
        const i = Math.max(0, Math.min(WEBSITE_IMGS.length - 1, Math.floor((p / 0.5) * WEBSITE_IMGS.length)));
        setWebIdx((prev) => (prev === i ? prev : i));
      } else if (p < 0.75) {
        setPhase("configurator");
      } else {
        setPhase("dashboard");
      }
    });
  }, [scrollYProgress]);

  const t = (en: string, de: string) => (lang === "de" ? de : en);

  return (
    <div ref={outer} style={{ height: "360vh" }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* surface tabs on top */}
        <div className="mb-8 flex items-center justify-center gap-1.5">
          {PHASES.map((ph) => {
            const on = ph.key === phase;
            return (
              <span
                key={ph.key}
                className="meta rounded-full px-4 py-2 text-[0.6rem] tracking-[0.22em] transition-colors"
                style={{
                  color: on ? "#0a0a0b" : "var(--ink-3)",
                  background: on ? "var(--accent)" : "transparent",
                  border: `1px solid ${on ? "var(--accent)" : "var(--stroke-card)"}`,
                }}
              >
                {t(ph.en, ph.de).toUpperCase()}
              </span>
            );
          })}
        </div>

        {/* stage */}
        <div className="relative flex w-full items-center justify-center px-4" style={{ perspective: "1700px" }}>
          {phase === "website" ? (
            <div className="grid w-full max-w-[1240px] items-center gap-8 md:grid-cols-[1.6fr_auto]">
              <div style={{ transform: "rotateY(-7deg) rotateZ(1deg)", transformStyle: "preserve-3d" }}>
                <Chrome img={WEBSITE_IMGS[webIdx]!} id={`brand.website.${webIdx}`} note="groundx.ae" label={`Website ${webIdx + 1}`} />
                <div className="mt-4 flex justify-center gap-1.5">
                  {WEBSITE_IMGS.map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: i === webIdx ? 18 : 6, background: i === webIdx ? "var(--accent)" : "var(--stroke-strong)" }}
                    />
                  ))}
                </div>
              </div>
              <Phone img={MOBILE_IMG} id="brand.mobile.0" />
            </div>
          ) : (
            <div
              className="w-[clamp(340px,92%,1240px)]"
              style={{ transform: "rotateY(-6deg) rotateZ(0.8deg)", transformStyle: "preserve-3d" }}
            >
              <Chrome
                img={phase === "configurator" ? CONFIG_IMG : DASHBOARD_IMG}
                id={phase === "configurator" ? "brand.configurator.0" : "brand.dashboard.0"}
                note={phase === "configurator" ? "groundx.ae/configure" : "app.groundx.ae"}
                label={phase === "configurator" ? t("Configurator", "Konfigurator") : t("Dashboard", "Owner-Dashboard")}
                big
              />
            </div>
          )}
        </div>

        <span className="meta accent absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.4em]">
          {t("SCROLL — ONE BRAND, THREE SURFACES", "SCROLL — EINE MARKE, DREI OBERFLÄCHEN")}
        </span>
      </div>

      <ScanBlock />
    </div>
  );
}

/* PDF / print fallback: everything stacked vertically, no scroll transforms. */
function SurfaceStatic() {
  const { lang } = useLang();
  const t = (en: string, de: string) => (lang === "de" ? de : en);
  return (
    <div className="mt-10 flex flex-col gap-14">
      <div className="grid items-center gap-8 md:grid-cols-[1.55fr_auto]">
        <div className="flex flex-col gap-4">
          {WEBSITE_IMGS.map((src, i) => (
            <Chrome key={i} img={src} id={`brand.website.${i}`} note="groundx.ae" label={`Website ${i + 1}`} />
          ))}
        </div>
        <Phone img={MOBILE_IMG} id="brand.mobile.0" />
      </div>
      <Chrome img={CONFIG_IMG} id="brand.configurator.0" note="groundx.ae/configure" label={t("Configurator", "Konfigurator")} big />
      <Chrome img={DASHBOARD_IMG} id="brand.dashboard.0" note="app.groundx.ae" label={t("Dashboard", "Owner-Dashboard")} big />
      <ScanBlock />
    </div>
  );
}

/* Hidden block so the DevPanel ImagePicker always lists every slot. */
function ScanBlock() {
  return (
    <div aria-hidden style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", visibility: "hidden" }}>
      {WEBSITE_IMGS.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={src} data-img-id={`brand.website.${i}`} alt="" />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={MOBILE_IMG} data-img-id="brand.mobile.0" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CONFIG_IMG} data-img-id="brand.configurator.0" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={DASHBOARD_IMG} data-img-id="brand.dashboard.0" alt="" />
    </div>
  );
}

/* Browser chrome (mac dots + url pill). */
function Chrome({ img, id, note, label, big = false }: { img: string; id: string; note: string; label: string; big?: boolean }) {
  return (
    <div
      className="relative overflow-hidden rounded-[13px] border border-[var(--stroke-card)] bg-black"
      style={{ boxShadow: "0 40px 110px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-2 border-b border-[var(--stroke-card)] bg-[#0a0907] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
        </span>
        <span
          className="ml-3 rounded-full px-3 py-0.5 text-[0.6rem]"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}
        >
          {note}
        </span>
      </div>
      {/* object-contain: das ganze Bild/der ganze Screen ist sichtbar, nicht
          angeschnitten (Samy 2026-06-02). bg-black füllt evtl. Letterbox-Ränder. */}
      <div className={`w-full overflow-hidden bg-black ${big ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} data-img-id={id} alt={label} className="h-full w-full object-contain" />
      </div>
    </div>
  );
}

/* Phone mockup — bigger than the old one (Samy 2026-06-02). */
function Phone({ img, id }: { img: string; id: string }) {
  return (
    <div className="mx-auto" style={{ width: "clamp(230px, 22vw, 320px)" }}>
      <div
        className="overflow-hidden rounded-[2.4rem] border-[8px]"
        style={{ borderColor: "#0a0a0b", background: "#000", boxShadow: "0 30px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05)" }}
      >
        <div className="aspect-[9/19] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} data-img-id={id} alt="mobile" className="h-full w-full object-cover object-top" />
        </div>
      </div>
    </div>
  );
}
