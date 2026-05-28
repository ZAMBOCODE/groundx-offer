"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cases, type CaseStudy } from "@/lib/data";
import { useOffer } from "./OfferProvider";
import { useLang } from "./language-context";
import { usePdfMode } from "@/lib/pdfMode";
import { iconFor as brandIconFor } from "./BrandIcons";

/* Selected Work — V5 (Samy 2026-05-26 voice briefing iterations).
 *
 * Curved sticky-scroll carousel that cycles through ALL projects.
 *   - Section heading "Selected work" stays sticky inside the frame.
 *   - One project on screen at a time. Layout: company NAME in display
 *     typography on the left, ONE prominent 3D-tilted screenshot card
 *     on the right (Samy 2026-05-26: "ich will doch nur ein bild bzw
 *     zwei bilder zeigen, leicht tilted 3d-cards-mäßig").
 *   - Hover the card → it crossfades to the second shot. Click → opens
 *     a lightbox that registers BOTH shots so you can cycle them
 *     (prev / next arrows + ←/→ keys).
 *   - Scroll between projects: curved rotateY + slide. Each project is
 *     also a CSS scroll-snap stop so the browser lands cleanly on the
 *     next slide ("soll die carousell sektion auch snappen zu den
 *     einzelnen pages").
 *
 * PDF / static fallback renders each project as a vertical
 * ProjectCard, no animation, no hover cycle. */

