"use client";

import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";
import { useOffer } from "./OfferProvider";

export function Hero() {
  const { content } = useOffer();
  const h = content.hero;
  return (
    <header className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6 flex flex-col items-center gap-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/zambo-logo.png"
          alt="ZamboDezigns"
          className="h-12 w-12 opacity-90"
        />
        <p className="eyebrow">ZamboDezigns &nbsp;·&nbsp; {h.eyebrow}</p>
      </motion.div>

      {/* floating Ground X business card — the client's own gold/anthracite brand */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <TiltCard className="mx-auto flex aspect-[1.66/1] w-[330px] flex-col justify-between p-7 sm:w-[420px]">
          <div className="flex items-start justify-between">
            <span className="meta text-[0.6rem] text-faint">Underground Sanctuaries</span>
            <span
              className="meta text-[0.6rem]"
              style={{ color: "var(--gx-gold-hi)" }}
            >
              Dubai
            </span>
          </div>

          <div className="text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/groundx-logo.png"
              alt="GROUND X"
              className="w-[200px] sm:w-[250px]"
            />
            <div className="meta mt-2 text-[0.62rem] text-dim">
              Private · Modular · Uncompromising
            </div>
          </div>

          <div className="hairline" />
        </TiltCard>
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
        <a href="#offer" className="btn btn-primary">
          See the offer
        </a>
        <a href="#work" className="btn btn-ghost">
          View the work
        </a>
      </motion.div>
    </header>
  );
}
