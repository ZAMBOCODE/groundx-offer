"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { usePdfMode } from "@/lib/pdfMode";
import { useLang } from "./language-context";

/* "How Ground X could feel" — variant: isometric scroll-stack.
   Three Safari mockups in 3D perspective. Each one rises from below
   into its OWN offset resting position so at the end of scroll all
   three remain visible as a layered triptych (Samy 2026-05-25: "alle
   drei in 3D-mäßig gelayert sichtbar, kein Merge").

   PDF fallback: render the three mockups in a clean vertical stack. */

type Slide = { img: string; label: string; note: string };

/* Base slides — labels are lang-aware at render via useSlides(). The
 * SLIDES const holds the EN baseline (used for type narrowing + length). */
const SLIDES: readonly Slide[] = [
  { img: "/assets/gx-web-1.png", label: "Website", note: "groundx.ae" },
  { img: "/assets/gx-web-2.png", label: "Configurator", note: "groundx.ae/configure" },
  { img: "/assets/gx-web-3.png", label: "Owner Dashboard", note: "app.groundx.ae" },
];

function useSlides(): Slide[] {
  const { lang } = useLang();
  if (lang !== "de") return [...SLIDES];
  return [
    SLIDES[0]!,
    { ...SLIDES[1]!, label: "Konfigurator" },
    { ...SLIDES[2]!, label: "Owner-Dashboard" },
  ];
}

export function IsometricScrollStack() {
  const pdf = usePdfMode();
  if (pdf) return <IsometricStaticStack />;
  return <IsometricScrollStackDynamic />;
}

/* PDF fallback: vertical stack of the three mockups, no scroll-driven
   transforms. Each gets the same Safari chrome treatment as the
   dynamic version. */
function IsometricStaticStack() {
  const slides = useSlides();
  return (
    <div className="mt-12 flex flex-col gap-10">
      {slides.map((s, i) => (
        <MockupCard key={s.img} slide={s} index={i} />
      ))}
    </div>
  );
}

function IsometricScrollStackDynamic() {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const slides = useSlides();

  return (
    <div ref={outer} style={{ height: `${slides.length * 110 + 30}vh` }} className="mt-12">
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
          {slides.map((s, i) => (
            <Slide key={s.img} slide={s} index={i} total={slides.length} progress={scrollYProgress} />
          ))}
        </div>

        <ScrollStackHint />
      </div>
    </div>
  );
}

function ScrollStackHint() {
  const { lang } = useLang();
  return (
    <span className="meta accent absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.4em]">
      {lang === "de" ? "SCROLL — EINE MARKE, DREI OBERFLÄCHEN" : "SCROLL — ONE BRAND, THREE SURFACES"}
    </span>
  );
}

function Slide({
  slide,
  index,
  total,
  progress,
}: {
  slide: Slide;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each card OWN window 1/total of the scroll. Inside its window it
  // rises from below into its resting offset position. After its window
  // it stays put so all three end visible as a 3D triptych (no merge).
  //
  // Resting positions: spread the trio in a curved layered fan —
  // index 0 sits upper-left tilted, index 1 centered foreground,
  // index 2 lower-right tilted. All breakpoints stay within [0, 1].
  const start = index / total;
  const end = (index + 1) / total;

  // Position the resting offset around the center index (1 for 3 slides)
  const center = (total - 1) / 2;
  const restX = (index - center) * 70; // horizontal spread
  const restY = (index - center) * 36; // vertical layering
  const restRotateY = (center - index) * -10; // outward tilt
  const restRotateZ = (index - center) * 1.4;
  const restZ = -Math.abs(index - center) * 40; // back-most edges
  const restScale = 1 - Math.abs(index - center) * 0.04;

  // While inside its window, the card animates into focus (slightly
  // bigger, less tilted, centered) then settles back to its resting
  // offset position at window end.
  const opacity = useTransform(progress, [Math.max(0, start - 0.05), start, end], [0, 1, 1]);
  const x = useTransform(progress, [start, (start + end) / 2, end], [restX, 0, restX]);
  const y = useTransform(progress, [start, (start + end) / 2, end], [120 + restY, 0, restY]);
  const rotateY = useTransform(progress, [start, (start + end) / 2, end], [restRotateY + 6, 0, restRotateY]);
  const rotateZ = useTransform(progress, [start, (start + end) / 2, end], [restRotateZ + 1.8, 0, restRotateZ]);
  const scale = useTransform(progress, [start, (start + end) / 2, end], [0.88, 1.04, restScale]);
  const z = useTransform(progress, [start, (start + end) / 2, end], [restZ - 80, 60, restZ]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[68%] max-w-[760px] -translate-x-1/2 -translate-y-1/2"
      style={{
        opacity,
        x,
        y,
        rotateY,
        rotateZ,
        scale,
        z,
        zIndex: index === Math.round(center) ? 20 : 10 - Math.abs(index - center),
        transformStyle: "preserve-3d",
      }}
    >
      <MockupCardChrome slide={slide} index={index} total={total} />
    </motion.div>
  );
}

/* Mockup card chrome shared between dynamic + static renders */
function MockupCardChrome({
  slide,
  index,
  total,
}: {
  slide: Slide;
  index: number;
  total: number;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[14px] border border-[var(--stroke-card)] bg-black"
      style={{
        boxShadow:
          "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(232,181,99,0.08), 0 10px 40px rgba(232,181,99,0.05)",
      }}
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
  );
}

function MockupCard({ slide, index }: { slide: Slide; index: number }) {
  return (
    <div className="mx-auto w-full max-w-[860px]">
      <MockupCardChrome slide={slide} index={index} total={SLIDES.length} />
    </div>
  );
}
