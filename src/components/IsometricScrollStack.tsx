"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/* "How Ground X could feel" — variant: isometric scroll-stack.
   Sticky viewport. Three device mockups arranged in 3D perspective,
   each one rises into focus and slides past as you scroll down.
   The screenshot stack reads like a layered architectural section. */

const SLIDES = [
  { img: "/assets/gx-web-1.png", label: "Website", note: "groundx.ae" },
  { img: "/assets/gx-web-2.png", label: "Configurator", note: "groundx.ae/configure" },
  { img: "/assets/gx-web-3.png", label: "Owner Dashboard", note: "app.groundx.ae" },
];

export function IsometricScrollStack() {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={outer} style={{ height: `${SLIDES.length * 110 + 30}vh` }} className="mt-12">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* depth grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,181,99,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,181,99,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(900px) rotateX(60deg) translateY(20%)",
            transformOrigin: "center",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />

        <div
          className="relative w-full max-w-[1100px]"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "center 35%",
          }}
        >
          {SLIDES.map((s, i) => (
            <Slide key={s.img} slide={s} index={i} total={SLIDES.length} progress={scrollYProgress} />
          ))}
        </div>

        <span className="meta accent absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.4em]">
          SCROLL — ONE BRAND, THREE SURFACES
        </span>
      </div>
    </div>
  );
}

function Slide({
  slide,
  index,
  total,
  progress,
}: {
  slide: (typeof SLIDES)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each slide owns 1/total of the scroll. Outside its window it sits in the
  // stack (tilted, dimmed); inside, it rises to the foreground.
  // All breakpoints stay within [0, 1] — Motion's Web Animations API rejects
  // non-monotonic / out-of-range offsets.
  const start = index / total;
  const peak = (index + 0.5) / total;
  const end = (index + 1) / total;
  const range: [number, number, number] = [start, peak, end];

  const opacity = useTransform(progress, range, [0.4, 1, 0.4]);
  const y = useTransform(progress, range, [120, 0, -120]);
  const rotateX = useTransform(progress, range, [38, 0, -38]);
  const scale = useTransform(progress, range, [0.85, 1, 0.85]);
  const z = useTransform(progress, range, [-220, 0, -220]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[78%] max-w-[860px] -translate-x-1/2 -translate-y-1/2"
      style={{
        opacity,
        y,
        rotateX,
        scale,
        z,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative overflow-hidden rounded-[14px] border border-[var(--stroke-card)] bg-black"
        style={{
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(232,181,99,0.08), 0 10px 40px rgba(232,181,99,0.05)",
        }}
      >
        {/* browser chrome */}
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
            {slide.note}
          </span>
          <span
            className="meta ml-auto text-[0.55rem] tracking-[0.35em]"
            style={{ color: "var(--gx-gold-hi)" }}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {slide.label}
          </span>
        </div>
        <div className="aspect-[16/9.5] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.img} alt={slide.label} className="h-full w-full object-cover object-top" />
        </div>
      </div>
    </motion.div>
  );
}
