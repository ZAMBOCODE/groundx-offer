"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CONFIG, mergeConfig, type OfferConfig } from "@/lib/config";

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

export function OfferProvider({ children }: { children: React.ReactNode }) {
  const [cfg, setCfg] = useState<OfferConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    applyAccent(DEFAULT_CONFIG.brand.accent);
    let id: string | null = null;
    try {
      id = new URLSearchParams(window.location.search).get("offer");
    } catch {}
    if (!id) return;
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
  }, []);

  return <Ctx.Provider value={cfg}>{children}</Ctx.Provider>;
}
