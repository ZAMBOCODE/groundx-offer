/**
 * OfferConfig — the per-client contract the Techne renderer consumes.
 * Mirrors services/aether-api/src/offers.ts. The deck fetches GET /offers/:id
 * (via ?offer=<id>) and merges the returned `config` over DEFAULT_CONFIG, so a
 * new client gets a different brand, section order/variants and copy without a
 * rebuild. DEFAULT_CONFIG is the Ground X template.
 */

export type SectionKey =
  | "hero"
  | "about"
  | "angle"
  | "capabilities"
  | "work"
  | "brand"
  | "offer"
  | "contact";

export type SectionSpec = { key: SectionKey; enabled: boolean; variant: number };

export type OfferContent = {
  hero: { eyebrow: string; headline: string; headlineAccent: string; sub: string };
  angle: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub: string;
    points: { k: string; v: string }[];
  };
  capabilities: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub: string;
  };
  work: { eyebrow: string; title: string; titleAccent: string };
  brand: { eyebrow: string; title: string; titleAccent: string; sub: string };
  offer: { eyebrow: string; title: string; titleAccent: string; sub: string };
  contact: { eyebrow: string; headline: string; headlineAccent: string; sub: string };
};

export type OfferConfig = {
  brand: { name: string; accent: string; tagline?: string };
  sections: SectionSpec[];
  content: OfferContent;
};

export const DEFAULT_CONFIG: OfferConfig = {
  brand: { name: "Ground X", accent: "#f97316", tagline: "Underground Sanctuaries" },
  sections: [
    { key: "hero", enabled: true, variant: 0 },
    { key: "about", enabled: true, variant: 0 },
    { key: "angle", enabled: true, variant: 0 },
    { key: "capabilities", enabled: true, variant: 0 },
    { key: "work", enabled: true, variant: 4 },
    { key: "brand", enabled: true, variant: 2 },
    { key: "offer", enabled: true, variant: 0 },
    { key: "contact", enabled: true, variant: 0 },
  ],
  content: {
    hero: {
      eyebrow: "Proposal",
      headline: "A brand that makes its mark",
      headlineAccent: "out of sight.",
      sub: "Brand, AI visuals, web and content — built as one system for the GCC's most private luxury product. This is what I'd build for Ground X, and the work that proves I can.",
    },
    angle: {
      eyebrow: "Why me, for this",
      title: "Not a generalist. Someone who has already built",
      titleAccent: "your exact world.",
      sub: "Ground X needs Dubai fluency, a luxury-security tone, container know-how and a systems mindset. Those four overlap with work I have already delivered.",
      points: [
        { k: "Dubai", v: "I already build for the GCC market and its buyers." },
        { k: "Luxury + security", v: "Gulf Rescue, Löwenhardt — the exact tone Ground X needs." },
        { k: "Containers", v: "I have shipped a 3D container configurator already." },
        { k: "Systems", v: "AETHER and zZzlim prove I run marketing as a system." },
      ],
    },
    capabilities: {
      eyebrow: "What I can do",
      title: "The full stack of a",
      titleAccent: "marketing department, in one person.",
      sub: "Each of these is something I have built and shipped, not a service line on a page.",
    },
    work: { eyebrow: "Selected work", title: "Already built,", titleAccent: "already live." },
    brand: {
      eyebrow: "Brand direction",
      title: "How Ground X could",
      titleAccent: "feel.",
      sub: "A first taste of the visual language: a gentleman's-club world, not a survival product. Final brand locks once your assets land.",
    },
    offer: {
      eyebrow: "The offer",
      title: "Pick how you want to",
      titleAccent: "work together.",
      sub: "For context: Dubai agencies charge $3,000–8,000/mo for this scope, and Ground X sells from $50,000 a module.",
    },
    contact: {
      eyebrow: "Next step",
      headline: "Let's build the first",
      headlineAccent: "renderings.",
      sub: "Samples land first, the offer right behind. Take it to the table with your team, and we start.",
    },
  },
};

/** shallow-merge a partial fetched config over the default */
export function mergeConfig(partial: Partial<OfferConfig> | null | undefined): OfferConfig {
  if (!partial) return DEFAULT_CONFIG;
  return {
    brand: { ...DEFAULT_CONFIG.brand, ...(partial.brand ?? {}) },
    sections: Array.isArray(partial.sections) && partial.sections.length ? partial.sections : DEFAULT_CONFIG.sections,
    content: {
      hero: { ...DEFAULT_CONFIG.content.hero, ...(partial.content?.hero ?? {}) },
      angle: { ...DEFAULT_CONFIG.content.angle, ...(partial.content?.angle ?? {}) },
      capabilities: { ...DEFAULT_CONFIG.content.capabilities, ...(partial.content?.capabilities ?? {}) },
      work: { ...DEFAULT_CONFIG.content.work, ...(partial.content?.work ?? {}) },
      brand: { ...DEFAULT_CONFIG.content.brand, ...(partial.content?.brand ?? {}) },
      offer: { ...DEFAULT_CONFIG.content.offer, ...(partial.content?.offer ?? {}) },
      contact: { ...DEFAULT_CONFIG.content.contact, ...(partial.content?.contact ?? {}) },
    },
  };
}
