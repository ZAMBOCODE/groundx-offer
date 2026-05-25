"use client";

import { useEffect, useState } from "react";

/* PDF-mode flag. Set by ?pdf=1 query param (the export-pdf.mjs script
   appends it). Sticky-scroll sections check this to render a static
   vertical-stack fallback instead of their scroll-driven layouts —
   Playwright doesn't actually scroll, so animated sections come out
   broken in the PDF otherwise.

   Pattern (avoids hydration mismatch):
   - SSR + first client render: hook returns false → dynamic version
   - After useEffect: reads URL, returns true if ?pdf=1 → static version
   - PDF script waits a beat after networkidle to let the swap settle. */
export function usePdfMode(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("pdf") === "1") setOn(true);
  }, []);
  return on;
}
