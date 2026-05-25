"use client";

import { useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useScroll, useTransform, type MotionValue } from "motion/react";
import { Maximize2 } from "lucide-react";
import { cases, type CaseStudy } from "@/lib/data";
import { usePdfMode } from "@/lib/pdfMode";

/* Samy 2026-05-25, Selected Work pick = v5 (this WorkShowcase).
   Changes from prior:
   - First case stays as the prominent ShowcaseRow (logo + facts + 3
     screenshots) but:
       · max 4 tags shown (the 4 most important)
       · favicon-style logo faded into the bottom-right of the shots area
       · hover any screenshot → fullscreen indicator (clickable lightbox)
   - The REMAINING cases no longer stack vertically. They scroll via a
     gumball-wheel sticky scroll (WorkWheel) — three projects visible at
     a time on a curved arc, sides fade into the background. */

export function WorkShowcase() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const first = cases[0];
  const rest = cases.slice(1);
  return (
    <>
      <div className="mt-14">
        {first && <ShowcaseRow c={first} flip={false} onOpen={setLightbox} />}
      </div>
      {rest.length > 0 && <WorkWheel cases={rest} onOpen={setLightbox} />}
      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </>
  );
}

/* ----------------------------------------------- Prominent showcase row */

function ShowcaseRow({
  c,
  flip,
  onOpen,
}: {
  c: CaseStudy;
  flip: boolean;
  onOpen: (src: string) => void;
}) {
  const shots = c.shots ?? (c.image ? [c.image] : []);
  // Samy 2026-05-25: "es sollten immer nur vier Tags da dranstehen"
  const tags = c.tags?.slice(0, 4);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={`grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] ${flip ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      {/* left — identity */}
      <div>
        {c.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.logo} alt={c.name} className="mb-5 h-9 w-auto opacity-95" />
        ) : (
          <div className="display mb-4 text-[1.8rem]">{c.name}</div>
        )}
        <p className="meta accent text-[0.6rem]">{c.tag}</p>
        <p className="text-dim mt-4 text-[1rem] leading-relaxed">{c.what}</p>
        <p className="accent mt-3 text-[0.9rem] italic">{c.why}</p>
        {tags && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="inner-card px-3 py-1.5 text-[0.78rem] text-dim">
                {t}
              </span>
            ))}
          </div>
        )}
        <p className="meta text-faint mt-5 text-[0.58rem]">{c.stack}</p>
      </div>

      {/* right — staggered tilted screenshot cards (+ favicon corner + hover indicator) */}
      <div className="relative h-[320px] overflow-hidden sm:h-[440px] sm:overflow-visible">
        {shots.map((src, i) => {
          const rot = (i - (shots.length - 1) / 2) * 6;
          const left = shots.length > 1 ? (i / (shots.length - 1)) * 34 : 8;
          const top = i % 2 === 0 ? 0 : 30;
          return (
            <button
              key={src}
              onClick={() => onOpen(src)}
              className="shot-card group absolute overflow-hidden"
              style={
                {
                  "--r": `${rot}deg`,
                  left: `${left}%`,
                  top: `${top}px`,
                  width: "72%",
                  aspectRatio: "16 / 10",
                  zIndex: i + 1,
                } as CSSProperties
              }
              aria-label={`${c.name} screenshot ${i + 1} — click for fullscreen`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${c.name} ${i + 1}`}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {/* hover-only fullscreen indicator (Samy: "Indikator dass man klicken kann") */}
              <span
                className="meta pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-md border border-[var(--stroke-card)] bg-[rgba(8,7,5,0.7)] px-2 py-1 text-[0.55rem] tracking-[0.3em] opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
                style={{ color: "var(--accent-bright)" }}
              >
                <Maximize2 size={9} strokeWidth={2.2} />
                FULLSCREEN
              </span>
            </button>
          );
        })}

        {/* favicon-style logo faded bottom-right of the shots area */}
        {c.logo && (
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-2 right-0 z-10"
            style={{
              opacity: 0.18,
              filter: "blur(0.3px)",
              maskImage: "linear-gradient(135deg, black 30%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(135deg, black 30%, transparent 100%)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.logo} alt="" className="h-32 w-auto sm:h-44" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------- Gumball-wheel scroll */

/* Three slots visible at once. As scroll progresses, the wheel rotates
   so the next case enters from the right and the leftmost exits. Side
   slots are tilted outward + faded; the middle slot is fully opaque.
   Each slot shows the project's logo, tag, three thumbs, and a hover
   line. */
function WorkWheel({ cases: list, onOpen }: { cases: CaseStudy[]; onOpen: (src: string) => void }) {
  const pdf = usePdfMode();
  if (pdf) return <WorkWheelStatic list={list} onOpen={onOpen} />;
  return <WorkWheelDynamic list={list} onOpen={onOpen} />;
}

/* PDF fallback: same per-case WheelCard but rendered in a vertical
   2-col grid instead of a sticky horizontal wheel. */
function WorkWheelStatic({ list, onOpen }: { list: CaseStudy[]; onOpen: (src: string) => void }) {
  return (
    <div className="mt-16">
      <div className="mb-8 text-center">
        <p className="eyebrow">More work</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => {
          const shots = (c.shots ?? (c.image ? [c.image] : [])).slice(0, 3);
          return <WheelCard key={c.name} c={c} shots={shots} onOpen={onOpen} />;
        })}
      </div>
    </div>
  );
}

function WorkWheelDynamic({ list, onOpen }: { list: CaseStudy[]; onOpen: (src: string) => void }) {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });

  // The track holds `list.length` slots, but visually 3 are visible.
  // Index along the wheel = progress * (list.length - 1). Each slot's
  // position on screen is its index minus the current scrolled index.
  return (
    <div
      ref={outer}
      className="relative mt-24"
      style={{ height: `${Math.max(2, list.length - 1) * 90 + 40}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="mb-10 text-center">
          <p className="eyebrow">More work, less wall of text</p>
          <p className="text-dim mt-2 text-[0.92rem]">scroll to spin the wheel · click to enlarge</p>
        </div>

        <div
          className="relative h-[440px] w-full"
          style={{ perspective: "1500px" }}
        >
          {list.map((c, i) => (
            <WheelSlot
              key={c.name}
              c={c}
              index={i}
              total={list.length}
              progress={scrollYProgress}
              onOpen={onOpen}
            />
          ))}
        </div>

        {/* edge gradient masks (sides fade into bg) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[18vw]"
          style={{
            background: "linear-gradient(90deg, var(--bg, #050507) 0%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-30 w-[18vw]"
          style={{
            background: "linear-gradient(270deg, var(--bg, #050507) 0%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}

function WheelSlot({
  c,
  index,
  total,
  progress,
  onOpen,
}: {
  c: CaseStudy;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onOpen: (src: string) => void;
}) {
  // currentIdx in [0, total-1] as scroll moves
  // slot offset = index - currentIdx → negative = left, 0 = center, positive = right
  const SLOT_W = 380; // px between slot centers

  const offsetPx = useTransform(progress, (p) => {
    const denom = Math.max(1, total - 1);
    const current = p * denom;
    return (index - current) * SLOT_W;
  });
  const opacity = useTransform(progress, (p) => {
    const current = p * Math.max(1, total - 1);
    const dist = Math.abs(index - current);
    if (dist > 2) return 0;
    return 1 - Math.min(1, dist * 0.45);
  });
  const scale = useTransform(progress, (p) => {
    const current = p * Math.max(1, total - 1);
    const dist = Math.abs(index - current);
    return Math.max(0.7, 1 - dist * 0.12);
  });
  const rotateY = useTransform(progress, (p) => {
    const current = p * Math.max(1, total - 1);
    return (index - current) * -18; // tilt outward
  });
  const zIndex = useTransform(progress, (p) => {
    const current = p * Math.max(1, total - 1);
    return Math.round(100 - Math.abs(index - current) * 10);
  });

  const shots = (c.shots ?? (c.image ? [c.image] : [])).slice(0, 3);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2"
      style={{
        x: offsetPx,
        opacity,
        scale,
        rotateY,
        zIndex,
        transformStyle: "preserve-3d",
        transformOrigin: "center",
      }}
    >
      <WheelCard c={c} shots={shots} onOpen={onOpen} />
    </motion.div>
  );
}

function WheelCard({
  c,
  shots,
  onOpen,
}: {
  c: CaseStudy;
  shots: string[];
  onOpen: (src: string) => void;
}) {
  const [hoverShot, setHoverShot] = useState<number | null>(null);
  const HOVER_LINES: Record<number, string> = {
    0: c.what,
    1: c.why,
    2: c.stack || c.what,
  };
  return (
    <div
      className="card glow-border flex flex-col gap-3 overflow-hidden p-5"
      style={{
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.55), 0 6px 20px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-center justify-between">
        {c.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.logo} alt={c.name} className="h-6 w-auto opacity-90" />
        ) : (
          <span className="display text-[1.1rem]">{c.name}</span>
        )}
        <span className="meta accent text-[0.55rem] tracking-[0.3em]">{c.tag}</span>
      </div>

      {/* three thumb tiles */}
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => {
          const src = shots[i];
          if (!src) {
            return (
              <div
                key={i}
                className="aspect-square rounded-md border border-dashed border-[var(--stroke-card)]"
              />
            );
          }
          return (
            <button
              key={src + i}
              onClick={() => onOpen(src)}
              onMouseEnter={() => setHoverShot(i)}
              onMouseLeave={() => setHoverShot((h) => (h === i ? null : h))}
              className="group relative aspect-square overflow-hidden rounded-md border border-[var(--stroke-card)]"
              aria-label={`${c.name} screenshot ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <span
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(8,7,5,0.45)] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
              >
                <Maximize2 size={14} strokeWidth={2.2} style={{ color: "var(--accent-bright)" }} />
              </span>
            </button>
          );
        })}
      </div>

      {/* one-liner — swaps when you hover a thumb */}
      <div className="min-h-[34px] px-1 text-[0.78rem] leading-snug text-dim">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={hoverShot ?? "default"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            {hoverShot !== null ? HOVER_LINES[hoverShot] : c.what}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ----------------------------------------------- Lightbox (shared) */

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.86)", backdropFilter: "blur(10px)" }}
    >
      <motion.img
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        src={src}
        alt="screenshot"
        className="max-h-[90vh] max-w-[92vw] rounded-2xl border border-[var(--stroke-card)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <span className="meta text-faint absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.6rem]">
        CLICK ANYWHERE TO CLOSE
      </span>
    </motion.div>
  );
}
