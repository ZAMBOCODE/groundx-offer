"use client";

import { useOffer } from "./OfferProvider";
import { useLang } from "./language-context";

/* Fixed bottom-right WhatsApp pill. Orange-only per brand-rule (no green).
   Samy 2026-05-24: "unten rechts whatsapp icon". data-pdf-hide → hidden in PDF. */

export function WhatsAppFloat() {
  const { brand } = useOffer();
  const { lang } = useLang();
  const num = brand.whatsapp;
  if (!num) return null;
  const msg = brand.whatsappMessage ?? (lang === "de" ? "Hi Samy, ich habe gerade das Deck gesehen." : "Hi Samy, I just saw the deck.");
  const href = `https://wa.me/${num.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  return (
    <a
      data-pdf-hide
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full transition hover:scale-105"
      style={{
        background: "linear-gradient(180deg, var(--accent-bright), var(--accent))",
        color: "#1a0f04",
        boxShadow: "0 10px 28px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
      title={lang === "de" ? "WhatsApp-Nachricht" : "Message on WhatsApp"}
      aria-label="WhatsApp"
    >
      <WaIcon size={20} />
    </a>
  );
}

function WaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.42 1.32 4.91L2.05 22l5.32-1.39a9.86 9.86 0 0 0 4.67 1.18h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 19.06 4.9a9.86 9.86 0 0 0-7.02-2.9zm0 18.13c-1.48 0-2.93-.4-4.2-1.16l-.3-.18-3.16.83.84-3.08-.2-.32a8.18 8.18 0 0 1-1.26-4.38c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.4 5.82c0 4.53-3.69 8.22-8.22 8.22zm4.51-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.51.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.46-.27z"/>
    </svg>
  );
}
