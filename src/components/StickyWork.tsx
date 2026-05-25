"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cases as ALL_CASES, type CaseStudy } from "@/lib/data";
import { TiltCard } from "./TiltCard";

/* Sticky horizontal scroll: vertical scroll pins the viewport and translates a
   horizontal track of case cards. Falls back to a vertical stack on mobile. */

export function StickyWork({ cases }: { cases?: CaseStudy[] } = {}) {
  const list = cases ?? ALL_CASES;
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const maxX = useRef(0);
  const [isDesktop, setIsDesktop] = useState(true);

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (v) => -(v * maxX.current));

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);

    const measure = () => {
      if (track.current) {
        maxX.current = Math.max(0, track.current.scrollWidth - window.innerWidth + 48);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 300); // after fonts/layout settle
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  if (!isDesktop) {
    return (
      <div className="section grid gap-5 pt-0">
        {list.map((c) => (
          <Card key={c.name} c={c} />
        ))}
      </div>
    );
  }

  return (
    <div ref={outer} style={{ height: `${list.length * 85 + 30}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={track}
          style={{ x }}
          className="flex gap-6"
        >
          <div className="shrink-0" style={{ width: "max(1.5rem, calc((100vw - 1120px) / 2))" }} />
          {list.map((c) => (
            <div key={c.name} className="w-[78vw] max-w-[540px] shrink-0">
              <Card c={c} />
            </div>
          ))}
          <div className="shrink-0" style={{ width: "10vw" }} />
        </motion.div>
      </div>
    </div>
  );
}

function Card({ c }: { c: CaseStudy }) {
  return (
    <TiltCard className="group flex h-full flex-col overflow-hidden">
      <div
        className="relative h-56 w-full overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(5,5,7,0.6))" }}
      >
        {c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.image}
            alt={c.name}
            className={
              c.fit === "contain"
                ? "h-full w-full object-contain p-8 opacity-95 transition duration-700 group-hover:scale-[1.03]"
                : "h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.04]"
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="display text-[2rem] text-3 opacity-40">{c.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
        <span className="meta accent absolute bottom-3 left-4 text-[0.6rem]">{c.tag}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="display text-[1.3rem]">{c.name}</h3>
        <p className="text-dim mt-3 text-[0.92rem] leading-relaxed">{c.what}</p>
        <p className="accent mt-3 text-[0.88rem] italic">{c.why}</p>
      </div>
    </TiltCard>
  );
}
