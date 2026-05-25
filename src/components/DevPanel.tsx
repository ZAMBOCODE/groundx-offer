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
import { Presets } from "./Presets";
import { cases as ALL_CASES } from "@/lib/data";
import type { SectionKey as ConfigSectionKey } from "@/lib/config";

const ALL_SECTIONS: { key: ConfigSectionKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "angle", label: "Why me" },
  { key: "capabilities", label: "Capabilities" },
  { key: "work", label: "Work" },
  { key: "brand", label: "Brand" },
  { key: "offer", label: "Offer" },
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
  smoothScroll: boolean;
  snap: boolean;
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
  smoothScroll: true,
  snap: true,
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
  root.style.scrollBehavior = s.smoothScroll ? "smooth" : "auto";
  root.classList.toggle("snap", s.snap);
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
  const { variants, setVariant, enabledOverride, toggleSection, workProjects, setWorkProjects } = useDesign();
  const offer = useOffer();

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
            <div>
              <p className="eyebrow">Design Panel</p>
              <p className="meta text-faint mt-1 text-[0.58rem]">Taste D zum Ein-/Ausblenden</p>
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
