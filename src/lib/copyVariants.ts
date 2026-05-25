/**
 * Per-section copy variants — the deck-side seed for what will become
 * the Techne text-variant agent. Each section offers 3 named alt-copies
 * in radically different tones (Direct / Editorial / Punchy). Samy picks
 * one via the DevPanel; the choice persists in localStorage and the
 * OfferProvider merges the patch over the active OfferConfig before
 * handing it to <useOffer>().
 *
 * Real model-generated alternatives will land here once we wire the
 * AETHER /api/copy-variants endpoint — this file's shape is the
 * contract. Until then, the curated set below ships immediate value:
 * Samy can A/B/C the tone of every section without touching code.
 */
import type { OfferContent, SectionKey } from "./config";

export type SectionCopyKey = Exclude<SectionKey, "about">;

/** Patch shape per section — only the user-facing copy fields, not data. */
export type CopyPatch =
  | Partial<OfferContent["hero"]>
  | Partial<Omit<OfferContent["angle"], "points">>
  | Partial<Omit<OfferContent["capabilities"], "items">>
  | Partial<OfferContent["work"]>
  | Partial<OfferContent["brand"]>
  | Partial<Omit<OfferContent["offer"], "tabs">>
  | Partial<OfferContent["contact"]>;

export type CopyVariant = {
  id: string;
  label: string;
  vibe: string;
  patch: CopyPatch;
};

/** Map of section → 3 variants. "default" is implicit (no patch). */
export const COPY_VARIANTS: Record<SectionCopyKey, CopyVariant[]> = {
  hero: [
    {
      id: "direct",
      label: "Direct",
      vibe: "Plain, fast, what + why",
      patch: {
        eyebrow: "Proposal",
        headline: "A brand that earns trust",
        headlineAccent: "out of sight.",
        sub: "Brand, AI visuals, web and content — one system for the GCC's most private luxury product. Built end-to-end by one person who has already shipped it.",
      },
    },
    {
      id: "editorial",
      label: "Editorial",
      vibe: "Magazine cadence, narrative",
      patch: {
        eyebrow: "A proposal for Ground X",
        headline: "Invisible from above.",
        headlineAccent: "Unmistakable below.",
        sub: "Underground sanctuaries deserve a brand world that matches their discretion. Cinematic visuals, multilingual sites, and an AI content engine that keeps the story alive between launches.",
      },
    },
    {
      id: "punchy",
      label: "Punchy",
      vibe: "Short lines, momentum",
      patch: {
        eyebrow: "For Ground X",
        headline: "One operator.",
        headlineAccent: "Full marketing stack.",
        sub: "Brand. Renderings. Site. Reels. Configurator. Dashboards. Ads. All from one head, all already shipped for clients like yours.",
      },
    },
  ],

  angle: [
    {
      id: "direct",
      label: "Direct",
      vibe: "Why I'm a fit, no warm-up",
      patch: {
        eyebrow: "Why me, for this",
        title: "Not a generalist. Someone who has already built",
        titleAccent: "your exact world.",
        sub: "Ground X needs Dubai fluency, a luxury-security tone, container know-how and a systems mindset. Those four overlap with work I have already delivered.",
      },
    },
    {
      id: "editorial",
      label: "Editorial",
      vibe: "Soft sell, story-first",
      patch: {
        eyebrow: "On overlap",
        title: "I have already lived",
        titleAccent: "in your four worlds.",
        sub: "Dubai's buyer, the luxury-security register, container engineering, and the systems mindset of a marketing department-of-one. Each of these is a project on my shelf, not a service line.",
      },
    },
    {
      id: "punchy",
      label: "Punchy",
      vibe: "Receipts, not promises",
      patch: {
        eyebrow: "Why me",
        title: "Four reasons,",
        titleAccent: "all shipped.",
        sub: "Dubai. Luxury-security. Containers. Systems. Each one already in production with a client logo behind it.",
      },
    },
  ],

  capabilities: [
    {
      id: "direct",
      label: "Direct",
      vibe: "Service list framing",
      patch: {
        eyebrow: "What I can do",
        title: "The full stack of a",
        titleAccent: "marketing department, in one person.",
        sub: "Each of these is something I have built and shipped, not a service line on a page.",
      },
    },
    {
      id: "editorial",
      label: "Editorial",
      vibe: "Capability as craft",
      patch: {
        eyebrow: "Craft",
        title: "Eight disciplines,",
        titleAccent: "one operator.",
        sub: "Not a roster of agencies behind a logo. Each capability below is something I personally have shipped — the screenshots are real, the clients are real, the systems are running.",
      },
    },
    {
      id: "punchy",
      label: "Punchy",
      vibe: "Receipts language",
      patch: {
        eyebrow: "Stack",
        title: "Everything Ground X needs.",
        titleAccent: "Already shipped, with proof.",
        sub: "Renderings. Configurators. Sites. Reels. Decks. Dashboards. Social. Brand. Eight live receipts below.",
      },
    },
  ],

  work: [
    {
      id: "direct",
      label: "Direct",
      vibe: "Selected work, plain",
      patch: { eyebrow: "Selected work", title: "Already built,", titleAccent: "already live." },
    },
    {
      id: "editorial",
      label: "Editorial",
      vibe: "Quiet confidence",
      patch: { eyebrow: "On the shelf", title: "A short list of work", titleAccent: "Ground X can verify today." },
    },
    {
      id: "punchy",
      label: "Punchy",
      vibe: "Bragging rights",
      patch: { eyebrow: "Proof", title: "Live.", titleAccent: "Click anything." },
    },
  ],

  brand: [
    {
      id: "direct",
      label: "Direct",
      vibe: "Plain brand direction",
      patch: {
        eyebrow: "Brand direction",
        title: "How Ground X could",
        titleAccent: "feel.",
        sub: "A first taste of the visual language: a gentleman's-club world, not a survival product. Final brand locks once your assets land.",
      },
    },
    {
      id: "editorial",
      label: "Editorial",
      vibe: "Twilight + cognac voice",
      patch: {
        eyebrow: "Mood, before the lock",
        title: "Twilight, walnut, brushed gold —",
        titleAccent: "Ground X's quiet language.",
        sub: "The brand never shouts. Cognac leather, dark walnut, brushed gold. Lifestyle on the surface, engineering implied. A first frame; the final lock comes once your asset library lands.",
      },
    },
    {
      id: "punchy",
      label: "Punchy",
      vibe: "Single-line manifesto",
      patch: {
        eyebrow: "Brand world",
        title: "Discreet.",
        titleAccent: "Above standards.",
        sub: "Never the word that begins with B. Always lifestyle first, sanctuary second, engineering third.",
      },
    },
  ],

  offer: [
    {
      id: "direct",
      label: "Direct",
      vibe: "Pricing context up front",
      patch: {
        eyebrow: "The offer",
        title: "Pick how you want to",
        titleAccent: "work together.",
        sub: "For context: Dubai agencies charge $3,000–8,000/mo for this scope, and Ground X sells from $50,000 a module.",
      },
    },
    {
      id: "editorial",
      label: "Editorial",
      vibe: "Three doors framing",
      patch: {
        eyebrow: "Three doors",
        title: "Three ways in.",
        titleAccent: "Same operator.",
        sub: "A monthly partnership, a one-time build, or à-la-carte items priced per deliverable. All routed through one person who knows the project end-to-end.",
      },
    },
    {
      id: "punchy",
      label: "Punchy",
      vibe: "Numbers-first",
      patch: {
        eyebrow: "Pricing",
        title: "From €120 a render",
        titleAccent: "to €1,500/mo all-in.",
        sub: "Compare: Dubai agencies €3–8K/mo for the same scope. Ground X modules sell from €50K.",
      },
    },
  ],

  contact: [
    {
      id: "direct",
      label: "Direct",
      vibe: "Samples-first close",
      patch: {
        eyebrow: "Next step",
        headline: "Let's build the first",
        headlineAccent: "renderings.",
        sub: "Samples land first, the offer right behind. Take it to the table with your team, and we start.",
      },
    },
    {
      id: "editorial",
      label: "Editorial",
      vibe: "Quiet handshake",
      patch: {
        eyebrow: "Handshake",
        headline: "A short call,",
        headlineAccent: "and we begin.",
        sub: "Thirty minutes. We talk through what Ground X needs in the first ninety days, I send the first three renderings the week after.",
      },
    },
    {
      id: "punchy",
      label: "Punchy",
      vibe: "One-line close",
      patch: {
        eyebrow: "Start",
        headline: "Pick a slot.",
        headlineAccent: "I bring the renderings.",
        sub: "Calendly above, email beside it. First samples in your inbox within a week.",
      },
    },
  ],
};

