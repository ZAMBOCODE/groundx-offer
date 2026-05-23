"use client";

import { useEffect, useRef } from "react";

/* Optional background atmosphere + graphics, driven by data-* / classes on
   <html> set from the dev-panel. All pointer-events:none.
   - data-shader: none|aurora|mesh|grain|grid|orbs|beams (background)
   - data-cursor: off|glow|ring|spotlight
   - .fx-bubbles / .fx-mark toggles */

const BUBBLES = [
  { left: "8%", size: 120, dur: 26, delay: 0 },
  { left: "22%", size: 70, dur: 34, delay: 6 },
  { left: "44%", size: 160, dur: 30, delay: 12 },
  { left: "63%", size: 90, dur: 38, delay: 3 },
  { left: "78%", size: 130, dur: 28, delay: 9 },
  { left: "90%", size: 60, dur: 36, delay: 15 },
];

export function Atmosphere() {
  const cursor = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (cursor.current) {
          cursor.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
        if (spot.current) {
          spot.current.style.setProperty("--mx", `${e.clientX}px`);
          spot.current.style.setProperty("--my", `${e.clientY}px`);
        }
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
      {/* shader backgrounds */}
      <div className="shader-layer shader-aurora" aria-hidden />
      <div className="shader-layer shader-mesh" aria-hidden />
      <div className="shader-layer shader-grain" aria-hidden />
      <div className="shader-layer shader-grid" aria-hidden />
      <div className="shader-layer shader-orbs" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="shader-layer shader-beams" aria-hidden />

      {/* bubbles + brand mark */}
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

      {/* cursor effects */}
      <div ref={cursor} className="fx-cursor-wrap" aria-hidden>
        <div className="cur-glow" />
        <div className="cur-ring" />
      </div>
      <div ref={spot} className="fx-spotlight" aria-hidden />
    </>
  );
}
