/**
 * OfferConfig — the per-client contract the Techne renderer consumes.
 * Mirrors services/aether-api/src/offers.ts. The deck fetches GET /offers/:id
 * (via ?offer=<id>) and merges the returned `config` over DEFAULT_CONFIG, so a
 * new client gets a different brand, section order/variants and copy without a
 * rebuild. DEFAULT_CONFIG is the Ground X template.
 */

export type SectionKey =
  | "hero"
  | "trustedBy"
  | "about"
  | "angle"
  | "capabilities"
  | "work"
  | "testimonials"
  | "brand"
  | "offer"
  | "process"
  | "faq"
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
  process: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub: string;
    milestones: { when: string; title: string; deliverables: string[] }[];
  };
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
  trustedBy: {
    eyebrow: string;
    logos: { name: string; src: string }[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    items: { quote: string; author: string; role: string; logo?: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub?: string;
    items: { q: string; a: string }[];
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
    // trustedBy is now rendered inside Hero (no longer a standalone section).
    { key: "trustedBy", enabled: false, variant: 0 },
    { key: "about", enabled: true, variant: 4 },
    { key: "angle", enabled: true, variant: 4 },
    { key: "capabilities", enabled: true, variant: 3 },
    { key: "work", enabled: true, variant: 4 },
    { key: "testimonials", enabled: true, variant: 0 },
    { key: "brand", enabled: true, variant: 2 },
    { key: "offer", enabled: true, variant: 2 },
    { key: "process", enabled: true, variant: 2 },
    { key: "faq", enabled: true, variant: 0 },
    { key: "contact", enabled: true, variant: 4 },
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
      title: "A full marketing stack, software side included —",
      titleAccent: "one person, one system.",
      sub: "Web, software, 3D, AI visuals, content and ads. Each of these is something I have built and shipped, not a line on a service sheet.",
      // Samy 2026-05-26: "6 Tabs reichen, nicht 10. AI-Renderings + Video
      // zusammen, Social + Ad zusammen". Plus mockup images per item.
      items: [
        { title: "Websites — Design & Development", blurb: "Fast, multilingual, conversion-focused sites with cinematic motion. Built end-to-end: design in Figma, code in Next.js, deployed on Vercel. Lead capture, private-consultation flows, RTL-ready.", proof: "Gulf Rescue & Löwenhardt — live luxury/security sites" },
        { title: "Software Development", blurb: "Custom web apps, internal tools and automations. Dashboards, configurators, lead systems, AI pipelines. Not a Wix template — real code, your repo, your control.", proof: "AETHER operating system + zZzlim dashboard, both in daily use" },
        { title: "3D & Configurators", blurb: "Interactive product builders in the browser: rotate, combine modules, see the result live. Real GLB models, React Three Fiber, deployed.", proof: "Container configurator already shipped (Next.js + R3F)" },
        { title: "AI Renderings & Video", blurb: "Photoreal interiors and exteriors from a controlled prompt system plus cinematic walkthroughs, reels and timelapses from an AI video pipeline. Brand-locked, not random output.", proof: "12-prompt master system + end-to-end video pipeline live for Ground X" },
        { title: "Brand & Design System", blurb: "Logo, color, type and tone of voice into one guideline your team can actually use. Consistent across web, print, social and product.", proof: "Full brand systems across multiple clients" },
        { title: "Social Media & Ads", blurb: "Content calendars, scheduling, DM funnels — plus paid-media setup and ongoing optimization across Meta, Google and TikTok. One hand on creative, one on the campaign.", proof: "ManyChat flows + content-plan + performance accounts live on zZzlim" },
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
      sub: "",
      tabs: [
        // Samy 2026-05-28: pricing pass — projects ~15% down, monthly retainer
        // from €1,200, test month €999, à-la-carte add-ons more accessible,
        // SEO mentioned across web/shopify/landing.
        {
          label: "One-time builds",
          note: "Standalone projects, paid once. No retainer required.",
          cards: [
            { tag: "Web", name: "Informative website", price: "€1,700–2,500", items: ["EN + DE, responsive", "SEO-optimized (meta, schema, sitemap)", "Lead-capture / consultation", "Deployed on Vercel", "Privacy-first analytics"] },
            { tag: "Shop", name: "Shopify rebuild", price: "€1,300–2,000", items: ["Premium theme", "Product pages per module", "AI renderings integrated", "Checkout optimization", "SEO + structured data"] },
            { tag: "3D", name: "Module configurator", price: "€1,700–3,300", items: ["Build-your-module in 3D", "Real GLB models", "Browser-based", "Three.js / R3F"] },
            { tag: "Deck", name: "Investor pitch deck", price: "€1,300–3,000", items: ["Narrative + structure", "Real numbers, no fluff", "10–15 slides, custom-designed", "Optional Loom voice-over"] },
          ],
        },
        {
          label: "Partnership",
          note: "Setup once, then a system that runs every month.",
          cards: [
            { tag: "Setup", name: "Setup & foundation", price: "from €3,500", items: ["Brand guidelines finalized", "10–15 photoreal AI renderings", "Landing page, deployed (SEO included)", "2–3 marketing videos", "Social template set", "Drive + content calendar"] },
            { tag: "Monthly", name: "Ongoing partnership", price: "from €1,200 / mo", items: ["15–20 social posts", "4–6 AI videos", "3–5 new renderings", "Content calendar & scheduling", "Paid-ads management", "SEO monitoring + optimization", "Monthly analytics"] },
            { tag: "Soft start", name: "Test month", price: "€999 flat", items: ["One month, full output", "No long commitment", "Rolls into the retainer", "De-risks the decision"] },
          ],
        },
        {
          label: "À la carte",
          note: "Single deliverables, priced per item. Mix as you need.",
          cards: [
            { tag: "Visual", name: "Per deliverable", price: "from €80", items: ["AI rendering — from €80", "AI video / reel — from €250", "Logo animation — from €300", "Pitch-deck slide — from €90"] },
            { tag: "Web add-ons", name: "Web & content", price: "from €250", items: ["Landing page — from €900", "Extra language (e.g. Arabic + RTL) — €250 flat", "Analytics dashboard — €1–2k", "Brand guidelines — from €450", "SEO audit + fix — from €350"] },
            { tag: "Ongoing", name: "Social & ads", price: "from €25 / post", items: ["Social post — from €25", "ManyChat DM funnel — from €400", "Ad campaign setup — from €350", "Monthly report — from €150"] },
          ],
        },
      ],
    },
    process: {
      eyebrow: "How this rolls out",
      title: "From handshake to first",
      titleAccent: "renderings in 14 days.",
      sub: "A short timeline so Ground X knows exactly what lands, when, and what's expected from you. Each milestone has a hard deliverable, not a status update.",
      milestones: [
        {
          when: "Day 0",
          title: "Kickoff call",
          deliverables: [
            "30-min Calendly slot, no homework needed",
            "I share my checklist of what I need from you (assets, references, logins)",
            "Drive folder created, you get edit access",
            "Goals + KPI alignment so every milestone is measurable",
          ],
        },
        {
          when: "Week 1",
          title: "First samples",
          deliverables: [
            "5-7 photoreal AI renderings (your preferred angles)",
            "First brand-direction frame (palette + type)",
            "Site wireframe in Figma if part of the scope",
            "SEO keyword + competitor scan delivered",
          ],
        },
        {
          when: "Week 2",
          title: "Approval round",
          deliverables: [
            "Locked brand direction (palette, type, tone)",
            "10-15 final photoreal renderings, ready for use",
            "Site mockup at high fidelity",
            "On-page SEO blueprint (meta, schema, sitemap)",
          ],
        },
        {
          when: "Week 4",
          title: "Launch",
          deliverables: [
            "Site deployed on Vercel, EN+DE, SEO live",
            "First 2-3 marketing videos delivered",
            "Social calendar staged for month 2",
            "Analytics + Search Console wired",
          ],
        },
        {
          when: "Month 2+",
          title: "System running",
          deliverables: [
            "Monthly cadence locked: 15-20 posts, 4-6 reels, 3-5 renderings, ads",
            "SEO monitoring + content optimization every month",
            "Monthly report with what landed + what moved",
            "Quarterly review to recalibrate direction",
          ],
        },
      ],
    },
    trustedBy: {
      eyebrow: "Trusted by",
      logos: [
        { name: "Gulf Rescue", src: "/assets/gulfrescue-logo.svg" },
        { name: "Löwenhardt", src: "/assets/loewenhardt-logo.png" },
        { name: "AETHER", src: "/assets/aether.png" },
        { name: "ZamboDezigns", src: "/assets/zambo-logo.png" },
      ],
    },
    // PLACEHOLDER quotes — replace with real client words. Samy 2026-05-25.
    testimonials: {
      eyebrow: "What clients say",
      title: "Real words, real",
      titleAccent: "deliveries.",
      items: [
        {
          quote:
            "Samy built the full brand world plus the website in three weeks. The renderings landed before the engineering team finished the prototype.",
          author: "Stefan",
          role: "Founder · Gulf Rescue",
          logo: "/assets/gulfrescue-logo.svg",
        },
        {
          quote:
            "One person, full marketing stack. We stopped juggling three agencies. The Shopify rebuild paid for itself in the first month.",
          author: "Anonymous",
          role: "Co-founder · Löwenhardt",
          logo: "/assets/loewenhardt-logo.png",
        },
        {
          quote:
            "What we got back wasn't a deck of mood-boards. It was a working configurator, real models, deployed. Two weeks.",
          author: "Anonymous",
          role: "CEO · Module Configurator client",
        },
        {
          quote:
            "Samy brings pace and clarity. Visuals we'd only seen in pitch-decks were live in our product within days.",
          author: "Michels",
          role: "Client",
        },
        {
          quote:
            "We worked with Samy because he thinks brand feel and mechanics in one breath. No back-and-forth, one supplier, one system.",
          author: "Agentur Hitz",
          role: "Partner agency",
        },
      ],
    },
    faq: {
      eyebrow: "Common questions",
      title: "Everything you'd ask",
      titleAccent: "before the call.",
      sub: "Short answers. If something's missing, the consultation slot answers it.",
      items: [
        {
          q: "How fast can we start?",
          a: "Kickoff within a week of signing. First renderings inside two weeks. The Process section above breaks it down day by day.",
        },
        {
          q: "Who owns the assets?",
          a: "Ground X owns everything I produce — renderings, brand files, site source, configurator code. Delivered into your Drive + GitHub.",
        },
        {
          q: "What if we want to stop the retainer?",
          a: "Monthly cancellation. You keep everything shipped to date. No exit fee, no IP held back.",
        },
        {
          q: "What's not included?",
          a: "Paid-media spend itself (only management). Photography on location. Translation outside DE / EN / AR. Each is quotable separately.",
        },
        {
          q: "How do we communicate?",
          a: "Async-first via a shared Drive folder + WhatsApp / email for fast threads. Weekly 30-min call during build, bi-weekly once the retainer is running.",
        },
        {
          q: "Do you sub-contract?",
          a: "No. I build everything personally. AETHER (my own operating system) handles the repetitive work; the creative + strategic decisions are mine.",
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

/* ============================================================
 * GERMAN CONTENT (Samy 2026-05-26: "ich möchte dass auf Deutsch
 * übersetzt wird alles"). Mirrors the shape of OfferContent.
 * OfferProvider merges this over DEFAULT_CONFIG.content when
 * the active language is 'de'. Default UI language is now 'de'.
 * ============================================================ */
export const DE_CONTENT: OfferContent = {
  hero: {
    eyebrow: "Angebot",
    headline: "Eine Marke, die einschlägt",
    headlineAccent: "ohne sich zu zeigen.",
    sub: "Marke, KI-Visuals, Web und Content — als ein System gebaut für das privateste Luxusprodukt der Golf-Region. Das, was ich für Ground X bauen würde, plus die Arbeiten, die zeigen, dass ich es schon kann.",
  },
  angle: {
    eyebrow: "Warum ich, genau dafür",
    title: "Kein Generalist. Jemand, der euer Universum",
    titleAccent: "schon gebaut hat.",
    sub: "Ground X braucht Dubai-Verständnis, Luxus-und-Sicherheit-Ton, Container-Knowhow und Systemdenken. Vier Punkte, die sich mit Arbeiten überlappen, die ich bereits ausgeliefert habe.",
    points: [
      { k: "Dubai", v: "Ich baue bereits für den GCC-Markt und seine Käufer." },
      { k: "Luxus + Sicherheit", v: "Gulf Rescue, Löwenhardt — genau der Ton, den Ground X braucht." },
      { k: "Container", v: "Ich habe schon einen 3D-Container-Konfigurator ausgeliefert." },
      { k: "Systeme", v: "AETHER und zZzlim beweisen, dass ich Marketing als System fahre." },
    ],
  },
  capabilities: {
    eyebrow: "Was ich liefere",
    title: "Ein voller Marketing-Stack inklusive Software-Seite —",
    titleAccent: "eine Person, ein System.",
    sub: "Web, Software, 3D, KI-Visuals, Content und Ads. Jeder Punkt ist etwas, das ich gebaut und ausgeliefert habe — keine Service-Zeile auf einem Blatt Papier.",
    items: [
      { title: "Websites — Design & Entwicklung", blurb: "Schnelle, mehrsprachige, conversion-fokussierte Seiten mit cinematischer Bewegung. Ende zu Ende: Design in Figma, Code in Next.js, deployed auf Vercel. Lead-Erfassung, private Beratungs-Flows, RTL-fähig.", proof: "Gulf Rescue & Löwenhardt — live, Luxus/Sicherheit" },
      { title: "Software-Entwicklung", blurb: "Maßgeschneiderte Web-Apps, interne Tools und Automatisierungen. Dashboards, Konfiguratoren, Lead-Systeme, KI-Pipelines. Kein Wix-Template — echter Code, euer Repo, eure Kontrolle.", proof: "AETHER Operating System + zZzlim Dashboard, beide täglich im Einsatz" },
      { title: "3D & Konfiguratoren", blurb: "Interaktive Produkt-Builder im Browser: drehen, Module kombinieren, Ergebnis live sehen. Echte GLB-Modelle, React Three Fiber, deployed.", proof: "Container-Konfigurator bereits ausgeliefert (Next.js + R3F)" },
      { title: "KI-Renderings & Video", blurb: "Fotorealistische Innen- und Außenansichten aus einem kontrollierten Prompt-System plus cinematische Walkthroughs, Reels und Timelapses aus einer KI-Video-Pipeline. Marken-konsistent, kein zufälliger Output.", proof: "12-Prompt-Mastersystem + End-to-End-Video-Pipeline live für Ground X" },
      { title: "Branding & Design-System", blurb: "Logo, Farbe, Schrift und Tonalität in einer Guideline, die das Team wirklich nutzen kann. Konsistent über Web, Print, Social und Produkt.", proof: "Vollständige Brand-Systeme bei mehreren Kunden" },
      { title: "Social Media & Ads", blurb: "Content-Kalender, Scheduling, DM-Funnels — plus Paid-Media-Setup und laufende Optimierung über Meta, Google und TikTok. Eine Hand am Creative, eine an der Kampagne.", proof: "ManyChat-Flows + Content-Plan + Performance-Accounts live auf zZzlim" },
    ],
  },
  work: { eyebrow: "Ausgewählte Arbeiten", title: "Schon gebaut,", titleAccent: "schon live." },
  brand: {
    eyebrow: "Marken-Richtung",
    title: "So könnte sich Ground X",
    titleAccent: "anfühlen.",
    sub: "Ein erster Geschmack der visuellen Sprache: eine Gentleman’s-Club-Welt, kein Survival-Produkt. Finale Brand-Locks, sobald eure Assets vorliegen.",
  },
  offer: {
    eyebrow: "Das Angebot",
    title: "Such dir aus, wie wir",
    titleAccent: "zusammen arbeiten.",
    sub: "",
    tabs: [
      {
        label: "Einmal-Aufträge",
        note: "Eigenständige Projekte, einmal bezahlt. Keine Retainer-Bindung.",
        cards: [
          { tag: "Web", name: "Informative Website", price: "1.700–2.500 €", items: ["EN + DE, responsive", "SEO-optimiert (Meta, Schema, Sitemap)", "Lead-Capture / Beratung", "Deployed auf Vercel", "Privacy-first Analytics"] },
          { tag: "Shop", name: "Shopify-Rebuild", price: "1.300–2.000 €", items: ["Premium-Theme", "Produktseiten pro Modul", "KI-Renderings integriert", "Checkout-Optimierung", "SEO + structured data"] },
          { tag: "3D", name: "Modul-Konfigurator", price: "1.700–3.300 €", items: ["Modul selbst zusammenstellen in 3D", "Echte GLB-Modelle", "Im Browser", "Three.js / R3F"] },
          { tag: "Deck", name: "Investor-Pitch-Deck", price: "1.300–3.000 €", items: ["Narrative + Struktur", "Echte Zahlen, kein Füllstoff", "10–15 Folien, Custom-Design", "Optional Loom-Voiceover"] },
        ],
      },
      {
        label: "Partnerschaft",
        note: "Einmal aufgesetzt, dann ein System, das jeden Monat läuft.",
        cards: [
          { tag: "Setup", name: "Setup & Fundament", price: "ab 3.500 €", items: ["Brand-Guidelines final", "10–15 fotorealistische KI-Renderings", "Landingpage, deployed (SEO inklusive)", "2–3 Marketing-Videos", "Social-Template-Set", "Drive + Content-Kalender"] },
          { tag: "Monatlich", name: "Laufende Partnerschaft", price: "ab 1.200 € / Monat", items: ["15–20 Social-Posts", "4–6 KI-Videos", "3–5 neue Renderings", "Content-Kalender & Scheduling", "Paid-Ads-Management", "SEO-Monitoring + Optimierung", "Monatliche Analytics"] },
          { tag: "Soft Start", name: "Testmonat", price: "999 € flat", items: ["Ein Monat, voller Output", "Keine lange Bindung", "Geht in den Retainer über", "Entkoppelt die Entscheidung"] },
        ],
      },
      {
        label: "À la carte",
        note: "Einzelne Deliverables, pro Stück bepreist. Beliebig kombinierbar.",
        cards: [
          { tag: "Visual", name: "Pro Deliverable", price: "ab 80 €", items: ["KI-Rendering — ab 80 €", "KI-Video / Reel — ab 250 €", "Logo-Animation — ab 300 €", "Pitch-Deck-Folie — ab 90 €"] },
          { tag: "Web Add-ons", name: "Web & Content", price: "ab 250 €", items: ["Landingpage — ab 900 €", "Mehrsprachig (z.B. Arabisch + RTL) — 250 € flat", "Analytics-Dashboard — 1–2k €", "Brand-Guidelines — ab 450 €", "SEO-Audit + Fix — ab 350 €"] },
          { tag: "Laufend", name: "Social & Ads", price: "ab 25 € / Post", items: ["Social-Post — ab 25 €", "ManyChat-DM-Funnel — ab 400 €", "Ad-Kampagne Setup — ab 350 €", "Monats-Report — ab 150 €"] },
        ],
      },
    ],
  },
  process: {
    eyebrow: "Wie das abläuft",
    title: "Vom Handshake bis zu den ersten",
    titleAccent: "Renderings in 14 Tagen.",
    sub: "Ein kurzer Zeitplan, damit Ground X genau weiß, was wann landet — und was wir von euch brauchen. Jeder Meilenstein hat ein hartes Deliverable, kein Status-Update.",
    milestones: [
      {
        when: "Tag 0",
        title: "Kickoff-Call",
        deliverables: [
          "30-Min Calendly-Slot, keine Vorbereitung nötig",
          "Ich teile meine Checkliste: was ich von euch brauche (Assets, Referenzen, Logins)",
          "Drive-Ordner angelegt, ihr bekommt Edit-Rechte",
          "Ziele + KPIs aligned, jeder Meilenstein wird messbar",
        ],
      },
      {
        when: "Woche 1",
        title: "Erste Samples",
        deliverables: [
          "5–7 fotorealistische KI-Renderings (gewünschte Winkel)",
          "Erstes Brand-Direction-Frame (Palette + Typografie)",
          "Site-Wireframe in Figma falls Teil des Umfangs",
          "SEO-Keyword- + Wettbewerber-Scan geliefert",
        ],
      },
      {
        when: "Woche 2",
        title: "Approval-Runde",
        deliverables: [
          "Brand-Richtung gelockt (Palette, Typo, Tonalität)",
          "10–15 finale fotorealistische Renderings, einsatzbereit",
          "Site-Mockup in hoher Fidelity",
          "On-Page-SEO-Blueprint (Meta, Schema, Sitemap)",
        ],
      },
      {
        when: "Woche 4",
        title: "Launch",
        deliverables: [
          "Site live auf Vercel, EN+DE, SEO live",
          "Erste 2–3 Marketing-Videos ausgeliefert",
          "Social-Kalender für Monat 2 vorbereitet",
          "Analytics + Search Console verbunden",
        ],
      },
      {
        when: "Monat 2+",
        title: "System läuft",
        deliverables: [
          "Monatliche Frequenz gelockt: 15–20 Posts, 4–6 Reels, 3–5 Renderings, Ads",
          "SEO-Monitoring + Content-Optimierung jeden Monat",
          "Monatlicher Report: was gelandet ist, was bewegt hat",
          "Quartals-Review zur Richtung-Justierung",
        ],
      },
    ],
  },
  trustedBy: {
    eyebrow: "Vertrauen genießen",
    logos: DEFAULT_CONFIG.content.trustedBy.logos,
  },
  testimonials: {
    eyebrow: "Was Kunden sagen",
    title: "Echte Worte, echte",
    titleAccent: "Auslieferungen.",
    items: [
      {
        quote:
          "Samy hat die komplette Markenwelt plus die Website in drei Wochen gebaut. Die Renderings lagen schon vor, bevor das Engineering den Prototypen fertig hatte.",
        author: "Stefan",
        role: "Gründer · Gulf Rescue",
        logo: "/assets/gulfrescue-logo.svg",
      },
      {
        quote:
          "Eine Person, voller Marketing-Stack. Wir haben aufgehört, drei Agenturen zu jonglieren. Der Shopify-Rebuild hat sich im ersten Monat amortisiert.",
        author: "Anonym",
        role: "Co-Founder · Löwenhardt",
        logo: "/assets/loewenhardt-logo.png",
      },
      {
        quote:
          "Was wir zurückbekommen haben, war kein Mood-Board-Deck. Es war ein funktionierender Konfigurator, echte Modelle, deployed. Zwei Wochen.",
        author: "Anonym",
        role: "CEO · Modul-Konfigurator-Kunde",
      },
      {
        quote:
          "Samy bringt Tempo und Klarheit. Visuals, die wir vorher nur aus Pitch-Decks kannten, hatten wir nach wenigen Tagen real im Produkt.",
        author: "Michels",
        role: "Kunde",
      },
      {
        quote:
          "Wir haben mit Samy zusammengearbeitet, weil er das Brand-Gefühl und die Mechanik dahinter zusammen denkt. Kein Hin-und-Her, ein Lieferant, ein System.",
        author: "Agentur Hitz",
        role: "Partner-Agentur",
      },
    ],
  },
  faq: {
    eyebrow: "Häufige Fragen",
    title: "Alles, was ihr vor dem Call",
    titleAccent: "fragen würdet.",
    sub: "Kurze Antworten. Was fehlt, klärt der Beratungs-Slot.",
    items: [
      {
        q: "Wie schnell können wir starten?",
        a: "Kickoff innerhalb einer Woche nach Unterschrift. Erste Renderings innerhalb von zwei Wochen. Der Process-Abschnitt oben zeigt es Tag für Tag.",
      },
      {
        q: "Wem gehören die Assets?",
        a: "Ground X gehört alles, was ich produziere — Renderings, Brand-Dateien, Site-Source, Konfigurator-Code. Geliefert in euer Drive + GitHub.",
      },
      {
        q: "Was, wenn wir den Retainer stoppen wollen?",
        a: "Monatliche Kündigung. Ihr behaltet alles, was bis dahin ausgeliefert wurde. Keine Ausstiegsgebühr, kein IP-Rückhalt.",
      },
      {
        q: "Was ist nicht inbegriffen?",
        a: "Paid-Media-Budget selbst (nur das Management). Foto-Shootings vor Ort. Übersetzungen außerhalb DE / EN / AR. Jedes davon separat angebbar.",
      },
      {
        q: "Wie kommunizieren wir?",
        a: "Async-first über einen geteilten Drive-Ordner + WhatsApp / E-Mail für schnelle Threads. Wöchentlicher 30-Min-Call während des Builds, alle zwei Wochen, sobald der Retainer läuft.",
      },
      {
        q: "Lagerst du aus?",
        a: "Nein. Ich baue alles selbst. AETHER (mein eigenes Operating System) übernimmt die repetitive Arbeit; die kreativen und strategischen Entscheidungen sind meine.",
      },
    ],
  },
  contact: {
    eyebrow: "Nächster Schritt",
    headline: "Lass uns die ersten",
    headlineAccent: "Renderings bauen.",
    sub: "Samples landen zuerst, das Angebot direkt dahinter. Nehmt es mit ans Tisch zu eurem Team, und wir starten.",
  },
};

/** Pick the content block matching the active language. */
export function pickContent(lang: "en" | "de", content: OfferContent): OfferContent {
  if (lang === "en") return content;
  // Deep-merge DE_CONTENT over the EN content so any missing DE field
  // (or any partial override coming from a fetched offer) still falls
  // back to the EN text. Arrays come straight from DE_CONTENT (they
  // are full replacements, not merges, since indices have to line up).
  return {
    hero: { ...content.hero, ...DE_CONTENT.hero },
    angle: { ...content.angle, ...DE_CONTENT.angle, points: DE_CONTENT.angle.points },
    capabilities: {
      ...content.capabilities,
      ...DE_CONTENT.capabilities,
      items: DE_CONTENT.capabilities.items,
    },
    work: { ...content.work, ...DE_CONTENT.work },
    brand: { ...content.brand, ...DE_CONTENT.brand },
    offer: { ...content.offer, ...DE_CONTENT.offer, tabs: DE_CONTENT.offer.tabs },
    process: {
      ...content.process,
      ...DE_CONTENT.process,
      milestones: DE_CONTENT.process.milestones,
    },
    trustedBy: { ...content.trustedBy, ...DE_CONTENT.trustedBy },
    testimonials: {
      ...content.testimonials,
      ...DE_CONTENT.testimonials,
      items: DE_CONTENT.testimonials.items,
    },
    faq: { ...content.faq, ...DE_CONTENT.faq, items: DE_CONTENT.faq.items },
    contact: { ...content.contact, ...DE_CONTENT.contact },
  };
}

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
      process: { ...DEFAULT_CONFIG.content.process, ...(partial.content?.process ?? {}) },
      trustedBy: { ...DEFAULT_CONFIG.content.trustedBy, ...(partial.content?.trustedBy ?? {}) },
      testimonials: { ...DEFAULT_CONFIG.content.testimonials, ...(partial.content?.testimonials ?? {}) },
      faq: { ...DEFAULT_CONFIG.content.faq, ...(partial.content?.faq ?? {}) },
      contact: { ...DEFAULT_CONFIG.content.contact, ...(partial.content?.contact ?? {}) },
    },
  };
}
