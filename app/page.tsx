
import Link from "next/link";
import { CREATURES, ODDS, RARITY_ORDER, RARITY_LABEL } from "@/lib/data";

const RARITY_COLOR_TEXT: Record<string, string> = {
  common: "text-ash",
  uncommon: "text-sage",
  rare: "text-gold",
  epic: "text-ember",
  legendary: "text-bone",
};

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="flex flex-col items-center py-14 text-center sm:py-20">
        <img
          src="/emblem.svg"
          alt="ARCHIVUM seal"
          width={220}
          height={220}
          className="mb-8 opacity-95 drop-shadow-[0_0_28px_rgba(201,162,39,0.25)]"
        />
        <p className="font-mono text-[10px] tracking-[0.3em] text-gold">
          EVERY MYTHOLOGY KEPT THE SAME FILES
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] text-bone sm:text-7xl">
          The creatures were never fiction.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ash sm:text-base">
          13 beings from world mythologies — each backed by a real scientific record.
          Contain them in sealed packs. Trade duplicates. Climb the Archive Rank.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/packs"
            className="border border-gold bg-gold/10 px-8 py-4 font-mono text-xs tracking-dossier text-gold transition-colors hover:bg-gold hover:text-void"
          >
            BREACH FIRST PACK
          </Link>
          <Link
            href="/album"
            className="border border-bone/25 px-8 py-4 font-mono text-xs tracking-dossier text-bone transition-colors hover:bg-bone hover:text-void"
          >
            VIEW THE ARCHIVE
          </Link>
        </div>
        <p className="mt-4 font-mono text-[9px] tracking-dossier text-ash/70">
          NO EMAIL. NO PASSWORD. YOUR NOSTR KEY IS YOUR IDENTITY.
        </p>
      </section>

      {/* ODDS — transparent by design */}
      <section className="border-y border-bone/10 py-12">
        <p className="mb-6 text-center font-mono text-[10px] tracking-dossier text-ash">
          CONTAINMENT ODDS — PUBLISHED, AUDITABLE, FIXED
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {RARITY_ORDER.map((r) => (
            <div key={r} className="border border-bone/10 bg-coal p-4 text-center">
              <p className={`font-mono text-[9px] tracking-dossier ${RARITY_COLOR_TEXT[r]}`}>
                {RARITY_LABEL[r]}
              </p>
              <p className={`mt-2 font-display text-2xl ${RARITY_COLOR_TEXT[r]}`}>
                {(ODDS[r] * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-[9px] tracking-dossier text-ash/70">
          EPIC+ GUARANTEED EVERY 15 PACKS — LEGENDARY EVERY 60. PITY IS PUBLIC.
        </p>
      </section>

      {/* CREATURES */}
      <section className="py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl text-bone">The sealed files</h2>
          <Link
            href="/album"
            className="font-mono text-[10px] tracking-dossier text-gold hover:underline"
          >
            FULL ALBUM →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {CREATURES.slice(0, 10).map((c) => (
            <div
              key={c.id}
              className="redacted flex min-h-36 flex-col justify-between rounded-sm border border-bone/10 p-4"
            >
              <p className="font-mono text-[9px] tracking-dossier text-ash">FILE {c.id}</p>
              <div className="space-y-1.5 py-2">
                <div className="h-2 w-3/4 rounded bg-void/80" />
                <div className="h-2 w-1/2 rounded bg-void/80" />
              </div>
              <p className="font-mono text-[8px] tracking-dossier text-ash/60">
                {c.culture} — SEALED
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-bone/10 py-14">
        <h2 className="mb-10 text-center font-display text-3xl text-bone">
          How containment works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Breach packs",
              d: "Every pack holds 5 files. Odds are published. Pity is public. Nothing is hidden in the Archive.",
            },
            {
              n: "02",
              t: "Contain creatures",
              d: "Contain all 13 creatures to complete the Archive. Duplicates are tradeable when the exchange opens.",
            },
            {
              n: "03",
              t: "Climb the Rank",
              d: "Archive Rank tracks every cataloguer. Recruits through your link mark you as their origin. Rewards in the $ARCH era.",
            },
          ].map((s) => (
            <div key={s.n} className="border border-bone/10 bg-coal p-6">
              <p className="font-mono text-[10px] tracking-dossier text-gold">{s.n}</p>
              <h3 className="mt-3 font-display text-2xl text-bone">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ash">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
