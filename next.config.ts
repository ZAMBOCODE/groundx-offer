import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 2026-05-27 (Run-5): output: "standalone" fuer VPS-Deploy. Produziert
  // einen minimalen .next/standalone/ Output (Node-Server + nur die noetigen
  // node_modules), den wir in einen kleinen Docker-Container packen.
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
