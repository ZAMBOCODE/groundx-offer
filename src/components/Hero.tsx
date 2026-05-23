"use client";

import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";

export function Hero() {
  return (
    <header className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="eyebrow mb-6"
      >
        ZamboDezigns &nbsp;·&nbsp; Proposal
      </motion.p>

      {/* floating business card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <TiltCard
          max={10}
          lift={10}
          className="mx-auto flex aspect-[1.66/1] w-[330px] flex-col justify-between p-7 sm:w-[420px]"
        >
          <div className="flex items-start justify-between">
            <span className="text-[0.62rem] tracking-[0.32em] text-faint uppercase">
              Underground Sanctuaries
            </span>
            <span className="text-[0.62rem] tracking-[0.3em] accent uppercase">
              Dubai
            </span>
          </div>

          <div className="text-left">
            <div className="gold-text display text-[2.6rem] sm:text-[3.4rem]">
              GROUND<span className="ml-2 font-light">X</span>
            </div>
            <div className="mt-1 text-[0.7rem] tracking-[0.3em] text-dim uppercase">
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
        className="display max-w-3xl text-[2.3rem] sm:text-[3.4rem]"
      >
        A brand that makes its mark
        <span className="gold-text"> out of sight.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="text-dim mt-6 max-w-xl text-[1.05rem] leading-relaxed"
      >
        Brand, AI visuals, web and content — built as one system for the GCC&apos;s
        most private luxury product. This is what I&apos;d build for Ground X, and
        the work that proves I can.
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
