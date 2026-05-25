/* Inline brand/tech icons used across offer cards + capability section.
   Single-color monochrome (uses currentColor) so they pick up accent/ink.
   Samy 2026-05-24: "icons benutzen für shopify und alles". */

type Props = { size?: number; className?: string };

export function ShopifyIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M15.1 5.4c-.1-.7-.6-1.1-1.1-1.1l-.4-.1c-.4-1.2-1.1-1.9-2-1.9-.3 0-.7.1-1 .3-.6-.7-1.4-1-2.2-.9-1.7.1-3.4 1.4-4.2 4.1-.6 2.1-1.9 6-2.7 8.5l4.7 1.6 2.3-7.8.4.1-.4 7.9 4.6 1.6.7-7.4.6.2.8-5.1zM9.4 5.3l-1.6-.5c.4-1 1-1.7 1.8-1.7.5 0 .8.2 1 .6-.6.5-1 1.1-1.2 1.6zm.5-1.8c.4 0 .7.1.9.4-.2.1-.5.3-.7.5-.4.3-.6.7-.8 1.1l-1.2-.4c.3-.9.8-1.6 1.8-1.6zm1.8.7c.2.1.4.3.6.5-.5 0-1 .2-1.5.4.2-.4.5-.7.9-.9zM18 19.4c-.1 0-3.2-.4-3.2-.4l-2.2-2.2L12 2.5c2.5.1 4.7 1.5 4.7 1.5L18 19.4z"/>
    </svg>
  );
}

export function VercelIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 3l11 19H1L12 3z"/>
    </svg>
  );
}

export function NextIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 8v8M9 8l7 8" strokeLinecap="round" />
    </svg>
  );
}

export function ThreeIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3l9 16H3L12 3z" />
      <path d="M12 9l5 9H7l5-9z" />
    </svg>
  );
}

export function R3FIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" />
      <ellipse cx="12" cy="12" rx="10" ry="3.8" />
      <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function FigmaIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 2h4v6H8a3 3 0 010-6zm0 8h4v6H8a3 3 0 010-6zm0 8h4v0a3 3 0 11-3-3v3h-1zm6-16h2a3 3 0 010 6h-4V2zm0 8h2a3 3 0 010 6h-4v-6zm0-1h0z"/>
    </svg>
  );
}

export function GlobeIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2c3 3.5 4.5 7.5 4.5 10S15 18.5 12 22M12 2c-3 3.5-4.5 7.5-4.5 10S9 18.5 12 22" />
    </svg>
  );
}

export function CubeIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3l9 5v8l-9 5-9-5V8l9-5z" />
      <path d="M3 8l9 5 9-5M12 13v10" />
    </svg>
  );
}

export function PlayIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 4l14 8-14 8V4z" />
    </svg>
  );
}

export function ChatIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 12a8 8 0 11-3-6.2L21 4l-1 4.5A8 8 0 0121 12z" />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" />
      <circle cx="13" cy="12" r="0.8" fill="currentColor" />
      <circle cx="17" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function ChartIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M3 21h18" />
      <rect x="5" y="11" width="3" height="8" />
      <rect x="11" y="6" width="3" height="13" />
      <rect x="17" y="14" width="3" height="5" />
    </svg>
  );
}

export function DeckIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="1.5" />
      <path d="M8 20h8M12 17v3" />
    </svg>
  );
}

export function PaletteIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden="true">
      <path d="M12 22a10 10 0 110-20c5 0 9 4 9 8 0 3-2 4-4 4h-2a2 2 0 00-1 4c0 2-1 4-2 4z" />
      <circle cx="7" cy="11" r="1" fill="currentColor" />
      <circle cx="10" cy="7" r="1" fill="currentColor" />
      <circle cx="15" cy="7" r="1" fill="currentColor" />
      <circle cx="17" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

export function SparkIcon({ size = 16, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
    </svg>
  );
}

/* Lookup helper — pricing card "tag" or "name" string -> icon component.
   Falls back to a generic deck icon. Match is case-insensitive substring. */
export function iconFor(label: string): React.ComponentType<Props> {
  const s = label.toLowerCase();
  if (s.includes("shopify") || s.includes("shop")) return ShopifyIcon;
  if (s.includes("configurator") || s.includes("3d") || s.includes("module")) return CubeIcon;
  if (s.includes("web") || s.includes("site") || s.includes("landing")) return GlobeIcon;
  if (s.includes("video") || s.includes("reel")) return PlayIcon;
  if (s.includes("social") || s.includes("manychat") || s.includes("dm") || s.includes("ad")) return ChatIcon;
  if (s.includes("dashboard") || s.includes("analytic")) return ChartIcon;
  if (s.includes("deck") || s.includes("pitch") || s.includes("slide")) return DeckIcon;
  if (s.includes("brand") || s.includes("logo") || s.includes("guideline")) return PaletteIcon;
  if (s.includes("ai") || s.includes("rendering") || s.includes("visual")) return SparkIcon;
  if (s.includes("phase") || s.includes("setup") || s.includes("foundation")) return SparkIcon;
  if (s.includes("partnership") || s.includes("monthly") || s.includes("retainer")) return ChartIcon;
  return DeckIcon;
}
