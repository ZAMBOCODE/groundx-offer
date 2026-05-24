"use client";

import { useLang } from "./language-context";

/* Fixed top-right Sprach-Toggle. Pill mit zwei Hälften. Sichtbar permanent,
   damit Samy + jeder Empfänger der Seite das Lang umschalten kann. */

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="fixed top-5 right-5 z-40 inline-flex items-center gap-0.5 rounded-full p-1 backdrop-blur"
      style={{
        background: "rgba(8,7,5,0.6)",
        border: "1px solid var(--stroke-card)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {(["en", "de"] as const).map((l) => {
        const on = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition"
            style={{
              color: on ? "#1a0f04" : "var(--ink-2)",
              background: on
                ? "linear-gradient(180deg, var(--accent-bright), var(--accent))"
                : "transparent",
            }}
            aria-pressed={on}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
