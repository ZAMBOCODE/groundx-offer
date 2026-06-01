import { Deck } from "@/components/Deck";

// Root: the Ground X template (DEFAULT_CONFIG). Per-client decks live at /:slug.
// WhatsAppFloat bleibt drin (Samy 2026-05-27, Run-5): WA als schneller
// Alt-Kanal neben dem Calendly-CTA im Header. Beide gerendert im Deck.
export default function Page() {
  return <Deck />;
}
