import { Deck } from "@/components/Deck";

// Per-client offer deck: /:slug fetches offers/<slug> and applies the saved
// look. One domain, many clients, no rebuild per client.
export default async function ClientDeck({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <Deck offerId={slug} />;
}
