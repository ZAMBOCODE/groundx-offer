"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { clsx } from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Sambo Design card primitive: mouse-tracked 3D tilt + white-light hairline
 * border. Tilt magnitude scales down with card size (perspective 1300px),
 * matching apps/desktop useTiltCard. No decorative icons.
 */
export function TiltCard({ children, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const maxDim = Math.max(r.width, r.height);
    const tilt = Math.max(2.5, Math.min(9, 9 * (280 / maxDim)));
    const lift = Math.max(6, Math.min(14, 14 * (280 / maxDim)));

    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);

    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const rx = ((e.clientY - cy) / (r.height / 2)) * -tilt; // rotateX
    const ry = ((e.clientX - cx) / (r.width / 2)) * tilt; // rotateY
    el.style.transform = `perspective(1300px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${lift}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1300px) rotateX(0) rotateY(0) translateZ(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={clsx("card glow-border", className)}
      style={style}
    >
      {children}
    </div>
  );
}
