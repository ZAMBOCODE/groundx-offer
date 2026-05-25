import { OfferProvider } from "@/components/OfferProvider";
import { DesignProvider } from "@/components/design-context";
import { LanguageProvider } from "@/components/language-context";
import { HeaderActions } from "@/components/HeaderActions";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { DeckBody } from "@/components/DeckBody";

export default function Page() {
  return (
    <OfferProvider>
      <LanguageProvider>
        <DesignProvider>
          <HeaderActions />
          <DeckBody />
          <WhatsAppFloat />
        </DesignProvider>
      </LanguageProvider>
    </OfferProvider>
  );
}
