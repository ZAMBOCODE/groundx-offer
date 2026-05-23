"use client";

import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cases, type CaseStudy } from "@/lib/data";

/* "My previous work" showcase: per company, left = logo + the key facts + tags,
   right = the website screenshots as staggered, pre-tilted cards (filled image
   frames, minimal hover). Click a card to open it full. */

export function WorkShowcase() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <div className="mt-14 flex flex-col gap-20">
      {cases.map((c, i) => (
        <ShowcaseRow key={c.name} c={c} flip={i % 2 === 1} onOpen={setLightbox} />
      ))}
      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}

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
        {c.tags && (
          <div className="mt-5 flex flex-wrap gap-2">
            {c.tags.map((t) => (
              <span key={t} className="inner-card px-3 py-1.5 text-[0.78rem] text-dim">
                {t}
              </span>
            ))}
          </div>
        )}
        <p className="meta text-faint mt-5 text-[0.58rem]">{c.stack}</p>
      </div>

      {/* right — staggered tilted screenshot cards */}
      <div className="relative h-[280px] sm:h-[360px]">
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
                  width: "66%",
                  aspectRatio: "16 / 10",
                  zIndex: i + 1,
                } as CSSProperties
              }
              aria-label={`${c.name} screenshot ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${c.name} ${i + 1}`}
                className="h-full w-full object-cover object-top"
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

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
        click anywhere to close
      </span>
    </motion.div>
  );
}
