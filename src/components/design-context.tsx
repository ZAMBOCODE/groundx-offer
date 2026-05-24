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

export type SectionKey = "angle" | "capabilities" | "work" | "brand";

export type Variants = Record<SectionKey, number>;

const DEFAULTS: Variants = { angle: 0, capabilities: 0, work: 4, brand: 2 };

/** how many variants each section offers (for the dev-panel selector) */
export const VARIANT_COUNT: Record<SectionKey, number> = {
  angle: 6,
  capabilities: 6,
  work: 6,
  brand: 6,
};

export const SECTION_LABEL: Record<SectionKey, string> = {
  angle: "Why me",
  capabilities: "What I can do",
  work: "Selected work",
  brand: "Brand direction",
};

/** Award-tier inspiration the variant lineup draws on (for the variant tooltips
 *  + the on-screen variant label). Index = variant idx. */
export const VARIANT_NOTES: Record<SectionKey, string[]> = {
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
    "Showcase · facts + shots",
    "Polaroid · tilt stack",
  ],
  brand: [
    "Side-by-side · tilt card",
    "Centered · logo focal",
    "Mockup showcase",
    "Split-screen · logo + mood",
    "Magazine · serif cover",
    "Swatch · full-width bands",
  ],
};

const KEY = "groundx.variants";
const KEY_ENABLED = "groundx.sectionEnabled";

type Ctx = {
  variants: Variants;
  setVariant: (k: SectionKey, idx: number) => void;
  /** per-section runtime enabled-override (DevPanel toggle, beats cfg.sections). */
  enabledOverride: Partial<Record<ConfigSectionKey, boolean>>;
  toggleSection: (k: ConfigSectionKey, on: boolean) => void;
};

const DesignCtx = createContext<Ctx>({
  variants: DEFAULTS,
  setVariant: () => {},
  enabledOverride: {},
  toggleSection: () => {},
});

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const cfg = useOffer();
  const [variants, setVariants] = useState<Variants>(DEFAULTS);
  const [enabledOverride, setEnabledOverride] = useState<Partial<Record<ConfigSectionKey, boolean>>>({});

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

  return (
    <DesignCtx.Provider value={{ variants, setVariant, enabledOverride, toggleSection }}>
      {children}
    </DesignCtx.Provider>
  );
}

export const useDesign = () => useContext(DesignCtx);
