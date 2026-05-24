"use client";

import { useState } from "react";
import { TiltCard } from "./TiltCard";

/* "How Ground X could feel" — a Safari-style browser mockup with Website / Shop /
   Dashboard tabs beside an iPhone mobile mockup, plus a floating business card.
   Things deliberately overflow the section for a layered, alive feel. */

const TABS = [
  { id: "website", label: "Website", url: "groundx.ae", img: "/assets/gx-web-1.png" },
  { id: "shop", label: "Shop", url: "groundx.ae/configure", img: "/assets/gx-web-2.png" },
  { id: "dashboard", label: "Dashboard", url: "app.groundx.ae", img: "/assets/gx-web-3.png" },
];

export function MockupShowcase() {
  const [tab, setTab] = useState(0);
  const active = TABS[tab]!;

  return (
    <div className="relative mt-14">
      {/* floating Ground X business card — bottom-left, overflowing */}
      <div
        className="card glow-border absolute -left-6 -bottom-10 z-20 hidden w-[230px] flex-col justify-between p-5 md:flex"
        style={{ transform: "rotate(-7deg)", aspectRatio: "1.66 / 1" }}
      >
        <div className="flex items-start justify-between">
          <span className="meta text-[0.5rem] text-faint">Underground Sanctuaries</span>
          <span className="meta text-[0.5rem]" style={{ color: "var(--gx-gold-hi)" }}>Dubai</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/groundx-logo.png" alt="GROUND X" className="w-[140px]" />
        <div className="hairline" />
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-[1.7fr_0.8fr]">
        {/* browser mockup */}
        <TiltCard className="overflow-hidden p-0">
          <div className="flex items-center gap-3 border-b border-[var(--stroke-card)] px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
            </span>
            <div className="ml-2 flex gap-1.5">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setTab(i)}
                  className="meta rounded-t-md px-3 py-1.5 text-[0.58rem] transition"
                  style={{
                    color: i === tab ? "#1a0f04" : "var(--ink-2)",
                    background: i === tab ? "var(--accent)" : "rgba(255,255,255,0.04)",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="ml-auto hidden rounded-full px-3 py-1 text-[0.62rem] sm:block"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
              {active.url}
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.img} alt={active.label} className="h-full w-full object-cover object-top" />
          </div>
        </TiltCard>

        {/* phone mockup — mobile version of the active tab */}
        <div className="relative mx-auto hidden lg:block">
          <div
            className="relative overflow-hidden border-[6px]"
            style={{
              width: "200px",
              aspectRatio: "9 / 19",
              borderColor: "#1a1a1d",
              borderRadius: "32px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
              background: "#000",
            }}
          >
            <span
              className="absolute top-2 left-1/2 z-10 h-4 w-20 -translate-x-1/2 rounded-full"
              style={{ background: "#1a1a1d" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.img} alt={`${active.label} mobile`} className="h-full w-full object-cover object-top" />
          </div>
          <span className="meta text-faint mt-3 block text-center text-[0.55rem]">mobile</span>
        </div>
      </div>
    </div>
  );
}
