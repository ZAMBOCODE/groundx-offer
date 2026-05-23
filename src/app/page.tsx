import { Hero } from "@/components/Hero";
import {
  Angle,
  Capabilities,
  Work,
  BrandTeaser,
  Offer,
  Contact,
} from "@/components/Sections";
import { DevPanel } from "@/components/DevPanel";
import { DesignProvider } from "@/components/design-context";

export default function Page() {
  return (
    <DesignProvider>
      <main>
        <Hero />
        <div className="hairline mx-auto max-w-5xl" />
        <Angle />
        <Capabilities />
        <Work />
        <BrandTeaser />
        <Offer />
        <Contact />
        <DevPanel />
      </main>
    </DesignProvider>
  );
}