export const VARIANTS_STORAGE_KEY = "groundx.copyVariants";
/** Custom event so DevPanel writes propagate to OfferProvider in the same tab. */
export const VARIANTS_CHANGE_EVENT = "groundx.copyVariants:change";

export type CopyVariantSelections = Partial<Record<SectionCopyKey, string>>;

/** Load the current selections from localStorage. */
export function loadCopyVariantSelections(): CopyVariantSelections {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VARIANTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CopyVariantSelections) : {};
  } catch {
    return {};
  }
}

/** Save selections and notify same-tab listeners. */
export function saveCopyVariantSelections(next: CopyVariantSelections) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VARIANTS_STORAGE_KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new CustomEvent(VARIANTS_CHANGE_EVENT));
}

/** Apply the selections to an OfferContent, returning a new content object. */
export function applyCopyVariants(
  content: OfferContent,
  selections: CopyVariantSelections,
): OfferContent {
  const next = { ...content };
  for (const [sectionRaw, variantId] of Object.entries(selections)) {
    const section = sectionRaw as SectionCopyKey;
    if (!variantId) continue;
    const v = COPY_VARIANTS[section]?.find((x) => x.id === variantId);
    if (!v) continue;
    const base = next[section];
    if (!base) continue;
    // shallow merge — patch overrides only the fields it touches; nested
    // arrays (points, items, tabs) are untouched. Cast through unknown
    // because TypeScript can't narrow the union of patch shapes across
    // the section key index.
    (next[section] as unknown) = { ...base, ...v.patch };
  }
  return next;
}
