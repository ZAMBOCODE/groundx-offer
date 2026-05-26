"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useOffer } from "./OfferProvider";
import type { SectionKey as ConfigSectionKey } from "@/lib/config";

/* Per-section layout variants, shared between the dev-panel (which picks them)
   and the sections (which render them). Persisted to localStorage.
   2026-05-24: bumped to 6 variants/section (Samy: "sechs verschiedene Varianten,
   nicht generisch, sondern award-winning"). Per-section enabled-override
   ergänzt für DevPanel-Toggling ohne Config-Edit. */

export type SectionKey = "hero" | "trustedBy" | "about" | "angle" | "capabilities" | "work" | "testimonials" | "brand" | "offer" | "process" | "faq" | "contact";

export type Variants = Record<SectionKey, number>;

const DEFAULTS: Variants = {
  hero: 0, trustedBy: 0, about: 4, angle: 4, capabilities: 3, work: 4,
  testimonials: 0, brand: 2, offer: 2, process: 2, faq: 0, contact: 4,
};

/** how many variants each section offers (for the dev-panel selector) */
export const VARIANT_COUNT: Record<SectionKey, number> = {
  hero: 6, trustedBy: 2, about: 6, angle: 6, capabilities: 6, work: 6,
  testimonials: 3, brand: 6, offer: 6, process: 3, faq: 2, contact: 6,
};

export const SECTION_LABEL: Record<SectionKey, string> = {
  hero: "Hero",
  trustedBy: "Trusted by",
  about: "About",
  angle: "Why me",
  capabilities: "What I can do",
  work: "Selected work",
  testimonials: "Testimonials",
  brand: "Brand direction",
  offer: "Offer",
  process: "Process",
  faq: "FAQ",
  contact: "Contact",
};

/** Award-tier inspiration the variant lineup draws on (for the variant tooltips
 *  + the on-screen variant label). Index = variant idx. */
export const VARIANT_NOTES: Record<SectionKey, string[]> = {
  hero: [
    "Centered · card stack",
    "Split · headline + card",
    "Cinematic · minimal cover",
    "Marquee · scrolling display",
    "Hero strip · logo top",
    "Stacked · vertical center",
  ],
  about: [
    "Image left · skills right",
    "Image right · mirror",
    "Photo full-bleed · overlay",
    "Avatar centered · inline",
    "Split · stat-numbers",
    "Minimal · bio only",
  ],
  angle: [
    "Cards · tilt grid",
    "Editorial · numbered rows",
    "Timeline · gradient stem",
    "Bento · asymmetric",
    "Split · big numerals",
    "Manifesto · single column",
  ],
  capabilities: [
    "Tilt cards · 3 col",
    "Bento · first big",
    "Compact · table rows",
    "Stack deck · fanned",
    "Split pane · live preview",
    "Scroll snap · full-bleed",
  ],
  work: [
    "Image cards · 2 col",
    "Alternating · wide rows",
    "Horizontal · scroll strip",
    "Sticky · horizontal scroll",
    "Showcase · curved sticky carousel",
    "Polaroid · tilt stack",
  ],
  brand: [
    "Brand · editorial codex",
    "Brand · cinematic palette wall",
    "Brand · type specimen sheet",
    "Mockup · device frames",
    "Mockup · magazine spread",
    "Mockup · isometric scroll stack",
  ],
  offer: [
    "Tabs · 3-card grid",
    "Accordion · vertical",
    "Compare · columns",
    "Phases · timeline",
    "Scroll · pricing strip",
    "Minimal · list",
  ],
  process: [
    "Milestones · vertical timeline",
    "Sticky · scroll-reveal",
    "Phases · horizontal stations",
  ],
  trustedBy: [
    "Marquee · auto-scroll",
    "Static · centered row",
  ],
  testimonials: [
    "Cards · 3 col",
    "Marquee · auto-scroll",
    "Feature · one big quote",
  ],
  faq: [
    "Accordion · single column",
    "Columns · 2 col",
  ],
  contact: [
    "Centered · CTA + card",
    "Full quote · single CTA",
    "Split · CTA + channels",
    "Cinematic · big display",
    "Card row · contact rails",
    "Footer · minimal sign-off",
  ],
};

const KEY = "groundx.variants";
const KEY_ENABLED = "groundx.sectionEnabled";
const KEY_WORK_PROJECTS = "groundx.workProjects";

type Ctx = {
  variants: Variants;
  setVariant: (k: SectionKey, idx: number) => void;
  /** per-section runtime enabled-override (DevPanel toggle, beats cfg.sections). */
  enabledOverride: Partial<Record<ConfigSectionKey, boolean>>;
  toggleSection: (k: ConfigSectionKey, on: boolean) => void;
  /** Whitelist of work-project names to show in Selected Work. Empty = all. */
  workProjects: string[];
  setWorkProjects: (names: string[]) => void;
};

const DesignCtx = createContext<Ctx>({
  variants: DEFAULTS,
  setVariant: () => {},
  enabledOverride: {},
  toggleSection: () => {},
  workProjects: [],
  setWorkProjects: () => {},
});

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const cfg = useOffer();
  const [variants, setVariants] = useState<Variants>(DEFAULTS);
  const [enabledOverride, setEnabledOverride] = useState<Partial<Record<ConfigSectionKey, boolean>>>({});
  const [workProjects, setWorkProjectsState] = useState<string[]>([]);

  // Seed variants from the offer config (so the pipeline drives layout per
  // client); a saved dev-panel choice in localStorage always wins.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setVariants({ ...DEFAULTS, ...JSON.parse(raw) });
      } else {
        const seeded: Variants = { ...DEFAULTS };
        for (const s of cfg.sections) {
          if (s.key in seeded) (seeded as Record<string, number>)[s.key] = s.variant;
        }
        setVariants(seeded);
      }
    } catch {}
    try {
      const rawE = localStorage.getItem(KEY_ENABLED);
      if (rawE) setEnabledOverride(JSON.parse(rawE));
    } catch {}
    try {
      const rawP = localStorage.getItem(KEY_WORK_PROJECTS);
      if (rawP) setWorkProjectsState(JSON.parse(rawP));
    } catch {}
  }, [cfg]);

  const setVariant = useCallback((k: SectionKey, idx: number) => {
    setVariants((prev) => {
      const next = { ...prev, [k]: idx };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const toggleSection = useCallback((k: ConfigSectionKey, on: boolean) => {
    setEnabledOverride((prev) => {
      const next = { ...prev, [k]: on };
      try { localStorage.setItem(KEY_ENABLED, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setWorkProjects = useCallback((names: string[]) => {
    setWorkProjectsState(names);
    try { localStorage.setItem(KEY_WORK_PROJECTS, JSON.stringify(names)); } catch {}
  }, []);

  return (
    <DesignCtx.Provider value={{ variants, setVariant, enabledOverride, toggleSection, workProjects, setWorkProjects }}>
      {children}
    </DesignCtx.Provider>
  );
}

export const useDesign = () => useContext(DesignCtx);
