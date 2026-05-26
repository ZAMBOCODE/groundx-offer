"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/* Sprache-Toggle. Samy 2026-05-24: "es soll immer Deutsch und Englisch als
   Sprachauswahl oben geben." Speicher in localStorage, default EN. Content-
   Strings können entweder plain string sein (= zeigt immer) oder { en, de }
   (= wählt nach lang). `t(value, lang)` ist der Helper. */

export type Lang = "en" | "de";

export type Loc = string | { en?: string; de?: string };

const KEY = "groundx.lang";

const LangCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === "en" || raw === "de") setLangState(raw);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

/** Pick the right string out of a string-or-{en,de} value. */
export function t(v: Loc | undefined, lang: Lang): string {
  if (v === undefined) return "";
  if (typeof v === "string") return v;
  return v[lang] ?? v.en ?? v.de ?? "";
}

/** Convenience for pairs of EN/DE in component code. */
export function pair(en: string, de: string): Loc {
  return { en, de };
}
