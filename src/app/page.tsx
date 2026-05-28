import { OfferProvider } from "@/components/OfferProvider";
import { DesignProvider } from "@/components/design-context";
import { LanguageProvider } from "@/components/language-context";
import { HeaderActions } from "@/components/HeaderActions";
import { DeckBody } from "@/components/DeckBody";

// Samy 2026-05-27 (Run-4): "Man kommt auf WhatsApp wenn man auf Termin
// buchen geht." Der WhatsAppFloat unten rechts (orange Pille, sehr
// prominent) wurde mit dem "Termin buchen"-CTA verwechselt. Float raus,
// damit "Termin buchen" oben rechts der einzige CTA bleibt und sauber
// zu Calendly fuehrt.
export default function Page() {
  return (
    <LanguageProvider>
      <OfferProvider>
        <DesignProvider>
          <HeaderActions />
          <DeckBody />
        </DesignProvider>
      </OfferProvider>
    </LanguageProvider>
  );
}
