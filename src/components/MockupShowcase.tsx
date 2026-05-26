"use client";

import { useState } from "react";
import { TiltCard } from "./TiltCard";
import { useLang } from "./language-context";
import { Lock, ChevronLeft, ChevronRight, Plus, Share, PanelLeft, RotateCw, Wifi, Signal, Battery } from "lucide-react";

/* Brand-direction mockup showcase — variant 3 of the brand section.
   Samy 2026-05-25: the Safari + iPhone need to "echt aussehen, nicht so
   billig". Real macOS chrome (traffic lights with inner highlight, real
   toolbar buttons, lock-padlock URL pill, tab strip with active tint)
   plus a real iPhone bezel (Dynamic Island, status bar, side buttons,
   correct inner-screen radius).

   The business-card overlay was overlapping content; it now lives in a
   safe bottom-left slot, can be toggled off (showBusinessCard=false),
   and is laid out cleanly. */

const TABS = [
  { id: "website", label: "Website", url: "groundx.ae", img: "/assets/gx-web-1.png" },
  { id: "shop", label: "Configurator", url: "groundx.ae/configure", img: "/assets/gx-web-2.png" },
  { id: "dashboard", label: "Dashboard", url: "app.groundx.ae", img: "/assets/gx-web-3.png" },
];

export function MockupShowcase({ showBusinessCard = true }: { showBusinessCard?: boolean } = {}) {
  const [tab, setTab] = useState(0);
  const active = TABS[tab]!;

  return (
    <div className="relative mt-14 pb-12">
      <div className="grid items-center gap-8 lg:grid-cols-[1.7fr_0.7fr]">
        <SafariWindow tabs={TABS} active={tab} onSelect={setTab} screenshot={active.img} url={active.url} />
        <div className="hidden lg:block">
          <IPhoneFrame screenshot={active.img} label={active.label} />
        </div>
      </div>

      {showBusinessCard && (
        <div className="pointer-events-none absolute -bottom-2 left-2 z-20 hidden md:block">
          <CleanerCard />
        </div>
      )}
    </div>
  );
}

/* ---------------- Safari window (macOS Sequoia-ish) ---------------- */

function SafariWindow({
  tabs,
  active,
  onSelect,
  screenshot,
  url,
}: {
  tabs: { id: string; label: string; url: string }[];
  active: number;
  onSelect: (i: number) => void;
  screenshot: string;
  url: string;
}) {
  return (
    <TiltCard className="overflow-hidden p-0">
      {/* title bar with traffic lights + window controls */}
      <div
        className="flex items-center gap-3 border-b border-[var(--stroke-card)] px-3.5 py-2.5"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        }}
      >
        <div className="flex items-center gap-1.5">
          <TrafficLight color="#ff5f57" />
          <TrafficLight color="#febc2e" />
          <TrafficLight color="#28c840" />
        </div>

        <div className="ml-3 flex items-center gap-1.5 text-[var(--ink-3)]">
          <SafariBtn><PanelLeft size={11} strokeWidth={2} /></SafariBtn>
          <SafariBtn><ChevronLeft size={12} strokeWidth={2.2} /></SafariBtn>
          <SafariBtn><ChevronRight size={12} strokeWidth={2.2} /></SafariBtn>
        </div>

        <div
          className="mx-2 flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-[var(--ink-2)]"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <Lock size={9} strokeWidth={2.4} />
          <span className="text-[0.62rem]">{url}</span>
          <RotateCw size={9} strokeWidth={2.2} className="ml-1 opacity-60" />
        </div>

        <div className="flex items-center gap-1.5 text-[var(--ink-3)]">
          <SafariBtn><Share size={11} strokeWidth={2.2} /></SafariBtn>
          <SafariBtn><Plus size={12} strokeWidth={2.2} /></SafariBtn>
        </div>
      </div>

      {/* tab strip */}
      <div
        className="flex border-b border-[var(--stroke-card)] px-2 py-1"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(i)}
              className="meta relative mx-0.5 flex-1 truncate rounded-md px-3 py-1.5 text-left text-[0.6rem] transition"
              style={{
                color: on ? "var(--ink)" : "var(--ink-3)",
                background: on ? "rgba(255,255,255,0.08)" : "transparent",
                fontFamily: "var(--font-sans)",
                letterSpacing: 0,
                textTransform: "none",
              }}
            >
              <span className="font-semibold">{t.label}</span>
              <span className="text-faint ml-1.5 hidden text-[0.55rem] opacity-60 sm:inline">
                {t.url}
              </span>
            </button>
          );
        })}
      </div>

      {/* page content */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshot}
          alt={tabs[active]?.label ?? ""}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    </TiltCard>
  );
}

