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
} from "next/font/google";
import "./globals.css";
import { Atmosphere } from "@/components/Atmosphere";

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

// curated style-tagged display fonts (seed of the global font library)
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: ["400"], variable: "--font-instrument", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: "Ground X — Visual & Marketing Partnership",
  description:
    "A proposal by ZamboDezigns: brand, AI visuals, web and content systems for Ground X.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${bricolage.variable} ${syne.variable} ${fraunces.variable} ${instrument.variable} ${unbounded.variable} ${sora.variable}`}
    >
      <body>
        <div className="ambient" />
        <Atmosphere />
        {children}
      </body>
    </html>
  );
}
