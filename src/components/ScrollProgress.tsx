"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/* Bottom scroll-progress bar.
   Samy 2026-05-25: "ganz unten ein Scroll-Indicator, beim Hovern zeigt er
   Striche pro Sektion, Klick springt dorthin."
   - 3px hairline by default, expands to ~32px on hover so the tick-marks
     above the fill bar reveal cleanly.
   - Reads section anchors live from the DOM so the indicator stays
     correct if sections get reordered or toggled in the DevPanel.
   - data-pdf-hide → hidden in PDF export. */

const SECTION_LABEL: Record<string, string> = {
  hero: "Hero",
  about: "About",
  angle: "Why me",
  capabilities: "What I do",
  work: "Work",
  brand: "Brand",
  offer: "Offer",
  contact: "Contact",
};

type Tick = { id: string; label: string; pct: number };

export function ScrollProgress() {
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [hover, setHover] = useState(false);
  const rafId = useRef<number | null>(null);

  const { scrollYProgress } = useScroll();
  // 2026-05-27: useSpring entfernt — Spring auf scroll-bound values fühlte sich
  // auf Windows als "delay" an. Direct bind = sofortige Reaktion, identische
  // visuelle Wirkung weil die Bar dünn ist.
  const fillPct = useTransform(scrollYProgress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);

  // Recompute tick positions on resize / DOM mutation. Cheap: re-run on
  // window resize + on each scroll-to-end (after layout settles).
  useEffect(() => {
    const measure = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) {
        setTicks([]);
        return;
      }
      const next: Tick[] = [];
      document.querySelectorAll<HTMLElement>("section[id], header[id]").forEach((el) => {
        const id = el.id;
        if (!id) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const pct = Math.min(1, Math.max(0, top / docH));
        next.push({ id, label: SECTION_LABEL[id] ?? id, pct });
      });
      setTicks(next);
    };

    const debounced = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(measure);
    };

    measure();
    const ro = new ResizeObserver(debounced);
    ro.observe(document.body);
    window.addEventListener("resize", debounced);
    // settle pass after fonts / images load
    const t = window.setTimeout(measure, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", debounced);
      window.clearTimeout(t);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      data-pdf-hide
      data-scroll-progress
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fixed bottom-0 left-0 z-40 flex w-full items-end justify-center"
      style={{ pointerEvents: "auto" }}
    >
      {/* hover hit-area + tick lane */}
      <div
        className="relative w-full"
        style={{
          height: hover ? "36px" : "10px",
          transition: "height 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {/* tick rail (above the bar) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-2 flex"
          style={{
            opacity: hover ? 1 : 0,
            transform: hover ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 200ms ease, transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {ticks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => jumpTo(t.id)}
              className="meta group absolute -translate-x-1/2 cursor-pointer text-[0.55rem] tracking-[0.32em]"
              style={{
                left: `${t.pct * 100}%`,
                color: "var(--ink-3)",
                pointerEvents: "auto",
              }}
              title={t.label}
            >
              <span
                className="block h-3 w-px transition-all group-hover:h-5"
                style={{ background: "var(--accent-bright)", margin: "0 auto" }}
              />
              <span className="mt-1 block whitespace-nowrap transition-colors group-hover:text-[var(--accent-bright)]">
                {t.label}
              </span>
            </button>
          ))}
        </div>

        {/* the actual bar — sits flush at the bottom */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: "3px",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <motion.div
            className="h-full origin-left"
            style={{
              width: fillPct,
              background:
                "linear-gradient(90deg, var(--accent-bright), var(--accent))",
              boxShadow: "0 0 14px var(--accent-dim)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
