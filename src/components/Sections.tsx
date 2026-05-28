"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate, useMotionValue, useScroll, useTransform } from "motion/react";
import { TiltCard } from "./TiltCard";
import { cases, type CaseStudy } from "@/lib/data";
import { useDesign } from "./design-context";
import { useOffer } from "./OfferProvider";
import { useLang } from "./language-context";
import { StickyWork } from "./StickyWork";
import { WorkShowcase } from "./WorkShowcase";
import { MockupShowcase } from "./MockupShowcase";
import { MagazineSpread } from "./MagazineSpread";
import { IsometricScrollStack } from "./IsometricScrollStack";
import { usePdfMode } from "@/lib/pdfMode";
import {
  PenLine, Film, Tag, Code2, Monitor, LayoutTemplate, Palette,
  Sparkles, Box, Video, Presentation, LayoutDashboard, MessageCircle, Workflow,
  Image as ImageIcon, Repeat, ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { iconFor as brandIconFor } from "./BrandIcons";

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
  centered,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  /** Samy 2026-05-27: FAQ + ggf. weitere Sections mittig zentriert. */
  centered?: boolean;
}) {
  return (
    <Reveal>
      <div className={centered ? "mx-auto text-center" : undefined}>
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2
          className={`display text-[2.4rem] sm:text-[3.3rem] ${centered ? "mx-auto max-w-3xl" : "max-w-3xl"}`}
        >
          {title}
        </h2>
        {sub && (
          <p
            className={`text-dim mt-5 text-[1.12rem] leading-relaxed ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
          >
            {sub}
          </p>
        )}
      </div>
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

/* ==================================================== ABOUT (6 variants) */

type AboutStrings = {
  eyebrow: string;
  name: string;
  tagline: string;
  bio: string;
  proof: string;
  skills: readonly string[];
  statProjects: string;
  statDisciplines: string;
  statYears: string;
  whatIShip: string;
};

const ABOUT_STRINGS: { en: AboutStrings; de: AboutStrings } = {
  en: {
    eyebrow: "Who you're working with",
    name: "Samuel Heymig",
    tagline: "one person, full stack.",
    bio: "A freelancer from Stuttgart helping businesses grow with clean web design, optimized shops, and striking 3D and motion work. I build the whole system: brand, visuals, site, content and the automation behind it.",
    proof: "50+ projects · 8 disciplines in one head · 10+ years",
    skills: [
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
    ],
    statProjects: "Projects shipped",
    statDisciplines: "Disciplines in one head",
    statYears: "Years building",
    whatIShip: "— WHAT I SHIP",
  },
  de: {
    eyebrow: "Mit wem ihr arbeitet",
    name: "Samuel Heymig",
    tagline: "eine Person, voller Stack.",
    bio: "Freelancer aus Stuttgart, der Unternehmen mit klarem Webdesign, optimierten Shops und prägnanter 3D- und Motion-Arbeit wachsen lässt. Ich baue das ganze System: Marke, Visuals, Site, Content und die Automatisierung dahinter.",
    proof: "50+ Projekte · 8 Disziplinen in einem Kopf · 10+ Jahre",
    skills: [
      "Webdesign & Entwicklung",
      "E-Commerce & Checkout",
      "3D-Modeling & Rendering",
      "Motion Design & Animation",
      "KI-Video-Generierung",
      "KI-Bilder / Renderings",
      "Branding & Identity",
      "Landingpages & Copywriting",
      "Dashboards & interne Tools",
      "Automatisierung & KI-Agents",
    ],
    statProjects: "Ausgelieferte Projekte",
    statDisciplines: "Disziplinen in einem Kopf",
    statYears: "Jahre am Bauen",
    whatIShip: "— WAS ICH AUSLIEFERE",
  },
} as const;

function useAboutStrings(): AboutStrings {
  const { lang } = useLang();
  return ABOUT_STRINGS[lang === "de" ? "de" : "en"];
}

/** Tiny lang-aware string picker used by inline labels across sections.
 *  Usage: const t = useT(); t("EN text", "DE-Text"). */
function useT(): (en: string, de: string) => string {
  const { lang } = useLang();
  return (en, de) => (lang === "de" ? de : en);
}

/* Auto-scrolling services marquee for About v4. Pills with Lucide icons,
   edge-faded to black left+right, hover lifts icon + accent color.
   Labels are lang-aware via useServiceLabels. */
const ABOUT_SERVICE_ITEMS: { icon: LucideIcon; en: string; de: string }[] = [
  { icon: PenLine, en: "Copywriting", de: "Copywriting" },
  { icon: Film, en: "Motion Graphics", de: "Motion Graphics" },
  { icon: Tag, en: "Product Pages", de: "Produkt-Seiten" },
  { icon: Code2, en: "Web Development", de: "Web-Entwicklung" },
  { icon: Monitor, en: "Web Design", de: "Webdesign" },
  { icon: LayoutTemplate, en: "Landing Pages", de: "Landingpages" },
  { icon: Palette, en: "Branding", de: "Branding" },
  { icon: Sparkles, en: "AI Renderings", de: "KI-Renderings" },
  { icon: Box, en: "3D Configurators", de: "3D-Konfiguratoren" },
  { icon: Video, en: "AI Video", de: "KI-Video" },
  { icon: Presentation, en: "Pitch Decks", de: "Pitch-Decks" },
  { icon: LayoutDashboard, en: "Dashboards", de: "Dashboards" },
  { icon: MessageCircle, en: "Social Automation", de: "Social-Automatisierung" },
  { icon: Workflow, en: "Workflow Engineering", de: "Workflow-Engineering" },
];

function ServicesMarquee() {
  const { lang } = useLang();
  const items = ABOUT_SERVICE_ITEMS.map(({ icon, en, de }) => ({
    icon,
    label: lang === "de" ? de : en,
  }));
  const track = [...items, ...items];
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-3 py-1"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 42, ease: "linear", repeat: Infinity }}
      >
        {track.map(({ icon: Icon, label }, i) => (
          <div
            key={i}
            className="group flex items-center gap-2.5 rounded-full border border-[var(--stroke-card)] px-5 py-3 backdrop-blur-sm transition-colors hover:border-[var(--accent)]"
            style={{ background: "rgba(8,7,5,0.55)" }}
          >
            <Icon
              size={16}
              strokeWidth={2}
              className="transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[8deg]"
              style={{ color: "var(--ink-2)" }}
            />
            <span
              className="text-[0.85rem] transition-colors duration-300"
              style={{ color: "var(--ink-2)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function About() {
  const { variants } = useDesign();
  const v = variants.about;
  const a = useAboutStrings();
  return (
    <section id="about" className="section">
      <Reveal>
        <p className="eyebrow mb-4">{a.eyebrow}</p>
      </Reveal>

      {/* variant 0: image-left, skills right (default) */}
      {v === 0 && (
        <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <SamyPhoto />
          </Reveal>
          <Reveal delay={0.1}>
            <AboutCopy />
          </Reveal>
        </div>
      )}

      {/* variant 1: image-right mirror */}
      {v === 1 && (
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <AboutCopy />
          </Reveal>
          <Reveal delay={0.1}>
            <SamyPhoto />
          </Reveal>
        </div>
      )}

      {/* variant 2: photo full-bleed with text overlay bottom */}
      {v === 2 && (
        <Reveal>
          <div
            className="relative mx-auto mt-4 w-full max-w-5xl overflow-hidden rounded-[var(--r-hero)] border border-[var(--stroke-card)]"
            style={{ aspectRatio: "16 / 9" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/samy.png"
              alt="Samuel Heymig"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, transparent 30%, rgba(5,5,7,0.92) 92%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
              <h2 className="display text-[1.8rem] sm:text-[2.6rem]">
                {a.name} — <span className="accent-text">{a.tagline}</span>
              </h2>
              <p className="text-dim mt-3 max-w-2xl text-[0.95rem] leading-relaxed">{a.bio}</p>
              <p className="meta text-faint mt-4 text-[0.6rem]">{a.proof}</p>
            </div>
          </div>
        </Reveal>
      )}

      {/* variant 3: avatar centered, name + bio + inline skill list */}
      {v === 3 && (
        <Reveal>
          <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center text-center">
            <div
              className="card glow-border h-32 w-32 overflow-hidden"
              style={{ borderRadius: "50%" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/samy.png" alt="Samuel Heymig" className="h-full w-full object-cover object-top" />
            </div>
            <h2 className="display mt-6 text-[1.8rem] sm:text-[2.4rem]">
              {a.name} — <span className="accent-text">{a.tagline}</span>
            </h2>
            <p className="text-dim mt-4 max-w-xl text-[1rem] leading-relaxed">{a.bio}</p>
            <p className="text-dim mt-6 max-w-2xl text-[0.85rem] leading-relaxed">
              {a.skills.map((s, i) => (
                <span key={s}>
                  <span className="text-white">{s}</span>
                  {i < a.skills.length - 1 && <span className="accent">  ·  </span>}
                </span>
              ))}
            </p>
            <p className="meta text-faint mt-6 text-[0.6rem]">{a.proof}</p>
          </div>
        </Reveal>
      )}

      {/* variant 4: split — photo on transparent bg + stat numbers + auto-marquee.
         Samy 2026-05-25: photo no card-bg (image-2 reference, fades into black),
         "96% satisfaction" replaced with honest stat, services carousel below. */}
      {v === 4 && (
        <>
          <div className="grid items-stretch gap-6 md:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <SamyPhoto transparent />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-between">
                <h2 className="display text-[1.9rem] sm:text-[2.6rem]">
                  {a.name} — <span className="accent-text">{a.tagline}</span>
                </h2>
                <p className="text-dim mt-5 text-[1rem] leading-relaxed">{a.bio}</p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { n: "50+", l: a.statProjects },
                    { n: "8", l: a.statDisciplines },
                    { n: "10+", l: a.statYears },
                  ].map((s) => (
                    <TiltCard key={s.l} className="flex flex-col items-start p-5">
                      <div className="display-light accent text-[2.2rem]">{s.n}</div>
                      <div className="meta text-faint mt-1 text-[0.58rem]">{s.l}</div>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="mt-12">
              <p className="meta text-faint mb-3 text-[0.55rem] tracking-[0.4em]">
                {a.whatIShip}
              </p>
              <ServicesMarquee />
            </div>
          </Reveal>
        </>
      )}

      {/* variant 5: minimal — just name + bio, no photo */}
      {v === 5 && (
        <Reveal>
          <div className="mx-auto mt-6 max-w-3xl">
            <h2 className="display text-[2.4rem] leading-[1.05] sm:text-[3.6rem]">
              {a.name}. <span className="accent-text">{a.tagline}</span>
            </h2>
            <p className="text-dim mt-6 text-[1.1rem] leading-relaxed">{a.bio}</p>
            <p className="meta text-faint mt-6 text-[0.6rem]">{a.proof}</p>
          </div>
        </Reveal>
      )}
    </section>
  );
}

function SamyPhoto({ transparent = false }: { transparent?: boolean } = {}) {
  if (transparent) {
    // No card chrome, no gradient bg — photo sits directly on the section's
    // black background with a soft radial edge-fade so the silhouette blends.
    return (
      <div
        className="relative mx-auto w-full max-w-[420px]"
        style={{ aspectRatio: "4 / 5" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/samy.png"
          alt="Samuel Heymig"
          className="absolute inset-0 h-full w-full object-cover object-top"
          style={{
            maskImage:
              "radial-gradient(ellipse 75% 80% at 55% 45%, black 55%, transparent 95%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 80% at 55% 45%, black 55%, transparent 95%)",
          }}
        />
      </div>
    );
  }
  return (
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
  );
}

/* Big stencil number that smoothly counts 0 → target when scrolled into
   view. Used by Angle v4. PDF export sees the final value because the
   animation completes well before the Playwright snapshot. */
function CountUpNumeral({ target }: { target: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, target, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, target]);

  return (
    <div
      ref={ref}
      className="display select-none text-[6rem] leading-none tabular-nums md:text-[10rem]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 0 60px rgba(249,115,22,0.12)",
      }}
    >
      {String(n).padStart(2, "0")}
    </div>
  );
}

function AboutCopy() {
  const a = useAboutStrings();
  return (
    <>
      <h2 className="display text-[2rem] sm:text-[2.8rem]">
        {a.name} — <span className="accent-text">{a.tagline}</span>
      </h2>
      <p className="text-dim mt-5 max-w-xl text-[1.05rem] leading-relaxed">{a.bio}</p>
      <div className="mt-7 flex flex-wrap gap-2">
        {a.skills.map((s) => (
          <span key={s} className="inner-card px-3 py-1.5 text-[0.82rem] text-dim">
            {s}
          </span>
        ))}
      </div>
      <p className="meta text-faint mt-6 text-[0.6rem]">{a.proof}</p>
    </>
  );
}

/* ==================================================== ANGLE (6 variants) */

export function Angle() {
  const { variants } = useDesign();
  const c = useOffer().content.angle;
  const points = c.points;
  const v = variants.angle;

  // V5 (variant 4) = Sticky-Counter. Header sitzt INSIDE the sticky
  // frame so both fit in one 100vh viewport (Samy 2026-05-26 screenshot:
  // header + counter passten vorher nicht zusammen in 100vh).
  if (v === 4) {
    return (
      <section id="angle" className="section" data-scroll-driven>
        <AngleStickyCounter
          eyebrow={c.eyebrow}
          title={c.title}
          titleAccent={c.titleAccent}
          sub={c.sub}
          points={points}
        />
      </section>
    );
  }

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

/* variant 4 helper — sticky scroll counter (Samy 2026-05-26).
 * As the section scrolls past, the counter on the left stays pinned and
 * cycles 01 → 02 → 03 → 04 by translating its number-track upward. The
 * right side shows the K + V of the active point, with a smooth fade.
 * Bigger numbers stay readable; the counter is the focal anchor.
 */
function AngleStickyCounter({
  eyebrow,
  title,
  titleAccent,
  sub,
  points,
}: {
  eyebrow: string;
  title: string;
  titleAccent: string;
  sub?: string;
  points: { k: string; v: string }[];
}) {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const total = Math.max(points.length, 1);
  const pdf = usePdfMode();

  // (total) viewports of scroll is the snap rhythm: each step lands the
  // next digit + content. 110vh per step ≈ one section-snap-stop per
  // digit, plus 20vh tail so the last digit reads before leaving.
  const outerVh = pdf ? total * 100 : Math.max(total, 2) * 110 + 20;

  if (pdf) {
    return (
      <div className="mt-12 flex flex-col gap-8">
        <div>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="display max-w-3xl text-[2.4rem] sm:text-[3.3rem]">
            {title} <span className="accent-text">{titleAccent}</span>
          </h2>
          {sub && <p className="text-dim mt-5 max-w-2xl text-[1.12rem] leading-relaxed">{sub}</p>}
        </div>
        {points.map((p, i) => (
          <div key={p.k} className="grid grid-cols-[auto_1fr] items-baseline gap-8">
            <span className="display-light accent text-[6rem] leading-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="display text-[1.6rem]">{p.k}</h3>
              <p className="text-dim mt-3 text-[1rem] leading-relaxed">{p.v}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Sliding counter track. CHAR_H = slot height per digit. Snap-hold:
  // digit i sits stable during first 40 % of its window, transitions
  // sharply over 40–60 %, then digit i+1 sits stable from 60 % on.
  // 200px slot keeps the digit visually self-contained without needing
  // aggressive fades that crop it (Samy 2026-05-26: digit was cut at
  // top + bottom by the 40 % fades).
  const CHAR_H = 200;
  const trackY = useTransform(scrollYProgress, (p) => {
    const raw = p * (total - 1);
    const idx = Math.floor(raw);
    const frac = raw - idx;
    const snapped =
      frac < 0.4 ? 0 : frac > 0.6 ? 1 : (frac - 0.4) / 0.2;
    return -(idx + snapped) * CHAR_H;
  });
  const activeIdx = useTransform(scrollYProgress, (p) =>
    Math.round(p * (total - 1)),
  );

  return (
    <div ref={outer} className="relative" style={{ height: `${outerVh}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col">
        {/* HEAD (kept inside the sticky frame so head + counter share
           one 100vh viewport) */}
        <div className="pt-16 sm:pt-20">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="display max-w-3xl text-[2rem] leading-[1.05] sm:text-[2.6rem]">
            {title} <span className="accent-text">{titleAccent}</span>
          </h2>
          {sub && (
            <p className="text-dim mt-4 max-w-xl text-[0.95rem] leading-relaxed sm:text-[1.02rem]">
              {sub}
            </p>
          )}
        </div>

        {/* COUNTER + CONTENT row, vertically centered in the remaining
           viewport space below the head */}
        <div className="flex flex-1 items-center">
          <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8 sm:gap-14">
            <div
              className="relative overflow-hidden"
              style={{ height: `${CHAR_H}px`, width: "8.5rem" }}
            >
              {/* light edge-fades — enough to soften the half-digit
                 sliver during the 20 % transition, NOT enough to crop
                 the resting digit */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-10"
                style={{
                  height: "18%",
                  background:
                    "linear-gradient(180deg, #050507 0%, transparent 100%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
                style={{
                  height: "18%",
                  background:
                    "linear-gradient(0deg, #050507 0%, transparent 100%)",
                }}
              />
              <motion.div
                className="flex flex-col items-start"
                style={{ y: trackY, willChange: "transform" }}
              >
                {points.map((p, i) => (
                  <div
                    key={p.k}
                    className="display-light accent flex w-full items-center justify-center"
                    style={{
                      height: `${CHAR_H}px`,
                      fontSize: "clamp(5rem, 10vw, 8.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                ))}
              </motion.div>
            </div>

            <AnglePointPanel points={points} activeIdx={activeIdx} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnglePointPanel({
  points,
  activeIdx,
}: {
  points: { k: string; v: string }[];
  activeIdx: import("motion/react").MotionValue<number>;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const unsub = activeIdx.on("change", (v) => {
      const clamped = Math.max(0, Math.min(points.length - 1, Math.round(v)));
      setActive(clamped);
    });
    return () => unsub();
  }, [activeIdx, points.length]);
  const p = points[active] ?? points[0];
  if (!p) return null;
  return (
    <div className="relative h-[260px] sm:h-[320px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0 flex flex-col justify-center"
        >
          <h3 className="display text-[1.6rem] leading-tight sm:text-[2rem]">
            {p.k}
          </h3>
          <p className="text-dim mt-4 max-w-xl text-[0.98rem] leading-relaxed sm:text-[1.05rem]">
            {p.v}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ============================================ CAPABILITIES (6 variants) */

export function Capabilities() {
  const { variants } = useDesign();
  const v = variants.capabilities;
  const c = useOffer().content.capabilities;
  // v3 (sticky-stack) is scroll-driven, opt out of flex centering
  const scrollDriven = v === 3;
  return (
    <section
      id="capabilities"
      className="section"
      data-scroll-driven={scrollDriven || undefined}
    >
      <SectionHead
        eyebrow={c.eyebrow}
        title={
          <>
            {c.title} <span className="accent-text">{c.titleAccent}</span>
          </>
        }
        sub={c.sub}
      />

      {/* variant 0: 3-col cards — Samy 2026-05-26: 6 Capabilities auf
         100vh sichtbar. Karten kompakt: h-28 Bild, p-4, Text-Größen
         runter damit 2×3 Grid mit Header in eine Viewport-Höhe paßt. */}
      {v === 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((c, i) => {
            const img = CAPABILITY_IMAGE[c.title];
            return (
              <Reveal key={c.title} delay={(i % 3) * 0.07}>
                <div className="card glow-border flex h-full flex-col overflow-hidden p-0">
                  {img && (
                    <div className="relative h-28 w-full overflow-hidden sm:h-32">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={c.title}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                        style={{ background: "linear-gradient(180deg, transparent, rgba(5,5,7,0.9))" }}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="display text-[1rem] sm:text-[1.05rem]">{c.title}</h3>
                    <p className="text-dim mt-2 flex-1 text-[0.82rem] leading-snug sm:text-[0.85rem]">
                      {c.blurb}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* variant 1: bento — Samy 2026-05-26: kein Tilt, kein Proof */}
      {v === 1 && (
        <div className="mt-12 grid auto-rows-[minmax(150px,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((c, i) => {
            const big = i === 0;
            return (
              <Reveal key={c.title} delay={(i % 4) * 0.06}>
                <div
                  className={`card glow-border flex h-full flex-col p-6 ${big ? "lg:col-span-2 lg:row-span-2" : ""}`}
                >
                  <h3 className={`display ${big ? "text-[1.5rem]" : "text-[1.1rem]"}`}>{c.title}</h3>
                  <p className="text-dim mt-3 flex-1 text-[0.9rem] leading-relaxed">{c.blurb}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* variant 2: compact rows — proof entfernt */}
      {v === 2 && (
        <div className="mt-12 flex flex-col">
          {c.items.map((c, i) => (
            <Reveal key={c.title} delay={(i % 6) * 0.04}>
              <div className="grid grid-cols-1 items-center gap-2 border-t border-[var(--stroke-card)] py-5 md:grid-cols-[260px_1fr] md:gap-10">
                <h3 className="display text-[1.1rem]">{c.title}</h3>
                <p className="text-dim text-[0.9rem] leading-relaxed">{c.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 3-5 use helper sub-components for state/hooks */}
      {v === 3 && <CapabilitiesStickyStack items={c.items} />}
      {v === 4 && <CapabilitiesSplitPane items={c.items} />}
      {v === 5 && <CapabilitiesScrollSnap items={c.items} />}
    </section>
  );
}

/* variant 3 — sticky scroll-stack (Samy 2026-05-25):
   "Karten 01 bis 04 legen sich übereinander, leichter Offset, leichter
   Tilt, untere Karte fadet von unten linear in den Background, sodass
   man ahnt dass die nächste Karte kommt." Each card has its title +
   blurb + proof on the left and a project image on the right that
   fades to white on its left edge so it bleeds into the card.

   Images come from Drive Techne/My Services/ once Samy drops them in;
   meanwhile we map title → best existing /public/assets/ shot. */
/* Mockup-image per capability title. Keyed by both EN + DE titles so the
 * lookup works in either language (capabilities content swaps between
 * EN/DE via pickContent in OfferProvider). */
const CAPABILITY_IMAGE: Record<string, string> = {
  // EN titles
  "Websites — Design & Development": "/assets/gx-web-1.png",
  "Software Development": "/assets/gx-web-2.png",
  "3D & Configurators": "/assets/gx-web-3.png",
  "AI Renderings & Video": "/assets/gx-lifestyle.png",
  "Brand & Design System": "/assets/loewenhardt-logo.png",
  "Social Media & Ads": "/assets/gulfrescue-vehicle.png",
  // DE titles
  "Websites — Design & Entwicklung": "/assets/gx-web-1.png",
  "Software-Entwicklung": "/assets/gx-web-2.png",
  "3D & Konfiguratoren": "/assets/gx-web-3.png",
  "KI-Renderings & Video": "/assets/gx-lifestyle.png",
  "Branding & Design-System": "/assets/loewenhardt-logo.png",
};

function CapabilitiesStickyStack({
  items,
}: {
  items: Array<{ title: string; blurb: string; proof: string }>;
}) {
  // Show all (up to 6) capabilities — Samy 2026-05-26 reduced from 10
  // to 6 explicitly so the full list fits in the sticky stack.
  const stack = items.slice(0, 6);
  const pdf = usePdfMode();
  if (pdf) return <CapabilitiesStaticStack stack={stack} />;
  return <CapabilitiesStickyStackDynamic stack={stack} />;
}

/* Static fallback for PDF — all 4 cards rendered vertically with the
   same per-card layout (image right, copy left) but no sticky scroll. */
function CapabilitiesStaticStack({
  stack,
}: {
  stack: Array<{ title: string; blurb: string; proof: string }>;
}) {
  return (
    <div className="mt-10 flex flex-col gap-8">
      {stack.map((card, i) => {
        const Icon = brandIconFor(`${card.title} ${card.proof}`);
        return (
        <div key={card.title} className="card glow-border grid items-stretch overflow-hidden p-0 md:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-between p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="display-light accent text-[1.4rem]" style={{ letterSpacing: "-0.02em" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="meta text-faint text-[0.55rem] tracking-[0.4em]">
                / {String(stack.length).padStart(2, "0")}
              </span>
              <Icon size={18} className="ml-auto opacity-70" />
            </div>
            <div className="mt-6">
              <h3 className="display text-[1.6rem] leading-tight sm:text-[2rem]">{card.title}</h3>
              <p className="text-dim mt-4 max-w-md text-[1rem] leading-relaxed">{card.blurb}</p>
            </div>
            <div aria-hidden />
          </div>
          <div className="relative min-h-[240px] overflow-hidden bg-black">
            {CAPABILITY_IMAGE[card.title] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={CAPABILITY_IMAGE[card.title]}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
}

function CapabilitiesStickyStackDynamic({
  stack,
}: {
  stack: Array<{ title: string; blurb: string; proof: string }>;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={outer}
      className="relative mt-10"
      style={{ height: `${stack.length * 100 + 20}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          className="relative mx-auto w-full max-w-5xl"
          style={{ perspective: "1800px" }}
        >
          {stack.map((it, i) => (
            <StickyStackCard
              key={it.title}
              card={it}
              index={i}
              total={stack.length}
              progress={scrollYProgress}
              imageSrc={CAPABILITY_IMAGE[it.title]}
            />
          ))}
        </div>

        <span className="meta accent absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.55rem] tracking-[0.4em]">
          SCROLL — STACK FILLS 01 → 04
        </span>
      </div>
    </div>
  );
}

function StickyStackCard({
  card,
  index,
  total,
  progress,
  imageSrc,
}: {
  card: { title: string; blurb: string; proof: string };
  index: number;
  total: number;
  progress: import("motion/react").MotionValue<number>;
  imageSrc?: string;
}) {
  // Each card owns 1/total of the scroll. Inside its window it slides
  // from below (with tilt + scale) into its resting stacked position.
  // After its window it stays put, offset down + slightly tilted so the
  // next card lands on top of it with a tiny visible peek.
  const start = index / total;
  const end = (index + 1) / total;

  const restingY = index * 14; // stacked offset
  const restingTilt = index * 0.7; // slight rotation accent
  // Card 0 must already be in its resting position at scroll=0 so the
  // section isn't empty when the buyer lands on it. Subsequent cards
  // slide in from below during their respective scroll windows.
  const isFirst = index === 0;
  const enterY = useTransform(
    progress,
    isFirst ? [0, 0.001] : [start, end],
    isFirst ? [restingY, restingY] : [120, restingY],
  );
  const tiltZ = useTransform(
    progress,
    isFirst ? [0, 0.001] : [start, end],
    isFirst ? [restingTilt, restingTilt] : [restingTilt + 1.6, restingTilt],
  );
  const enterScale = useTransform(
    progress,
    isFirst ? [0, 0.001] : [start, end],
    isFirst ? [1, 1] : [0.96, 1],
  );
  const opacity = useTransform(
    progress,
    isFirst ? [0, 0.001] : [Math.max(0, start - 0.05), start],
    isFirst ? [1, 1] : [0, 1],
  );

  return (
    <motion.div
      className="absolute left-0 right-0 top-1/2 mx-auto -translate-y-1/2"
      style={{
        y: enterY,
        rotateZ: tiltZ,
        scale: enterScale,
        opacity,
        zIndex: 10 + index,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="card glow-border relative grid items-stretch overflow-hidden p-0 md:grid-cols-[1.05fr_1fr]"
        style={{
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55), 0 6px 20px rgba(0,0,0,0.45)",
        }}
      >
        {/* LEFT: text */}
        <div className="flex flex-col justify-between p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span
              className="display-light accent text-[1.4rem]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="meta text-faint text-[0.55rem] tracking-[0.4em]">
              / {String(total).padStart(2, "0")}
            </span>
            {(() => {
              const Icon = brandIconFor(`${card.title} ${card.proof}`);
              return <Icon size={20} className="ml-auto opacity-70" />;
            })()}
          </div>
          <div className="mt-6">
            <h3 className="display text-[1.6rem] leading-tight sm:text-[2rem]">
              {card.title}
            </h3>
            <p className="text-dim mt-4 max-w-md text-[1rem] leading-relaxed">
              {card.blurb}
            </p>
          </div>
          <div aria-hidden />
        </div>

        {/* RIGHT: image with left-edge fade to background so it bleeds in */}
        <div className="relative min-h-[260px] overflow-hidden bg-black">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={card.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 60% at 60% 40%, rgba(249,115,22,0.16), rgba(5,5,7,0.85))",
              }}
            />
          )}
          {/* left-edge fade to card background (cleanly bleeds into copy area) */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card, #0c0b09) 0%, rgba(12,11,9,0.55) 55%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </motion.div>
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
        <div className="card glow-border flex min-h-[300px] flex-col p-8">
          <div className="meta accent text-[0.62rem]">
            {String(hover + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </div>
          <h3 className="display mt-3 text-[1.8rem]">{active.title}</h3>
          <p className="text-dim mt-4 max-w-xl flex-1 text-[1.02rem] leading-relaxed">{active.blurb}</p>
        </div>
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
            <div className="card glow-border relative flex h-[360px] flex-col justify-end overflow-hidden p-10">
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
            </div>
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

/* ============================================== WORK (6 variants) */

/** Filter cases by DevPanel's project-whitelist. Empty = show all. */
function useVisibleCases() {
  const { workProjects } = useDesign();
  if (workProjects.length === 0) return cases;
  const set = new Set(workProjects);
  return cases.filter((c) => set.has(c.name));
}

export function Work() {
  const { variants } = useDesign();
  const v = variants.work;
  const c = useOffer().content.work;
  const visible = useVisibleCases();
  const t = useT();
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
        <StickyWork cases={visible} />
      </section>
    );
  }

  // variant 4 (V5 in the UI) = WorkShowcase. Curved sticky-scroll carousel
  // that cycles through ALL projects with a sticky heading. WorkShowcase
  // renders its own heading inside the sticky frame, so we skip the
  // outer SectionHead here. `.section` class added 2026-05-26 so the
  // global scroll-snap-align: start applies cleanly when carousel ends.
  if (v === 4) {
    return (
      <section id="work" className="section" data-scroll-driven>
        <WorkShowcase />
      </section>
    );
  }

  return (
    <section id="work" className="section">
      {head}

      {/* variant 0: 2-col image cards */}
      {v === 0 && (
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {visible.map((c, i) => (
            <Reveal key={c.name} delay={(i % 2) * 0.1}>
              <TiltCard className="group flex h-full flex-col overflow-hidden">
                <CaseImage c={c} className="h-64 w-full" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="display text-[1.3rem]">{c.name}</h3>
                  <p className="text-dim mt-3 text-[0.92rem] leading-relaxed">{c.what}</p>
                  <p className="accent mt-3 text-[0.88rem] italic">{c.why}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}

      {/* variant 1: alternating wide rows */}
      {v === 1 && (
        <div className="mt-12 flex flex-col gap-5">
          {visible.map((c, i) => (
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
            {visible.map((c) => (
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
          <p className="meta text-faint mt-2 text-[0.58rem]">{t("← scroll →", "← scrollen →")}</p>
        </Reveal>
      )}

      {/* variant 5: polaroid stack — overlapping tilted cards spread on hover */}
      {v === 5 && <WorkPolaroidStack cases={visible} />}
    </section>
  );
}

/* variant 5 helper — polaroid stack. Cards overlap tilted, hover spreads them. */
function WorkPolaroidStack({ cases }: { cases: CaseStudy[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const t = useT();
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
      <p className="meta text-faint mt-4 text-center text-[0.6rem]">{t("hover · spread", "hover · aufgefächert")}</p>
    </Reveal>
  );
}

/* =========================================== BRAND TEASER (6 variants) */

const BRAND_MOODS_EN = [
  "Cognac leather",
  "Dark walnut",
  "Twilight & warm light",
  "Brushed gold",
  "Villa, never isolated",
  "Discreet, never loud",
];
const BRAND_MOODS_DE = [
  "Cognac-Leder",
  "Dunkler Walnuss",
  "Twilight & warmes Licht",
  "Brushed Gold",
  "Villa, nie isoliert",
  "Diskret, nie laut",
];
function useBrandMoods(): string[] {
  const { lang } = useLang();
  return lang === "de" ? BRAND_MOODS_DE : BRAND_MOODS_EN;
}
const BRAND_PALETTE = ["#0a0907", "#1a1714", "#8a5a1c", "#c8862e", "#e8b563"];

export function BrandTeaser() {
  const { variants } = useDesign();
  const cb = useOffer().content.brand;
  const v = variants.brand;
  // Replace "Ground X" in the title with the GroundX wordmark image so
  // the section heading carries the actual client logo (Samy 2026-05-25).
  const titleWithLogo = renderTitleWithGroundXLogo(cb.title);

  // V2 (variant 1) = ScrollThrough. The sticky outer is 300vh; the
  // section head sits INSIDE the sticky frame so head + phase share
  // one 100vh viewport (Samy 2026-05-26: "alle 100vh"). Per-phase
  // snap rails so the browser lands cleanly on Palette / Mockup /
  // Stack instead of free-scrolling.
  if (v === 1) {
    return (
      <section id="brand" className="section" data-scroll-driven>
        <BrandScrollThrough
          eyebrow={cb.eyebrow}
          titleWithLogo={titleWithLogo}
          titleAccent={cb.titleAccent}
          sub={cb.sub}
        />
      </section>
    );
  }
  // v5 also scroll-driven but uses its own component layout.
  const scrollDriven = v === 5;
  return (
    <section id="brand" className="section" data-scroll-driven={scrollDriven || undefined}>
      <SectionHead
        eyebrow={cb.eyebrow}
        title={
          <>
            {titleWithLogo} <span className="accent-text">{cb.titleAccent}</span>
          </>
        }
        sub={cb.sub}
      />

      {/* ============================================================
          v0..v2 = PURE BRAND (mood / palette / typography, NO mockups)
          v3..v5 = MOCKUP-DRIVEN ("how it could feel" on real surfaces)
          ============================================================ */}

      {/* v0: Editorial Codex — broadsheet / type-foundry brandbook */}
      {v === 0 && <BrandEditorialCodex />}

      {/* v2: Type Specimen Sheet — Klim-style foundry spec page */}
      {v === 2 && <BrandTypeSpecimen />}

      {/* v3: Device Frames (browser + phone + business card) */}
      {v === 3 && <MockupShowcase />}

      {/* v4: Magazine Spread — print-style two-page editorial */}
      {v === 4 && <MagazineSpread />}

      {/* v5: Isometric Scroll Stack — sticky scroll, 3D layered mockups */}
      {v === 5 && <IsometricScrollStack />}
    </section>
  );
}

/* ---------------------------------------------------- brand sub-variants */

/* v0 — Editorial Codex.
   Broadsheet brandbook. Big wordmark headline, three editorial columns,
   palette as a printer's CMYK-style bar, no logo focal, no card chrome. */
function BrandEditorialCodex() {
  const t = useT();
  const moods = useBrandMoods();
  return (
    <Reveal delay={0.1}>
      <div className="mt-12 border-y border-[var(--stroke-card)] py-14">
        <div className="flex items-baseline justify-between border-b border-[var(--stroke-card)] pb-3">
          <span className="meta text-faint text-[0.6rem] tracking-[0.4em]">{t("VOL. 01", "BD. 01")}</span>
          <span className="meta text-faint text-[0.6rem] tracking-[0.4em]">{t("THE GROUND X CODEX", "DER GROUND-X-CODEX")}</span>
          <span className="meta text-faint text-[0.6rem] tracking-[0.4em]">DXB · 2025</span>
        </div>

        <h3
          className="display mt-10 text-[clamp(3rem,9vw,7.6rem)] leading-[0.9]"
          style={{ fontFamily: "var(--highlight-font, inherit)" }}
        >
          GROUND <span className="accent-text italic">X</span>
        </h3>
        <p className="meta text-dim mt-3 text-[0.78rem] tracking-[0.32em]">
          {t("A BRANDBOOK FOR UNDERGROUND SANCTUARIES", "EIN MARKEN-CODEX FÜR UNTERIRDISCHE REFUGEN")}
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <span className="meta accent text-[0.55rem] tracking-[0.35em]">{t("§01 — VOICE", "§01 — STIMME")}</span>
            <p className="text-dim mt-4 text-[0.92rem] leading-relaxed">
              {t(
                "Discreet. Confident. Never loud. The brand speaks the way the spaces feel: low light, slow tempo, certain of itself. Lifestyle first, engineering implied.",
                "Diskret. Souverän. Nie laut. Die Marke spricht, wie sich die Räume anfühlen: gedämpftes Licht, langsamer Takt, ihrer selbst sicher. Lifestyle zuerst, Engineering implizit.",
              )}
            </p>
          </div>
          <div>
            <span className="meta accent text-[0.55rem] tracking-[0.35em]">{t("§02 — MOOD", "§02 — STIMMUNG")}</span>
            <ul className="mt-4 grid grid-cols-1 gap-1.5">
              {moods.map((m) => (
                <li
                  key={m}
                  className="text-dim flex items-baseline gap-3 border-b border-[var(--stroke-card)] py-1.5 text-[0.92rem]"
                >
                  <span className="meta accent text-[0.55rem]">·</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta accent text-[0.55rem] tracking-[0.35em]">{t("§03 — RULE", "§03 — REGEL")}</span>
            <p
              className="display mt-4 text-[1.5rem] leading-[1.15]"
              style={{ fontFamily: "var(--highlight-font, inherit)" }}
            >
              {t("Never the word", "Nie das Wort,")}
              <br />
              {t("that begins with", "das mit")} <span className="accent-text">B</span>{t(".", " beginnt.")}
            </p>
            <p className="meta text-faint mt-3 text-[0.65rem]">
              {t(
                'No "bunker". Lifestyle, sanctuary, retreat, vault, atelier.',
                'Kein „Bunker". Lifestyle, Refugium, Rückzug, Tresor, Atelier.',
              )}
            </p>
          </div>
        </div>

        {/* printer's color bar */}
        <div className="mt-14 border-t border-[var(--stroke-card)] pt-5">
          <span className="meta text-faint text-[0.55rem] tracking-[0.4em]">
            {t("COLOR REGISTRATION", "FARBREGISTER")}
          </span>
          <div className="mt-3 flex h-10 w-full overflow-hidden">
            {BRAND_PALETTE.map((c) => (
              <div key={c} className="flex-1" style={{ background: c }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[0.62rem] text-faint">
            {BRAND_PALETTE.map((c) => (
              <span key={c}>{c.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* v1 — Cinematic Palette Wall.
   Full-bleed: five vertical palette slabs with mood words drifting over
   each, wordmark centered as an overlay, type-only typography sample,
   hover-expand. No card chrome, total immersion. */
function BrandPaletteWall({ fullscreen = false }: { fullscreen?: boolean } = {}) {
  const t = useT();
  const moods = useBrandMoods();
  const PALETTE_LABELS = [
    t("Onyx", "Onyx"),
    t("Walnut", "Walnuss"),
    t("Cognac", "Cognac"),
    t("Brushed Gold", "Brushed Gold"),
    t("Sunlit Sand", "Sonnen-Sand"),
  ];
  return (
    <Reveal delay={0.1}>
      <div
        className={`relative overflow-hidden ${fullscreen ? "h-full" : "mt-12"}`}
      >
        <div
          className={`relative flex w-full ${fullscreen ? "h-screen" : "h-[640px]"}`}
        >
          {BRAND_PALETTE.map((c, i) => (
            <div
              key={c}
              className="group relative flex-1 transition-[flex] duration-700 hover:flex-[1.8]"
              style={{ background: c }}
            >
              {/* vertical mood word, drifting up on hover */}
              <span
                className="meta absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.7rem] tracking-[0.4em] transition-all duration-700 group-hover:-translate-y-[120%] group-hover:opacity-100"
                style={{
                  writingMode: "vertical-rl",
                  transform: "translate(-50%, -50%) rotate(180deg)",
                  color: i < 2 ? "rgba(232,181,99,0.7)" : "rgba(10,9,7,0.7)",
                  opacity: 0.55,
                }}
              >
                {moods[i] ?? PALETTE_LABELS[i]}
              </span>
              {/* swatch label corner */}
              <div
                className="absolute bottom-4 left-4 transition-opacity duration-500 group-hover:opacity-100"
                style={{ color: i < 2 ? "rgba(232,181,99,0.8)" : "rgba(10,9,7,0.85)", opacity: 0.6 }}
              >
                <div className="meta text-[0.55rem] tracking-[0.3em]">{PALETTE_LABELS[i]}</div>
                <div className="meta font-mono mt-1 text-[0.6rem]">{c.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* center overlay: wordmark + tagline + type sample */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="meta text-faint mb-3 text-[0.6rem] tracking-[0.5em]" style={{ color: "rgba(255,255,255,0.55)" }}>
            {t("BRAND WORLD", "MARKEN-WELT")}
          </span>
          <h3
            className="display text-[clamp(3.5rem,10vw,7.5rem)] leading-none text-white"
            style={{
              fontFamily: "var(--highlight-font, inherit)",
              // 2026-05-27: mix-blend-mode: screen raus — das machte das Wordmark
              // auf den hellen Cognac-Spalten visuell aufgesogen und ungleich
              // gewichtet (Samy: "ist gar nicht in der Mitte"). Stattdessen
              // satter weisser Text + doppelter Glow-Halo plus subtile dunkle
              // Backplate, damit das Logo gleichmaessig pop-t.
              textShadow:
                "0 4px 32px rgba(0,0,0,0.85), 0 0 80px rgba(0,0,0,0.55)",
            }}
          >
            ground <span className="italic" style={{ color: "var(--gx-gold-hi, #e8b563)" }}>x</span>
          </h3>
          <p
            className="meta accent mt-5 text-[0.7rem] tracking-[0.45em]"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
          >
            {t("DISCREET · MODULAR · UNCOMPROMISING", "DISKRET · MODULAR · KOMPROMISSLOS")}
          </p>
        </div>

        {/* corner hint */}
        <span className="meta absolute right-4 top-4 text-[0.55rem] tracking-[0.4em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {t("HOVER — A PALETTE BREATHES", "HOVER — DIE PALETTE ATMET")}
        </span>
      </div>
    </Reveal>
  );
}

/* v2 — Type Specimen Sheet.
   Klim / Pangram-Pangram foundry-style specimen page. Type scale down the
   left, ruled palette + mood index on the right. Ruler-precise, no card. */
function BrandTypeSpecimen() {
  const t = useT();
  const moods = useBrandMoods();
  const paletteLabels = [
    t("Onyx", "Onyx"),
    t("Walnut", "Walnuss"),
    t("Cognac", "Cognac"),
    t("Brushed Gold", "Brushed Gold"),
    t("Sunlit Sand", "Sonnen-Sand"),
  ];
  return (
    <Reveal delay={0.1}>
      <div
        className="mt-12 border border-[var(--stroke-card)] p-8 sm:p-12"
        style={{ background: "linear-gradient(180deg, #08070a 0%, #050507 100%)" }}
      >
        {/* spec header */}
        <div className="flex items-baseline justify-between border-b border-[var(--stroke-card)] pb-3">
          <span className="meta text-faint text-[0.55rem] tracking-[0.4em]">{t("TYPE · SPECIMEN", "TYPO · MUSTERBOGEN")}</span>
          <span className="meta text-faint text-[0.55rem] tracking-[0.4em]">
            DISPLAY / TEXT / META
          </span>
          <span className="meta text-faint text-[0.55rem] tracking-[0.4em]">A4 · 1 / 1</span>
        </div>

        <div className="mt-10 grid gap-12 md:grid-cols-[1.6fr_1fr]">
          {/* LEFT: type scale */}
          <div className="space-y-7">
            {/* size 96 */}
            <div className="flex items-baseline gap-6 border-b border-[var(--stroke-card)] pb-5">
              <span className="meta text-faint w-16 shrink-0 font-mono text-[0.6rem]">96 · DSP</span>
              <p
                className="display text-[clamp(3.5rem,8vw,6rem)] leading-none"
                style={{ fontFamily: "var(--highlight-font, inherit)" }}
              >
                Ground <span className="accent-text italic">X</span>
              </p>
            </div>
            {/* size 56 */}
            <div className="flex items-baseline gap-6 border-b border-[var(--stroke-card)] pb-5">
              <span className="meta text-faint w-16 shrink-0 font-mono text-[0.6rem]">56 · H1</span>
              <p className="display text-[clamp(2rem,4.5vw,3.5rem)] leading-tight">
                {t("Underground. ", "Untertage. ")}<em className="accent-text">{t("Above standards.", "Über jedem Standard.")}</em>
              </p>
            </div>
            {/* size 32 */}
            <div className="flex items-baseline gap-6 border-b border-[var(--stroke-card)] pb-5">
              <span className="meta text-faint w-16 shrink-0 font-mono text-[0.6rem]">32 · H2</span>
              <p className="text-[1.5rem] leading-snug text-ink">
                {t(
                  "A villa lives on top. A sanctuary lives beneath.",
                  "Oben lebt die Villa. Unten lebt das Refugium.",
                )}
              </p>
            </div>
            {/* size 16 */}
            <div className="flex items-baseline gap-6 border-b border-[var(--stroke-card)] pb-5">
              <span className="meta text-faint w-16 shrink-0 font-mono text-[0.6rem]">16 · BDY</span>
              <p className="text-dim text-[1rem] leading-relaxed">
                {t(
                  "The brand carries a calm, twilight confidence. Cognac leather, brushed gold, dark walnut. Never the word that begins with B.",
                  "Die Marke trägt eine ruhige, dämmrige Souveränität. Cognac-Leder, Brushed Gold, dunkler Walnuss. Nie das Wort, das mit B beginnt.",
                )}
              </p>
            </div>
            {/* size 11 */}
            <div className="flex items-baseline gap-6">
              <span className="meta text-faint w-16 shrink-0 font-mono text-[0.6rem]">11 · META</span>
              <p className="meta text-faint text-[0.7rem] tracking-[0.3em]">
                {t(
                  "DXB · UNDERGROUND SANCTUARIES · DISCREET · MODULAR · UNCOMPROMISING",
                  "DXB · UNTERIRDISCHE REFUGEN · DISKRET · MODULAR · KOMPROMISSLOS",
                )}
              </p>
            </div>
          </div>

          {/* RIGHT: palette + mood */}
          <div className="space-y-10">
            <div>
              <span className="meta text-faint text-[0.55rem] tracking-[0.4em]">{t("PALETTE", "PALETTE")}</span>
              <div className="mt-4 space-y-2">
                {BRAND_PALETTE.map((c, i) => (
                  <div key={c} className="flex items-center gap-3 border-b border-[var(--stroke-card)] py-2">
                    <div
                      className="h-6 w-12 shrink-0 border border-[var(--stroke-card)]"
                      style={{ background: c }}
                    />
                    <div className="flex-1">
                      <div className="font-mono text-[0.7rem] text-ink">{c.toUpperCase()}</div>
                      <div className="meta text-faint text-[0.55rem]">
                        {paletteLabels[i]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="meta text-faint text-[0.55rem] tracking-[0.4em]">{t("MOOD INDEX", "STIMMUNGS-INDEX")}</span>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {moods.map((m, i) => (
                  <span
                    key={m}
                    className="meta border border-[var(--stroke-card)] px-2.5 py-1 text-[0.6rem] tracking-[0.15em]"
                  >
                    <span className="accent">{String(i + 1).padStart(2, "0")}</span> · {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* Inline GroundX wordmark inside a string: anywhere "Ground X" or
   "GroundX" appears, swap it for the actual logo image. Samy 2026-05-25:
   "wenn vorhanden, das Logo auch kommen" in brand-section headlines. */
function renderTitleWithGroundXLogo(title: string): React.ReactNode {
  // Match either "GroundX" or "Ground X" (case-insensitive)
  const parts = title.split(/(GroundX|Ground X)/gi);
  return parts.map((part, i) => {
    if (/^(GroundX|Ground X)$/i.test(part)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src="/assets/groundx-logo.png"
          alt="Ground X"
          className="inline-block h-[0.9em] w-auto align-baseline"
          style={{ verticalAlign: "-0.05em", marginInline: "0.18em" }}
        />
      );
    }
    return part;
  });
}

/* Brand v1 (Samy's pick) — sticky 300vh scroll-through that crossfades
   the three brand explorations in sequence:
     phase 1 (0.00 – 0.36) — Cinematic Palette Wall
     phase 2 (0.30 – 0.70) — Real Safari + iPhone mockups (cleanup card)
     phase 3 (0.64 – 1.00) — Final stacked 3D isometric mockups (no
                              merge — three cards rest in offset layered
                              positions per Samy's "alle drei in 3D-mäßig
                              gelayert sichtbar" note)
   Each phase fades in then out around its window via opacity tracks. */
type BrandScrollHeadProps = {
  eyebrow: string;
  titleWithLogo: React.ReactNode;
  titleAccent: string;
  sub?: string;
};

function BrandScrollThrough(props: BrandScrollHeadProps) {
  const pdf = usePdfMode();
  if (pdf) return <BrandScrollThroughStatic {...props} />;
  return <BrandScrollThroughDynamic {...props} />;
}

/* PDF fallback: head + all three phases vertically. */
function BrandScrollThroughStatic({ eyebrow, titleWithLogo, titleAccent, sub }: BrandScrollHeadProps) {
  return (
    <div className="mt-10 flex flex-col gap-16">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="display max-w-3xl text-[2.4rem] sm:text-[3.3rem]">
          {titleWithLogo} <span className="accent-text">{titleAccent}</span>
        </h2>
        {sub && <p className="text-dim mt-5 max-w-2xl text-[1.12rem] leading-relaxed">{sub}</p>}
      </div>
      <BrandPaletteWall />
      <MockupShowcase showBusinessCard={false} />
      <BrandFinalStack />
    </div>
  );
}

function BrandScrollThroughDynamic({ eyebrow, titleWithLogo, titleAccent, sub }: BrandScrollHeadProps) {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });

  // Non-overlapping fades + opaque bg per phase (Samy 2026-05-26
  // screenshot 15.21.41: vorherige Phasen leuchteten hinten durch).
  const p1 = useTransform(scrollYProgress, [0, 0.30, 0.34], [1, 1, 0]);
  const p2 = useTransform(scrollYProgress, [0.30, 0.34, 0.62, 0.66], [0, 1, 1, 0]);
  const p3 = useTransform(scrollYProgress, [0.62, 0.66, 1], [0, 1, 1]);

  return (
    <div ref={outer} className="relative" style={{ height: "300vh" }}>
      {/* Sticky frame: head at top, phase pinned below in flex-1.
         marginBottom: -100vh pulls the snap-rails up to start AT
         outer.top so rails span exactly outer's vertical range. */}
      <div
        className="sticky top-0 z-10 flex h-screen flex-col overflow-hidden"
        style={{ background: "#050507", marginBottom: "-100vh" }}
      >
        <div className="px-4 pt-12 sm:px-12 sm:pt-16">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="display max-w-3xl text-[1.8rem] leading-[1.05] sm:text-[2.4rem]">
            {titleWithLogo} <span className="accent-text">{titleAccent}</span>
          </h2>
          {sub && (
            <p className="text-dim mt-3 max-w-xl text-[0.92rem] leading-relaxed">
              {sub}
            </p>
          )}
        </div>

        <div className="relative flex-1">
          {/* opaque base layer for the snap moment between phases */}
          <div
            className="absolute inset-0"
            style={{ background: "#050507" }}
          />

          {/* Phase 1 — Palette Wall */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: p1, background: "#050507" }}
          >
            <div className="h-full w-full">
              <BrandPaletteWall fullscreen />
            </div>
          </motion.div>

          {/* Phase 2 — Safari + iPhone mockups */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={{ opacity: p2, background: "#050507" }}
          >
            <div className="w-full max-w-[1400px]">
              <MockupShowcase showBusinessCard={false} />
            </div>
          </motion.div>

          {/* Phase 3 — Final fanned trio */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: p3, background: "#050507" }}
          >
            <div className="w-full">
              <BrandFinalStack />
            </div>
          </motion.div>
        </div>

        <ScrollThroughDots progress={scrollYProgress} />
      </div>

      {/* Per-phase snap rails: 3 × 100vh inline blocks, scroll-snap-align
         start so the browser lands cleanly on Palette / Mockup / Stack. */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none"
          style={{ height: "100vh", scrollSnapAlign: "start" }}
        />
      ))}
    </div>
  );
}

function ScrollThroughDots({
  progress,
}: {
  progress: import("motion/react").MotionValue<number>;
}) {
  const t = useT();
  const labels = [t("Palette", "Palette"), t("Mockups", "Mockups"), t("3D Stack", "3D-Stack")];
  return (
    <div
      data-pdf-hide
      className="meta absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 text-[0.55rem] tracking-[0.35em]"
      style={{ color: "var(--ink-3)" }}
    >
      {labels.map((l, i) => (
        <ScrollThroughDot key={l} label={l} index={i} total={labels.length} progress={progress} />
      ))}
    </div>
  );
}

function ScrollThroughDot({
  label,
  index,
  total,
  progress,
}: {
  label: string;
  index: number;
  total: number;
  progress: import("motion/react").MotionValue<number>;
}) {
  const start = index / total;
  const peak = (index + 0.5) / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, peak, end], [0.35, 1, 0.35]);
  return (
    <motion.div className="flex items-center gap-1.5" style={{ opacity }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
      <span>{label.toUpperCase()}</span>
    </motion.div>
  );
}

/* Three Safari mockups arranged as a fanned trio so all three are
 * simultaneously + clearly visible. Samy 2026-05-26 screenshot showed
 * the previous 3D-stacked version collapsed visually to a single card
 * (back cards hidden behind the front one with near-identical pose).
 * Fix: flat fan — left card tilted left + scaled down, right card
 * tilted right + scaled down, middle card centered + full size.
 * Strong drop-shadow per card so each separates against the dark bg. */
function BrandFinalStack() {
  const { lang } = useLang();
  const slides = [
    {
      img: "/assets/gx-web-1.png",
      label: lang === "de" ? "Website" : "Website",
      note: "groundx.ae",
    },
    {
      img: "/assets/gx-web-2.png",
      label: lang === "de" ? "Konfigurator" : "Configurator",
      note: "groundx.ae/configure",
    },
    {
      img: "/assets/gx-web-3.png",
      label: lang === "de" ? "Owner-Dashboard" : "Owner Dashboard",
      note: "app.groundx.ae",
    },
  ];
  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[1280px]">
      {slides.map((s, i) => {
        // Fanned trio: -1 = left/back, 0 = center/front, +1 = right/back
        const offset = i - 1;
        const leftPercent = 50 + offset * 28; // center=50%, side=22% or 78%
        const tilt = offset * 7; // outer cards rotate outward
        const isCenter = offset === 0;
        const scale = isCenter ? 1 : 0.82;
        const lift = isCenter ? 0 : 36; // outer cards sit lower
        const z = isCenter ? 20 : 10;
        return (
          <div
            key={s.img}
            className="absolute top-1/2 w-[52%] max-w-[640px] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftPercent}%`,
              transform: `translate(-50%, calc(-50% + ${lift}px)) rotate(${tilt}deg) scale(${scale})`,
              transformOrigin: "center center",
              zIndex: z,
              transition: "transform 0.7s var(--ease)",
            }}
          >
            <div
              className="relative overflow-hidden rounded-[14px] border bg-black"
              style={{
                borderColor: isCenter
                  ? "rgba(232,181,99,0.18)"
                  : "var(--stroke-card)",
                boxShadow: isCenter
                  ? "0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,181,99,0.10), 0 0 60px rgba(249,115,22,0.08)"
                  : "0 30px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center gap-2 border-b border-[var(--stroke-card)] bg-[#0a0907] px-3 py-2">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
                </span>
                <span
                  className="meta ml-2 truncate text-[0.55rem]"
                  style={{
                    color: "var(--ink-3)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {s.note}
                </span>
                <span
                  className="meta ml-auto whitespace-nowrap text-[0.55rem] tracking-[0.3em]"
                  style={{ color: "var(--gx-gold-hi)" }}
                >
                  {String(i + 1).padStart(2, "0")} · {s.label.toUpperCase()}
                </span>
              </div>
              <div className="aspect-[16/10] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.label} className="h-full w-full object-cover object-top" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =================================================== OFFER (no variants) */

type PriceCard = { tag: string; name: string; price: string; items: string[]; feature?: boolean };

/* Shopify glyph — real brand mark since "ShoppingBag" loses recognition.
   Single-path simplification (currentColor) so it picks up theme accent. */
function ShopifyGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 109 124" width={size} height={size} fill="currentColor" aria-label="Shopify">
      <path d="M74.7 14.8s-1.4.4-3.7 1.1c-.4-1.3-1-2.8-1.8-4.4-2.6-5-6.4-7.7-11-7.7-.3 0-.6 0-1 .1-.1-.2-.3-.3-.4-.5C54.8 1.2 52.2.1 49.1.2 43.1.4 37.2 4.7 32.4 12.4c-3.4 5.4-6 12.2-6.7 17.5-6.9 2.1-11.7 3.6-11.8 3.7-3.5 1.1-3.6 1.2-4 4.5C9.5 40.6.1 113.5.1 113.5l78.8 13.6 34.1-8.5S75.1 14.6 74.7 14.8zm-9.6 2.4l-5.9 1.8c0-.4 0-.8-.1-1.3 0-3.2-.5-5.7-1.2-7.7 3.1.5 5.1 4.1 7.2 7.2zm-9.7 3l-12.7 3.9c1.3-4.8 3.7-9.5 6.8-12.7 1.1-1.2 2.7-2.5 4.5-3.2 1.8 3.6 2.2 8.7 1.4 12zM48 4.2c1.5 0 2.7.3 3.8 1-1.7.9-3.4 2.2-5 4-4.1 4.4-7.2 11.2-8.5 17.8L28 30.4C30.5 18.6 40.3 4.5 48 4.2z"/>
      <path d="M71 23.4S58.6 19.5 41.7 24.6c-.5.2-.4 1 0 1.7C45 30 51.2 38.3 49.7 38.3c-1.6 0-9.3-2.6-11-2.6-7.7 0-7.6 5-7.6 6.2 0 7.7 18.3 10.7 18.3 27.4 0 13.1-8.4 21.5-19.6 21.5-13.5 0-20.3-8.4-20.3-8.4l3.6-11.9s7 6 12.8 6c3.8 0 5.4-3 5.4-5.2 0-10.1-15-10.6-15-25.8 0-12.8 9.2-25.2 29.9-26.5 7.2-.5 11.1.9 11.1.9l-1.3 14.9s-7.7-2.4-11.4-2.1c-5.5.5-6.1 4-5.7 4.9.6 1.4 2.7 1.8 4.2 1.8 8.2 0 14.2-7 14.2-15.5C57.3 26.1 71 23.4 71 23.4z"/>
    </svg>
  );
}

type IconRenderer = (size: number) => React.ReactNode;
/* Match tag → icon. Lucide for generic, real Shopify glyph for "Shop". */
const TAG_ICON: Record<string, IconRenderer> = {
  Web: (s) => <Monitor size={s} strokeWidth={1.8} />,
  Shop: (s) => <ShopifyGlyph size={s} />,
  "3D": (s) => <Box size={s} strokeWidth={1.8} />,
  Deck: (s) => <Presentation size={s} strokeWidth={1.8} />,
  Setup: (s) => <Sparkles size={s} strokeWidth={1.8} />,
  Monthly: (s) => <Repeat size={s} strokeWidth={1.8} />,
  "Soft start": (s) => <Sparkles size={s} strokeWidth={1.8} />,
  Visual: (s) => <ImageIcon size={s} strokeWidth={1.8} />,
  "Web add-ons": (s) => <LayoutTemplate size={s} strokeWidth={1.8} />,
  Ongoing: (s) => <MessageCircle size={s} strokeWidth={1.8} />,
};

function PriceGrid({ cards }: { cards: PriceCard[] }) {
  // Layout adapts to card count: 3 → 3-col, 4 → 2x2 on md / 4-col on lg.
  const cols =
    cards.length === 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : "md:grid-cols-3";
  return (
    <div className={`mt-8 grid gap-5 ${cols}`}>
      {cards.map((p, i) => {
        const icon = TAG_ICON[p.tag] ?? ((s: number) => <ShoppingBag size={s} strokeWidth={1.8} />);
        return (
          <Reveal key={p.name} delay={i * 0.07}>
            <TiltCard className="flex h-full flex-col p-7">
              <div className="flex items-center justify-between">
                <span className="meta text-faint text-[0.6rem] tracking-[0.3em]">{p.tag}</span>
                <span
                  className="opacity-70 transition-opacity"
                  style={{ color: "var(--accent-bright)" }}
                >
                  {icon(22)}
                </span>
              </div>
              <h3 className="display mt-3 text-[1.3rem]">{p.name}</h3>
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
        );
      })}
    </div>
  );
}

export function Offer() {
  const { variants } = useDesign();
  const v = variants.offer;
  const co = useOffer().content.offer;
  const head = (
    <SectionHead
      eyebrow={co.eyebrow}
      title={
        <>
          {co.title} <span className="accent-text">{co.titleAccent}</span>
        </>
      }
      sub={co.sub}
    />
  );
  return (
    <section id="offer" className="section">
      {head}
      {v === 0 && <OfferTabs co={co} />}
      {v === 1 && <OfferAccordion co={co} />}
      {v === 2 && <OfferCompare co={co} />}
      {v === 3 && <OfferPhases co={co} />}
      {v === 4 && <OfferScrollStrip co={co} />}
      {v === 5 && <OfferMinimalList co={co} />}
    </section>
  );
}

type OfferShape = {
  tabs: {
    label: string;
    note: string;
    cards: PriceCard[];
  }[];
};

/* variant 0: tabs + 3-card grid (default).
   Samy 2026-05-25:
   · Tabs centered as a group; Partnership (config index 1) sits visually
     middle and is the default selection.
   · Active-tab bubble uses motion's layoutId so it slides+morphs between
     tabs with a springy width-stretch on click (Apple-style switcher).
   · tab.note (Setup once / Standalone projects / Single deliverables)
     moves UNDER the card grid, bigger, with AnimatePresence blur+fade
     on tab change. */
function OfferTabs({ co }: { co: OfferShape }) {
  // Default to the middle tab (Partnership lives at index 1 in config).
  const defaultIdx = Math.min(1, co.tabs.length - 1);
  const [tab, setTab] = useState(defaultIdx);
  const active = co.tabs[tab]!;
  return (
    <>
      <Reveal>
        <div className="mt-10 flex justify-center">
          <div
            className="relative inline-flex gap-1 rounded-full p-1.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--stroke-card)",
            }}
          >
            {co.tabs.map((t, i) => {
              const on = i === tab;
              return (
                <button
                  key={t.label}
                  onClick={() => setTab(i)}
                  className="relative z-10 rounded-full px-5 py-2 text-[0.85rem] font-medium transition-colors"
                  style={{ color: on ? "#1a0f04" : "var(--ink-2)" }}
                  aria-pressed={on}
                >
                  {/* sliding bubble — sits behind only on the active tab */}
                  {on && (
                    <motion.span
                      layoutId="offer-tab-bubble"
                      className="absolute inset-0 -z-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(180deg, var(--accent-bright), var(--accent))",
                        boxShadow:
                          "0 6px 18px rgba(249,115,22,0.30), inset 0 1px 0 rgba(255,255,255,0.22)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                        mass: 0.7,
                      }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <PriceGrid cards={active.cards} />

      {/* tab note moved below the cards, larger + blur-faded on tab change */}
      <div className="mt-8 flex min-h-[42px] items-start justify-center text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active.label}
            initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(6px)" }}
            transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-dim max-w-2xl text-[1.05rem] leading-relaxed"
          >
            {active.note}
          </motion.p>
        </AnimatePresence>
      </div>
    </>
  );
}

/* variant 1: accordion — each tab as expandable group */
/* variant 1: cinematic single-card (Samy 2026-05-25: "what this includes,
   pricing as footnote"). One tab is "open" at a time; that tab fills the
   whole card with all its items merged into one editorial list. Pricing
   row sits at the bottom as a quiet footnote. Tab selector pinned top. */
function OfferAccordion({ co }: { co: OfferShape }) {
  const defaultIdx = Math.min(1, co.tabs.length - 1);
  const [openIdx, setOpenIdx] = useState(defaultIdx);
  const active = co.tabs[openIdx]!;
  // Merge all the items across the active tab's cards (each card is one
  // "phase" / "stage" inside the chosen mode of working).
  const flatItems = active.cards.flatMap((c) =>
    c.items.map((text) => ({ text, fromCard: c.name, price: c.price })),
  );

  return (
    <Reveal>
      <div className="mt-10">
        {/* tab strip — minimalist underline switch */}
        <div className="flex flex-wrap justify-center gap-6 border-b border-[var(--stroke-card)] pb-3">
          {co.tabs.map((t, i) => {
            const on = i === openIdx;
            return (
              <button
                key={t.label}
                onClick={() => setOpenIdx(i)}
                className="meta relative pb-2 text-[0.7rem] tracking-[0.3em] transition-colors"
                style={{ color: on ? "var(--accent-bright)" : "var(--ink-3)" }}
              >
                {t.label.toUpperCase()}
                {on && (
                  <motion.span
                    layoutId="offer-accordion-rail"
                    className="absolute left-0 right-0 -bottom-[10px] h-px"
                    style={{
                      background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* the cinematic card */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.label}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-10"
          >
            <TiltCard className="relative overflow-hidden p-10 sm:p-14">
              {/* big editorial line */}
              <p className="meta accent text-[0.6rem] tracking-[0.35em]">— WHAT THIS INCLUDES</p>
              <h3
                className="display mt-4 text-[2rem] leading-tight sm:text-[2.8rem]"
                style={{ fontFamily: "var(--display-font, inherit)" }}
              >
                {active.label}
                <span className="text-dim block text-[1.1rem] font-normal sm:text-[1.4rem]">
                  {active.note}
                </span>
              </h3>

              {/* merged item list, split into 2 columns on wide screens */}
              <ul className="mt-9 grid gap-x-10 gap-y-2 md:grid-cols-2">
                {flatItems.map((it, i) => (
                  <li key={`${it.text}-${i}`} className="text-dim flex items-baseline gap-3 text-[0.95rem]">
                    <span className="accent shrink-0">—</span>
                    <span>{it.text}</span>
                  </li>
                ))}
              </ul>

              {/* pricing footnote at the bottom */}
              <div className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--stroke-card)] pt-6">
                <span className="meta text-faint text-[0.55rem] tracking-[0.35em]">
                  PRICING
                </span>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  {active.cards.map((c) => (
                    <div key={c.name} className="flex items-baseline gap-2">
                      <span className="meta text-faint text-[0.58rem] tracking-[0.25em]">
                        {c.name.toUpperCase()}
                      </span>
                      <span className="accent-text display text-[1.1rem]">{c.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

/* variant 2: feature-matrix comparison (Samy 2026-05-25: "real comparison
   matrix with feature-grid + checkmarks").
   Rows = capability categories. Columns = each offer tab. Cells = ✓ /
   add-on price / dash. Footer row = starting price per tab. Tab columns
   are sortable by clicking the header (puts the chosen one on the left
   so the buyer can study it). Hover a row to highlight across the matrix. */
/* Compare-matrix is keyed by TAB-INDEX (Partnership, One-time builds,
 * À la carte) instead of by tab label — labels switch between EN/DE so
 * a string-keyed lookup would silently break in DE mode. Order matches
 * config.ts tabs order: [One-time builds, Partnership, À la carte].
 * Each `cells` tuple = [oneTime, partnership, alaCarte]. */
type CompareRow = {
  category: { en: string; de: string };
  detail: { en: string; de: string };
  cells: [string, string, string];
};
const OFFER_COMPARE_MATRIX: CompareRow[] = [
  {
    category: { en: "Brand system", de: "Marken-System" },
    detail: { en: "Guidelines, palette, type, tone", de: "Guideline, Palette, Typo, Tonalität" },
    cells: ["✓", "✓", "+700 €"],
  },
  {
    category: { en: "Website / landing", de: "Website / Landingpage" },
    detail: { en: "EN+DE, lead-capture, Vercel", de: "EN+DE, Lead-Capture, Vercel" },
    cells: ["2–3 k €", "✓", "+900 €"],
  },
  {
    category: { en: "Shopify rebuild", de: "Shopify-Rebuild" },
    detail: { en: "Premium theme, product pages", de: "Premium-Theme, Produktseiten" },
    cells: ["1,5–2,5 k €", "+1,5 k €", "—"],
  },
  {
    category: { en: "AI renderings", de: "KI-Renderings" },
    detail: { en: "Photoreal, prompt-system locked", de: "Fotoreal, Prompt-System gelockt" },
    cells: ["inkl. Landing", "10–15 Setup, 3–5 / Mo", "ab 120 €"],
  },
  {
    category: { en: "AI video / reels", de: "KI-Video / Reels" },
    detail: { en: "Cinematic walkthroughs, social", de: "Cinematische Walkthroughs, Social" },
    cells: ["—", "4–6 / Monat", "ab 250 €"],
  },
  {
    category: { en: "3D configurator", de: "3D-Konfigurator" },
    detail: { en: "R3F build-your-module", de: "R3F · Modul selbst zusammenstellen" },
    cells: ["2–4 k €", "+2–4 k €", "—"],
  },
  {
    category: { en: "Social posts", de: "Social-Posts" },
    detail: { en: "Content calendar + scheduling", de: "Content-Kalender + Scheduling" },
    cells: ["—", "15–20 / Monat", "ab 40 €"],
  },
  {
    category: { en: "Paid-ads management", de: "Paid-Ads-Management" },
    detail: { en: "Campaigns, A/B, optimization", de: "Kampagnen, A/B, Optimierung" },
    cells: ["—", "✓", "ab 350 €"],
  },
  {
    category: { en: "Analytics dashboard", de: "Analytics-Dashboard" },
    detail: { en: "Custom view, privacy-first", de: "Eigene Sicht, Privacy-first" },
    cells: ["+1–2 k €", "Monats-Report", "ab 1 k €"],
  },
  {
    category: { en: "Multilingual (DE/EN/AR)", de: "Mehrsprachig (DE/EN/AR)" },
    detail: { en: "RTL-ready Arabic optional", de: "RTL-fähig, Arabisch optional" },
    cells: ["+500 €–1 k €", "✓", "+500 €"],
  },
  {
    category: { en: "Investor pitch deck", de: "Investor-Pitch-Deck" },
    detail: { en: "Narrative + numbers + 10–15 slides", de: "Story + Zahlen + 10–15 Folien" },
    cells: ["1,5–3,5 k €", "+1,5 k €", "ab 90 € / Folie"],
  },
];

function OfferCompare({ co }: { co: OfferShape }) {
  const tabLabels = co.tabs.map((t) => t.label);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const { lang } = useLang();
  return (
    <Reveal>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full border-collapse text-left" style={{ fontSize: "0.88rem" }}>
          <thead>
            <tr>
              <th
                className="meta text-faint sticky left-0 top-0 z-10 p-3 text-[0.55rem] tracking-[0.3em]"
                style={{ background: "rgba(8,7,5,0.96)" }}
              >
                {lang === "de" ? "LEISTUNG" : "CAPABILITY"}
              </th>
              {tabLabels.map((label, i) => (
                <th
                  key={label}
                  className="meta border-b border-[var(--stroke-card)] p-3 text-center text-[0.6rem] tracking-[0.25em]"
                  style={{
                    background: "rgba(8,7,5,0.96)",
                    color: i === 1 ? "var(--accent-bright)" : "var(--ink-2)",
                  }}
                >
                  {label.toUpperCase()}
                  {i === 1 && (
                    <div className="meta accent mt-0.5 text-[0.5rem]">
                      {lang === "de" ? "— empfohlen" : "— recommended"}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OFFER_COMPARE_MATRIX.map((row, ri) => {
              const isHover = hoverRow === ri;
              const category = lang === "de" ? row.category.de : row.category.en;
              const detail = lang === "de" ? row.detail.de : row.detail.en;
              return (
                <tr
                  key={row.category.en}
                  onMouseEnter={() => setHoverRow(ri)}
                  onMouseLeave={() => setHoverRow((h) => (h === ri ? null : h))}
                  className="border-t border-[var(--stroke-card)] transition-colors"
                  style={{
                    background: isHover ? "rgba(249,115,22,0.04)" : "transparent",
                  }}
                >
                  <td className="p-3.5">
                    <div className="text-[0.9rem] text-white">{category}</div>
                    <div className="meta text-faint mt-0.5 text-[0.6rem]">{detail}</div>
                  </td>
                  {co.tabs.map((_, ci) => {
                    const cell = row.cells[ci] ?? "—";
                    const isCheck = cell === "✓";
                    const isMissing = cell === "—";
                    return (
                      <td
                        key={ci}
                        className="p-3 text-center"
                        style={{
                          color: isMissing
                            ? "var(--ink-3)"
                            : isCheck
                              ? "var(--accent-bright)"
                              : "var(--ink-2)",
                          fontSize: isCheck ? "1.05rem" : "0.78rem",
                          fontWeight: isCheck ? 700 : 500,
                          opacity: isMissing ? 0.5 : 1,
                          background: ci === 1 && !isMissing ? "rgba(249,115,22,0.04)" : undefined,
                        }}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* footer: starting price per tab */}
            <tr className="border-t-2 border-[var(--stroke-card)]">
              <td className="p-3.5">
                <div className="meta text-faint text-[0.55rem] tracking-[0.3em]">
                  {lang === "de" ? "AB" : "FROM"}
                </div>
              </td>
              {co.tabs.map((t, ci) => {
                const minPrice =
                  t.cards.find((c) =>
                    /^(from|ab)\b/i.test(c.price ?? ""),
                  )?.price ??
                  t.cards[0]?.price ??
                  "—";
                return (
                  <td
                    key={t.label}
                    className="p-3.5 text-center"
                    style={{
                      background: ci === 1 ? "rgba(249,115,22,0.06)" : undefined,
                    }}
                  >
                    <div className="accent-text display text-[1.4rem]">{minPrice}</div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

/* variant 3: phases — horizontal timeline of offer-tabs as stations */
function OfferPhases({ co }: { co: OfferShape }) {
  return (
    <div className="relative mt-14">
      <div
        className="absolute left-0 right-0 top-[14px] h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
      />
      <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${co.tabs.length}, minmax(0, 1fr))` }}>
        {co.tabs.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.06}>
            <div className="flex flex-col items-start">
              <span
                className="relative -ml-1 h-7 w-7 rounded-full border-2"
                style={{ background: "var(--accent)", borderColor: "#050507", boxShadow: "0 0 0 4px rgba(249,115,22,0.18)" }}
              />
              <div className="meta accent mt-4 text-[0.6rem]">PHASE {i + 1}</div>
              <h3 className="display mt-1 text-[1.2rem]">{t.label}</h3>
              <p className="text-dim mt-2 text-[0.85rem] leading-relaxed">{t.note}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {t.cards.map((p) => (
                  <li key={p.name} className="text-dim text-[0.78rem]">
                    <span className="accent">—</span> {p.name}{" "}
                    <span className="meta text-faint">· {p.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* variant 4: full-bleed horizontal scroll-snap pricing strip */
function OfferScrollStrip({ co }: { co: OfferShape }) {
  const flat = co.tabs.flatMap((t) => t.cards.map((c) => ({ ...c, tab: t.label })));
  return (
    <Reveal>
      <div className="mt-10 flex snap-x snap-mandatory overflow-x-auto pb-6" style={{ scrollbarWidth: "none" }}>
        {flat.map((p, i) => (
          <div key={`${p.tab}-${p.name}`} className="w-[320px] shrink-0 snap-start pr-4 last:pr-0 sm:w-[380px]">
            <TiltCard
              className={p.feature ? "accent-glow flex h-full flex-col p-7" : "flex h-full flex-col p-7"}
              style={p.feature ? { borderColor: "var(--accent)", background: "rgba(249,115,22,0.06)" } : undefined}
            >
              <span className="meta text-faint text-[0.55rem]">{p.tab}</span>
              <span className="meta accent mt-1 text-[0.6rem]">{p.tag}</span>
              <h3 className="display mt-2 text-[1.25rem]">{p.name}</h3>
              <div className="accent-text display mt-2 text-[1.6rem]">{p.price}</div>
              <div className="hairline my-5" />
              <ul className="flex flex-1 flex-col gap-2">
                {p.items.map((it) => (
                  <li key={it} className="text-dim flex gap-2 text-[0.85rem]">
                    <span className="accent">—</span>
                    {it}
                  </li>
                ))}
              </ul>
              <span className="meta text-faint mt-4 text-[0.55rem]">card {i + 1} / {flat.length}</span>
            </TiltCard>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/* variant 5: minimal list — text-only, no cards */
function OfferMinimalList({ co }: { co: OfferShape }) {
  return (
    <div className="mx-auto mt-10 max-w-3xl">
      {co.tabs.map((t, ti) => (
        <Reveal key={t.label} delay={ti * 0.05}>
          <div className="border-t border-[var(--stroke-card)] py-6 last:border-b">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="display text-[1.2rem]">{t.label}</h3>
              <span className="meta text-faint text-[0.6rem]">{t.note}</span>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {t.cards.map((p) => (
                <li key={p.name} className="grid grid-cols-[1fr_auto_auto] items-baseline gap-4 text-[0.9rem]">
                  <span className="text-white">{p.name}</span>
                  <span className="meta text-faint text-[0.62rem]">{p.tag}</span>
                  <span className="accent">{p.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* =================================================== CONTACT (6 variants) */

const SAMY_EMAIL = "sheymig98@gmail.com";

function useContactChannels() {
  const { brand } = useOffer();
  const { lang } = useLang();
  return [
    { label: "Mail", value: SAMY_EMAIL, href: `mailto:${SAMY_EMAIL}` },
    { label: "Web", value: "zambodezigns.com", href: "https://zambodezigns.com" },
    {
      label: "Calendly",
      value: lang === "de"
        ? "Privates Beratungsgespräch · 30 Min"
        : "private consultation · 30 min",
      href: brand.calendly ?? `mailto:${SAMY_EMAIL}`,
    },
  ];
}

/* ==================================================== TRUSTED BY (2 variants) */

export function TrustedBy() {
  const t = useOffer().content.trustedBy;
  const { variants } = useDesign();
  const v = variants.trustedBy ?? 0;
  if (!t || t.logos.length === 0) return null;
  return (
    <section
      id="trustedBy"
      className="section"
      style={{ minHeight: "auto", paddingBlock: "3rem" }}
    >
      <p className="meta accent mb-6 text-center text-[0.6rem] tracking-[0.4em]">
        — {t.eyebrow.toUpperCase()} —
      </p>
      {v === 0 ? <LogoMarquee logos={t.logos} /> : <LogoRow logos={t.logos} />}
    </section>
  );
}

function LogoMarquee({ logos }: { logos: { name: string; src: string }[] }) {
  const track = [...logos, ...logos, ...logos];
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max items-center gap-16"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {track.map((l, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={l.src}
            alt={l.name}
            className="h-9 w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0 sm:h-12"
          />
        ))}
      </motion.div>
    </div>
  );
}

function LogoRow({ logos }: { logos: { name: string; src: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12">
      {logos.map((l) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={l.src}
          src={l.src}
          alt={l.name}
          className="h-9 w-auto opacity-60 grayscale transition-all duration-300 hover:opacity-95 hover:grayscale-0 sm:h-12"
        />
      ))}
    </div>
  );
}

/* ==================================================== TESTIMONIALS (3 variants) */

export function Testimonials() {
  const t = useOffer().content.testimonials;
  const { variants } = useDesign();
  const v = variants.testimonials ?? 0;
  if (!t || t.items.length === 0) return null;
  return (
    <section id="testimonials" className="section">
      <SectionHead
        eyebrow={t.eyebrow}
        title={
          <>
            {t.title} <span className="accent-text">{t.titleAccent}</span>
          </>
        }
      />
      {v === 0 && <TestimonialCards items={t.items} />}
      {v === 1 && <TestimonialMarquee items={t.items} />}
      {v === 2 && <TestimonialFeature items={t.items} />}
    </section>
  );
}

type Testimonial = { quote: string; author: string; role: string; logo?: string };

function TestimonialCards({ items }: { items: Testimonial[] }) {
  // Samy 2026-05-26: V1-Look behalten (Quote + Autor unten), aber kleiner
  // und automatisch scrollen.
  const track = [...items, ...items];
  return (
    <div
      className="mt-10 w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 55, ease: "linear", repeat: Infinity }}
      >
        {track.map((t, i) => (
          <div key={i} className="w-[320px] shrink-0 sm:w-[340px]">
            <div className="card glow-border flex h-full flex-col p-5">
              <span
                className="display-light accent select-none text-[2.2rem] leading-none"
                aria-hidden
              >
                “
              </span>
              <p className="text-dim mt-2 flex-1 text-[0.88rem] leading-relaxed">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3">
                {t.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.logo} alt="" className="h-5 w-auto opacity-80" />
                )}
                <div>
                  <div className="text-[0.82rem] text-white">{t.author}</div>
                  <div className="meta text-faint text-[0.55rem]">{t.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function TestimonialMarquee({ items }: { items: Testimonial[] }) {
  const track = [...items, ...items];
  return (
    <div
      className="mt-12 w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      >
        {track.map((t, i) => (
          <div key={i} className="w-[460px] shrink-0">
            <TiltCard className="flex h-full flex-col p-6">
              <p className="text-dim text-[0.95rem] leading-relaxed">“{t.quote}”</p>
              <div className="meta text-faint mt-5 text-[0.58rem] tracking-[0.25em]">
                {t.author.toUpperCase()} · {t.role.toUpperCase()}
              </div>
            </TiltCard>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function TestimonialFeature({ items }: { items: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  const t = items[idx]!;
  return (
    <div className="mt-12">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <span className="display-light accent select-none text-[5rem] leading-none">“</span>
          <p
            className="display mt-4 text-[1.6rem] leading-snug sm:text-[2.1rem]"
            style={{ fontFamily: "var(--display-font, inherit)" }}
          >
            {t.quote}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            {t.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.logo} alt="" className="h-8 w-auto opacity-80" />
            )}
            <div className="text-left">
              <div className="text-[0.95rem] text-white">{t.author}</div>
              <div className="meta text-faint text-[0.6rem]">{t.role}</div>
            </div>
          </div>
        </div>
      </Reveal>
      <div className="mt-8 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: idx === i ? 28 : 10,
              background: idx === i ? "var(--accent)" : "var(--stroke-strong)",
            }}
            aria-label={`Quote ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ==================================================== FAQ (2 variants) */

export function FAQ() {
  const f = useOffer().content.faq;
  const { variants } = useDesign();
  const v = variants.faq ?? 0;
  if (!f || f.items.length === 0) return null;
  return (
    <section id="faq" className="section section--center items-center">
      <SectionHead
        eyebrow={f.eyebrow}
        title={
          <>
            {f.title} <span className="accent-text">{f.titleAccent}</span>
          </>
        }
        sub={f.sub}
        centered
      />
      {v === 0 ? <FAQAccordion items={f.items} /> : <FAQColumns items={f.items} />}
    </section>
  );
}

type FAQItem = { q: string; a: string };

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  // Samy 2026-05-26: kleiner + linksbündig (wo alles andere anfängt) — also
  // kein mx-auto, geringere max-width, kleinere q/a-Schrift.
  return (
    <div className="mt-10 flex w-full max-w-2xl flex-col">
      {items.map((it, i) => {
        const open = openIdx === i;
        return (
          <div key={it.q} className="border-t border-[var(--stroke-card)] last:border-b">
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-4 text-left"
              aria-expanded={open}
            >
              <span className="display text-[0.95rem] sm:text-[1.05rem]">{it.q}</span>
              <span
                className="text-accent shrink-0 text-[1.15rem] transition-transform"
                style={{
                  transform: open ? "rotate(45deg)" : "rotate(0deg)",
                  color: "var(--accent-bright)",
                }}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="text-dim pb-5 text-[0.9rem] leading-relaxed">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function FAQColumns({ items }: { items: FAQItem[] }) {
  return (
    <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
      {items.map((it, i) => (
        <Reveal key={it.q} delay={i * 0.05}>
          <div>
            <h3 className="display text-[1.1rem]">
              <span className="accent-text mr-3">{String(i + 1).padStart(2, "0")}</span>
              {it.q}
            </h3>
            <p className="text-dim mt-3 text-[0.95rem] leading-relaxed">{it.a}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ==================================================== PROCESS (3 variants) */

export function Process() {
  const { variants } = useDesign();
  const v = variants.process ?? 0;
  const p = useOffer().content.process;
  if (!p) return null;
  return (
    <section
      id="process"
      className="section"
      data-scroll-driven={v === 2 || undefined}
    >
      <SectionHead
        eyebrow={p.eyebrow}
        title={
          <>
            {p.title} <span className="accent-text">{p.titleAccent}</span>
          </>
        }
        sub={p.sub}
      />
      {v === 0 && <ProcessTimeline milestones={p.milestones} />}
      {v === 1 && <ProcessStickyReveal milestones={p.milestones} />}
      {v === 2 && <ProcessStations milestones={p.milestones} />}
    </section>
  );
}

type Milestone = { when: string; title: string; deliverables: string[] };

/* variant 0 — vertical timeline with gradient stem (default).
   Each milestone: WHEN pill on the left, title + deliverables on the right.
   Accent-orange dot sits on the stem at each step. */
function ProcessTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="relative mt-14 pl-10 md:pl-16">
      <div
        className="absolute left-3 top-0 bottom-0 w-px md:left-6"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--accent) 6%, var(--accent) 94%, transparent)",
        }}
      />
      {milestones.map((m, i) => (
        <Reveal key={m.when + m.title} delay={i * 0.07}>
          <div className="relative pb-12 last:pb-0">
            <span
              className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full md:-left-[55px]"
              style={{
                background: "var(--accent)",
                boxShadow:
                  "0 0 0 6px rgba(249,115,22,0.18), 0 0 22px rgba(249,115,22,0.45)",
              }}
            />
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-8">
              <div className="md:w-32 md:shrink-0">
                <span
                  className="inner-card meta inline-block px-3 py-1 text-[0.6rem] tracking-[0.3em]"
                  style={{ color: "var(--accent-bright)" }}
                >
                  {m.when.toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="display text-[1.4rem]">{m.title}</h3>
                <ul className="text-dim mt-3 flex flex-col gap-1.5 text-[0.95rem]">
                  {m.deliverables.map((d) => (
                    <li key={d} className="flex gap-2 leading-relaxed">
                      <span className="accent shrink-0">—</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* variant 1 — sticky scroll-reveal cards (placeholder, reuses timeline). */
function ProcessStickyReveal({ milestones }: { milestones: Milestone[] }) {
  // TODO(2026-05-25): proper sticky scroll-driven reveal per milestone.
  return <ProcessTimeline milestones={milestones} />;
}

/* variant 2 — horizontal stations with progress line (Samy 2026-05-27:
 * "Process 100 VH bitte und alles zusammen. Animation muss smooth sein.
 * Sobald die Leiste den Button erwischt, leuchtet er direkt."). Kein
 * sticky-Pin mehr — die Section bleibt normal 100vh hoch, die Road-Linie
 * animiert sich SELBST sobald die Section in den Viewport scrollt, und
 * jeder Dot leuchtet auf wenn die Linie ihn erreicht. Scrollen bleibt
 * frei, kein Pin, kein outer-vh-Stretch. */
function ProcessStations({ milestones }: { milestones: Milestone[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const progress = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(progress, 1, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, progress]);
  const lineWidth = useTransform(progress, (p) => `${Math.min(100, p * 100)}%`);
  return (
    <div ref={ref} className="relative mt-10">
      <div className="relative w-full">
        {/* base track */}
        <div
          className="absolute left-0 right-0 top-[14px] h-px"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        {/* growing accent line */}
        <motion.div
          className="absolute left-0 top-[14px] h-px"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-bright))",
            width: lineWidth,
            boxShadow: "0 0 14px rgba(249,115,22,0.5)",
          }}
        />
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))`,
          }}
        >
          {milestones.map((m, i) => (
            <ProcessStation
              key={m.when + m.title}
              m={m}
              index={i}
              total={milestones.length}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProcessStation({
  m,
  index,
  total,
  progress,
}: {
  m: Milestone;
  index: number;
  total: number;
  progress: import("motion/react").MotionValue<number>;
}) {
  // dot lights up once the growing line has reached its column
  const denom = Math.max(1, total - 1);
  const threshold = index / denom;
  const dotOpacity = useTransform(progress, (p) =>
    p >= threshold ? 1 : 0.18,
  );
  const dotGlow = useTransform(progress, (p) =>
    p >= threshold
      ? "0 0 0 4px rgba(249,115,22,0.18), 0 0 22px rgba(249,115,22,0.45)"
      : "none",
  );
  return (
    <Reveal delay={index * 0.06}>
      <div className="flex flex-col items-start">
        <motion.span
          className="relative -ml-1 h-7 w-7 rounded-full border-2"
          style={{
            background: "var(--accent)",
            borderColor: "#050507",
            opacity: dotOpacity,
            boxShadow: dotGlow,
          }}
        />
        <div className="meta accent mt-4 text-[0.6rem] tracking-[0.3em]">
          {m.when.toUpperCase()}
        </div>
        <h3 className="display mt-1 text-[1.15rem]">{m.title}</h3>
        <ul className="text-dim mt-3 flex flex-col gap-1.5 text-[0.82rem]">
          {m.deliverables.map((d) => (
            <li key={d}>
              <span className="accent">—</span> {d}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function Contact() {
  const cx = useOffer().content.contact;
  const { variants } = useDesign();
  const v = variants.contact;
  return (
    <section id="contact" className="section text-center">
      {v === 0 && <ContactCentered cx={cx} />}
      {v === 1 && <ContactQuote cx={cx} />}
      {v === 2 && <ContactSplit cx={cx} />}
      {v === 3 && <ContactCinematic cx={cx} />}
      {v === 4 && <ContactCardRow cx={cx} />}
      {v === 5 && <ContactMinimalFooter cx={cx} />}
    </section>
  );
}

/* Shared CTA: prefers Calendly, falls back to mailto. External target so
   Calendly opens in a new tab. Keeps every Contact variant in sync. */
function ConsultationButton({
  label,
  className = "btn btn-primary",
}: { label?: string; className?: string }) {
  const { brand } = useOffer();
  const { lang } = useLang();
  const defaultLabel = lang === "de" ? "Privates Beratungsgespräch buchen" : "Book a private consultation";
  const href = brand.calendly ?? `mailto:${SAMY_EMAIL}`;
  return (
    <a
      href={href}
      target={brand.calendly ? "_blank" : undefined}
      rel="noreferrer noopener"
      className={className}
    >
      {label ?? defaultLabel}
    </a>
  );
}

type CxContent = { eyebrow: string; headline: string; headlineAccent: string; sub: string };

/* variant 0: centered + samy card (default) */
function ContactCentered({ cx }: { cx: CxContent }) {
  const t = useT();
  return (
    <Reveal>
      <p className="eyebrow mb-4">{cx.eyebrow}</p>
      <h2 className="display mx-auto max-w-2xl text-[2.2rem] sm:text-[3rem]">
        {cx.headline} <span className="accent-text">{cx.headlineAccent}</span>
      </h2>
      <p className="text-dim mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed">{cx.sub}</p>
      <div className="card mx-auto mt-12 flex max-w-md items-center gap-5 p-5 text-left">
        <div
          className="h-20 w-16 shrink-0 overflow-hidden rounded-xl"
          style={{ background: "linear-gradient(160deg, rgba(249,115,22,0.18), rgba(255,255,255,0.04))" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/samy.png" alt="Samuel Heymig" className="h-full w-full object-cover object-top" />
        </div>
        <div>
          <div className="display text-[1.05rem]">Samuel Heymig</div>
          <div className="meta accent mt-0.5 text-[0.58rem]">ZamboDezigns · Stuttgart</div>
          <p className="text-dim mt-1.5 text-[0.85rem] leading-snug">
            {t(
              "Clean web design, optimized shops, and striking 3D & motion work.",
              "Klares Webdesign, optimierte Shops und prägnante 3D- und Motion-Arbeit.",
            )}
          </p>
        </div>
      </div>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <ConsultationButton />
      </div>
      <p className="meta text-faint mt-16 text-[0.62rem]">
        ZamboDezigns · Samuel Heymig · {t("Stuttgart, Germany", "Stuttgart, Deutschland")}
      </p>
    </Reveal>
  );
}

/* variant 1: full quote + single CTA */
function ContactQuote({ cx }: { cx: CxContent }) {
  return (
    <Reveal>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 py-12">
        <span className="display select-none accent text-[5rem] leading-none">“</span>
        <h2 className="display text-[2rem] leading-[1.15] sm:text-[2.8rem]">
          {cx.headline} <span className="accent-text">{cx.headlineAccent}</span>
        </h2>
        <p className="text-dim max-w-xl text-[1rem] leading-relaxed">{cx.sub}</p>
        <ConsultationButton className="btn btn-primary mt-4" />
        <p className="meta text-faint text-[0.6rem]">ZamboDezigns · Samuel Heymig · Stuttgart</p>
      </div>
    </Reveal>
  );
}

/* variant 2: split — CTA left, channels right */
function ContactSplit({ cx }: { cx: CxContent }) {
  const { brand } = useOffer();
  const channels = useContactChannels();
  const { lang } = useLang();
  return (
    <div className="grid items-stretch gap-6 text-left md:grid-cols-2">
      <Reveal>
        <TiltCard className="flex h-full flex-col justify-between p-9">
          <div>
            <p className="eyebrow mb-3">{cx.eyebrow}</p>
            <h2 className="display text-[1.8rem] sm:text-[2.4rem]">
              {cx.headline} <span className="accent-text">{cx.headlineAccent}</span>
            </h2>
            <p className="text-dim mt-5 text-[1rem] leading-relaxed">{cx.sub}</p>
          </div>
          <a
            href={brand.calendly ?? `mailto:${SAMY_EMAIL}`}
            target={brand.calendly ? "_blank" : undefined}
            rel="noreferrer noopener"
            className="btn btn-primary mt-8 self-start"
          >
            {lang === "de" ? "Privates Beratungsgespräch buchen" : "Book a private consultation"}
          </a>
        </TiltCard>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="flex h-full flex-col gap-3">
          {channels.map((c) => (
            <a key={c.label} href={c.href} className="inner-card flex flex-1 items-center justify-between px-6 py-5">
              <span className="meta accent text-[0.6rem]">{c.label}</span>
              <span className="text-[0.95rem] text-white">{c.value}</span>
              <span className="accent text-[1.2rem]">→</span>
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/* variant 3: cinematic — big display + CTA, gradient bg */
function ContactCinematic({ cx }: { cx: CxContent }) {
  return (
    <Reveal>
      <div
        className="relative mx-auto mt-4 flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-[var(--r-hero)] border border-[var(--stroke-card)] p-12 text-center"
        style={{
          background:
            "radial-gradient(100% 60% at 50% 0%, rgba(249,115,22,0.16), transparent 60%), radial-gradient(80% 60% at 50% 100%, rgba(232,181,99,0.10), transparent 55%)",
        }}
      >
        <p className="eyebrow mb-6">{cx.eyebrow}</p>
        <h2 className="display max-w-4xl text-[2.6rem] leading-[1.05] sm:text-[4.2rem]">
          {cx.headline} <span className="accent-text">{cx.headlineAccent}</span>
        </h2>
        <p className="text-dim mt-6 max-w-xl text-[1.05rem] leading-relaxed">{cx.sub}</p>
        <ConsultationButton className="btn btn-primary mt-10" />
      </div>
    </Reveal>
  );
}

/* variant 4: v4+v5 hybrid — editorial sign-off typography (v5) on top, big
   prominent Mail + Calendly cards below (v4 card-row feel scaled up).
   Samy 2026-05-25: "Mix aus 5 und 4 … wie es angezeigt werden soll und
   wie die Schriftart ausgewählt ist, finde ich besser bei 'Let's build
   the first renderings'." Mail is the headline channel, Calendly opens
   brand.calendly. */
function ContactCardRow({ cx }: { cx: CxContent }) {
  const { brand } = useOffer();
  const cal = brand.calendly ?? `mailto:${SAMY_EMAIL}`;
  const t = useT();
  return (
    <>
      {/* editorial sign-off top — borrowed from v5's typography rhythm */}
      <Reveal>
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 border-t border-[var(--stroke-card)] pt-12 text-left md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">{cx.eyebrow}</p>
            <h2 className="display text-[2.4rem] leading-[1.05] sm:text-[3.4rem]">
              {cx.headline} <span className="accent-text">{cx.headlineAccent}</span>
            </h2>
            <p className="text-dim mt-4 max-w-md text-[0.95rem] leading-relaxed">{cx.sub}</p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <a
              href={cal}
              target={brand.calendly ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="btn btn-primary"
            >
              {t("Book a private consultation", "Privates Beratungsgespräch buchen")}
            </a>
            <p className="meta text-faint text-[0.6rem]">
              ZamboDezigns · Samuel Heymig · Stuttgart
            </p>
          </div>
        </div>
      </Reveal>

      {/* two oversized rails: Mail (left, primary) + Calendly (right) */}
      <div className="mx-auto mt-12 grid w-full max-w-5xl gap-4 text-left md:grid-cols-2">
        <Reveal>
          <a
            href={`mailto:${SAMY_EMAIL}`}
            className="block h-full"
            aria-label="Email Samy"
          >
            <TiltCard
              className="accent-glow flex h-full flex-col justify-between p-8 sm:p-10"
              style={{
                borderColor: "var(--accent)",
                background: "rgba(249,115,22,0.06)",
              }}
            >
              <div>
                <span className="meta accent text-[0.6rem] tracking-[0.35em]">— MAIL</span>
                <p className="display mt-3 break-all text-[1.5rem] sm:text-[1.8rem]">
                  {SAMY_EMAIL}
                </p>
              </div>
              <span className="meta text-faint mt-6 text-[0.6rem]">
                {t(
                  "→ fastest reply, usually under a day",
                  "→ schnellste Antwort, meist unter einem Tag",
                )}
              </span>
            </TiltCard>
          </a>
        </Reveal>
        <Reveal delay={0.07}>
          <a
            href={cal}
            target={brand.calendly ? "_blank" : undefined}
            rel="noreferrer noopener"
            className="block h-full"
            aria-label={t("Book on Calendly", "Auf Calendly buchen")}
          >
            <TiltCard className="flex h-full flex-col justify-between p-8 sm:p-10">
              <div>
                <span className="meta accent text-[0.6rem] tracking-[0.35em]">— CALENDLY</span>
                <p className="display mt-3 text-[1.5rem] sm:text-[1.8rem]">
                  {t("Private consultation", "Privates Beratungsgespräch")}
                </p>
                <p className="text-dim mt-2 text-[0.9rem]">
                  {t("30 minutes, any time that fits.", "30 Minuten, wann es euch passt.")}
                </p>
              </div>
              <span className="meta text-faint mt-6 text-[0.6rem]">
                {t("→ pick a slot", "→ Slot wählen")}
              </span>
            </TiltCard>
          </a>
        </Reveal>
      </div>
    </>
  );
}

/* variant 5: minimal footer-style sign-off */
function ContactMinimalFooter({ cx }: { cx: CxContent }) {
  const t = useT();
  return (
    <Reveal>
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 border-t border-[var(--stroke-card)] pt-12 text-left md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-3">{cx.eyebrow}</p>
          <h2 className="display text-[1.8rem] sm:text-[2.3rem]">
            {cx.headline} <span className="accent-text">{cx.headlineAccent}</span>
          </h2>
          <p className="text-dim mt-3 max-w-md text-[0.92rem] leading-relaxed">{cx.sub}</p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <ConsultationButton label={t("Book a consultation", "Beratung buchen")} />
          <p className="meta text-faint text-[0.6rem]">
            ZamboDezigns · {t("Stuttgart, Germany", "Stuttgart, Deutschland")}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
