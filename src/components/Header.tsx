"use client";

/* Sticky brand lockup, top-left — the deck's header. */
export function Header() {
  return (
    <header
      className="fixed top-0 left-0 z-40 flex items-center gap-2.5 px-5 py-4"
      style={{ mixBlendMode: "normal" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/zambo-logo.png" alt="ZamboDezigns" className="h-6 w-6 opacity-90" />
      <span className="meta text-[0.6rem]" style={{ color: "var(--ink-2)" }}>
        ZAMBODEZIGNS
      </span>
    </header>
  );
}
