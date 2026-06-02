"use client";

import { useHideOnScroll } from "@/lib/useHideOnScroll";

/* Brand lockup, top-left. Samy 2026-06-02: ZAMBODEZIGNS-Wortmarke entfernt
 * (nur noch das kleine Logo bleibt), und der Header scrollt jetzt weg statt
 * den Content zu überdecken. */
export function Header() {
  const hidden = useHideOnScroll();
  return (
    <header
      data-pdf-hide
      className="fixed top-0 left-0 z-40 flex items-center gap-2.5 px-5 py-4"
      style={{
        transform: hidden ? "translateY(-130%)" : "translateY(0)",
        opacity: hidden ? 0 : 1,
        transition: "transform 0.35s ease, opacity 0.35s ease",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/zambo-logo.png" alt="ZamboDezigns" className="h-8 w-8 opacity-90" />
    </header>
  );
}
