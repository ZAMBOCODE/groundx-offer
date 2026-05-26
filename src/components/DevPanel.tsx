"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  useDesign,
  VARIANT_COUNT,
  VARIANT_NOTES,
  SECTION_LABEL,
  type SectionKey,
} from "./design-context";
import { useOffer } from "./OfferProvider";
import { useLang } from "./language-context";
import { Presets } from "./Presets";
import { cases as ALL_CASES } from "@/lib/data";
import type { SectionKey as ConfigSectionKey } from "@/lib/config";
import {
  COPY_VARIANTS,
  loadCopyVariantSelections,
  saveCopyVariantSelections,
  VARIANTS_CHANGE_EVENT,
  type CopyVariant,
  type CopyVariantSelections,
  type SectionCopyKey,
} from "@/lib/copyVariants";

const ALL_SECTIONS: { key: ConfigSectionKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "trustedBy", label: "Trusted by" },
  { key: "about", label: "About" },
  { key: "angle", label: "Why me" },
  { key: "capabilities", label: "Capabilities" },
  { key: "work", label: "Work" },
  { key: "testimonials", label: "Testimonials" },
  { key: "brand", label: "Brand" },
  { key: "offer", label: "Offer" },
  { key: "process", label: "Process" },
  { key: "faq", label: "FAQ" },
  { key: "contact", label: "Contact" },
];

/* Live design controls — the "Angebot builder" panel. Toggle with the FAB
   (or press "D"). Everything writes CSS custom properties on <html> and
   persists to localStorage, so a tuned look survives reload. */

type Settings = {
  accent: string;
  radius: number; // base card radius in px
  highlightFont: string; // accent-text gradient font
  displayFont: string; // .display / .display-light (headlines)
  bodyFont: string; // body paragraphs
  sidePad: number; // section horizontal padding in px (clamped >=0)
  uiScale: number; // global text-scale: 1 = default, scales html font-size
  smoothScroll: boolean;
  snap: boolean;
  devHud: boolean; // dev-mode section name HUD top-left
  cursorFx: string;
  bubbles: boolean;
  bgMark: boolean;
  shader: string;
  buttonStyle: string;
};

const DEFAULTS: Settings = {
  accent: "#f97316",
  radius: 14,
  highlightFont: "inherit",
  displayFont: "inherit",
  bodyFont: "inherit",
  sidePad: 24,
  uiScale: 1,
  smoothScroll: true,
  snap: true,
  devHud: false,
  cursorFx: "off",
  bubbles: false,
  bgMark: false,
  shader: "none",
  buttonStyle: "solid",
};

const SHADERS = [
  { label: "None", value: "none" },
  { label: "Aurora", value: "aurora" },
  { label: "Mesh", value: "mesh" },
  { label: "Grain", value: "grain" },
  { label: "Grid", value: "grid" },
  { label: "Orbs", value: "orbs" },
  { label: "Beams", value: "beams" },
];

const CURSORS = [
  { label: "Off", value: "off" },
  { label: "Glow", value: "glow" },
  { label: "Ring", value: "ring" },
  { label: "Spotlight", value: "spotlight" },
];

const BUTTON_STYLES = [
  { label: "Solid", value: "solid" },
  { label: "Outline", value: "outline" },
  { label: "Soft", value: "soft" },
];

const KEY = "groundx.devpanel";

const ACCENT_PRESETS = [
  "#f97316", // orange (brand)
  "#fb923c", // bright
  "#fbbf24", // amber
  "#e8b563", // gold (Ground X)
  "#22d3ee", // cyan
  "#a78bfa", // violet
  "#34d399", // emerald
  "#f43f5e", // rose
];

type FontOption = { label: string; value: string; group?: string };

/* Grouped by style+emotion so Samy can scan by intent. Expanded 2026-05-25.
   The values reference next/font/google CSS variables declared in layout.tsx.
   Custom Google Fonts can be added live via the "Custom font" input below —
   those get persisted and appended to this list at runtime. */
const FONTS: FontOption[] = [
  { label: "Default (Space Grotesk)", value: "inherit", group: "Default" },

  { label: "Inter — clean", value: "var(--font-sans)", group: "Grotesk · clean" },
  { label: "Inter Tight — condensed", value: "var(--font-inter-tight)", group: "Grotesk · clean" },
  { label: "Manrope — modern", value: "var(--font-manrope)", group: "Grotesk · clean" },
  { label: "DM Sans — friendly", value: "var(--font-dm-sans)", group: "Grotesk · clean" },
  { label: "Outfit — geometric", value: "var(--font-outfit)", group: "Grotesk · clean" },
  { label: "Sora — geometric", value: "var(--font-sora)", group: "Grotesk · clean" },

  { label: "Bricolage — editorial", value: "var(--font-bricolage)", group: "Display · editorial" },
  { label: "Unbounded — bold", value: "var(--font-unbounded)", group: "Display · editorial" },
  { label: "Anton — brutalist", value: "var(--font-anton)", group: "Display · editorial" },
  { label: "Bebas Neue — caps", value: "var(--font-bebas)", group: "Display · editorial" },

  { label: "Fraunces — luxury serif", value: "var(--font-fraunces)", group: "Serif · luxury" },
  { label: "Playfair Display — classic", value: "var(--font-playfair)", group: "Serif · luxury" },
  { label: "Cormorant Garamond — high-end", value: "var(--font-cormorant)", group: "Serif · luxury" },
  { label: "DM Serif Display — magazine", value: "var(--font-dm-serif)", group: "Serif · luxury" },
  { label: "Instrument — serif", value: "var(--font-instrument)", group: "Serif · luxury" },

  { label: "Syne — futuristic", value: "var(--font-syne)", group: "Display · futuristic" },
  { label: "Orbitron — sci-fi", value: "var(--font-orbitron)", group: "Display · futuristic" },
  { label: "Audiowide — retro-future", value: "var(--font-audiowide)", group: "Display · futuristic" },

  { label: "JetBrains — mono", value: "var(--font-mono)", group: "Mono" },
  { label: "IBM Plex — mono", value: "var(--font-plex-mono)", group: "Mono" },
];

