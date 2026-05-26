"use client";

import { useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useScroll, useTransform, type MotionValue } from "motion/react";
import { Maximize2 } from "lucide-react";
import { cases, type CaseStudy } from "@/lib/data";
import { useOffer } from "./OfferProvider";
import { usePdfMode } from "@/lib/pdfMode";
import { iconFor as brandIconFor } from "./BrandIcons";

/* Selected Work — V5 (Samy 2026-05-26 voice briefing).
 *
 * Curved sticky-scroll carousel that cycles through ALL projects.
 *   - Section heading "Selected work" is rendered INSIDE the sticky frame
 *     so it stays visible the whole time you scroll through projects.
 *   - One project visible at a time. Layout: company NAME in display
 *     typography on the left (replaces the logo top-left from older V5),
 *     screenshots staggered + tilted on the right, faded favicon-style
 *     logo behind the shots bottom-right corner.
 *   - On scroll, the active project leaves with a curved rotateY + slide,
 *     the next enters from the opposite side on the same arc. Not a flat
 *     linear strip — a wheel-like curve, as Samy specified.
 *   - Images bigger than the previous V5 (75% column width, 16:10).
 *   - "More work, less wall of text — scroll to spin the wheel" copy is
 *     removed; the movement explains itself.
 *
 * PDF / static fallback renders each project as a vertical ShowcaseRow,
 * no animation. */

export function WorkShowcase() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const pdf = usePdfMode();
  const list = cases;
  return (
    <>
      {pdf ? (
        <WorkShowcaseStatic list={list} onOpen={setLightbox} />
      ) : (
        <WorkShowcaseDynamic list={list} onOpen={setLightbox} />
      )}
      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </>
  );
}

/* ----------------------------------------------- Dynamic curved scroll */

function WorkShowcaseDynamic({
  list,
  onOpen,
}: {
  list: CaseStudy[];
  onOpen: (src: string) => void;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const total = list.length;
  // ~90vh of scroll per project keeps the rhythm tight without feeling
  // like the section is endless. +40vh tail so the last project can
  // settle before the next section begins.
  const outerVh = Math.max(total, 1) * 90 + 40;

  const head = <Heading />;

  return (
    <div ref={outer} className="relative" style={{ height: `${outerVh}vh` }}>
      <div
        className="sticky top-0 flex h-screen flex-col overflow-hidden"
        style={{ perspective: "1600px" }}
      >
        <div className="pt-16 sm:pt-20">{head}</div>
        <div className="relative flex-1">
          {list.map((c, i) => (
            <ShowcaseSlot
              key={c.name}
              c={c}
              index={i}
              total={total}
              progress={scrollYProgress}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShowcaseSlot({
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
  const denom = Math.max(1, total - 1);

  const x = useTransform(progress, (p) => {
    const cur = p * denom;
    const d = index - cur;
    // 95vw per step keeps neighbouring slides nearly off-screen but
    // hints at the carousel.
    return `${d * 95}vw`;
  });
  const rotateY = useTransform(progress, (p) => {
    const cur = p * denom;
    const d = index - cur;
    return d * -22;
  });
  const opacity = useTransform(progress, (p) => {
    const cur = p * denom;
    const d = Math.abs(index - cur);
    if (d > 1.4) return 0;
    return Math.max(0, 1 - d * 0.85);
  });
  const scale = useTransform(progress, (p) => {
    const cur = p * denom;
    const d = Math.abs(index - cur);
    return Math.max(0.78, 1 - d * 0.16);
  });
  const zIndex = useTransform(progress, (p) => {
    const cur = p * denom;
    return Math.round(120 - Math.abs(index - cur) * 12);
  });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4 sm:px-12"
      style={{
        x,
        rotateY,
        opacity,
        scale,
        zIndex,
        transformStyle: "preserve-3d",
        transformOrigin: "center",
        willChange: "transform, opacity",
      }}
    >
      <div className="w-full max-w-[1280px]">
        <ProjectCard c={c} onOpen={onOpen} />
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------- One project card */

function ProjectCard({
  c,
  onOpen,
}: {
  c: CaseStudy;
  onOpen: (src: string) => void;
}) {
  const shots = (c.shots ?? (c.image ? [c.image] : [])).slice(0, 3);
  // Samy 2026-05-25: max 4 tags shown
  const tags = c.tags?.slice(0, 4);

  return (
    <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
      {/* LEFT — identity. Samy 2026-05-26: company name in display
         typography replaces the logo top-left. */}
      <div>
        <h3 className="display text-[2.2rem] leading-[0.95] sm:text-[3.2rem]">
          {c.name}
        </h3>
        <p className="meta accent mt-3 text-[0.62rem] tracking-[0.3em]">
          {c.tag}
        </p>
        <p className="text-dim mt-5 text-[1rem] leading-relaxed">{c.what}</p>
        <p className="accent mt-3 text-[0.9rem] italic">{c.why}</p>
        {tags && tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((t) => {
              const Icon = brandIconFor(t);
              return (
                <span
                  key={t}
                  className="inner-card flex items-center gap-1.5 px-3 py-1.5 text-[0.78rem] text-dim"
                >
                  <Icon size={11} className="opacity-70" />
                  {t}
                </span>
              );
            })}
          </div>
        )}
        {c.stack && (
          <p className="meta text-faint mt-5 text-[0.58rem]">{c.stack}</p>
        )}
      </div>

      {/* RIGHT — staggered tilted screenshots, bigger than V5-classic
         (75% column width, 16:10), plus faded favicon-logo behind */}
      <div className="relative h-[360px] overflow-visible sm:h-[520px]">
        {shots.map((src, i) => {
          const rot = (i - (shots.length - 1) / 2) * 6;
          const left = shots.length > 1 ? (i / (shots.length - 1)) * 30 : 8;
          const top = i % 2 === 0 ? 0 : 40;
          return (
            <button
              key={src + i}
              onClick={() => onOpen(src)}
              className="shot-card group absolute overflow-hidden"
              style={
                {
                  "--r": `${rot}deg`,
                  left: `${left}%`,
                  top: `${top}px`,
                  width: "75%",
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

        {/* faded favicon-style logo behind the shots, bottom-right */}
        {c.logo && (
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-2 right-0 z-10"
            style={{
              opacity: 0.18,
              filter: "blur(0.3px)",
              maskImage:
                "linear-gradient(135deg, black 30%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(135deg, black 30%, transparent 100%)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.logo} alt="" className="h-32 w-auto sm:h-48" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------- Heading (sticky) */

function Heading() {
  const c = useOffer().content.work;
  return (
    <div className="px-4 sm:px-12">
      <p className="eyebrow mb-3">{c.eyebrow}</p>
      <h2 className="display text-[2.2rem] sm:text-[3rem]">
        {c.title} <span className="accent-text">{c.titleAccent}</span>
      </h2>
    </div>
  );
}

/* ----------------------------------------------- Static / PDF fallback */

function WorkShowcaseStatic({
  list,
  onOpen,
}: {
  list: CaseStudy[];
  onOpen: (src: string) => void;
}) {
  return (
    <div className="px-4 sm:px-12">
      <Heading />
      <div className="mt-12 flex flex-col gap-20">
        {list.map((c) => (
          <ProjectCard key={c.name} c={c} onOpen={onOpen} />
        ))}
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
