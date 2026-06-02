"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useOffer } from "./OfferProvider";
import type { SectionKey as ConfigSectionKey } from "@/lib/config";
import { fileToCompressedDataUrl, downscaleDataUrl, dataUrlBytes } from "@/lib/imageCompress";

/* Per-section layout variants, shared between the dev-panel (which picks them)
   and the sections (which render them). Persisted to localStorage.
   2026-05-24: bumped to 6 variants/section (Samy: "sechs verschiedene Varianten,
   nicht generisch, sondern award-winning"). Per-section enabled-override
   ergänzt für DevPanel-Toggling ohne Config-Edit. */

export type SectionKey = "hero" | "trustedBy" | "about" | "angle" | "capabilities" | "work" | "testimonials" | "brand" | "offer" | "process" | "faq" | "contact";

export type Variants = Record<SectionKey, number>;

const DEFAULTS: Variants = {
  hero: 0, trustedBy: 0, about: 4, angle: 4, capabilities: 0, work: 4,
  testimonials: 0, brand: 1, offer: 2, process: 2, faq: 0, contact: 4,
};

/** how many variants each section offers (for the dev-panel selector) */
export const VARIANT_COUNT: Record<SectionKey, number> = {
  hero: 6, trustedBy: 2, about: 6, angle: 6, capabilities: 6, work: 6,
  testimonials: 3, brand: 7, offer: 6, process: 3, faq: 2, contact: 6,
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
    "Mockup · surface tabs (tilted)",
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
const KEY_HERO_BUTTONS = "groundx.heroButtons";
const KEY_HERO_OVERRIDE = "groundx.heroOverride";
const KEY_SECTION_HEIGHT = "groundx.sectionHeight";
const KEY_IMAGE_OVERRIDES = "groundx.imageOverrides";

/** Per-section min-height override: 50 = halbe Viewport-Hoehe (zwei Sections
 *  passen uebereinander auf einen Bildschirm), 100 = volle Hoehe (default).
 *  Samy 2026-05-27: "ich moechte entscheiden koennen, ob 50% VH oder 100% VH". */
export type SectionHeight = 50 | 100;

/** Image-overrides: keyed by stable image-id (e.g. "work.gulfrescue.0",
 *  "hero.background"). Value is a data-URL (file upload) ODER eine externe
 *  URL. Sections lesen ueber useImageSrc(id, fallback). */
export type ImageOverrides = Record<string, string>;

/** which Hero CTA buttons to render (Samy 2026-05-26: "die Buttons unten
 *  in der Hero Section sollen anwählbar sein, ob man die haben will oder nicht"). */
export type HeroButtons = { primary: boolean; ghost: boolean };
const HERO_BUTTONS_DEFAULT: HeroButtons = { primary: true, ghost: true };

/** Editable Hero copy overrides (Samy 2026-05-26: "dass man eine Überschrift
 *  und Unterschrift ändern kann"). Empty string = use offer-config default. */
export type HeroOverride = {
  eyebrow?: string;
  headline?: string;
  headlineAccent?: string;
  sub?: string;
};

type Ctx = {
  variants: Variants;
  setVariant: (k: SectionKey, idx: number) => void;
  /** per-section runtime enabled-override (DevPanel toggle, beats cfg.sections). */
  enabledOverride: Partial<Record<ConfigSectionKey, boolean>>;
  toggleSection: (k: ConfigSectionKey, on: boolean) => void;
  /** Whitelist of work-project names to show in Selected Work. Empty = all. */
  workProjects: string[];
  setWorkProjects: (names: string[]) => void;
  heroButtons: HeroButtons;
  setHeroButtons: (patch: Partial<HeroButtons>) => void;
  heroOverride: HeroOverride;
  setHeroOverride: (patch: Partial<HeroOverride>) => void;
  /** per-section vh-Hoehe (default 100). Wenn 50 gesetzt: section nimmt nur
   *  halbe Viewport-Hoehe, sodass zwei Sections nebeneinander auf einen
   *  Bildschirm passen. */
  sectionHeight: Partial<Record<ConfigSectionKey, SectionHeight>>;
  setSectionHeight: (k: ConfigSectionKey, vh: SectionHeight) => void;
  /** image overrides: id → URL (data: oder remote). Sections lesen via
   *  useImageSrc(id, fallback). DevPanel scannt Page nach data-img-id und
   *  bietet pro id einen Upload-Picker. */
  imageOverrides: ImageOverrides;
  setImageOverride: (id: string, url: string | null) => void;
  /** edit-mode: wenn aktiv, faerbt jedes img-Tag einen Hover-Outline und
   *  Click oeffnet den File-Picker (Samy 2026-05-27 Run-4: "direkt
   *  draufklicken koennen im Angebot selber"). DevPanel toggelt das beim
   *  Oeffnen automatisch ein, beim Schliessen aus. */
  editMode: boolean;
  setEditMode: (on: boolean) => void;
};

const DesignCtx = createContext<Ctx>({
  variants: DEFAULTS,
  setVariant: () => {},
  enabledOverride: {},
  toggleSection: () => {},
  workProjects: [],
  setWorkProjects: () => {},
  heroButtons: HERO_BUTTONS_DEFAULT,
  setHeroButtons: () => {},
  heroOverride: {},
  setHeroOverride: () => {},
  sectionHeight: {},
  setSectionHeight: () => {},
  imageOverrides: {},
  setImageOverride: () => {},
  editMode: false,
  setEditMode: () => {},
});

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const cfg = useOffer();
  const [variants, setVariants] = useState<Variants>(DEFAULTS);
  const [enabledOverride, setEnabledOverride] = useState<Partial<Record<ConfigSectionKey, boolean>>>({});
  const [workProjects, setWorkProjectsState] = useState<string[]>([]);
  const [heroButtons, setHeroButtonsState] = useState<HeroButtons>(HERO_BUTTONS_DEFAULT);
  const [heroOverride, setHeroOverrideState] = useState<HeroOverride>({});
  const [sectionHeight, setSectionHeightState] = useState<Partial<Record<ConfigSectionKey, SectionHeight>>>({});
  const [imageOverrides, setImageOverridesState] = useState<ImageOverrides>({});
  const [editMode, setEditMode] = useState(false);

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
    try {
      const rawH = localStorage.getItem(KEY_HERO_BUTTONS);
      if (rawH) setHeroButtonsState({ ...HERO_BUTTONS_DEFAULT, ...JSON.parse(rawH) });
    } catch {}
    try {
      const rawHO = localStorage.getItem(KEY_HERO_OVERRIDE);
      if (rawHO) setHeroOverrideState(JSON.parse(rawHO));
    } catch {}
    try {
      const rawSH = localStorage.getItem(KEY_SECTION_HEIGHT);
      if (rawSH) setSectionHeightState(JSON.parse(rawSH));
    } catch {}
    try {
      const rawIO = localStorage.getItem(KEY_IMAGE_OVERRIDES);
      if (rawIO) setImageOverridesState(JSON.parse(rawIO));
    } catch {}
  }, [cfg]);

  // One-time migration (Samy 2026-06-02): the earlier raw uploads pushed the
  // saved look to ~5MB, hitting the localStorage quota so new images couldn't
  // save. Re-compress any oversized override once on load to free space.
  const migratedRef = useRef(false);
  useEffect(() => {
    if (migratedRef.current) return;
    const big = Object.entries(imageOverrides).filter(
      ([, v]) => typeof v === "string" && dataUrlBytes(v) > 250_000,
    );
    if (big.length === 0) return;
    migratedRef.current = true;
    void (async () => {
      const updates: Record<string, string> = {};
      for (const [id, v] of big) {
        const small = await downscaleDataUrl(v);
        if (small.length < v.length) updates[id] = small;
      }
      if (Object.keys(updates).length === 0) return;
      setImageOverridesState((prev) => {
        const next = { ...prev, ...updates };
        try {
          localStorage.setItem(KEY_IMAGE_OVERRIDES, JSON.stringify(next));
        } catch (e) {
          console.warn("imageOverrides migration: localStorage still full", e);
        }
        return next;
      });
    })();
  }, [imageOverrides]);

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

  const setHeroButtons = useCallback((patch: Partial<HeroButtons>) => {
    setHeroButtonsState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(KEY_HERO_BUTTONS, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setSectionHeight = useCallback((k: ConfigSectionKey, vh: SectionHeight) => {
    setSectionHeightState((prev) => {
      const next = { ...prev, [k]: vh };
      try { localStorage.setItem(KEY_SECTION_HEIGHT, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setImageOverride = useCallback((id: string, url: string | null) => {
    setImageOverridesState((prev) => {
      const next = { ...prev };
      if (url === null || url === "") delete next[id];
      else next[id] = url;
      try { localStorage.setItem(KEY_IMAGE_OVERRIDES, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // Edit-Mode click-intercept (Samy 2026-05-27 Run-4): wenn editMode an
  // ist, faengt ein capture-phase click-listener Klicks auf <img>-Tags ab
  // und oeffnet einen versteckten File-Picker. Override wird mit dem
  // data-img-id (bzw. dem Original-src als Fallback) gespeichert. Plus:
  // hover-outline via injected style-tag damit der User die klickbaren
  // Bilder visuell erkennt.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!editMode) {
      document.documentElement.classList.remove("img-edit-mode");
      return;
    }
    document.documentElement.classList.add("img-edit-mode");

    // hidden file input fuer den Upload
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    document.body.appendChild(input);
    let pendingId: string | null = null;

    const onChange = () => {
      const file = input.files?.[0];
      if (!file || !pendingId) {
        input.value = "";
        return;
      }
      const id = pendingId;
      // Downscale + compress before storing so we stay under the localStorage
      // quota (Samy 2026-06-02 — raw uploads blew the ~5MB limit, saves failed).
      void fileToCompressedDataUrl(file).then((dataUrl) => {
        setImageOverridesState((prev) => {
          const next = { ...prev, [id]: dataUrl };
          try {
            localStorage.setItem(KEY_IMAGE_OVERRIDES, JSON.stringify(next));
          } catch (e) {
            console.warn("imageOverrides: localStorage full — image kept in-session only", e);
          }
          return next;
        });
        input.value = "";
        pendingId = null;
      });
    };
    input.addEventListener("change", onChange);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const img = target.closest<HTMLImageElement>("img");
      if (!img) return;
      // ignore the DevPanel-internal thumbnails (the Picker-Sektion selbst).
      if (img.closest("[data-devpanel]")) return;
      const id = img.dataset.imgId ?? img.dataset.imgOriginal ?? img.getAttribute("src");
      if (!id) return;
      e.preventDefault();
      e.stopPropagation();
      pendingId = id;
      input.click();
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.documentElement.classList.remove("img-edit-mode");
      document.removeEventListener("click", onClick, true);
      input.removeEventListener("change", onChange);
      input.remove();
    };
  }, [editMode]);

  // Global Image-Override Manager (Samy 2026-05-27): scannt das DOM nach
  // <img>-Tags, merkt sich das Original-src in data-img-original und ersetzt
  // src durch das Override aus imageOverrides[originalSrc]. Re-runs bei jedem
  // DOM-Change (React-Rerender) via MutationObserver, sodass die Overrides
  // persistieren ohne dass jede Section.tsx-Stelle angefasst werden muss.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let scheduled = false;
    const apply = () => {
      scheduled = false;
      document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        // capture the original once — getAttribute() avoids the
        // absolutized form .src returns (e.g. http://localhost/...)
        if (!img.dataset.imgOriginal) {
          const attr = img.getAttribute("src");
          if (attr) img.dataset.imgOriginal = attr;
        }
        const original = img.dataset.imgOriginal ?? "";
        if (!original) return;
        const id = img.dataset.imgId ?? original;
        const override = imageOverrides[id];
        const current = img.getAttribute("src");
        if (override && current !== override) {
          img.setAttribute("src", override);
        } else if (!override && current !== original) {
          img.setAttribute("src", original);
        }
      });
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(apply);
    };
    apply();
    const obs = new MutationObserver(schedule);
    obs.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src", "data-img-id"],
    });
    return () => obs.disconnect();
  }, [imageOverrides]);

  const setHeroOverride = useCallback((patch: Partial<HeroOverride>) => {
    setHeroOverrideState((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === "") delete (next as Record<string, string>)[k];
        else (next as Record<string, string>)[k] = v as string;
      }
      try { localStorage.setItem(KEY_HERO_OVERRIDE, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <DesignCtx.Provider
      value={{
        variants,
        setVariant,
        enabledOverride,
        toggleSection,
        workProjects,
        setWorkProjects,
        heroButtons,
        setHeroButtons,
        heroOverride,
        setHeroOverride,
        sectionHeight,
        setSectionHeight,
        imageOverrides,
        setImageOverride,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </DesignCtx.Provider>
  );
}

export const useDesign = () => useContext(DesignCtx);

/** Liest die finale Image-URL: DevPanel-Override gewinnt, sonst fallback. */
export function useImageSrc(id: string, fallback: string): string {
  const { imageOverrides } = useDesign();
  return imageOverrides[id] ?? fallback;
}
