import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
    <html lang="en" className={manrope.variable}>
      <body>
        <div className="ambient" />
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
