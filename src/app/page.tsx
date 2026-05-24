import { OfferProvider } from "@/components/OfferProvider";
import { DesignProvider } from "@/components/design-context";
import { DeckBody } from "@/components/DeckBody";

export default function Page() {
  return (
    <OfferProvider>
      <DesignProvider>
        <DeckBody />
      </DesignProvider>
    </OfferProvider>
  );
}
