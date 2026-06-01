"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_CONFIG, mergeConfig, pickContent, type OfferConfig } from "@/lib/config";
import {
  VARIANTS_CHANGE_EVENT,
  applyCopyVariants,
  loadCopyVariantSelections,
  type CopyVariantSelections,
} from "@/lib/copyVariants";
import { useLang } from "./language-context";

const API =
  process.env.NEXT_PUBLIC_AETHER_API || "https://178.104.134.120.sslip.io/api";

const Ctx = createContext<OfferConfig>(DEFAULT_CONFIG);
export const useOffer = () => useContext(Ctx);

function lighten(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const n = parseInt(h, 16);
  const r = Math.round(((n >> 16) & 255) + (255 - ((n >> 16) & 255)) * amt);
  const g = Math.round(((n >> 8) & 255) + (255 - ((n >> 8) & 255)) * amt);
  const b = Math.round((n & 255) + (255 - (n & 255)) * amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
function rgba(hex: string, a: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
function applyAccent(hex: string) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  // don't fight a user-saved dev-panel accent
  try {
    const saved = localStorage.getItem("groundx.devpanel");
    if (saved && JSON.parse(saved)?.accent) return;
  } catch {}
  const root = document.documentElement;
  root.style.setProperty("--accent", hex);
  root.style.setProperty("--accent-bright", lighten(hex, 0.18));
  root.style.setProperty("--accent-dim", rgba(hex, 0.18));
}

export function OfferProvider({
  children,
  offerId,
}: {
  children: React.ReactNode;
  /** client slug/id from the /:slug route; falls back to ?offer= query. */
  offerId?: string;
}) {
  const [cfg, setCfg] = useState<OfferConfig>(DEFAULT_CONFIG);
  const [copyVariants, setCopyVariants] = useState<CopyVariantSelections>({});

  useEffect(() => {
    applyAccent(DEFAULT_CONFIG.brand.accent);
    let id: string | null = offerId ?? null;
    if (!id) {
      try {
        id = new URLSearchParams(window.location.search).get("offer");
      } catch {}
    }
    if (id) {
      fetch(`${API}/offers/${encodeURIComponent(id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((row: { config?: Partial<OfferConfig> } | null) => {
          if (row?.config) {
            const merged = mergeConfig(row.config);
            setCfg(merged);
            applyAccent(merged.brand.accent);
          }
        })
        .catch(() => {});
    }

    // load + subscribe to copy-variant selection changes
    setCopyVariants(loadCopyVariantSelections());
    const onChange = () => setCopyVariants(loadCopyVariantSelections());
    window.addEventListener(VARIANTS_CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange); // cross-tab updates too
    return () => {
      window.removeEventListener(VARIANTS_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [offerId]);

  // Merge active copy-variant patches over the section content, then
  // swap to the German translation if the active language is 'de'.
  // Memoized so identity stays stable across no-op re-renders.
  const { lang } = useLang();
  const merged = useMemo<OfferConfig>(() => {
    const withCopy =
      Object.keys(copyVariants).length === 0
        ? cfg
        : { ...cfg, content: applyCopyVariants(cfg.content, copyVariants) };
    return { ...withCopy, content: pickContent(lang, withCopy.content) };
  }, [cfg, copyVariants, lang]);

  return <Ctx.Provider value={merged}>{children}</Ctx.Provider>;
}
