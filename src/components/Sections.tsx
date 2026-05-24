"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";
import { cases, type CaseStudy } from "@/lib/data";
import { useDesign } from "./design-context";
import { useOffer } from "./OfferProvider";
import { StickyWork } from "./StickyWork";
import { WorkShowcase } from "./WorkShowcase";
import { MockupShowcase } from "./MockupShowcase";

/* ---------------------------------------------------- shared helpers */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="reveal"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <Reveal>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="display max-w-3xl text-[2.4rem] sm:text-[3.3rem]">{title}</h2>
      {sub && <p className="text-dim mt-5 max-w-2xl text-[1.12rem] leading-relaxed">{sub}</p>}
    </Reveal>
  );
}

function CaseImage({ c, className }: { c: CaseStudy; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
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
  );
}

/* ==================================================== ABOUT */

export function About() {
  const skills = [
    "Web design & development",
    "E-commerce & checkout",
    "3D modeling & rendering",
    "Motion design & animation",
    "AI video generation",
    "AI image / renderings",
    "Branding & identity",
    "Landing pages & copywriting",
    "Dashboards & internal tools",
    "Automation & AI agents",
  ];
  return (
    <section id="about" className="section">
      <Reveal>
        <p className="eyebrow mb-4">Who you&apos;re working with</p>
      </Reveal>
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div
            className="card glow-border mx-auto w-full max-w-[320px] overflow-hidden"
            style={{ aspectRatio: "4 / 5" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/samy.png"
              alt="Samuel Heymig"
              className="h-full w-full object-cover object-top"
              style={{ background: "linear-gradient(160deg, rgba(249,115,22,0.16), rgba(255,255,255,0.03))" }}
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[2rem] sm:text-[2.8rem]">
            Samuel Heymig — <span className="accent-text">one person, full stack.</span>
          </h2>
          <p className="text-dim mt-5 max-w-xl text-[1.05rem] leading-relaxed">
            A freelancer from Stuttgart helping businesses grow with clean web design,
            optimized shops, and striking 3D and motion work. I build the whole system:
            brand, visuals, site, content and the automation behind it.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="inner-card px-3 py-1.5 text-[0.82rem] text-dim">
                {s}
              </span>
            ))}
          </div>
          <p className="meta text-faint mt-6 text-[0.6rem]">
            50+ projects · 96% client satisfaction · 10+ years
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ==================================================== ANGLE (6 variants) */

export function Angle() {
  const { variants } = useDesign();
  const c = useOffer().content.angle;
  const points = c.points;
  const v = variants.angle;
  return (
    <section id="angle" className="section">
      <SectionHead
        eyebrow={c.eyebrow}
        title={
          <>
            {c.title} <span className="accent-text">{c.titleAccent}</span>
          </>
        }
        sub={c.sub}
      />

      {/* variant 0: tilt-card grid (4 col) */}
      {v === 0 && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.08}>
              <TiltCard className="h-full p-6">
                <div className="meta accent">{p.k}</div>
                <p className="text-dim mt-3 text-[0.95rem] leading-relaxed">{p.v}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 1: editorial numbered rows */}
      {v === 1 && (
        <div className="mt-12 flex flex-col">
          {points.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.06}>
              <div className="group flex items-baseline gap-6 border-t border-[var(--stroke-card)] py-6">
                <span className="display-light accent w-12 shrink-0 text-[1.6rem]">
                  0{i + 1}
                </span>
                <div className="flex flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-8">
                  <h3 className="display w-full text-[1.3rem] md:w-64">{p.k}</h3>
                  <p className="text-dim flex-1 text-[1rem] leading-relaxed">{p.v}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 2: timeline w/ gradient stem (Linear/Stripe scroll-reveal) */}
      {v === 2 && (
        <div className="relative mt-14 pl-10 md:pl-16">
          <div
            className="absolute left-3 top-0 bottom-0 w-px md:left-6"
            style={{
              background:
                "linear-gradient(180deg, transparent, var(--accent) 8%, var(--accent) 92%, transparent)",
            }}
          />
          {points.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.08}>
              <div className="relative pb-12 last:pb-0">
                <span
                  className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full md:-left-[55px]"
                  style={{
                    background: "var(--accent)",
                    boxShadow:
                      "0 0 0 6px rgba(249,115,22,0.18), 0 0 22px rgba(249,115,22,0.45)",
                  }}
                />
                <div className="meta accent text-[0.62rem]">{p.k}</div>
                <p className="text-dim mt-3 max-w-2xl text-[1.02rem] leading-relaxed">{p.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 3: asymmetric bento (first one large) */}
      {v === 3 && (
        <div className="mt-12 grid auto-rows-[minmax(140px,auto)] gap-4 md:grid-cols-3">
          {points.map((p, i) => {
            const big = i === 0;
            return (
              <Reveal key={p.k} delay={i * 0.07}>
                <TiltCard
                  className={`flex h-full flex-col p-6 ${big ? "md:col-span-2 md:row-span-2 md:p-9" : ""}`}
                >
                  <div className={`meta accent ${big ? "text-[0.72rem]" : ""}`}>{p.k}</div>
                  <p
                    className={`text-dim mt-3 leading-relaxed ${big ? "text-[1.15rem] md:text-[1.3rem]" : "text-[0.9rem]"}`}
                  >
                    {p.v}
                  </p>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* variant 4: big-numeral split — alternating, huge stencil number */}
      {v === 4 && (
        <div className="mt-14 flex flex-col gap-10">
          {points.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.06}>
              <div
                className={`flex flex-col items-start gap-6 md:items-center md:gap-12 ${
                  i % 2 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className="flex-1 md:max-w-md">
                  <h3 className="display text-[1.5rem]">{p.k}</h3>
                  <p className="text-dim mt-3 text-[1rem] leading-relaxed">{p.v}</p>
                </div>
                <div
                  className="display select-none text-[6rem] leading-none md:text-[10rem]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 60px rgba(249,115,22,0.12)",
                  }}
                >
                  0{i + 1}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 5: manifesto — first point as huge display, rest as chips */}
      {v === 5 && (
        <div className="mt-12 grid items-start gap-10 md:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h3 className="display text-[1.9rem] leading-tight sm:text-[2.4rem]">
              {points[0]?.v}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-2.5">
              {points.slice(1).map((p, i) => (
                <div key={p.k} className="inner-card flex items-baseline gap-4 px-5 py-4">
                  <span className="meta accent w-10 shrink-0 text-[0.6rem]">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="text-[0.9rem] text-white">{p.k}</div>
                    <p className="text-dim mt-0.5 text-[0.85rem] leading-snug">{p.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}

/* ============================================ CAPABILITIES (6 variants) */

export function Capabilities() {
  const { variants } = useDesign();
  const v = variants.capabilities;
  const c = useOffer().content.capabilities;
  return (
    <section id="capabilities" className="section">
      <SectionHead
        eyebrow={c.eyebrow}
        title={
          <>
            {c.title} <span className="accent-text">{c.titleAccent}</span>
          </>
        }
        sub={c.sub}
      />

      {/* variant 0: even 3-col cards */}
      {v === 0 && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.07}>
              <TiltCard className="flex h-full flex-col p-6">
                <h3 className="display text-[1.15rem]">{c.title}</h3>
                <p className="text-dim mt-3 flex-1 text-[0.92rem] leading-relaxed">{c.blurb}</p>
                <div className="inner-card mt-5 px-3 py-2">
                  <span className="meta text-faint text-[0.6rem]">Proof</span>
                  <p className="accent mt-0.5 text-[0.82rem]">{c.proof}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 1: bento — first card featured */}
      {v === 1 && (
        <div className="mt-12 grid auto-rows-[minmax(150px,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((c, i) => {
            const big = i === 0;
            return (
              <Reveal key={c.title} delay={(i % 4) * 0.06}>
                <TiltCard
                  className={`flex h-full flex-col p-6 ${big ? "lg:col-span-2 lg:row-span-2" : ""}`}
                >
                  <h3 className={`display ${big ? "text-[1.5rem]" : "text-[1.1rem]"}`}>{c.title}</h3>
                  <p className="text-dim mt-3 flex-1 text-[0.9rem] leading-relaxed">{c.blurb}</p>
                  <div className="inner-card mt-4 px-3 py-2">
                    <p className="accent text-[0.8rem]">{c.proof}</p>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* variant 2: compact rows */}
      {v === 2 && (
        <div className="mt-12 flex flex-col">
          {c.items.map((c, i) => (
            <Reveal key={c.title} delay={(i % 6) * 0.04}>
              <div className="grid grid-cols-1 items-center gap-2 border-t border-[var(--stroke-card)] py-5 md:grid-cols-[220px_1fr_auto] md:gap-8">
                <h3 className="display text-[1.1rem]">{c.title}</h3>
                <p className="text-dim text-[0.9rem] leading-relaxed">{c.blurb}</p>
                <span className="accent meta text-[0.6rem] md:text-right">{c.proof}</span>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 3-5 use helper sub-components for state/hooks */}
      {v === 3 && <CapabilitiesStackDeck items={c.items} />}
      {v === 4 && <CapabilitiesSplitPane items={c.items} />}
      {v === 5 && <CapabilitiesScrollSnap items={c.items} />}
    </section>
  );
}

/* variant 3 — stack-deck: top card prominent, others fanned behind with z-depth.
   Hover on a peek triggers it to swap to the front (Apple-style press-stack). */
function CapabilitiesStackDeck({ items }: { items: Array<{ title: string; blurb: string; proof: string }> }) {
  const [active, setActive] = useState(0);
  const visible = 4; // how many we fan
  return (
    <Reveal>
      <div className="relative mx-auto mt-16 grid max-w-3xl place-items-center" style={{ perspective: 1400 }}>
        {items.slice(0, visible).map((it, i) => {
          const offset = (i - active + visible) % visible;
          const isFront = offset === 0;
          return (
            <div
              key={it.title}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
              className="card glow-border absolute top-0 w-full max-w-xl p-8 transition-all duration-500"
              style={{
                transform: `translateY(${offset * 18}px) translateZ(${-offset * 40}px) rotateX(${offset * -3}deg) scale(${1 - offset * 0.04})`,
                opacity: 1 - offset * 0.15,
                zIndex: visible - offset,
                cursor: isFront ? "default" : "pointer",
                pointerEvents: offset > 2 ? "none" : "auto",
              }}
            >
              <div className="meta accent text-[0.62rem]">
                {String(i + 1).padStart(2, "0")} · {visible}
              </div>
              <h3 className="display mt-3 text-[1.5rem]">{it.title}</h3>
              <p className="text-dim mt-3 text-[1rem] leading-relaxed">{it.blurb}</p>
              <div className="inner-card mt-5 inline-block px-3 py-2">
                <p className="accent text-[0.82rem]">{it.proof}</p>
              </div>
            </div>
          );
        })}
        {/* spacer so the absolute stack reserves vertical room */}
        <div className="h-[380px]" />
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {items.slice(0, visible).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: active === i ? 28 : 10,
              background: active === i ? "var(--accent)" : "var(--stroke-strong)",
            }}
            aria-label={`Card ${i + 1}`}
          />
        ))}
      </div>
    </Reveal>
  );
}

/* variant 4 — split pane: title-list left, preview pane right (Vercel/Linear). */
function CapabilitiesSplitPane({ items }: { items: Array<{ title: string; blurb: string; proof: string }> }) {
  const [hover, setHover] = useState(0);
  const active = items[hover] ?? items[0];
  if (!active) return null;
  return (
    <Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-[minmax(220px,300px)_1fr]">
        <ul className="flex flex-col">
          {items.map((it, i) => {
            const on = i === hover;
            return (
              <li key={it.title}>
                <button
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onClick={() => setHover(i)}
                  className="group flex w-full items-center gap-3 border-t border-[var(--stroke-card)] py-4 text-left transition-colors last:border-b"
                  style={{
                    color: on ? "var(--ink)" : "var(--ink-2)",
                  }}
                >
                  <span
                    className="h-px w-6 transition-all"
                    style={{
                      background: on ? "var(--accent)" : "var(--stroke-strong)",
                      width: on ? 28 : 14,
                    }}
                  />
                  <span className="display text-[1rem]">{it.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <TiltCard className="flex min-h-[300px] flex-col p-8">
          <div className="meta accent text-[0.62rem]">
            {String(hover + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </div>
          <h3 className="display mt-3 text-[1.8rem]">{active.title}</h3>
          <p className="text-dim mt-4 max-w-xl flex-1 text-[1.02rem] leading-relaxed">{active.blurb}</p>
          <div className="inner-card mt-5 inline-block self-start px-4 py-2.5">
            <span className="meta text-faint text-[0.6rem]">Proof</span>
            <p className="accent mt-0.5 text-[0.88rem]">{active.proof}</p>
          </div>
        </TiltCard>
      </div>
    </Reveal>
  );
}

/* variant 5 — full-bleed horizontal scroll-snap strip. One feature per viewport.
   Soft inertia + snap, indicator dots underneath. */
function CapabilitiesScrollSnap({ items }: { items: Array<{ title: string; blurb: string; proof: string }> }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  return (
    <Reveal>
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== idx) setIdx(i);
        }}
        className="mt-12 flex w-full snap-x snap-mandatory overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {items.map((it, i) => (
          <div key={it.title} className="w-full shrink-0 snap-start pr-5 last:pr-0">
            <TiltCard className="flex h-[360px] flex-col justify-end overflow-hidden p-10">
              <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background: `radial-gradient(70% 50% at 80% 10%, rgba(249,115,22,${0.06 + (i % 3) * 0.04}), transparent 60%)`,
                }}
              />
              <div className="meta accent text-[0.62rem]">
                {String(i + 1).padStart(2, "0")} · capability
              </div>
              <h3 className="display mt-4 text-[2.2rem] leading-[1.05]">{it.title}</h3>
              <p className="text-dim mt-4 max-w-2xl text-[1.05rem] leading-relaxed">{it.blurb}</p>
              <div className="inner-card mt-6 inline-block self-start px-4 py-2.5">
                <p className="accent text-[0.84rem]">{it.proof}</p>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = ref.current;
              if (!el) return;
              el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
            }}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: idx === i ? 24 : 8,
              background: idx === i ? "var(--accent)" : "var(--stroke-strong)",
            }}
            aria-label={`To capability ${i + 1}`}
          />
        ))}
      </div>
    </Reveal>
  );
}

/* ============================================== WORK (3 variants) */

export function Work() {
  const { variants } = useDesign();
  const v = variants.work;
  const c = useOffer().content.work;
  const head = (
    <SectionHead
      eyebrow={c.eyebrow}
      title={
        <>
          {c.title} <span className="accent-text">{c.titleAccent}</span>
        </>
      }
    />
  );

  // variant 3: sticky horizontal scroll (full-bleed)
  if (v === 3) {
    return (
      <section id="work">
        <div className="section pb-0">{head}</div>
        <StickyWork />
      </section>
    );
  }

  return (
    <section id="work" className="section">
      {head}

      {/* variant 0: 2-col image cards */}
      {v === 0 && (
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cases.map((c, i) => (
            <Reveal key={c.name} delay={(i % 2) * 0.1}>
              <TiltCard className="group flex h-full flex-col overflow-hidden">
                <CaseImage c={c} className="h-64 w-full" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="display text-[1.3rem]">{c.name}</h3>
                  <p className="text-dim mt-3 text-[0.92rem] leading-relaxed">{c.what}</p>
                  <p className="accent mt-3 text-[0.88rem] italic">{c.why}</p>
                  <p className="meta text-faint mt-4 text-[0.6rem]">{c.stack}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 1: alternating wide rows */}
      {v === 1 && (
        <div className="mt-12 flex flex-col gap-5">
          {cases.map((c, i) => (
            <Reveal key={c.name} delay={0.05}>
              <TiltCard
                className={`group flex flex-col overflow-hidden md:flex-row ${
                  i % 2 ? "md:flex-row-reverse" : ""
                }`}
              >
                <CaseImage c={c} className="h-56 w-full md:h-auto md:w-1/2" />
                <div className="flex flex-1 flex-col justify-center p-8">
                  <h3 className="display text-[1.6rem]">{c.name}</h3>
                  <p className="text-dim mt-3 max-w-md text-[0.95rem] leading-relaxed">{c.what}</p>
                  <p className="accent mt-3 text-[0.9rem] italic">{c.why}</p>
                  <p className="meta text-faint mt-4 text-[0.6rem]">{c.stack}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 2: horizontal scroll strip */}
      {v === 2 && (
        <Reveal>
          <div
            className="mt-12 flex gap-5 overflow-x-auto pb-4"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {cases.map((c) => (
              <div
                key={c.name}
                className="shrink-0"
                style={{ width: "340px", scrollSnapAlign: "start" }}
              >
                <TiltCard className="group flex h-full flex-col overflow-hidden">
                  <CaseImage c={c} className="h-48 w-full" />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="display text-[1.25rem]">{c.name}</h3>
                    <p className="text-dim mt-3 text-[0.9rem] leading-relaxed">{c.what}</p>
                    <p className="accent mt-3 text-[0.86rem] italic">{c.why}</p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
          <p className="meta text-faint mt-2 text-[0.58rem]">← scroll →</p>
        </Reveal>
      )}

      {/* variant 4: showcase — logo + facts + tags | staggered tilted shots */}
      {v === 4 && <WorkShowcase />}

      {/* variant 5: polaroid stack — overlapping tilted cards spread on hover */}
      {v === 5 && <WorkPolaroidStack />}
    </section>
  );
}

/* variant 5 helper — polaroid stack. Cards overlap tilted, hover spreads them. */
function WorkPolaroidStack() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <Reveal>
      <div
        className="relative mx-auto mt-16 grid max-w-5xl place-items-center"
        style={{ perspective: 1500 }}
        onMouseLeave={() => setHover(null)}
      >
        <div className="relative h-[520px] w-full">
          {cases.slice(0, 6).map((c, i) => {
            const baseRot = (i - 2.5) * 5; // -12.5 .. +12.5
            const offsetX = (i - 2.5) * 60; // spread horizontally
            const spread = hover !== null;
            return (
              <div
                key={c.name}
                onMouseEnter={() => setHover(i)}
                className="absolute left-1/2 top-1/2 w-[280px] cursor-pointer transition-all duration-500"
                style={{
                  transform: `translate(-50%,-50%) translateX(${spread ? offsetX * 1.7 : offsetX * 0.2}px) translateY(${hover === i ? -24 : 0}px) rotate(${spread ? baseRot * 0.6 : baseRot}deg) scale(${hover === i ? 1.06 : 1})`,
                  zIndex: hover === i ? 30 : 10 + i,
                }}
              >
                <div
                  className="overflow-hidden bg-[#0c0a08] p-3 pb-12 shadow-2xl"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      hover === i
                        ? "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)"
                        : "0 14px 28px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="relative h-[220px] w-full overflow-hidden">
                    <CaseImage c={c} className="h-full w-full" />
                  </div>
                  <div className="pt-3 text-center">
                    <div className="display text-[0.95rem] text-white">{c.name}</div>
                    <div className="meta accent mt-0.5 text-[0.55rem]">{c.tag}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="meta text-faint mt-4 text-center text-[0.6rem]">hover · spread</p>
    </Reveal>
  );
}

/* =========================================== BRAND TEASER (6 variants) */

const BRAND_MOODS = [
  "Cognac leather",
  "Dark walnut",
  "Twilight & warm light",
  "Brushed gold",
  "Villa, never isolated",
  "Discreet, never loud",
];
const BRAND_PALETTE = ["#0a0907", "#1a1714", "#8a5a1c", "#c8862e", "#e8b563"];

export function BrandTeaser() {
  const { variants } = useDesign();
  const cb = useOffer().content.brand;
  const v = variants.brand;
  return (
    <section id="brand" className="section">
      <SectionHead
        eyebrow={cb.eyebrow}
        title={
          <>
            {cb.title} <span className="accent-text">{cb.titleAccent}</span>
          </>
        }
        sub={cb.sub}
      />

      {/* variant 0: side-by-side tilt card (logo + mood-chips) */}
      {v === 0 && (
        <Reveal delay={0.1}>
          <TiltCard className="mt-12 p-8 sm:p-12">
            <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[280px] sm:w-[340px]" />
                <p className="meta text-dim mt-5 text-[0.72rem]">Discreet. Modular. Uncompromising.</p>
                <div className="mt-6 flex gap-3">
                  {BRAND_PALETTE.map((c) => (
                    <div
                      key={c}
                      className="h-9 w-9 rounded-full border border-[var(--stroke-card)]"
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BRAND_MOODS.map((m) => (
                  <div key={m} className="inner-card px-4 py-3 text-[0.85rem] text-dim">
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </Reveal>
      )}

      {/* variant 1: centered logo focal */}
      {v === 1 && (
        <Reveal delay={0.1}>
          <TiltCard className="mt-12 flex flex-col items-center p-10 text-center sm:p-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[300px] sm:w-[440px]" />
            <p className="meta text-dim mt-4 text-[0.78rem]">Discreet. Modular. Uncompromising.</p>
            <div className="mt-7 flex gap-3">
              {BRAND_PALETTE.map((c) => (
                <div
                  key={c}
                  className="h-10 w-10 rounded-full border border-[var(--stroke-card)]"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {BRAND_MOODS.map((m) => (
                <span key={m} className="inner-card px-4 py-2 text-[0.82rem] text-dim">
                  {m}
                </span>
              ))}
            </div>
          </TiltCard>
        </Reveal>
      )}

      {/* variant 2: mockup showcase */}
      {v === 2 && <MockupShowcase />}

      {/* variant 3: split-screen — logo dominates left, mood-grid right */}
      {v === 3 && (
        <Reveal delay={0.1}>
          <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2">
            <TiltCard className="flex flex-col justify-between overflow-hidden p-10">
              <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(60% 70% at 50% 80%, rgba(232,181,99,0.18), transparent 60%)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[260px] self-start sm:w-[340px]" />
              <div className="mt-10">
                <p className="display text-[1.4rem] leading-tight text-white">Underground. Above standards.</p>
                <p className="meta text-faint mt-3 text-[0.6rem]">A villa lives on top. A sanctuary lives beneath.</p>
                <div className="mt-6 flex gap-2.5">
                  {BRAND_PALETTE.map((c) => (
                    <div
                      key={c}
                      className="h-8 w-8 rounded-md border border-[var(--stroke-card)]"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </TiltCard>
            <div className="grid grid-cols-2 gap-3">
              {BRAND_MOODS.map((m, i) => (
                <TiltCard
                  key={m}
                  className="flex items-end p-5"
                  style={{
                    background: `linear-gradient(${135 + i * 12}deg, rgba(249,115,22,0.06), rgba(232,181,99,${0.03 + (i % 3) * 0.02}))`,
                  }}
                >
                  <div>
                    <span className="meta accent text-[0.55rem]">mood / {String(i + 1).padStart(2, "0")}</span>
                    <p className="display mt-1 text-[1.05rem]">{m}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* variant 4: magazine cover — serif display headline, logo top-right, palette strip bottom */}
      {v === 4 && (
        <Reveal delay={0.1}>
          <TiltCard className="mt-12 overflow-hidden">
            <div
              className="relative flex min-h-[520px] flex-col justify-between p-10 sm:p-16"
              style={{
                background:
                  "radial-gradient(120% 80% at 20% 0%, rgba(232,181,99,0.16), transparent 50%), radial-gradient(120% 80% at 80% 100%, rgba(249,115,22,0.10), transparent 55%)",
              }}
            >
              <div className="flex items-start justify-between">
                <span className="meta text-faint text-[0.62rem]">ISSUE 01 · BRAND BOOK</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[140px] sm:w-[180px] opacity-90" />
              </div>
              <h3
                className="display max-w-3xl text-[2.6rem] leading-[1.02] sm:text-[4.2rem]"
                style={{ fontFamily: "var(--highlight-font, inherit)" }}
              >
                A sanctuary you wouldn’t expect from a villa on the surface.
              </h3>
              <div className="flex items-end justify-between gap-6">
                <p className="text-dim max-w-md text-[0.95rem] leading-relaxed">
                  Lifestyle first. The mood is twilight, brushed gold and cognac leather. Never the
                  word that begins with B.
                </p>
                <div className="flex gap-2.5">
                  {BRAND_PALETTE.map((c) => (
                    <div
                      key={c}
                      className="h-12 w-7 border border-[var(--stroke-card)]"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      )}

      {/* variant 5: swatch-bands — full-width palette stripes, logo floating in middle */}
      {v === 5 && (
        <Reveal delay={0.1}>
          <div className="relative mt-12 overflow-hidden rounded-[var(--r-card)] border border-[var(--stroke-card)]">
            <div className="flex h-[420px] w-full">
              {BRAND_PALETTE.map((c, i) => (
                <div
                  key={c}
                  className="group relative flex-1 transition-all duration-500 hover:flex-[2]"
                  style={{ background: c }}
                >
                  <span
                    className="meta absolute bottom-3 left-3 text-[0.55rem] opacity-0 transition-opacity group-hover:opacity-90"
                    style={{ color: i < 2 ? "var(--ink-2)" : "rgba(0,0,0,0.65)" }}
                  >
                    {c}
                  </span>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="card glow-border p-7 sm:p-9" style={{ background: "rgba(8,7,5,0.55)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[240px] sm:w-[320px]" />
                <p className="meta accent mt-3 text-center text-[0.6rem]">Discreet · Modular · Uncompromising</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5 border-t border-[var(--stroke-card)] bg-[#050507] p-5">
              {BRAND_MOODS.map((m) => (
                <span key={m} className="inner-card px-3.5 py-1.5 text-[0.78rem] text-dim">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}

/* =================================================== OFFER (no variants) */

type PriceCard = { tag: string; name: string; price: string; items: string[]; feature?: boolean };


function PriceGrid({ cards }: { cards: PriceCard[] }) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      {cards.map((p, i) => (
        <Reveal key={p.name} delay={i * 0.07}>
          <TiltCard
            className={p.feature ? "accent-glow flex h-full flex-col p-7" : "flex h-full flex-col p-7"}
            style={p.feature ? { borderColor: "var(--accent)", background: "rgba(249,115,22,0.06)" } : undefined}
          >
            <span className="meta text-faint text-[0.6rem]">{p.tag}</span>
            <h3 className="display mt-2 text-[1.3rem]">{p.name}</h3>
            <div className="accent-text display mt-2 text-[1.6rem]">{p.price}</div>
            <div className="hairline my-5" />
            <ul className="flex flex-1 flex-col gap-2.5">
              {p.items.map((it) => (
                <li key={it} className="text-dim flex gap-2 text-[0.9rem]">
                  <span className="accent">—</span>
                  {it}
                </li>
              ))}
            </ul>
          </TiltCard>
        </Reveal>
      ))}
    </div>
  );
}

export function Offer() {
  const [tab, setTab] = useState(0);
  const co = useOffer().content.offer;
  const active = co.tabs[tab]!;
  return (
    <section id="offer" className="section">
      <SectionHead
        eyebrow={co.eyebrow}
        title={
          <>
            {co.title} <span className="accent-text">{co.titleAccent}</span>
          </>
        }
        sub={co.sub}
      />
      {/* tabs */}
      <Reveal>
        <div className="mt-9 inline-flex flex-wrap gap-1.5 rounded-full p-1.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--stroke-card)" }}>
          {co.tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className="rounded-full px-4 py-2 text-[0.82rem] font-medium transition"
              style={{
                color: i === tab ? "#1a0f04" : "var(--ink-2)",
                background: i === tab ? "linear-gradient(180deg, var(--accent-bright), var(--accent))" : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-dim mt-4 text-[0.95rem]">{active.note}</p>
      </Reveal>
      <PriceGrid cards={active.cards} />
    </section>
  );
}

/* =================================================== CONTACT */

export function Contact() {
  const cx = useOffer().content.contact;
  return (
    <section className="section text-center">
      <Reveal>
        <p className="eyebrow mb-4">{cx.eyebrow}</p>
        <h2 className="display mx-auto max-w-2xl text-[2.2rem] sm:text-[3rem]">
          {cx.headline} <span className="accent-text">{cx.headlineAccent}</span>
        </h2>
        <p className="text-dim mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed">
          {cx.sub}
        </p>

        {/* who's behind it */}
        <div className="card mx-auto mt-12 flex max-w-md items-center gap-5 p-5 text-left">
          <div
            className="h-20 w-16 shrink-0 overflow-hidden rounded-xl"
            style={{ background: "linear-gradient(160deg, rgba(249,115,22,0.18), rgba(255,255,255,0.04))" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/samy.png"
              alt="Samuel Heymig"
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div>
            <div className="display text-[1.05rem]">Samuel Heymig</div>
            <div className="meta accent mt-0.5 text-[0.58rem]">ZamboDezigns · Stuttgart</div>
            <p className="text-dim mt-1.5 text-[0.85rem] leading-snug">
              Clean web design, optimized shops, and striking 3D &amp; motion work.
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="#" className="btn btn-primary">
            Book a private consultation
          </a>
        </div>
        <p className="meta text-faint mt-16 text-[0.62rem]">
          ZamboDezigns · Samuel Heymig · Stuttgart, Germany
        </p>
      </Reveal>
    </section>
  );
}
