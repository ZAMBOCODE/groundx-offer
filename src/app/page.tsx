import { OfferProvider } from "@/components/OfferProvider";
import { DesignProvider } from "@/components/design-context";
import { LanguageProvider } from "@/components/language-context";
import { LangToggle } from "@/components/LangToggle";
import { DeckBody } from "@/components/DeckBody";

export default function Page() {
  return (
    <OfferProvider>
      <LanguageProvider>
        <DesignProvider>
          <LangToggle />
          <DeckBody />
        </DesignProvider>
      </LanguageProvider>
    </OfferProvider>
  );
}
