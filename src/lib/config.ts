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
    items: { title: string; blurb: string; proof: string }[];
  };
  work: { eyebrow: string; title: string; titleAccent: string };
  brand: { eyebrow: string; title: string; titleAccent: string; sub: string };
  offer: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub: string;
    tabs: {
      label: string;
      note: string;
      cards: { tag: string; name: string; price: string; items: string[]; feature?: boolean }[];
    }[];
  };
  contact: { eyebrow: string; headline: string; headlineAccent: string; sub: string };
};

export type OfferConfig = {
  brand: {
    name: string;
    accent: string;
    tagline?: string;
    /** Calendly booking URL — rendered as "Book a call" in the top header. */
    calendly?: string;
    /** WhatsApp number in international format (e.g. "491702234567") — fixed floating button bottom-right. */
    whatsapp?: string;
    /** Optional prefilled WhatsApp message. */
    whatsappMessage?: string;
  };
  sections: SectionSpec[];
  content: OfferContent;
};

export const DEFAULT_CONFIG: OfferConfig = {
  brand: {
    name: "Ground X",
    accent: "#f97316",
    tagline: "Underground Sanctuaries",
    calendly: "https://calendly.com/zambodezigns/30min",
    whatsapp: "4915233729743",
    whatsappMessage: "Hi Samy, I just saw the deck.",
  },
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
      items: [
        { title: "AI renderings & visual systems", blurb: "Photoreal interiors and exteriors from a controlled prompt system, not random AI output. Real camera profiles, consistent light, brand-locked.", proof: "12-prompt master system + enhancer pipeline built for Ground X" },
        { title: "3D configurators", blurb: "Interactive product builders in the browser. Rotate, combine modules, see the result live. Built on React Three Fiber.", proof: "Container configurator already shipped (Next.js + R3F, deployed)" },
        { title: "Premium websites", blurb: "Fast, multilingual, conversion-focused sites with cinematic motion. Lead capture, private-consultation flows, RTL-ready.", proof: "Gulf Rescue & Löwenhardt — live luxury/security sites" },
        { title: "AI video production", blurb: "Cinematic walkthroughs, reels and timelapses from an AI pipeline. Sound, motion and grade, not slideshow exports.", proof: "End-to-end AI video pipeline in production" },
        { title: "Social & automation", blurb: "Content calendars, scheduling, and DM funnels. ManyChat auto-reply and lead routing wired to the content plan.", proof: "ManyChat flows + content-plan system live on zZzlim" },
        { title: "Dashboards & internal tools", blurb: "Custom dashboards that pull your data into one view: analytics, pipeline, performance. The same systems I build for myself.", proof: "AETHER operating system + zZzlim dashboard" },
        { title: "Investor pitch decks", blurb: "Decks that raise: clear story, real numbers, design that signals a serious company. From narrative to final layout.", proof: "Athena and further investor decks delivered" },
        { title: "Branding", blurb: "Logo, color, type and tone of voice into one guideline your team can actually use. Consistent across every surface.", proof: "Full brand systems across multiple clients" },
      ],
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
      tabs: [
        {
          label: "Partnership",
          note: "Setup once, then a system that runs every month.",
          cards: [
            { tag: "Phase 1 · one-time", name: "Setup & foundation", price: "from €3,500", items: ["Brand guidelines finalized", "10–15 photoreal AI renderings", "Landing page, deployed", "2–3 marketing videos", "Social template set", "Drive + content calendar"] },
            { tag: "Phase 2 · monthly", name: "Ongoing partnership", price: "from €1,500 / mo", items: ["15–20 social posts", "4–6 AI videos", "3–5 new renderings", "Content calendar & scheduling", "Paid-ads management", "Monthly analytics & optimization"], feature: true },
            { tag: "Soft start · optional", name: "Test month", price: "€1,500 flat", items: ["One month, full output", "No long commitment", "Rolls into the retainer", "De-risks the decision"] },
          ],
        },
        {
          label: "One-time builds",
          note: "Standalone projects, paid once. No retainer required.",
          cards: [
            { tag: "Web", name: "Informative website", price: "€2,000–3,000", items: ["EN + DE, responsive", "Lead-capture / consultation", "Deployed on Vercel", "Privacy-first analytics"] },
            { tag: "Shop", name: "Shopify rebuild", price: "€1,500–2,500", items: ["Premium theme", "Product pages per module", "AI renderings integrated", "Checkout optimization"], feature: true },
            { tag: "3D", name: "Module configurator", price: "€2,000–4,000", items: ["Build-your-module in 3D", "Real GLB models", "Browser-based", "Three.js / R3F"] },
          ],
        },
        {
          label: "À la carte",
          note: "Single deliverables, priced per item. Mix as you need.",
          cards: [
            { tag: "Visual", name: "Per deliverable", price: "from €120", items: ["AI rendering — from €120", "AI video / reel — from €250", "Logo animation — from €300", "Pitch-deck slide — from €90"] },
            { tag: "Web add-ons", name: "Web & content", price: "from €500", items: ["Landing page — from €900", "Arabic + RTL — €500–1,000", "Analytics dashboard — €1–2k", "Brand guidelines — from €700"] },
            { tag: "Ongoing", name: "Social & ads", price: "from €40 / post", items: ["Social post — from €40", "ManyChat DM funnel — from €400", "Ad campaign setup — from €350", "Monthly report — from €150"] },
          ],
        },
      ],
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