export function WorkShowcase() {
  const [lightboxCase, setLightboxCase] = useState<CaseStudy | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const pdf = usePdfMode();
  const list = cases;

  function openLightbox(c: CaseStudy, startIdx = 0) {
    setLightboxCase(c);
    setLightboxIdx(startIdx);
  }
  function closeLightbox() {
    setLightboxCase(null);
  }

  return (
    <>
      {pdf ? (
        <WorkShowcaseStatic list={list} onOpen={openLightbox} />
      ) : (
        <WorkShowcaseDynamic list={list} onOpen={openLightbox} />
      )}
      <AnimatePresence>
        {lightboxCase && (
          <Lightbox
            c={lightboxCase}
            idx={lightboxIdx}
            onIdx={setLightboxIdx}
            onClose={closeLightbox}
          />
        )}
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
  onOpen: (c: CaseStudy, startIdx?: number) => void;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const total = list.length;
  // outer = total * 65vh (Samy 2026-05-27: vorher 100vh/Case → 5 Cases = 500vh
  // Pin-Scroll, fuehlte sich an wie "scrollen tut nichts"). 65vh/Case haelt
  // den Carousel-Pin spuerbar aber kompakt, plus 35vh exit tail damit das
  // letzte Case noch kurz steht bevor die naechste Section snappt.
  const outerVh = Math.max(total, 1) * 65 + 35;

  return (
    <div ref={outer} className="relative" style={{ height: `${outerVh}vh` }}>
      {/* Sticky carousel — visually overlays the inline snap-rails below.
         marginBottom: -100vh pulls the following rails block up to start
         AT outer.top, so the rails span exactly outer's vertical range
         while the sticky child stays pinned. */}
      <div
        className="sticky top-0 z-10 flex h-screen flex-col overflow-hidden"
        style={{ marginBottom: "-100vh", perspective: "1600px" }}
      >
        <div className="pt-16 sm:pt-20">
          <Heading />
        </div>
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

      {/* Snap-rails: invisible inline blocks, je 65vh um zur reduzierten
         outerVh-Math zu passen (vorher 100vh/Case → outer ueberlief). */}
      {list.map((c) => (
        <div
          key={`rail-${c.name}`}
          aria-hidden
          className="pointer-events-none"
          style={{ height: "65vh", scrollSnapAlign: "start" }}
        />
      ))}
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
  onOpen: (c: CaseStudy, startIdx?: number) => void;
}) {
  const denom = Math.max(1, total - 1);

  const x = useTransform(progress, (p) => {
    const cur = p * denom;
    const d = index - cur;
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
  onOpen: (c: CaseStudy, startIdx?: number) => void;
}) {
  const shots = c.shots ?? (c.image ? [c.image] : []);
  const primary = shots[0];
  const secondary = shots[1];
  const [hover, setHover] = useState(false);
  const showingSecondary = hover && !!secondary;
  // Samy 2026-05-25: max 4 tags shown
  const tags = c.tags?.slice(0, 4);

  return (
    <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
      {/* LEFT — identity. Company name as display typography. */}
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

      {/* RIGHT — ONE prominent 3D-tilted card; hover crossfades to shot 2.
         Click opens the lightbox with the currently-shown shot pre-active
         so the user can cycle prev/next there. */}
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpen(c, showingSecondary ? 1 : 0)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="shot-card group relative block w-full overflow-hidden"
          style={
            {
              "--r": "-2.5deg",
              aspectRatio: "16 / 10",
              maxWidth: "720px",
              marginLeft: "auto",
              transform:
                "perspective(1300px) rotateY(-6deg) rotateX(2deg) rotate(-2.5deg)",
              transformStyle: "preserve-3d",
            } as CSSProperties
          }
          aria-label={`${c.name} — click for fullscreen`}
        >
          {primary && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primary}
              alt={c.name}
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ease-out"
              style={{ opacity: showingSecondary ? 0 : 1 }}
            />
          )}
          {secondary && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={secondary}
              alt={`${c.name} alternate view`}
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ease-out"
              style={{ opacity: showingSecondary ? 1 : 0 }}
            />
          )}

          {/* counter dots — only shown when there's a second shot */}
          {secondary && (
            <div
              className="pointer-events-none absolute right-3 top-3 flex gap-1.5"
              aria-hidden
            >
              <span
                className="h-1.5 w-3 rounded-full transition-all"
                style={{
                  background: !showingSecondary
                    ? "var(--accent)"
                    : "rgba(255,255,255,0.35)",
                  width: !showingSecondary ? "20px" : "8px",
                }}
              />
              <span
                className="h-1.5 w-3 rounded-full transition-all"
                style={{
                  background: showingSecondary
                    ? "var(--accent)"
                    : "rgba(255,255,255,0.35)",
                  width: showingSecondary ? "20px" : "8px",
                }}
              />
            </div>
          )}

          {/* fullscreen indicator on hover */}
          <FullscreenBadge />
        </button>

        {/* faded favicon-style logo behind/below the card */}
        {c.logo && (
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 right-2 z-[-1]"
            style={{
              opacity: 0.16,
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
  onOpen: (c: CaseStudy, startIdx?: number) => void;
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

/* ----------------------------------------------- Lightbox with cycle */

function Lightbox({
  c,
  idx,
  onIdx,
  onClose,
}: {
  c: CaseStudy;
  idx: number;
  onIdx: (i: number) => void;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const shots = c.shots ?? (c.image ? [c.image] : []);
  const total = shots.length;
  const safeIdx = ((idx % total) + total) % total;
  const src = shots[safeIdx];

  // keyboard arrows + esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && total > 1) onIdx((safeIdx + 1) % total);
      else if (e.key === "ArrowLeft" && total > 1)
        onIdx((safeIdx - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onIdx, safeIdx, total]);

  if (!src) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.86)", backdropFilter: "blur(10px)" }}
    >
      <motion.div
        key={safeIdx}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] max-w-[92vw]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${c.name} ${safeIdx + 1}`}
          className="max-h-[90vh] max-w-[92vw] rounded-2xl border border-[var(--stroke-card)] shadow-2xl"
        />
      </motion.div>

      {/* prev / next */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIdx((safeIdx - 1 + total) % total);
            }}
            aria-label={lang === "de" ? "Vorheriges Bild" : "Previous image"}
            className="inner-card absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full text-dim hover:text-[var(--accent-bright)]"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIdx((safeIdx + 1) % total);
            }}
            aria-label={lang === "de" ? "Nächstes Bild" : "Next image"}
            className="inner-card absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full text-dim hover:text-[var(--accent-bright)]"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* dots + hint */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        {total > 1 && (
          <div className="flex gap-1.5">
            {shots.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onIdx(i);
                }}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === safeIdx ? 24 : 8,
                  background:
                    i === safeIdx ? "var(--accent)" : "rgba(255,255,255,0.25)",
                }}
                aria-label={`${c.name} ${i + 1}`}
              />
            ))}
          </div>
        )}
        <span className="meta text-faint text-[0.55rem]">
          {lang === "de"
            ? "ÜBERALL KLICKEN ZUM SCHLIESSEN"
            : "CLICK ANYWHERE TO CLOSE"}
        </span>
      </div>
    </motion.div>
  );
}

function FullscreenBadge() {
  const { lang } = useLang();
  return (
    <span
      className="meta pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-md border border-[var(--stroke-card)] bg-[rgba(8,7,5,0.7)] px-2 py-1 text-[0.55rem] tracking-[0.3em] opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
      style={{ color: "var(--accent-bright)" }}
    >
      <Maximize2 size={9} strokeWidth={2.2} />
      {lang === "de" ? "VOLLBILD" : "FULLSCREEN"}
    </span>
  );
}
