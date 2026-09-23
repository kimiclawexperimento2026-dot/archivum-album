import Link from "next/link";
import data from "@/lib/creatures-data.json";

type Creature = {
  id: string;
  series: string;
  title: string;
  meta: string;
  image: string;
  quote: string;
};

export const metadata = {
  title: "Creature Files — ARCHIVUM",
  description:
    "Classified mythology files: every creature is a real phenomenon recorded by ancient civilizations. ABZUTH, APEP, KRAKEN and more — with the science behind the myth.",
};

export default function CreatureIndex() {
  const creatures = data as Creature[];
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-center font-mono text-[10px] tracking-dossier text-gold">
        DECLASSIFIED — GENESIS SERIES
      </p>
      <h1 className="mt-3 text-center font-display text-4xl text-bone sm:text-6xl">
        Creature Files
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-ash">
        Nobody invented monsters. They recorded phenomena they couldn&apos;t explain
        yet. Each file pairs the myth with its scientific basis — sources, dates,
        and the exact natural event behind the story.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {creatures.map((c) => (
          <Link
            key={c.id}
            href={`/creatures/${c.id}`}
            className="group border border-bone/10 bg-void/60 transition-colors hover:border-gold/60"
          >
            <div className="relative overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute left-3 top-3 bg-void/85 px-2 py-1 font-mono text-[9px] tracking-dossier text-gold">
                FILE {c.id}
              </span>
            </div>
            <div className="p-5">
              <h2 className="font-display text-2xl leading-tight text-bone group-hover:text-gold">
                {c.title}
              </h2>
              <p className="mt-2 font-mono text-[10px] tracking-wider text-ash">
                {c.meta}
              </p>
              <p className="mt-3 line-clamp-2 text-sm italic leading-relaxed text-ash/80">
                “{c.quote}”
              </p>
              <p className="mt-4 font-mono text-[10px] tracking-dossier text-gold/80">
                OPEN FILE →
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 border-t border-bone/10 pt-8 text-center">
        <p className="font-mono text-[10px] tracking-dossier text-ash">
          NEW FILES ARE DECLASSIFIED AS THE ARCHIVE GROWS
        </p>
        <Link
          href="/packs"
          className="mt-4 inline-block border border-gold bg-gold/10 px-8 py-4 font-mono text-xs tracking-dossier text-gold transition-colors hover:bg-gold hover:text-void"
        >
          CONTAIN THE CREATURES
        </Link>
      </div>
    </div>
  );
}
