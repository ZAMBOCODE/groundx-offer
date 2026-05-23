"use client";

import { useRef, type ReactNode } from "react";
import { clsx } from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
  /** lift on hover in px */
  lift?: number;
};

/**
 * Whole-surface mouse-tracked 3D tilt + gradient hairline border.
 * The AETHER card primitive: subtle parallax, no decorative icons.
 */
export function TiltCard({ children, className, max = 7, lift = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-${lift}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={clsx("card glow-border", className)}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
