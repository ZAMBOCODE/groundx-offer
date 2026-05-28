import { OfferProvider } from "@/components/OfferProvider";
import { DesignProvider } from "@/components/design-context";
import { LanguageProvider } from "@/components/language-context";
import { HeaderActions } from "@/components/HeaderActions";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { DeckBody } from "@/components/DeckBody";

// Samy 2026-05-27 (Run-5): WhatsAppFloat doch wieder rein. "WhatsApp soll
// trotzdem da sein". Der Calendly-Termin-Button im Header bleibt der
// primaere CTA, die WA-Float ist der schnelle alternative Kanal.
export default function Page() {
  return (
    <LanguageProvider>
      <OfferProvider>
        <DesignProvider>
          <HeaderActions />
          <DeckBody />
          <WhatsAppFloat />
        </DesignProvider>
      </OfferProvider>
    </LanguageProvider>
  );
}
