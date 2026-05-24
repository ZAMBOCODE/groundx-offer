"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useOffer } from "./OfferProvider";

/* Per-section layout variants, shared between the dev-panel (which picks them)
   and the sections (which render them). Persisted to localStorage. */

export type SectionKey = "angle" | "capabilities" | "work" | "brand";

export type Variants = Record<SectionKey, number>;

const DEFAULTS: Variants = { angle: 0, capabilities: 0, work: 4, brand: 2 };

/** how many variants each section offers (for the dev-panel selector) */
export const VARIANT_COUNT: Record<SectionKey, number> = {
  angle: 2,
  capabilities: 3,
  work: 5,
  brand: 3,
};

export const SECTION_LABEL: Record<SectionKey, string> = {
  angle: "Why me",
  capabilities: "What I can do",
  work: "Selected work",
  brand: "Brand direction",
};

const KEY = "groundx.variants";

type Ctx = {
  variants: Variants;
  setVariant: (k: SectionKey, idx: number) => void;
};

const DesignCtx = createContext<Ctx>({
  variants: DEFAULTS,
  setVariant: () => {},
});

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const cfg = useOffer();
  const [variants, setVariants] = useState<Variants>(DEFAULTS);

  // Seed variants from the offer config (so the pipeline drives layout per
  // client); a saved dev-panel choice in localStorage always wins.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setVariants({ ...DEFAULTS, ...JSON.parse(raw) });
        return;
      }
    } catch {}
    const seeded: Variants = { ...DEFAULTS };
    for (const s of cfg.sections) {
      if (s.key in seeded) (seeded as Record<string, number>)[s.key] = s.variant;
    }
    setVariants(seeded);
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

  return (
    <DesignCtx.Provider value={{ variants, setVariant }}>
      {children}
    </DesignCtx.Provider>
  );
}

export const useDesign = () => useContext(DesignCtx);
