"use client";

import { useEffect, useRef } from "react";

/* Optional background atmosphere, all gated by classes on <html> set from the
   dev-panel: cursor glow (.fx-cursor), glassmorphism bubbles (.fx-bubbles),
   floating brand mark (.fx-mark). All pointer-events:none, behind content. */

const BUBBLES = [
  { left: "8%", size: 120, dur: 26, delay: 0 },
  { left: "22%", size: 70, dur: 34, delay: 6 },
  { left: "44%", size: 160, dur: 30, delay: 12 },
  { left: "63%", size: 90, dur: 38, delay: 3 },
  { left: "78%", size: 130, dur: 28, delay: 9 },
  { left: "90%", size: 60, dur: 36, delay: 15 },
];

export function Atmosphere() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glow.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="fx-layer fx-bubbles-layer" aria-hidden>
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="fx-layer fx-mark-layer" aria-hidden>
        <span className="bg-mark">GROUND X</span>
      </div>

      <div ref={glow} className="fx-cursor-glow" aria-hidden />
    </>
  );
}
