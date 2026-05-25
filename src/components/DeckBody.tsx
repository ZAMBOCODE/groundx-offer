"use client";

import type { ComponentType } from "react";
import { Hero } from "./Hero";
import {
  About, Angle, Capabilities, Work, BrandTeaser, Offer, Process, Contact,
  TrustedBy, Testimonials, FAQ,
} from "./Sections";
import { DevPanel } from "./DevPanel";
import { useOffer } from "./OfferProvider";
import { useDesign } from "./design-context";
import type { SectionKey } from "@/lib/config";

const REGISTRY: Record<SectionKey, ComponentType> = {
  hero: Hero,
  trustedBy: TrustedBy,
  about: About,
  angle: Angle,
  capabilities: Capabilities,
  work: Work,
  testimonials: Testimonials,
  brand: BrandTeaser,
  offer: Offer,
  process: Process,
  faq: FAQ,
  contact: Contact,
};

export function DeckBody() {
  const cfg = useOffer();
  const { enabledOverride } = useDesign();
  return (
    <main>
      {cfg.sections
        .filter((s) => {
          // DevPanel override wins over cfg.sections[].enabled.
          if (enabledOverride[s.key] === false) return false;
          if (enabledOverride[s.key] === true) return true;
          return s.enabled;
        })
        .map((s, i) => {
          const C = REGISTRY[s.key];
          if (!C) return null;
          return (
            <div key={`${s.key}-${i}`}>
              {i === 1 && <div className="hairline mx-auto max-w-5xl" />}
              <C />
            </div>
          );
        })}
      <DevPanel />
    </main>
  );
}
