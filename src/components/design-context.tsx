"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

/* Per-section layout variants, shared between the dev-panel (which picks them)
   and the sections (which render them). Persisted to localStorage. */

export type SectionKey = "angle" | "capabilities" | "work" | "brand";

export type Variants = Record<SectionKey, number>;

const DEFAULTS: Variants = { angle: 0, capabilities: 0, work: 0, brand: 0 };

/** how many variants each section offers (for the dev-panel selector) */
export const VARIANT_COUNT: Record<SectionKey, number> = {
  angle: 2,
  capabilities: 3,
  work: 4,
  brand: 2,
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
  const [variants, setVariants] = useState<Variants>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setVariants({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

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