/* Custom-font runtime registry: pasting a Google-Font name (e.g. "Sign
   Futuristic") injects a <link> and adds an entry to this list, persisted
   in localStorage so it survives reloads. */
const KEY_CUSTOM_FONTS = "groundx.customFonts";

type CustomFont = { name: string; family: string }; // family = quoted CSS family value

function loadCustomFonts(): CustomFont[] {
  try {
    const raw = localStorage.getItem(KEY_CUSTOM_FONTS);
    return raw ? (JSON.parse(raw) as CustomFont[]) : [];
  } catch {
    return [];
  }
}

function saveCustomFonts(list: CustomFont[]) {
  try {
    localStorage.setItem(KEY_CUSTOM_FONTS, JSON.stringify(list));
  } catch {}
}

/** inject the Google Fonts <link> for `name` (idempotent per name). */
function ensureGoogleFontLoaded(name: string) {
  const id = `gf-${name.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const fam = name.replace(/\s+/g, "+");
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fam}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/** lighten a hex toward white by amount (0..1) */
function lighten(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const n = parseInt(h, 16);
  const r = Math.round(((n >> 16) & 255) + (255 - ((n >> 16) & 255)) * amt);
  const g = Math.round(((n >> 8) & 255) + (255 - ((n >> 8) & 255)) * amt);
  const b = Math.round((n & 255) + (255 - (n & 255)) * amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function apply(s: Settings) {
  const root = document.documentElement;
  root.style.setProperty("--accent", s.accent);
  root.style.setProperty("--accent-bright", lighten(s.accent, 0.18));
  root.style.setProperty("--accent-dim", hexToRgba(s.accent, 0.18));
  root.style.setProperty("--r-card", `${s.radius}px`);
  root.style.setProperty("--r-control", `${Math.round(s.radius * 0.48)}px`);
  root.style.setProperty("--r-hero", `${Math.round(s.radius * 1.3)}px`);
  root.style.setProperty("--r-mini", `${Math.round(s.radius * 0.3)}px`);
  root.style.setProperty("--highlight-font", s.highlightFont);
  root.style.setProperty(
    "--display-font",
    s.displayFont === "inherit" ? "var(--font-display)" : s.displayFont,
  );
  root.style.setProperty(
    "--body-font",
    s.bodyFont === "inherit" ? "var(--font-sans)" : s.bodyFont,
  );
  // clamp >=0 so stale negatives in localStorage don't break layout
  root.style.setProperty("--side-pad", `${Math.max(0, s.sidePad)}px`);
  // global text-scale: drives html { font-size } via --ui-scale so every
  // rem-based size scales together. Clamped to a sane range.
  const scale = Math.min(1.6, Math.max(0.8, s.uiScale ?? 1));
  root.style.setProperty("--ui-scale", String(scale));
  root.style.scrollBehavior = s.smoothScroll ? "smooth" : "auto";
  root.classList.toggle("snap", s.snap);
  root.classList.toggle("dev-hud", s.devHud);
  root.classList.toggle("fx-bubbles", s.bubbles);
  root.classList.toggle("fx-mark", s.bgMark);
  root.dataset.cursor = s.cursorFx;
  root.dataset.shader = s.shader;
  root.dataset.btn = s.buttonStyle;
}

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);
  const [fontInput, setFontInput] = useState("");
  const [copySel, setCopySel] = useState<CopyVariantSelections>({});
  const [openCopyKey, setOpenCopyKey] = useState<SectionCopyKey | null>(null);
  // Agent-generated copy variants per section (overrides the curated set).
  const [dynamicCopy, setDynamicCopy] = useState<Partial<Record<SectionCopyKey, CopyVariant[]>>>({});
  const [copyBusy, setCopyBusy] = useState<SectionCopyKey | null>(null);
  const {
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
  } = useDesign();
  const offer = useOffer();

  const generateCopyVariants = useCallback(
    async (section: SectionCopyKey) => {
      const currentCopy = (offer.content as Record<string, unknown>)[section];
      if (!currentCopy) return;
      setCopyBusy(section);
      try {
        const res = await fetch("/api/copy-variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section,
            currentCopy,
            client: {
              name: offer.brand.name,
              tagline: offer.brand.tagline,
              voice:
                "Ground X brand rules: NEVER use 'bunker'. Lifestyle-first, sanctuary-second. Twilight + cognac + brushed-gold visual register. Villa always in frame. Discreet, never loud. Avoid em-dashes (use commas / periods).",
            },
          }),
        });
        const j = (await res.json()) as { ok?: boolean; variants?: CopyVariant[]; error?: string };
        if (!res.ok || !j.variants) {
          alert(`Generate failed: ${j.error ?? res.status}`);
          return;
        }
        setDynamicCopy((prev) => ({ ...prev, [section]: j.variants }));
        // Auto-open the picker so the new variants are immediately visible.
        setOpenCopyKey(section);
      } catch (e) {
        alert(`Generate failed: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setCopyBusy(null);
      }
    },
    [offer],
  );

  // load + apply on mount (settings + custom fonts)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const loaded = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
      setS(loaded);
      apply(loaded);
    } catch {
      apply(DEFAULTS);
    }
    const cf = loadCustomFonts();
    cf.forEach((f) => ensureGoogleFontLoaded(f.name));
    setCustomFonts(cf);
    setCopySel(loadCopyVariantSelections());
    const onCopyChange = () => setCopySel(loadCopyVariantSelections());
    window.addEventListener(VARIANTS_CHANGE_EVENT, onCopyChange);
    window.addEventListener("storage", onCopyChange);
    return () => {
      window.removeEventListener(VARIANTS_CHANGE_EVENT, onCopyChange);
      window.removeEventListener("storage", onCopyChange);
    };
  }, []);

  const applyCopyVariant = useCallback((section: SectionCopyKey, id: string | null) => {
    setCopySel((prev) => {
      const next = { ...prev };
      if (id === null) delete next[section];
      else next[section] = id;
      // Defer the save+dispatch to after this render commits. Calling
      // saveCopyVariantSelections inside the updater triggers
      // OfferProvider's event listener synchronously → React error
      // "Cannot update a component while rendering a different
      // component" (Samy 2026-05-26).
      queueMicrotask(() => saveCopyVariantSelections(next));
      return next;
    });
  }, []);

  const addCustomFont = useCallback((rawName: string) => {
    const name = rawName.trim();
    if (!name) return;
    ensureGoogleFontLoaded(name);
    const family = `"${name}", system-ui, sans-serif`;
    setCustomFonts((prev) => {
      if (prev.some((f) => f.name.toLowerCase() === name.toLowerCase())) return prev;
      const next = [...prev, { name, family }];
      saveCustomFonts(next);
      return next;
    });
    setFontInput("");
  }, []);

  /** All font options shown in the three pickers — curated list + custom. */
  const allFonts: FontOption[] = [
    ...FONTS,
    ...customFonts.map((f) => ({ label: `${f.name} — custom`, value: f.family, group: "Custom" })),
  ];

  /** Group options for <optgroup> rendering. */
  const fontGroups = allFonts.reduce<Record<string, FontOption[]>>((acc, f) => {
    const g = f.group ?? "Other";
    (acc[g] ??= []).push(f);
    return acc;
  }, {});

  // keyboard toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "d" || e.key === "D") && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const pickEyedropper = useCallback(async () => {
    const ED = (window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
    if (!ED) {
      alert("EyeDropper wird in diesem Browser nicht unterstützt (Chrome/Edge).");
      return;
    }
    try {
      const res = await new ED().open();
      update({ accent: res.sRGBHex });
    } catch {
      /* cancelled */
    }
  }, [update]);

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.2em] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          color: open ? "#1a0f04" : "var(--accent-bright)",
          background: open
            ? "linear-gradient(180deg, var(--accent-bright), var(--accent))"
            : "rgba(255,255,255,0.04)",
          borderColor: "var(--accent)",
          backdropFilter: "blur(12px)",
        }}
        aria-label="Toggle design panel"
      >
        Design
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="card glow-border flex flex-col gap-5 overflow-y-auto p-6"
            style={{
              borderRadius: "var(--r-card)",
              position: "fixed",
              top: "1rem",
              right: "1rem",
              bottom: "4.5rem",
              width: "min(340px, calc(100vw - 2rem))",
              background: "rgba(12, 11, 9, 0.94)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              zIndex: 50,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Design Panel</p>
                <p className="meta text-faint mt-1 text-[0.58rem]">Taste D zum Ein-/Ausblenden</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className="meta flex items-center gap-1.5 text-[0.55rem] tracking-[0.25em]"
                  style={{ color: "var(--accent-bright)" }}
                  title="All changes save automatically to this browser. Use Export below to back up or share."
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }}
                  />
                  AUTO-SAVED
                </span>
                <PresetIO
                  settings={s}
                  customFonts={customFonts}
                  copyVariants={copySel}
                  onImport={(snap) => {
                    if (snap.settings) {
                      setS(snap.settings);
                      apply(snap.settings);
                      try { localStorage.setItem(KEY, JSON.stringify(snap.settings)); } catch {}
                    }
                    if (Array.isArray(snap.customFonts)) {
                      snap.customFonts.forEach((f: CustomFont) => ensureGoogleFontLoaded(f.name));
                      setCustomFonts(snap.customFonts);
                      saveCustomFonts(snap.customFonts);
                    }
                    if (snap.variants) {
                      for (const [k, v] of Object.entries(snap.variants)) {
                        if (typeof v === "number") setVariant(k as SectionKey, v);
                      }
                    }
                    if (snap.copyVariants) {
                      saveCopyVariantSelections(snap.copyVariants);
                      setCopySel(snap.copyVariants);
                    }
                  }}
                />
              </div>
            </div>

            <div className="hairline" />
            <Presets />

            {/* accent */}
            <Field label="Accent color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={s.accent}
                  onChange={(e) => update({ accent: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded-md border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={s.accent}
                  onChange={(e) => update({ accent: e.target.value })}
                  className="inner-card w-24 px-2 py-1.5 text-[0.78rem]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
                />
                <button
                  onClick={pickEyedropper}
                  className="inner-card px-2.5 py-1.5 text-[0.7rem]"
                  style={{ color: "var(--accent-bright)" }}
                  title="Pipette: Farbe vom Bildschirm picken"
                >
                  Pipette
                </button>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c}
                    onClick={() => update({ accent: c })}
                    className="h-6 w-6 rounded-full border"
                    style={{
                      background: c,
                      borderColor: s.accent.toLowerCase() === c ? "#fff" : "var(--stroke-card)",
                    }}
                    title={c}
                  />
                ))}
              </div>
            </Field>

            {/* radius */}
            <Field label={`Border radius — ${s.radius}px`}>
              <input
                type="range"
                min={0}
                max={44}
                value={s.radius}
                onChange={(e) => update({ radius: Number(e.target.value) })}
                className="w-full accent-[var(--accent)]"
              />
            </Field>

            {/* font pickers — three slots, all share the same grouped catalog */}
            {(
              [
                { label: "Highlight font (accent)", key: "highlightFont" as const },
                { label: "Display font (headlines)", key: "displayFont" as const },
                { label: "Body font (text)", key: "bodyFont" as const },
              ]
            ).map(({ label, key }) => (
              <Field key={key} label={label}>
                <select
                  value={s[key]}
                  onChange={(e) => update({ [key]: e.target.value } as Partial<Settings>)}
                  className="inner-card w-full px-2.5 py-2 text-[0.82rem]"
                  style={{ color: "var(--ink)" }}
                >
                  {Object.entries(fontGroups).map(([group, list]) => (
                    <optgroup key={group} label={group} style={{ background: "#111" }}>
                      {list.map((f) => (
                        <option key={f.value} value={f.value} style={{ background: "#111" }}>
                          {f.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Field>
            ))}

            {/* custom Google Font: paste the exact name (e.g. "Sign Futuristic",
                "Inter Tight", "Big Shoulders Display"); appears in all three
                font pickers above + persists across reloads. */}
            <Field label="+ Custom Google Font">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={fontInput}
                  onChange={(e) => setFontInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomFont(fontInput);
                    }
                  }}
                  placeholder="e.g. Sign Futuristic"
                  className="inner-card flex-1 px-2.5 py-1.5 text-[0.78rem]"
                  style={{ color: "var(--ink)" }}
                />
                <button
                  onClick={() => addCustomFont(fontInput)}
                  className="rounded-[var(--r-control)] px-3 py-1.5 text-[0.7rem] font-semibold"
                  style={{
                    color: "#1a0f04",
                    background: "linear-gradient(180deg, var(--accent-bright), var(--accent))",
                  }}
                >
                  Add
                </button>
              </div>
              {customFonts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {customFonts.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => {
                        const next = customFonts.filter((x) => x.name !== f.name);
                        setCustomFonts(next);
                        saveCustomFonts(next);
                      }}
                      className="meta text-faint rounded-[var(--r-mini)] border border-[var(--stroke-card)] px-2 py-0.5 text-[0.55rem] hover:border-[var(--accent)]"
                      title="Remove"
                    >
                      {f.name} ×
                    </button>
                  ))}
                </div>
              )}
            </Field>

            {/* side padding — 0 = edge-to-edge, N = clear px from viewport edges */}
            <Field label={`Side padding — ${Math.max(0, s.sidePad)}px`}>
              <input
                type="range"
                min={0}
                max={200}
                value={Math.max(0, s.sidePad)}
                onChange={(e) => update({ sidePad: Number(e.target.value) })}
                className="w-full accent-[var(--accent)]"
              />
            </Field>

            {/* global text scale — scales html font-size so every rem unit
                scales together (typography only, viewport units untouched) */}
            <Field label={`Text size — ${Math.round((s.uiScale ?? 1) * 100)}%`}>
              <input
                type="range"
                min={0.8}
                max={1.6}
                step={0.05}
                value={s.uiScale ?? 1}
                onChange={(e) => update({ uiScale: Number(e.target.value) })}
                className="w-full accent-[var(--accent)]"
              />
              <div className="meta text-faint mt-1 flex justify-between text-[0.55rem]">
                <span>80%</span>
                <button
                  onClick={() => update({ uiScale: 1 })}
                  className="hover:text-[var(--accent-bright)]"
                  title="Reset to 100%"
                >
                  reset
                </button>
                <span>160%</span>
              </div>
            </Field>

            {/* toggles */}
            <Toggle
              label="Smooth scroll"
              on={s.smoothScroll}
              onChange={(v) => update({ smoothScroll: v })}
            />
            <Toggle
              label="Snap to section"
              on={s.snap}
              onChange={(v) => update({ snap: v })}
            />
            <Toggle
              label="Dev: section name (top-left)"
              on={s.devHud}
              onChange={(v) => update({ devHud: v })}
            />

            <div className="hairline" />
            <p className="meta text-faint text-[0.58rem]">Graphics</p>
            <SelectField
              label="Background shader"
              value={s.shader}
              options={SHADERS}
              onChange={(v) => update({ shader: v })}
            />
            <SelectField
              label="Button style"
              value={s.buttonStyle}
              options={BUTTON_STYLES}
              onChange={(v) => update({ buttonStyle: v })}
            />

            <div className="hairline" />
            <p className="meta text-faint text-[0.58rem]">Atmosphere</p>
            <SelectField
              label="Cursor effect"
              value={s.cursorFx}
              options={CURSORS}
              onChange={(v) => update({ cursorFx: v })}
            />
            <Toggle
              label="Glass bubbles"
              on={s.bubbles}
              onChange={(v) => update({ bubbles: v })}
            />
            <Toggle
              label="Floating brand mark"
              on={s.bgMark}
              onChange={(v) => update({ bgMark: v })}
            />

            <div className="hairline" />
            <p className="meta text-faint text-[0.58rem]">Sections — on/off</p>
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_SECTIONS.map(({ key, label }) => {
                const cfgEnabled = offer.sections.find((s) => s.key === key)?.enabled ?? true;
                const override = enabledOverride[key];
                const on = override === undefined ? cfgEnabled : override;
                return (
                  <button
                    key={key}
                    onClick={() => toggleSection(key, !on)}
                    className="inner-card flex items-center justify-between px-3 py-2"
                    title={`${label}: ${on ? "on" : "off"}`}
                  >
                    <span className="text-[0.78rem]" style={{ color: on ? "var(--ink)" : "var(--ink-3)" }}>
                      {label}
                    </span>
                    <span
                      className="relative h-4 w-7 rounded-full transition"
                      style={{ background: on ? "var(--accent)" : "rgba(255,255,255,0.1)" }}
                    >
                      <span
                        className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
                        style={{ left: on ? "0.875rem" : "0.125rem" }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hairline" />
            <p className="meta text-faint text-[0.58rem]">Section layouts — 6 variants each</p>
            {(Object.keys(VARIANT_COUNT) as SectionKey[]).map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.82rem] text-dim">{SECTION_LABEL[key]}</span>
                  <span className="meta text-faint text-[0.55rem]">
                    {VARIANT_NOTES[key]?.[variants[key]] ?? `Variant ${variants[key] + 1}`}
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: VARIANT_COUNT[key] }).map((_, idx) => {
                    const active = variants[key] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setVariant(key, idx);
                          document
                            .getElementById(key)
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="inner-card h-7 flex-1 text-[0.7rem] font-semibold"
                        style={{
                          color: active ? "#1a0f04" : "var(--ink-2)",
                          background: active ? "var(--accent)" : undefined,
                          borderColor: active ? "var(--accent)" : undefined,
                        }}
                        title={VARIANT_NOTES[key]?.[idx] ?? `Variant ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                {/* per-section copy picker (skip About — no content slot in OfferContent) */}
                {key !== "about" && (
                  <CopyVariantPicker
                    section={key as SectionCopyKey}
                    selectedId={copySel[key as SectionCopyKey]}
                    open={openCopyKey === key}
                    onToggle={() =>
                      setOpenCopyKey((prev) => (prev === key ? null : (key as SectionCopyKey)))
                    }
                    onPick={(id) => applyCopyVariant(key as SectionCopyKey, id)}
                    overrideVariants={dynamicCopy[key as SectionCopyKey]}
                    busy={copyBusy === key}
                    onGenerate={() => generateCopyVariants(key as SectionCopyKey)}
                  />
                )}
                {/* Hero panel — Samy 2026-05-26: Buttons toggle-bar +
                   Überschrift/Unterschrift editierbar. */}
                {key === "hero" && (
                  <div className="mt-1.5 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setHeroButtons({ primary: !heroButtons.primary })}
                        className="inner-card flex items-center justify-between px-3 py-2"
                        title={`Primary button: ${heroButtons.primary ? "on" : "off"}`}
                      >
                        <span
                          className="text-[0.72rem]"
                          style={{ color: heroButtons.primary ? "var(--ink)" : "var(--ink-3)" }}
                        >
                          Primary button
                        </span>
                        <span
                          className="relative h-4 w-7 rounded-full transition"
                          style={{ background: heroButtons.primary ? "var(--accent)" : "rgba(255,255,255,0.1)" }}
                        >
                          <span
                            className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
                            style={{ left: heroButtons.primary ? "0.875rem" : "0.125rem" }}
                          />
                        </span>
                      </button>
                      <button
                        onClick={() => setHeroButtons({ ghost: !heroButtons.ghost })}
                        className="inner-card flex items-center justify-between px-3 py-2"
                        title={`Ghost button: ${heroButtons.ghost ? "on" : "off"}`}
                      >
                        <span
                          className="text-[0.72rem]"
                          style={{ color: heroButtons.ghost ? "var(--ink)" : "var(--ink-3)" }}
                        >
                          Ghost button
                        </span>
                        <span
                          className="relative h-4 w-7 rounded-full transition"
                          style={{ background: heroButtons.ghost ? "var(--accent)" : "rgba(255,255,255,0.1)" }}
                        >
                          <span
                            className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
                            style={{ left: heroButtons.ghost ? "0.875rem" : "0.125rem" }}
                          />
                        </span>
                      </button>
                    </div>
                    <HeroCopyField
                      label="Eyebrow"
                      placeholder={offer.content.hero.eyebrow}
                      value={heroOverride.eyebrow ?? ""}
                      onChange={(v) => setHeroOverride({ eyebrow: v })}
                    />
                    <HeroCopyField
                      label="Headline"
                      placeholder={offer.content.hero.headline}
                      value={heroOverride.headline ?? ""}
                      onChange={(v) => setHeroOverride({ headline: v })}
                    />
                    <HeroCopyField
                      label="Headline accent"
                      placeholder={offer.content.hero.headlineAccent}
                      value={heroOverride.headlineAccent ?? ""}
                      onChange={(v) => setHeroOverride({ headlineAccent: v })}
                    />
                    <HeroCopyField
                      label="Subline"
                      placeholder={offer.content.hero.sub}
                      value={heroOverride.sub ?? ""}
                      onChange={(v) => setHeroOverride({ sub: v })}
                      multiline
                    />
                  </div>
                )}
                {/* Project-filter only for Work — Samy 2026-05-24: "ich will auswählen welche Projekte gezeigt werden" */}
                {key === "work" && (
                  <div className="mt-1.5 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="meta text-faint text-[0.55rem]">
                        Projects ({workProjects.length === 0 ? `all (${ALL_CASES.length})` : `${workProjects.length}/${ALL_CASES.length}`})
                      </span>
                      <button
                        onClick={() => setWorkProjects([])}
                        className="meta text-faint hover:text-accent-bright text-[0.55rem] underline-offset-2 hover:underline"
                        title="Alle zeigen (Filter aus)"
                      >
                        all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ALL_CASES.map((c) => {
                        const explicit = workProjects.length > 0;
                        const on = !explicit || workProjects.includes(c.name);
                        return (
                          <button
                            key={c.name}
                            onClick={() => {
                              if (!explicit) {
                                // first click flips to whitelist mode minus this one
                                setWorkProjects(ALL_CASES.map((x) => x.name).filter((n) => n !== c.name));
                              } else {
                                const next = on
                                  ? workProjects.filter((n) => n !== c.name)
                                  : [...workProjects, c.name];
                                setWorkProjects(next);
                              }
                            }}
                            className="inner-card px-2 py-1 text-[0.6rem]"
                            style={{
                              color: on ? "var(--ink)" : "var(--ink-3)",
                              background: on ? "rgba(249,115,22,0.12)" : undefined,
                              borderColor: on ? "var(--accent)" : undefined,
                              opacity: on ? 1 : 0.55,
                            }}
                            title={on ? "abwählen" : "zeigen"}
                          >
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => {
                setS(DEFAULTS);
                apply(DEFAULTS);
                try {
                  localStorage.removeItem(KEY);
                } catch {}
              }}
              className="meta text-faint mt-auto self-start text-[0.62rem] underline underline-offset-4 hover:text-[var(--accent-bright)]"
            >
              Reset to brand defaults
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="meta text-faint mb-2 text-[0.58rem]">{label}</p>
      {children}
    </div>
  );
}

/* Small inline text field used by the Hero panel. Placeholder shows the
 * current offer-config default so empty input = use default. */
function HeroCopyField({
  label,
  value,
  placeholder,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="meta text-faint text-[0.55rem] tracking-[0.3em]">
          {label.toUpperCase()}
        </span>
        {value !== "" && (
          <button
            onClick={() => onChange("")}
            className="meta text-faint hover:text-accent-bright text-[0.55rem] underline-offset-2 hover:underline"
            title="Auf Default zurücksetzen"
          >
            reset
          </button>
        )}
      </div>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="inner-card resize-y px-2.5 py-1.5 text-[0.78rem]"
          style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="inner-card px-2.5 py-1.5 text-[0.78rem]"
          style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
        />
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.82rem] text-dim">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="inner-card px-2 py-1.5 text-[0.8rem]"
        style={{ color: "var(--ink)" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#111" }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="inner-card flex items-center justify-between px-3 py-2.5"
    >
      <span className="text-[0.85rem] text-dim">{label}</span>
      <span
        className="relative h-5 w-9 rounded-full transition"
        style={{ background: on ? "var(--accent)" : "rgba(255,255,255,0.12)" }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all"
          style={{ left: on ? "1.125rem" : "0.125rem" }}
        />
      </span>
    </button>
  );
}

/* Compact Export / Import controls in the DevPanel header.
   Export builds a single JSON snapshot of {settings, customFonts, variants}
   and triggers a browser download — Samy can keep per-client presets next
   to the offer-config file, share them, and re-load them on any machine.
   Import reads a previously-exported JSON and rehydrates state. */
function PresetIO({
  settings,
  customFonts,
  copyVariants,
  onImport,
}: {
  settings: Settings;
  customFonts: CustomFont[];
  copyVariants: CopyVariantSelections;
  onImport: (snap: {
    settings?: Settings;
    customFonts?: CustomFont[];
    variants?: Partial<Record<SectionKey, number>>;
    copyVariants?: CopyVariantSelections;
  }) => void;
}) {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const buildSnapshot = useCallback(() => {
    let variants: Partial<Record<SectionKey, number>> = {};
    try {
      const raw = localStorage.getItem("groundx.variants");
      if (raw) variants = JSON.parse(raw);
    } catch {}
    return {
      meta: { exportedAt: new Date().toISOString(), app: "groundx-offer", schema: 2 },
      settings,
      customFonts,
      variants,
      copyVariants,
    };
  }, [settings, customFonts, copyVariants]);

  const exportSnapshot = useCallback(() => {
    const snap = buildSnapshot();
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `groundx-preset-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [settings, customFonts]);

  const importSnapshot = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const snap = JSON.parse(text);
        onImport({
          settings: snap.settings,
          customFonts: snap.customFonts,
          variants: snap.variants,
          copyVariants: snap.copyVariants,
        });
      } catch (e) {
        alert("Invalid preset file: " + (e instanceof Error ? e.message : String(e)));
      }
    };
    input.click();
  }, [onImport]);

  const saveToDisk = useCallback(async () => {
    const snap = buildSnapshot();
    try {
      const res = await fetch("/api/save-preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snap),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Save failed (${res.status}): ${j.error ?? "unknown"}`);
        return;
      }
      const stamp = new Date().toLocaleTimeString();
      setSavedAt(stamp);
      window.setTimeout(() => setSavedAt(null), 2200);
    } catch (e) {
      alert("Save failed: " + (e instanceof Error ? e.message : String(e)));
    }
  }, [buildSnapshot]);

  return (
    <div className="flex flex-col items-end gap-0.5">
      <div className="flex gap-1">
        <button
          onClick={saveToDisk}
          className="meta rounded-[var(--r-mini)] border px-1.5 py-0.5 text-[0.55rem] tracking-[0.2em]"
          style={{
            color: savedAt ? "#1a0f04" : "var(--accent-bright)",
            background: savedAt ? "var(--accent)" : "transparent",
            borderColor: "var(--accent)",
          }}
          title="Write current settings to data/preset.json (dev only). PDF + fresh visits inherit it."
        >
          {savedAt ? `SAVED · ${savedAt}` : "💾 DISK"}
        </button>
        <button
          onClick={exportSnapshot}
          className="meta text-faint rounded-[var(--r-mini)] border border-[var(--stroke-card)] px-1.5 py-0.5 text-[0.55rem] tracking-[0.2em] hover:border-[var(--accent)] hover:text-[var(--accent-bright)]"
          title="Download current settings as JSON"
        >
          ↓ EXPORT
        </button>
        <button
          onClick={importSnapshot}
          className="meta text-faint rounded-[var(--r-mini)] border border-[var(--stroke-card)] px-1.5 py-0.5 text-[0.55rem] tracking-[0.2em] hover:border-[var(--accent)] hover:text-[var(--accent-bright)]"
          title="Load settings from a previously exported JSON"
        >
          ↑ IMPORT
        </button>
      </div>
    </div>
  );
}

