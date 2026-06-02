"use client";

import { useLang } from "./language-context";
import { useOffer } from "./OfferProvider";

/* Fixed top-right action bar: [Book a call (Calendly)] [EN/DE].
   Samy 2026-05-24: "calendly hinzufügen als book a call oben im header".
   Beides als kompakte Pills mit derselben Höhe damit's optisch eine Einheit ist.
   data-pdf-hide → PDF-Export-Script versteckt das. */

export function HeaderActions() {
  const { lang, setLang } = useLang();
  const { brand } = useOffer();

  // Prefer WhatsApp for "Book a call"; fall back to Calendly if no WA number.
  const bookHref = brand.whatsapp
    ? `https://wa.me/${brand.whatsapp}${brand.whatsappMessage ? `?text=${encodeURIComponent(brand.whatsappMessage)}` : ""}`
    : brand.calendly;

  return (
    <div
      data-pdf-hide
      className="fixed top-5 right-5 z-40 flex items-center gap-2"
    >
      {/* Samy 2026-06-02: "Book a call" geht jetzt auf WhatsApp statt Calendly. */}
      {bookHref && (
        <a
          href={bookHref}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition"
          style={{
            color: "#1a0f04",
            background: "linear-gradient(180deg, var(--accent-bright), var(--accent))",
            fontFamily: "var(--font-mono)",
            boxShadow: "0 6px 18px rgba(249,115,22,0.32), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
          title={lang === "de" ? "Per WhatsApp einen Call vereinbaren" : "Book a call via WhatsApp"}
        >
          <CalIcon size={11} />
          <span>{lang === "de" ? "Termin buchen" : "Book a call"}</span>
        </a>
      )}

      <div
        className="inline-flex items-center gap-0.5 rounded-full p-1 backdrop-blur"
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
    </div>
  );
}

function CalIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
