"use client";

import PackOpener from "@/components/PackOpener";
import NostrConnect from "@/components/NostrConnect";
import { ReferralBox } from "@/components/ReferralBox";
import { useArchive } from "@/lib/store";
import { rankFor } from "@/lib/data";

export default function PacksPage() {
  const packsOpened = useArchive((s) => s.packsOpened);
  const points = useArchive((s) => s.points);
  const { current, next } = rankFor(points);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-dossier text-ash">CONTAINMENT CHAMBER</p>
          <h1 className="mt-2 font-display text-4xl text-bone">Breach the packs</h1>
          <div className="mt-4 flex flex-wrap gap-5 font-mono text-[10px] tracking-dossier text-ash">
            <span>
              PACKS: <span className="text-gold">{packsOpened}</span>
            </span>
            <span>
              RANK: <span className="text-gold">{current.name}</span>
            </span>
            {next && (
              <span>
                NEXT: {next.name} <span className="text-ash/60">({next.min - points} pts)</span>
              </span>
            )}
          </div>
        </div>
        <NostrConnect />
      </div>

      <PackOpener />

      <div className="mt-16">
        <ReferralBox />
      </div>
    </div>
  );
}