/* Per-section copy-variant picker — DE/EN aware. */
const COPY_LABEL_DE: Record<string, string> = {
  Default: "Standard",
  Direct: "Direkt",
  Editorial: "Editorial",
  Punchy: "Knackig",
};
const COPY_VIBE_DE: Record<string, string> = {
  "Config copy as written": "Standard-Text wie konfiguriert",
  // hero
  "Plain, fast, what + why": "Klar, schnell, was + warum",
  "Magazine cadence, narrative": "Magazin-Takt, erzählerisch",
  "Short lines, momentum": "Kurze Zeilen, Tempo",
  // angle
  "Why I'm a fit, no warm-up": "Warum ich passe — ohne Aufwärmen",
  "Soft sell, story-first": "Soft-Sell, Story zuerst",
  "Punchy fit-statements": "Knackige Fit-Statements",
  // capabilities
  "What I ship, no fluff": "Was ich ausliefere — ohne Füllstoff",
  "A craft-letter framing": "Ein Brief-Stil aus dem Handwerk",
  "Rapid-fire capability list": "Schnelle Capability-Liste",
  // work
  "Reference set, no story": "Referenzen, keine Story",
  "A portfolio with weight": "Ein Portfolio mit Gewicht",
  "Receipts, fast": "Belege, schnell",
  // brand
  "What this could look like": "Wie sich das anfühlen könnte",
  "A brand world with rules": "Eine Markenwelt mit Regeln",
  "Mood + materials, terse": "Stimmung + Materialien, knapp",
  // offer
  "Pick a path": "Wähle einen Weg",
  "Three doors, framed": "Drei Türen, gerahmt",
  "Tabs + the price story": "Tabs + die Preis-Story",
  // process
  "Day-by-day, no fluff": "Tag für Tag, ohne Füllstoff",
  "A guided onboarding": "Ein begleitetes Onboarding",
  "From handshake to launch": "Vom Handschlag zum Launch",
  // testimonials
  "Real voices, plain": "Echte Stimmen, schlicht",
  "Quote-page editorial": "Editorial-Zitatseite",
  "Best lines only": "Nur die besten Zeilen",
  // faq
  "Direct Q&A": "Direkte Fragen & Antworten",
  "Long-form FAQs": "FAQs in Langform",
  "Snappy FAQs": "Knappe FAQs",
  // contact
  "Just say go": "Einfach Go sagen",
  "An open-door close": "Ein offener Türabschluss",
  "Now-or-later": "Jetzt oder später",
};
function localizeCopyLabel(label: string, lang: "en" | "de"): string {
  return lang === "de" ? COPY_LABEL_DE[label] ?? label : label;
}
function localizeCopyVibe(vibe: string, lang: "en" | "de"): string {
  return lang === "de" ? COPY_VIBE_DE[vibe] ?? vibe : vibe;
}

