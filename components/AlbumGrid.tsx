"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CREATURES, RARITY_COLOR, TOTAL_CREATURES } from "@/lib/data";
import { useArchive } from "@/lib/store";

export default function AlbumGrid() {
  const owned = useArchive((s) => s.owned);
  const contained = CREATURES.filter((c) => (owned[c.id] ?? 0) > 0).length;

  return (
    <div>
      <div className="mb-8 flex items-end justify-between border-b border-bone/10 pb-4">
        <div>
          <p className="font-mono text-[10px] tracking-dossier text-ash">CONTAINMENT PROGRESS</p>
          <p className="mt-1 font-display text-3xl text-bone">
            {contained} <span className="text-ash">/ {TOTAL_CREATURES}</span>
          </p>
        </div>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-coal sm:w-64">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(contained / TOTAL_CREATURES) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
        {CREATURES.map((c, idx) => {
          const count = owned[c.id] ?? 0;
          const unlocked = count > 0;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`relative flex min-h-44 flex-col rounded-sm border p-4 ${
                unlocked ? `${RARITY_COLOR[c.rarity]} bg-coal` : "redacted border-bone/10"
              }`}
            >
              {unlocked ? (
                <>
                  <div className="flex items-start justify-between">
                    <p className="font-mono text-[9px] tracking-dossier opacity-70">FILE {c.id}</p>
                    {count > 1 && (
                      <span className="rounded-full border border-bone/30 px-2 font-mono text-[9px] text-bone">
                        ×{count}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-xl leading-tight">{c.name}</h3>
                  <p className="mt-0.5 text-[11px] italic opacity-75">{c.epithet}</p>
                  <p className="mt-2 font-mono text-[9px] tracking-dossier opacity-60">{c.culture}</p>
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed opacity-80">{c.blurb}</p>
                  <div className="mt-auto pt-3">
                    <span className="stamp text-[8px] opacity-90">{c.status}</span>
                  </div>
                  {c.href && (
                    <Link
                      href={c.href}
                      target="_blank"
                      className="mt-3 font-mono text-[9px] tracking-dossier text-gold hover:underline"
                    >
                      FULL FILE ↗
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-mono text-[9px] tracking-dossier text-ash">FILE {c.id}</p>
                  <div className="my-3 space-y-1.5">
                    <div className="h-2 w-24 rounded bg-void/80" />
                    <div className="h-2 w-20 rounded bg-void/80" />
                    <div className="h-2 w-16 rounded bg-void/80" />
                  </div>
                  <p className="font-mono text-[8px] tracking-dossier text-ash/70">FILE SEALED</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {contained === 0 && (
        <p className="mt-8 text-center font-mono text-xs tracking-dossier text-ash">
          No files contained yet. The packs are waiting.
        </p>
      )}
    </div>
  );
}
