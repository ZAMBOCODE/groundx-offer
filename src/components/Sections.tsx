"use client";

import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";
import { capabilities, cases, type CaseStudy } from "@/lib/data";
import { useDesign } from "./design-context";
import { StickyWork } from "./StickyWork";
import { WorkShowcase } from "./WorkShowcase";

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
      <h2 className="display max-w-2xl text-[2rem] sm:text-[2.8rem]">{title}</h2>
      {sub && <p className="text-dim mt-5 max-w-2xl text-[1.05rem] leading-relaxed">{sub}</p>}
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

/* ==================================================== ANGLE (2 variants) */

export function Angle() {
  const { variants } = useDesign();
  const points = [
    { k: "Dubai", v: "I already build for the GCC market and its buyers." },
    { k: "Luxury + security", v: "Gulf Rescue, Löwenhardt — the exact tone Ground X needs." },
    { k: "Containers", v: "I have shipped a 3D container configurator already." },
    { k: "Systems", v: "AETHER and zZzlim prove I run marketing as a system." },
  ];
  return (
    <section className="section">
      <SectionHead
        eyebrow="Why me, for this"
        title={
          <>
            Not a generalist. Someone who has already built{" "}
            <span className="accent-text">your exact world.</span>
          </>
        }
        sub="Ground X needs Dubai fluency, a luxury-security tone, container know-how and a systems mindset. Those four overlap with work I have already delivered."
      />

      {variants.angle === 0 ? (
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
      ) : (
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
    </section>
  );
}

/* ============================================ CAPABILITIES (3 variants) */

export function Capabilities() {
  const { variants } = useDesign();
  const v = variants.capabilities;
  return (
    <section id="capabilities" className="section">
      <SectionHead
        eyebrow="What I can do"
        title={
          <>
            The full stack of a <span className="accent-text">marketing department</span>, in one person.
          </>
        }
        sub="Each of these is something I have built and shipped, not a service line on a page."
      />

      {/* variant 0: even 3-col cards */}
      {v === 0 && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
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
          {capabilities.map((c, i) => {
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
          {capabilities.map((c, i) => (
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
    </section>
  );
}

/* ============================================== WORK (3 variants) */

export function Work() {
  const { variants } = useDesign();
  const v = variants.work;
  const head = (
    <SectionHead
      eyebrow="Selected work"
      title={
        <>
          Proof, <span className="accent-text">not promises.</span>
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
                <CaseImage c={c} className="h-52 w-full" />
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
    </section>
  );
}

/* =========================================== BRAND TEASER (2 variants) */

export function BrandTeaser() {
  const { variants } = useDesign();
  const moods = [
    "Cognac leather",
    "Dark walnut",
    "Twilight & warm light",
    "Brushed gold",
    "Villa, never isolated",
    "Discreet, never loud",
  ];
  const palette = ["#0a0907", "#1a1714", "#8a5a1c", "#c8862e", "#e8b563"];
  return (
    <section className="section">
      <SectionHead
        eyebrow="Brand direction"
        title={
          <>
            How Ground X could <span className="accent-text">feel.</span>
          </>
        }
        sub="A first taste of the visual language: a gentleman's-club world, not a survival product. Final brand locks once your assets land."
      />

      {variants.brand === 0 ? (
        <Reveal delay={0.1}>
          <TiltCard className="mt-12 p-8 sm:p-12">
            <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[280px] sm:w-[340px]" />
                <p className="meta text-dim mt-5 text-[0.72rem]">Discreet. Modular. Uncompromising.</p>
                <div className="mt-6 flex gap-3">
                  {palette.map((c) => (
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
                {moods.map((m) => (
                  <div key={m} className="inner-card px-4 py-3 text-[0.85rem] text-dim">
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </Reveal>
      ) : (
        <Reveal delay={0.1}>
          <TiltCard className="mt-12 flex flex-col items-center p-10 text-center sm:p-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[300px] sm:w-[440px]" />
            <p className="meta text-dim mt-4 text-[0.78rem]">Discreet. Modular. Uncompromising.</p>
            <div className="mt-7 flex gap-3">
              {palette.map((c) => (
                <div
                  key={c}
                  className="h-10 w-10 rounded-full border border-[var(--stroke-card)]"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {moods.map((m) => (
                <span key={m} className="inner-card px-4 py-2 text-[0.82rem] text-dim">
                  {m}
                </span>
              ))}
            </div>
          </TiltCard>
        </Reveal>
      )}
    </section>
  );
}

/* =================================================== OFFER (no variants) */

export function Offer() {
  const phases = [
    {
      tag: "Phase 1 · one-time",
      name: "Setup & foundation",
      price: "from €3,500",
      items: [
        "Brand guidelines finalized",
        "10–15 photoreal AI renderings",
        "Landing page, deployed",
        "2–3 marketing videos",
        "Social template set",
        "Drive + content calendar",
      ],
      feature: false,
    },
    {
      tag: "Phase 2 · monthly",
      name: "Ongoing partnership",
      price: "from €1,500 / mo",
      items: [
        "15–20 social posts",
        "4–6 AI videos",
        "3–5 new renderings",
        "Content calendar & scheduling",
        "Paid-ads management",
        "Monthly analytics & optimization",
      ],
      feature: true,
    },
    {
      tag: "Soft start · optional",
      name: "Test month",
      price: "€1,500 flat",
      items: [
        "One month, full output",
        "No long commitment",
        "Rolls into the retainer",
        "De-risks the decision",
      ],
      feature: false,
    },
  ];
  return (
    <section id="offer" className="section">
      <SectionHead
        eyebrow="The offer"
        title={
          <>
            A setup that lasts, then a <span className="accent-text">system that runs.</span>
          </>
        }
        sub="For context: Dubai agencies charge $3,000–8,000/mo for this scope, and Ground X sells from $50,000 a module."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {phases.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <TiltCard
              className={p.feature ? "accent-glow flex h-full flex-col p-7" : "flex h-full flex-col p-7"}
              style={
                p.feature
                  ? { borderColor: "var(--accent)", background: "rgba(249,115,22,0.06)" }
                  : undefined
              }
            >
              <span className="meta text-faint text-[0.6rem]">{p.tag}</span>
              <h3 className="display mt-2 text-[1.3rem]">{p.name}</h3>
              <div className="accent-text display mt-2 text-[1.7rem]">{p.price}</div>
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
      <Reveal delay={0.1}>
        <p className="text-faint mt-6 text-center text-[0.82rem]">
          Extensions on request: full website (€2–3k) · Shopify rebuild (€1.5–2.5k) · 3D
          configurator (€2–4k) · Arabic + RTL (€0.5–1k) · analytics dashboard (€1–2k)
        </p>
      </Reveal>
    </section>
  );
}

/* =================================================== CONTACT */

export function Contact() {
  return (
    <section className="section text-center">
      <Reveal>
        <p className="eyebrow mb-4">Next step</p>
        <h2 className="display mx-auto max-w-2xl text-[2.2rem] sm:text-[3rem]">
          Let&apos;s build the first <span className="accent-text">renderings.</span>
        </h2>
        <p className="text-dim mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed">
          Samples land first, the offer right behind. Take it to the table with your
          team, and we start.
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
