import type { Metadata } from "next";
import {
  Space_Grotesk,
  Inter,
  JetBrains_Mono,
  Bricolage_Grotesque,
  Syne,
  Fraunces,
  Instrument_Serif,
  Unbounded,
  Sora,
  Playfair_Display,
  Cormorant_Garamond,
  DM_Serif_Display,
  Anton,
  Bebas_Neue,
  Orbitron,
  Audiowide,
  Manrope,
  Inter_Tight,
  DM_Sans,
  Outfit,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import { Atmosphere } from "@/components/Atmosphere";
import { Header } from "@/components/Header";
import { ScrollProgress } from "@/components/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
});

// curated style-tagged display fonts (seed of the global font library).
// Expanded 2026-05-25 — Samy's request for more font options.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: ["400"], variable: "--font-instrument", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

// Editorial / luxury serifs
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-cormorant", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-serif", display: "swap" });

// Bold / display
const anton = Anton({ subsets: ["latin"], weight: ["400"], variable: "--font-anton", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"], variable: "--font-bebas", display: "swap" });

// Futuristic
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", display: "swap" });
const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"], variable: "--font-audiowide", display: "swap" });

// Clean grotesks
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

// Alt mono
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Ground X — Visual & Marketing Partnership",
  description:
    "A proposal by ZamboDezigns: brand, AI visuals, web and content systems for Ground X.",
  // Samy 2026-05-27: Favicon = ZamboDezigns-Logo (Sender, nicht der Kunde).
  icons: {
    icon: [
      { url: "/assets/zambo-logo.png", type: "image/png" },
    ],
    shortcut: "/assets/zambo-logo.png",
    apple: "/assets/zambo-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[
        inter.variable, spaceGrotesk.variable, jetbrainsMono.variable,
        bricolage.variable, syne.variable, fraunces.variable,
        instrument.variable, unbounded.variable, sora.variable,
        playfair.variable, cormorant.variable, dmSerif.variable,
        anton.variable, bebas.variable,
        orbitron.variable, audiowide.variable,
        manrope.variable, interTight.variable, dmSans.variable, outfit.variable,
        plexMono.variable,
      ].join(" ")}
    >
      <body>
        <div className="ambient" />
        <Atmosphere />
        <Header />
        {children}
        <ScrollProgress />
      </body>
    </html>
  );
}
