"use client";

import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";
import { capabilities, cases } from "@/lib/data";

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
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

/* -------------------------------------------------- the angle */
export function Angle() {
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
    </section>
  );
}

/* -------------------------------------------------- capabilities */
export function Capabilities() {
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
    </section>
  );
}

/* -------------------------------------------------- selected work */
export function Work() {
  return (
    <section id="work" className="section">
      <SectionHead
        eyebrow="Selected work"
        title={
          <>
            Proof, <span className="accent-text">not promises.</span>
          </>
        }
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {cases.map((c, i) => (
          <Reveal key={c.name} delay={(i % 2) * 0.1}>
            <TiltCard className="group flex h-full flex-col overflow-hidden">
              <div
                className="relative h-52 w-full overflow-hidden"
                style={{
                  borderTopLeftRadius: "inherit",
                  borderTopRightRadius: "inherit",
                  background:
                    "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(5,5,7,0.6))",
                }}
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
                <p className="meta text-faint mt-4 text-[0.6rem]">{c.stack}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------- brand teaser */
export function BrandTeaser() {
  const moods = [
    "Cognac leather",
    "Dark walnut",
    "Twilight & warm light",
    "Brushed gold",
    "Villa, never isolated",
    "Discreet, never loud",
  ];
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
      <Reveal delay={0.1}>
        <TiltCard className="mt-12 p-8 sm:p-12">
          <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="gold-text display text-[3.4rem] sm:text-[4.6rem]">
                GROUND<span className="ml-3 font-light">X</span>
              </div>
              <p className="meta text-dim mt-4 text-[0.72rem]">
                Discreet. Modular. Uncompromising.
              </p>
              <div className="mt-6 flex gap-3">
                {["#0a0907", "#1a1714", "#8a5a1c", "#c8862e", "#e8b563"].map((c) => (
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
    </section>
  );
}

/* -------------------------------------------------- the offer */
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

/* -------------------------------------------------- contact */
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
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="#" className="btn btn-primary">
            Book a private consultation
          </a>
        </div>
        <p className="meta text-faint mt-16 text-[0.62rem]">
          Sambo Design · Samuel Heymig · Böblingen, Germany
        </p>
      </Reveal>
    </section>
  );
}