function CopyVariantPicker({
  section,
  selectedId,
  open,
  onToggle,
  onPick,
  overrideVariants,
  busy,
  onGenerate,
}: {
  section: SectionCopyKey;
  selectedId: string | undefined;
  open: boolean;
  onToggle: () => void;
  onPick: (id: string | null) => void;
  overrideVariants?: CopyVariant[];
  busy?: boolean;
  onGenerate?: () => void;
}) {
  const { lang } = useLang();
  const variants = overrideVariants ?? COPY_VARIANTS[section] ?? [];
  if (variants.length === 0) return null;
  const active = variants.find((v) => v.id === selectedId);
  const rawLabel = selectedId ? active?.label ?? selectedId : "Default";
  const label = localizeCopyLabel(rawLabel, lang);
  const sourceLabel = overrideVariants
    ? lang === "de" ? "KI" : "AI"
    : lang === "de" ? "KURATIERT" : "CURATED";
  const copyWord = lang === "de" ? "TEXT" : "COPY";
  const aiTitle = lang === "de"
    ? "3 frische Text-Varianten via Claude erzeugen (braucht ANTHROPIC_API_KEY in .env.local)"
    : "Generate 3 fresh copy variants via Claude (needs ANTHROPIC_API_KEY in .env.local)";

  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onToggle}
          className="meta text-faint flex flex-1 items-center justify-between gap-2 rounded-[var(--r-mini)] border border-[var(--stroke-card)] px-2.5 py-1.5 text-[0.58rem] tracking-[0.2em] hover:border-[var(--accent)] hover:text-[var(--accent-bright)]"
          aria-expanded={open}
        >
          <span>
            <span style={{ color: "var(--accent-bright)" }}>✦</span> {copyWord} · {label.toUpperCase()}
            <span className="text-faint ml-2 text-[0.5rem] opacity-60">{sourceLabel}</span>
          </span>
          <span style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 200ms" }}>›</span>
        </button>
        {onGenerate && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={busy}
            className="meta rounded-[var(--r-mini)] border px-2 py-1.5 text-[0.58rem] tracking-[0.2em] transition-colors disabled:opacity-60"
            style={{
              color: busy ? "var(--ink-3)" : "var(--accent-bright)",
              borderColor: "var(--accent)",
            }}
            title={aiTitle}
          >
            {busy ? "…" : lang === "de" ? "✨ KI" : "✨ AI"}
          </button>
        )}
      </div>
      {open && (
        <div className="flex flex-col gap-1">
          <CopyOption
            isActive={!selectedId}
            label={localizeCopyLabel("Default", lang)}
            vibe={localizeCopyVibe("Config copy as written", lang)}
            preview={null}
            onPick={() => onPick(null)}
          />
          {variants.map((v) => {
            const previewSource =
              ("headline" in v.patch && v.patch.headline) ||
              ("title" in v.patch && v.patch.title) ||
              ("eyebrow" in v.patch && v.patch.eyebrow) ||
              null;
            return (
              <CopyOption
                key={v.id}
                isActive={selectedId === v.id}
                label={localizeCopyLabel(v.label, lang)}
                vibe={localizeCopyVibe(v.vibe, lang)}
                preview={previewSource}
                onPick={() => {
                  onPick(v.id);
                  document
                    .getElementById(section)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function CopyOption({
  isActive,
  label,
  vibe,
  preview,
  onPick,
}: {
  isActive: boolean;
  label: string;
  vibe: string;
  preview: string | null;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="group flex flex-col items-start gap-0.5 rounded-[var(--r-mini)] border px-2.5 py-1.5 text-left transition-colors"
      style={{
        borderColor: isActive ? "var(--accent)" : "var(--stroke-card)",
        background: isActive ? "rgba(249,115,22,0.06)" : "transparent",
      }}
    >
      <div className="flex w-full items-baseline justify-between gap-2">
        <span
          className="text-[0.78rem] font-semibold"
          style={{ color: isActive ? "var(--accent-bright)" : "var(--ink)" }}
        >
          {label}
        </span>
        <span className="meta text-faint text-[0.55rem]">{vibe}</span>
      </div>
      {preview && (
        <span className="text-faint truncate text-[0.7rem]" style={{ maxWidth: "100%" }}>
          “{preview}”
        </span>
      )}
    </button>
  );
}
