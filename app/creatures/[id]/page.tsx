import Link from "next/link";
import { notFound } from "next/navigation";
import data from "@/lib/creatures-data.json";

type Creature = {
  id: string;
  series: string;
  title: string;
  meta: string;
  image: string;
  quote: string;
  content: string;
};

const BASE = "https://archivum-album.vercel.app";

export function generateStaticParams() {
  return (data as Creature[]).map((c) => ({ id: c.id }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { id: string } }) {
  const c = (data as Creature[]).find((x) => x.id === params.id);
  if (!c) return {};
  const name = c.title.split("—")[1]?.trim() ?? c.title;
  return {
    title: `${c.title} — ARCHIVUM Creature File`,
    description: `${c.quote} Origin: ${c.meta}. The science behind the ${name} myth — what ancient civilizations actually recorded.`,
    openGraph: {
      title: c.title,
      description: c.quote,
      images: [`${BASE}${c.image}`],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.quote,
      images: [`${BASE}${c.image}`],
    },
  };
}

export default function CreatureFile({ params }: { params: { id: string } }) {
  const c = (data as Creature[]).find((x) => x.id === params.id);
  if (!c) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.quote,
    image: `${BASE}${c.image}`,
    author: { "@type": "Organization", name: "ARCHIVUM" },
    publisher: { "@type": "Organization", name: "ARCHIVUM" },
    articleSection: "Mythology × Science",
    keywords: [c.title, "mythology", "cryptozoology", "ARCHIVUM", "creature file"],
  };

  const [name] = c.title.split("—");
  const prev = (data as Creature[]).find((x) => parseInt(x.id) === parseInt(c.id) - 1);
  const next = (data as Creature[]).find((x) => parseInt(x.id) === parseInt(c.id) + 1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-8 flex items-center justify-between font-mono text-[10px] tracking-dossier text-ash">
        <Link href="/creatures" className="text-gold hover:text-bone">
          ← ALL FILES
        </Link>
        <span className="text-ash/60">FILE {c.id}/010</span>
      </nav>

      <p className="font-mono text-[10px] tracking-dossier text-gold">
        {c.series.toUpperCase()}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-bone sm:text-6xl">
        {name.trim()}
      </h1>
      <p className="mt-3 font-mono text-[11px] tracking-wider text-ash">{c.meta}</p>

      <figure className="relative mt-8 overflow-hidden border border-bone/10">
        <img
          src={c.image}
          alt={c.title}
          className="w-full object-cover"
          loading="eager"
        />
        <figcaption className="border-t border-bone/10 bg-void px-4 py-2 font-mono text-[9px] tracking-wider text-ash/70">
          ARTISTIC RENDERING — RECOVERED FROM THE ARCHIVE
        </figcaption>
      </figure>

      <blockquote className="mt-10 border-l-2 border-gold pl-5 font-display text-2xl italic leading-relaxed text-bone/90">
        “{c.quote}”
      </blockquote>

      <div
        className="creature-content mt-10"
        dangerouslySetInnerHTML={{ __html: c.content }}
      />

      <div className="mt-12 border-y border-bone/10 py-6">
        <p className="font-mono text-[9px] tracking-dossier text-ash">
          THE ARCHIVE REMEMBERS — SHARE THIS FILE
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={`https://njump.me/${BASE.replace("https://", "")}/creatures/${c.id}`}
            className="border border-bone/20 px-4 py-2 font-mono text-[10px] tracking-wider text-bone hover:bg-bone hover:text-void"
          >
            NOSTR
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `${c.quote}\n\n${c.title} — ${BASE}/creatures/${c.id}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-bone/20 px-4 py-2 font-mono text-[10px] tracking-wider text-bone hover:bg-bone hover:text-void"
          >
            X
          </a>
        </div>
      </div>

      <nav className="mt-8 flex items-center justify-between font-mono text-[10px] tracking-dossier">
        {prev ? (
          <Link href={`/creatures/${prev.id}`} className="text-ash hover:text-gold">
            ← {prev.title.split("—")[1]?.trim() ?? prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/creatures/${next.id}`} className="text-ash hover:text-gold">
            {next.title.split("—")[1]?.trim() ?? next.title} →
          </Link>
        ) : (
          <Link href="/packs" className="text-gold hover:text-bone">
            BREACH A PACK →
          </Link>
        )}
      </nav>
    </div>
  );
}
