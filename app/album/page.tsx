"use client";

import AlbumGrid from "@/components/AlbumGrid";
import NostrConnect from "@/components/NostrConnect";
import { useArchive } from "@/lib/store";
import { rankFor } from "@/lib/data";

export default function AlbumPage() {
  const points = useArchive((s) => s.points);
  const packsOpened = useArchive((s) => s.packsOpened);
  const { current, next } = rankFor(points);
  const progress = next ? ((points - current.min) / (next.min - current.min)) * 100 : 100;

  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-dossier text-ash">OFFICIAL LEDGER</p>
          <h1 className="mt-2 font-display text-4xl text-bone">The Creature Archive</h1>
        </div>
        <NostrConnect />
      </div>

      <div className="mb-10 grid gap-4 border border-bone/10 bg-coal p-6 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[9px] tracking-dossier text-ash">ARCHIVE RANK</p>
          <p className="mt-1 font-display text-2xl text-gold">{current.name}</p>
          {next && (
            <div className="mt-3">
              <div className="h-1 w-full overflow-hidden rounded-full bg-void">
                <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1 font-mono text-[9px] text-ash">
                {points} / {next.min} → {next.name}
              </p>
            </div>
          )}
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-dossier text-ash">POINTS</p>
          <p className="mt-1 font-display text-2xl text-bone">{points}</p>
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-dossier text-ash">PACKS BREACHED</p>
          <p className="mt-1 font-display text-2xl text-bone">{packsOpened}</p>
        </div>
      </div>

      <AlbumGrid />
    </div>
  );
}
