"use client";

import { useEffect, useState } from "react";

/* Hide a fixed header when scrolling down, reveal it at the top or when
 * scrolling back up (Samy 2026-06-02: header should be immersive, the
 * Book-a-call / EN-DE pills must not cover the content while reading). */
export function useHideOnScroll(threshold = 80): boolean {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = typeof window !== "undefined" ? window.scrollY : 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < threshold) setHidden(false);
      else if (y > last + 6) setHidden(true);
      else if (y < last - 6) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return hidden;
}
