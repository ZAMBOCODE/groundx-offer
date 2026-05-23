/** Capability + reference data for the Ground X offer deck. */

export type Capability = {
  title: string;
  blurb: string;
  proof: string;
};

export const capabilities: Capability[] = [
  {
    title: "AI renderings & visual systems",
    blurb:
      "Photoreal interiors and exteriors from a controlled prompt system, not random AI output. Real camera profiles, consistent light, brand-locked.",
    proof: "12-prompt master system + enhancer pipeline built for Ground X",
  },
  {
    title: "3D configurators",
    blurb:
      "Interactive product builders in the browser. Rotate, combine modules, see the result live. Built on React Three Fiber.",
    proof: "Container configurator already shipped (Next.js + R3F, deployed)",
  },
  {
    title: "Premium websites",
    blurb:
      "Fast, multilingual, conversion-focused sites with cinematic motion. Lead capture, private-consultation flows, RTL-ready.",
    proof: "Gulf Rescue & Löwenhardt — live luxury/security sites",
  },
  {
    title: "AI video production",
    blurb:
      "Cinematic walkthroughs, reels and timelapses from an AI pipeline. Sound, motion and grade, not slideshow exports.",
    proof: "End-to-end AI video pipeline in production",
  },
  {
    title: "Social & automation",
    blurb:
      "Content calendars, scheduling, and DM funnels. ManyChat auto-reply and lead routing wired to the content plan.",
    proof: "ManyChat flows + content-plan system live on zZzlim",
  },
  {
    title: "Dashboards & internal tools",
    blurb:
      "Custom dashboards that pull your data into one view: analytics, pipeline, performance. The same systems I build for myself.",
    proof: "AETHER operating system + zZzlim dashboard",
  },
  {
    title: "Investor pitch decks",
    blurb:
      "Decks that raise: clear story, real numbers, design that signals a serious company. From narrative to final layout.",
    proof: "Athena and further investor decks delivered",
  },
  {
    title: "Branding",
    blurb:
      "Logo, color, type and tone of voice into one guideline your team can actually use. Consistent across every surface.",
    proof: "Full brand systems across multiple clients",
  },
];

export type CaseStudy = {
  name: string;
  tag: string;
  what: string;
  why: string;
  stack: string;
  image?: string;
  /** "cover" for photos, "contain" for logos on a dark plate */
  fit?: "cover" | "contain";
  /** white/transparent logo for the showcase variant */
  logo?: string;
  /** capability tags shown as chips in the showcase variant */
  tags?: string[];
  /** website/section screenshots for the staggered showcase cards */
  shots?: string[];
};

export const cases: CaseStudy[] = [
  {
    name: "Gulf Rescue",
    tag: "Dubai · luxury security",
    what:
      "Brand and site for an armored VIP transfer service. Cinematic 3D vehicle, multilingual, map-driven coverage, ballistic-spec storytelling.",
    why: "Same market, same buyer, same discretion as Ground X.",
    stack: "Next.js 16 · React Three Fiber · Mapbox",
    image: "/assets/gulfrescue-vehicle.png",
    logo: "/assets/gulfrescue-logo.svg",
    tags: ["3D animation", "AI video", "Web design", "Branding", "Multilingual", "Motion"],
    shots: ["/assets/gulfrescue-1.png", "/assets/gulfrescue-2.png", "/assets/gulfrescue-3.png"],
  },
  {
    name: "Löwenhardt",
    tag: "Armored vehicles · partner network",
    what:
      "Production site for an armored-vehicle and VIP-transport partner platform with a partner ecosystem.",
    why: "Built trust in the Dubai security/luxury world already.",
    stack: "Next.js 14 · React · TypeScript",
    image: "/assets/loewenhardt-logo.png",
    fit: "contain",
    logo: "/assets/loewenhardt-logo.png",
    tags: ["Web design", "Branding", "Partner platform", "Multilingual"],
  },
  {
    name: "Container Configurator",
    tag: "3D · product builder",
    what:
      "Interactive 3D configurator for a container builder. Real GLB models, live interior parts, browser-based.",
    why: "Ground X sells containers. This already exists.",
    stack: "Next.js · React Three Fiber · Three.js",
    tags: ["3D / R3F", "Configurator", "Product viz", "Web app"],
  },
  {
    name: "AETHER + zZzlim",
    tag: "Systems · automation",
    what:
      "A personal operating system (AETHER) and a full content/automation dashboard (zZzlim) — proof I build whole systems, not one-offs.",
    why: "Shows I can run your marketing as a system, not a task list.",
    stack: "React · TypeScript · AI agents · ManyChat",
    image: "/assets/aether.png",
    tags: ["Dashboards", "AI agents", "Automation", "ManyChat", "Systems"],
  },
];
