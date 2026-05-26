"use client";

import { useEffect, useState } from "react";
import { SECTION_LABEL, type SectionKey } from "./design-context";

/* Dev-only HUD: shows the section name top-left for whichever section
   currently dominates the viewport. Toggled via DevPanel ("Dev: section
   name") which flips `html.dev-hud`. Used so Samy can describe which
   section he wants changes in without guessing. */

const SECTION_IDS: SectionKey[] = [
  "hero", "trustedBy", "about", "angle", "capabilities", "work",
  "testimonials", "brand", "offer", "process", "faq", "contact",
];

export function SectionHud() {
  const [active, setActive] = useState<SectionKey | null>(null);
  const [variant, setVariant] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  // mirror html.dev-hud → enabled (so we only observe when needed)
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setEnabled(root.classList.contains("dev-hud"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // pick whichever known-section element is most visible
    const els = SECTION_IDS
      .map((k) => ({ key: k, el: document.getElementById(k) }))
      .filter((x): x is { key: SectionKey; el: HTMLElement } => !!x.el);
    if (els.length === 0) return;

    const ratios = new Map<SectionKey, number>();
    const pickActive = () => {
      let best: SectionKey | null = null;
      let bestR = 0;
      for (const [k, r] of ratios.entries()) {
        if (r > bestR) {
          bestR = r;
          best = k;
        }
      }
      if (best && best !== active) setActive(best);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const k = (e.target as HTMLElement).id as SectionKey;
          ratios.set(k, e.intersectionRatio);
        }
        pickActive();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const { el } of els) io.observe(el);
    return () => io.disconnect();
  }, [enabled, active]);

  // poll the persisted variant index for the active section (DevPanel
  // writes to localStorage on every change; that's the source of truth)
  useEffect(() => {
    if (!enabled || !active) return;
    const read = () => {
      try {
        const raw = localStorage.getItem("groundx.variants");
        if (!raw) return setVariant(null);
        const parsed = JSON.parse(raw) as Record<string, number>;
        setVariant(typeof parsed[active] === "number" ? parsed[active] : null);
      } catch {
        setVariant(null);
      }
    };
    read();
    const t = setInterval(read, 600);
    const onStorage = () => read();
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(t);
      window.removeEventListener("storage", onStorage);
    };
  }, [enabled, active]);

  if (!enabled || !active) return null;

  return (
    <div
      className="fixed left-4 top-4 z-[60] flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        background: "rgba(12,11,9,0.78)",
        border: "1px solid var(--accent-dim)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      aria-hidden
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }}
      />
      <span
        className="meta tracking-[0.25em]"
        style={{ color: "var(--accent-bright)", fontSize: "0.6rem" }}
      >
        SECTION
      </span>
      <span
        className="display"
        style={{ fontSize: "0.85rem", color: "var(--ink)" }}
      >
        {SECTION_LABEL[active]}
      </span>
      {variant !== null && (
        <span
          className="meta text-faint"
          style={{ fontSize: "0.55rem" }}
          title="active variant index (1-based)"
        >
          · v{variant + 1}
        </span>
      )}
    </div>
  );
}
