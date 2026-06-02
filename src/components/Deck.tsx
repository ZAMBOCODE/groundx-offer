"use client";

/**
 * Deck — the multi-tenant entry point. One domain, many clients (/:slug).
 *
 * Critical ordering: we seed the saved look into localStorage BEFORE the
 * providers (and DevPanel) mount, because they read localStorage in their
 * mount effects. So we gate the whole provider tree behind `ready`, which
 * flips only after the look fetch settles. A fresh visitor (the client) gets
 * Samy's saved look; Samy himself (?dev=1, keys already set) is untouched.
 */

import { useEffect, useState } from "react";
import { OfferProvider } from "./OfferProvider";
import { DesignProvider } from "./design-context";
import { LanguageProvider } from "./language-context";
import { HeaderActions } from "./HeaderActions";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { DeckBody } from "./DeckBody";
import { seedLookFromBackend } from "@/lib/look";

export function Deck({ offerId }: { offerId?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const done = () => {
      if (alive) setReady(true);
    };
    // Client view (no ?dev=1) always loads the latest saved look (overwrite),
    // so selections / sections / images are never stale on a returning device.
    // Dev mode preserves Samy's in-progress local edits.
    const devMode =
      typeof window !== "undefined" &&
      (new URLSearchParams(window.location.search).get("dev") === "1" ||
        window.location.hash === "#dev");
    if (offerId) seedLookFromBackend(offerId, !devMode).finally(done);
    else done();
    return () => {
      alive = false;
    };
  }, [offerId]);

  // Until the saved look is seeded, render nothing (the layout's dark ambient
  // background still shows, so no white flash). Keeps providers from reading
  // an un-seeded localStorage.
  if (!ready) return null;

  return (
    <LanguageProvider>
      <OfferProvider offerId={offerId}>
        <DesignProvider>
          <HeaderActions />
          <DeckBody />
          <WhatsAppFloat />
        </DesignProvider>
      </OfferProvider>
    </LanguageProvider>
  );
}
