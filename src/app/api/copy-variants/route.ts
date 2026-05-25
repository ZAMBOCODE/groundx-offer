/**
 * Copy-variants agent — generates 3 distinct alt-copies for a deck
 * section. Called by the DevPanel CopyVariantPicker's "✨ AI" button.
 *
 * Backed by Anthropic via direct fetch (no SDK). Requires
 * ANTHROPIC_API_KEY in the env (set in .env.local for dev). When the
 * key is missing the endpoint returns 503 with a helpful message so
 * the picker can fall back to the curated COPY_VARIANTS without
 * exploding.
 *
 * Request:  POST { section: string, currentCopy: object, client?: { name, tagline?, voice? } }
 * Response: { ok: true, variants: CopyVariant[] }
 */
import { NextRequest, NextResponse } from "next/server";

type Client = { name?: string; tagline?: string; voice?: string };

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY not set on the server. Put it in .env.local and restart the dev server. Picker will keep using the curated set in src/lib/copyVariants.ts.",
      },
      { status: 503 },
    );
  }

  let body: { section?: string; currentCopy?: unknown; client?: Client };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const { section, currentCopy, client } = body;
  if (!section || !currentCopy) {
    return NextResponse.json(
      { error: "missing required fields: section, currentCopy" },
      { status: 400 },
    );
  }

  const clientLine = client?.name
    ? `${client.name}${client.tagline ? ` — ${client.tagline}` : ""}`
    : "(unspecified client)";
  const voiceLine = client?.voice ? `\nVoice notes: ${client.voice}` : "";

  const user = `Generate 3 alternative copy variants for the "${section}" section of a sales-deck.

Client: ${clientLine}${voiceLine}

Current copy:
${JSON.stringify(currentCopy, null, 2)}

Each variant must:
- Have a clearly distinct tone (Direct = plain + fast + what+why ; Editorial = magazine cadence + narrative ; Punchy = short lines + receipts + momentum)
- Keep the SAME field names + types as the input
- Only include patch fields you actually want to change (you may omit fields)
- Be tighter than the current copy where you can — no filler, no buzzwords
- Avoid em-dashes (use commas / colons / periods)
- Respect the brand voice notes if present

Output STRICT JSON only, no markdown fences, no preamble:
{
  "variants": [
    { "id": "direct",    "label": "Direct",    "vibe": "...", "patch": { /* same shape as currentCopy, partial */ } },
    { "id": "editorial", "label": "Editorial", "vibe": "...", "patch": { ... } },
    { "id": "punchy",    "label": "Punchy",    "vibe": "...", "patch": { ... } }
  ]
}`;

  let upstream: Response;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system:
          "You write distinct, on-brand sales-deck copy variants. You output strict JSON exactly matching the schema the user describes, nothing else. No markdown fences. No preamble. No commentary.",
        messages: [{ role: "user", content: user }],
      }),
    });
  } catch (e) {
    return NextResponse.json(
      { error: "upstream fetch failed: " + (e instanceof Error ? e.message : String(e)) },
      { status: 502 },
    );
  }
  if (!upstream.ok) {
    const text = await upstream.text();
    return NextResponse.json(
      { error: `Anthropic ${upstream.status}: ${text.slice(0, 400)}` },
      { status: 502 },
    );
  }
  const payload = (await upstream.json()) as {
    content?: { type: string; text?: string }[];
  };
  const raw = payload.content?.find((b) => b.type === "text")?.text ?? "";
  // Strip any accidental code-fence (defensive)
  const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();

  let parsed: { variants?: unknown };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "model returned non-JSON", raw: cleaned.slice(0, 400) },
      { status: 502 },
    );
  }
  if (!parsed.variants || !Array.isArray(parsed.variants)) {
    return NextResponse.json(
      { error: "missing variants[] in model output", raw: parsed },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, variants: parsed.variants });
}