function TrafficLight({ color }: { color: string }) {
  return (
    <span
      className="block h-3 w-3 rounded-full"
      style={{
        background: color,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.25)",
      }}
    />
  );
}

function SafariBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-white/[0.07]"
      tabIndex={-1}
    >
      {children}
    </button>
  );
}

/* ---------------- iPhone 15 Pro-ish frame ---------------- */

function IPhoneFrame({ screenshot, label }: { screenshot: string; label: string }) {
  return (
    <div className="relative mx-auto" style={{ width: "230px" }}>
      {/* side buttons */}
      <span
        aria-hidden
        className="absolute left-[-3px] top-[120px] h-12 w-[3px] rounded-l"
        style={{ background: "#0c0a08", boxShadow: "inset 1px 0 0 rgba(255,255,255,0.04)" }}
      />
      <span
        aria-hidden
        className="absolute left-[-3px] top-[180px] h-8 w-[3px] rounded-l"
        style={{ background: "#0c0a08" }}
      />
      <span
        aria-hidden
        className="absolute right-[-3px] top-[150px] h-16 w-[3px] rounded-r"
        style={{ background: "#0c0a08" }}
      />

      {/* outer bezel */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "9 / 19.5",
          borderRadius: "44px",
          background:
            "linear-gradient(160deg, #1a1817 0%, #0a0907 50%, #15110d 100%)",
          padding: "10px",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* screen */}
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{ borderRadius: "34px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshot}
            alt={`${label} mobile`}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />

          {/* Dynamic Island */}
          <div
            className="absolute left-1/2 top-2 z-30 -translate-x-1/2"
            style={{
              width: "92px",
              height: "26px",
              borderRadius: "20px",
              background: "#000",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
            }}
          />

          {/* status bar — time left, indicators right (sits in screen safe-area) */}
          <div className="absolute inset-x-0 top-0 z-20 flex h-[26px] items-center justify-between px-5 text-white">
            <span
              className="text-[0.55rem] font-semibold"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              9:41
            </span>
            <div className="flex items-center gap-1 opacity-90">
              <Signal size={9} strokeWidth={3} />
              <Wifi size={9} strokeWidth={2.6} />
              <Battery size={11} strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </div>

      <span className="meta text-faint mt-3 block text-center text-[0.55rem] tracking-[0.3em]">
        IPHONE — {label.toUpperCase()}
      </span>
    </div>
  );
}

/* ---------------- Cleaner business card ---------------- */

function CleanerCard() {
  const { lang } = useLang();
  return (
    <div
      className="card glow-border flex w-[210px] flex-col gap-4 p-4"
      style={{
        transform: "rotate(-5deg)",
        aspectRatio: "1.66 / 1",
        background: "linear-gradient(160deg, #0c0a08 0%, #050505 100%)",
      }}
    >
      <div className="flex items-start justify-between">
        <span className="meta text-[0.5rem] tracking-[0.3em] text-[var(--ink-3)]">DXB · 2025</span>
        <span className="meta text-[0.5rem] tracking-[0.3em]" style={{ color: "var(--gx-gold-hi)" }}>
          GROUND X
        </span>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[120px]" />

      <div className="mt-auto flex items-baseline justify-between text-[var(--ink-3)]">
        <span className="meta text-[0.5rem] tracking-[0.3em]">
          {lang === "de" ? "UNTERTAGE" : "UNDERGROUND"}
        </span>
        <span className="meta text-[0.5rem] tracking-[0.3em]">
          {lang === "de" ? "REFUGIUM" : "SANCTUARY"}
        </span>
      </div>
    </div>
  );
}
