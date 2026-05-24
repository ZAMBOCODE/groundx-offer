"use client";

import { useEffect, useState } from "react";

/* Speicher-Symbol (Samy 2026-05-24): Snapshot der aktuellen Design-Stellungen
   als named Preset, später wieder ladbar. Snapshotet diese 4 localStorage-Keys:
     groundx.variants       — variant index pro Section
     groundx.sectionEnabled — pro Section an/aus
     groundx.devpanel       — accent/font/radius/cursorFx/shader/...
     groundx.lang           — en/de
   Auf Load setzen wir alle 4 + reloaden, damit Provider die neuen Werte ziehen.
*/

const PRESETS_KEY = "groundx.presets.v1";
const SNAPSHOT_KEYS = ["groundx.variants", "groundx.sectionEnabled", "groundx.devpanel", "groundx.lang"];

type Snapshot = Record<string, string>;
type Preset = { name: string; createdAt: string; snapshot: Snapshot };

function readPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Preset[];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function writePresets(list: Preset[]): void {
  try { localStorage.setItem(PRESETS_KEY, JSON.stringify(list)); } catch {}
}

function snapshotNow(): Snapshot {
  const out: Snapshot = {};
  for (const k of SNAPSHOT_KEYS) {
    const v = localStorage.getItem(k);
    if (v !== null) out[k] = v;
  }
  return out;
}

function applySnapshot(s: Snapshot): void {
  for (const k of SNAPSHOT_KEYS) {
    const v = s[k];
    if (v === undefined) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  }
  // Re-init from localStorage so every provider picks up new values.
  window.location.reload();
}

export function Presets() {
  const [list, setList] = useState<Preset[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setList(readPresets());
  }, []);

  const save = () => {
    const nm = (name.trim() || `Preset ${list.length + 1}`).slice(0, 40);
    const next: Preset[] = [
      { name: nm, createdAt: new Date().toISOString(), snapshot: snapshotNow() },
      ...list.filter((p) => p.name !== nm),
    ].slice(0, 20);
    writePresets(next);
    setList(next);
    setName("");
  };

  const remove = (nm: string) => {
    const next = list.filter((p) => p.name !== nm);
    writePresets(next);
    setList(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="meta text-faint text-[0.58rem]">Presets — Speichern / Laden</p>
        <button
          onClick={() => setOpen((o) => !o)}
          className="inner-card flex h-7 items-center gap-1.5 px-2.5 text-[0.62rem] font-mono uppercase tracking-[0.16em]"
          style={{ color: open ? "#1a0f04" : "var(--accent-bright)", background: open ? "var(--accent)" : undefined, borderColor: open ? "var(--accent)" : undefined }}
          title="Speicher-Panel öffnen"
        >
          <SaveIcon size={11} /> save
        </button>
      </div>

      {open && (
        <div className="mt-2.5 flex flex-col gap-2">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Preset-Name"
              className="inner-card flex-1 px-2.5 py-1.5 text-[0.78rem]"
              style={{ color: "var(--ink)", fontFamily: "var(--font-mono)" }}
            />
            <button
              onClick={save}
              className="inner-card flex h-7 items-center gap-1 px-3 text-[0.7rem] font-semibold"
              style={{ color: "#1a0f04", background: "var(--accent)", borderColor: "var(--accent)" }}
              title="Aktuellen Stand speichern"
            >
              <SaveIcon size={10} /> snap
            </button>
          </div>

          {list.length === 0 ? (
            <p className="meta text-faint text-[0.6rem]">noch keine Snapshots</p>
          ) : (
            <ul className="flex max-h-[180px] flex-col gap-1 overflow-y-auto pr-1">
              {list.map((p) => (
                <li key={p.name} className="inner-card flex items-center justify-between gap-2 px-2.5 py-1.5">
                  <button
                    onClick={() => applySnapshot(p.snapshot)}
                    className="flex flex-1 flex-col items-start text-left"
                    title="Diesen Snapshot laden (reload)"
                  >
                    <span className="text-[0.78rem] text-white">{p.name}</span>
                    <span className="meta text-faint text-[0.54rem]">
                      {new Date(p.createdAt).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </button>
                  <button
                    onClick={() => remove(p.name)}
                    className="meta text-faint hover:text-[var(--danger)] text-[0.6rem] underline-offset-4 hover:underline"
                    title="Löschen"
                  >
                    rm
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* Disk/save symbol, inline so we don't pull in a deps. */
function SaveIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
