"use client";

import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";
import { useOffer } from "./OfferProvider";
import { useDesign } from "./design-context";

export function Hero() {
  const { content } = useOffer();
  const h = content.hero;
  const { variants } = useDesign();
  const v = variants.hero;

  if (v === 1) return <HeroSplit h={h} />;
  if (v === 2) return <HeroMinimal h={h} />;
  if (v === 3) return <HeroMarquee h={h} />;
  if (v === 4) return <HeroCinematic h={h} />;
  if (v === 5) return <HeroStackedFrame h={h} />;
  return <HeroCentered h={h} />;
}

type HeroContent = { eyebrow: string; headline: string; headlineAccent: string; sub: string };

/* variant 0 — centered (default, original) */
function HeroCentered({ h }: { h: HeroContent }) {
  return (
    <header id="hero" className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6 flex flex-col items-center gap-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/zambo-logo.png" alt="ZamboDezigns" className="h-12 w-12 opacity-90" />
        <p className="eyebrow">ZamboDezigns &nbsp;·&nbsp; {h.eyebrow}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <GxBusinessCard />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="display max-w-4xl text-[2.7rem] sm:text-[4rem]"
      >
        {h.headline} <span className="accent-text">{h.headlineAccent}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="text-dim mt-6 max-w-xl text-[1.05rem] leading-relaxed"
      >
        {h.sub}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <a href="#offer" className="btn btn-primary">See the offer</a>
        <a href="#work" className="btn btn-ghost">View the work</a>
      </motion.div>
    </header>
  );
}

/* variant 1 — split: card left, headline right */
function HeroSplit({ h }: { h: HeroContent }) {
  return (
    <header id="hero" className="relative min-h-screen px-6 py-24 sm:px-12">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
          <GxBusinessCard />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
          <p className="eyebrow mb-4">ZamboDezigns &nbsp;·&nbsp; {h.eyebrow}</p>
          <h1 className="display text-[2.6rem] sm:text-[4.2rem] leading-[1.04]">
            {h.headline} <span className="accent-text">{h.headlineAccent}</span>
          </h1>
          <p className="text-dim mt-6 max-w-md text-[1.05rem] leading-relaxed">{h.sub}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#offer" className="btn btn-primary">See the offer</a>
            <a href="#work" className="btn btn-ghost">View the work</a>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

/* variant 2 — minimal cover: giant display, no card, scroll hint */
function HeroMinimal({ h }: { h: HeroContent }) {
  return (
    <header id="hero" className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="eyebrow mb-6">
        ZamboDezigns &nbsp;·&nbsp; {h.eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.1 }}
        className="display max-w-6xl text-[3rem] leading-[0.98] sm:text-[6rem]"
      >
        {h.headline} <span className="accent-text">{h.headlineAccent}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-dim mt-8 max-w-lg text-[1rem]"
      >
        {h.sub}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.6 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="meta text-faint text-[0.6rem]">scroll</span>
        <span className="block h-8 w-px" style={{ background: "linear-gradient(180deg, var(--accent), transparent)" }} />
      </motion.div>
    </header>
  );
}

/* variant 3 — marquee: scrolling display text edge-to-edge */
function HeroMarquee({ h }: { h: HeroContent }) {
  return (
    <header id="hero" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-0 py-24">
      <div className="mx-6 mb-16 flex items-baseline justify-between sm:mx-16">
        <p className="eyebrow">ZamboDezigns &nbsp;·&nbsp; {h.eyebrow}</p>
        <span className="meta text-faint text-[0.6rem]">Stuttgart → Dubai</span>
      </div>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[0, 1].map((k) => (
          <span key={k} className="display pr-12 text-[6rem] leading-[0.95] sm:text-[10rem]">
            {h.headline} <span className="accent-text">{h.headlineAccent}</span> &nbsp;·&nbsp;
          </span>
        ))}
      </motion.div>
      <div className="mx-6 mt-16 flex flex-col items-start gap-6 sm:mx-16 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-dim max-w-md text-[1rem] leading-relaxed">{h.sub}</p>
        <div className="flex gap-3">
          <a href="#offer" className="btn btn-primary">See the offer</a>
          <a href="#work" className="btn btn-ghost">View the work</a>
        </div>
      </div>
    </header>
  );
}

/* variant 4 — cinematic: fullbleed with logo top-left, big headline bottom-left */
function HeroCinematic({ h }: { h: HeroContent }) {
  return (
    <header id="hero" className="relative flex min-h-screen flex-col justify-between px-6 py-16 sm:px-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 15% 0%, rgba(232,181,99,0.18), transparent 55%), radial-gradient(80% 60% at 85% 100%, rgba(249,115,22,0.12), transparent 55%)",
        }}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/zambo-logo.png" alt="ZamboDezigns" className="h-10 w-10 opacity-90" />
        <p className="eyebrow">{h.eyebrow}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.2 }} className="max-w-5xl">
        <h1 className="display text-[3rem] leading-[1.02] sm:text-[5.6rem]">
          {h.headline}
          <br />
          <span className="accent-text">{h.headlineAccent}</span>
        </h1>
        <p className="text-dim mt-6 max-w-xl text-[1.05rem] leading-relaxed">{h.sub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#offer" className="btn btn-primary">See the offer</a>
          <a href="#work" className="btn btn-ghost">View the work</a>
        </div>
      </motion.div>
    </header>
  );
}

/* variant 5 — stacked-frame: wrapped in tilt-card frame */
function HeroStackedFrame({ h }: { h: HeroContent }) {
  return (
    <header id="hero" className="relative flex min-h-screen items-center justify-center px-6 py-24">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="w-full max-w-4xl">
        <TiltCard className="flex flex-col items-center p-10 text-center sm:p-16">
          <p className="eyebrow mb-6">ZamboDezigns &nbsp;·&nbsp; {h.eyebrow}</p>
          <GxBusinessCard />
          <h1 className="display mt-10 text-[2.4rem] sm:text-[3.6rem]">
            {h.headline} <span className="accent-text">{h.headlineAccent}</span>
          </h1>
          <p className="text-dim mt-5 max-w-xl text-[1rem] leading-relaxed">{h.sub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#offer" className="btn btn-primary">See the offer</a>
            <a href="#work" className="btn btn-ghost">View the work</a>
          </div>
        </TiltCard>
      </motion.div>
    </header>
  );
}

/* ---- shared bits ---- */

function GxBusinessCard() {
  return (
    <TiltCard className="mx-auto flex aspect-[1.66/1] w-full max-w-[330px] flex-col justify-between p-5 sm:max-w-[420px] sm:p-7">
      <div className="flex items-start justify-between">
        <span className="meta text-[0.6rem] text-faint">Underground Sanctuaries</span>
        <span className="meta text-[0.6rem]" style={{ color: "var(--gx-gold-hi)" }}>Dubai</span>
      </div>
      <div className="text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-full max-w-[200px] sm:max-w-[250px]" />
        <div className="meta mt-2 text-[0.62rem] text-dim">Private · Modular · Uncompromising</div>
      </div>
      <div className="hairline" />
    </TiltCard>
  );
}
