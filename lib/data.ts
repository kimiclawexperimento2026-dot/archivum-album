// ARCHIVUM creature catalog — the sealed files.
// Sources: ARCHIVUM field notes (Nostr) + site dossiers.

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITY_ORDER: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "ARTIFACT",
  uncommon: "UNCOMMON FILE",
  rare: "RARE FILE",
  epic: "EPIC FILE",
  legendary: "LEGENDARY FILE",
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common: "text-ash border-ash/40",
  uncommon: "text-sage border-sage/50",
  rare: "text-gold border-gold/60",
  epic: "text-ember border-ember/60",
  legendary: "text-bone border-gold shadow-goldglow",
};

export const ODDS: Record<Rarity, number> = {
  common: 0.7,
  uncommon: 0.175,
  rare: 0.08,
  epic: 0.035,
  legendary: 0.01,
};

export const PITY = { epicEvery: 15, legendaryEvery: 60 };

export interface Card {
  id: string; // "001" for creatures, "A1" for artifacts
  name: string;
  epithet?: string;
  culture?: string;
  rarity: Rarity;
  isCreature: boolean;
  status?: string;
  blurb: string;
  href?: string;
}

export const CREATURES: Card[] = [
  { id: "001", name: "ABZUTH", epithet: "The Devourer of Stars", culture: "SUMER", rarity: "legendary", isCreature: true, status: "AWAKE", blurb: "A 2390 BCE omens tablet. Impact winter recorded in clay. The cold that eats the sky.", href: "https://archivum-rho.vercel.app/blog/creatures.html#001" },
  { id: "002", name: "FIMBUL", epithet: "The Winter Out of Season", culture: "NORSE", rarity: "legendary", isCreature: true, status: "APPROACHING", blurb: "536 CE. A dust veil, 18 months of failed sun, empires starving. The wolf's first step.", href: "https://archivum-rho.vercel.app/blog/creatures.html#002" },
  { id: "003", name: "APEP", epithet: "The Devourer of Order", culture: "EGYPT", rarity: "epic", isCreature: true, status: "ACTIVE", blurb: "3,000 years of daily exorcism against the serpent that swallows the sun. An asteroid named Apophis passes in 2029.", href: "https://archivum-rho.vercel.app/blog/creatures.html#003" },
  { id: "007", name: "AZDAHA", epithet: "The Mountain That Walks", culture: "PERSIA", rarity: "epic", isCreature: true, status: "STIRRING", blurb: "The dragon under Damavand is not under the mountain. It IS the mountain.", href: "https://archivum-rho.vercel.app/blog/creatures.html#007" },
  { id: "010", name: "AMATSU-MIKABOSHI", epithet: "The August Star of Heaven", culture: "JAPAN", rarity: "epic", isCreature: true, status: "FIXED", blurb: "The pole star that does not move — until precession moves it. Even the fixed point moves.", href: "https://archivum-rho.vercel.app/blog/creatures.html#010" },
  { id: "004", name: "FENGHUANG", epithet: "The Meridian Bird", culture: "CHINA", rarity: "rare", isCreature: true, status: "PERCHED", blurb: "When the phoenix dimmed, dynasties fell. Solar minimums, failed harvests, 1,100 years of correlation.", href: "https://archivum-rho.vercel.app/blog/creatures.html#004" },
  { id: "005", name: "QETZALCOATL", epithet: "The Plumed Serpent", culture: "MAYA", rarity: "rare", isCreature: true, status: "CYCLING", blurb: "Venus calculated to 2 hours over 500 years with naked eyes and limestone towers.", href: "https://archivum-rho.vercel.app/blog/creatures.html#005" },
  { id: "011", name: "GASHADOKURO", epithet: "The Starving Giant", culture: "JAPAN", rarity: "rare", isCreature: true, status: "ASSEMBLING", blurb: "Bones that surface after the quakes. A skull two meters wide, where the soul should be.", href: "https://archivum-rho.vercel.app/blog/creatures.html#011" },
  { id: "012", name: "CAICAI-VILU", epithet: "The Serpent That Is the Sea", culture: "MAPUCHE", rarity: "rare", isCreature: true, status: "AWAKE", blurb: "The 1960 Valdivia quake — magnitude 9.5 — drowned coasts in minutes. The Mapuche already knew the serpent.", href: "https://archivum-rho.vercel.app/blog/creatures.html#012" },
  { id: "006", name: "NEFILIM", epithet: "The Builders Before the Flood", culture: "LEVANT", rarity: "uncommon", isCreature: true, status: "BURIED", blurb: "1,500-ton stones placed with precision some cranes would struggle to match. The Archive catalogs that they moved.", href: "https://archivum-rho.vercel.app/blog/creatures.html#006" },
  { id: "008", name: "JORMUNGANDR", epithet: "The World Serpent", culture: "NORSE", rarity: "uncommon", isCreature: true, status: "CIRCULATING", blurb: "A single connected current that wraps the planet like a living system. Described 1,000 years before satellites.", href: "https://archivum-rho.vercel.app/blog/creatures.html#008" },
  { id: "009", name: "TANNIN", epithet: "The Deep's Firstborn", culture: "CANAAN", rarity: "uncommon", isCreature: true, status: "UNMAPPED", blurb: "95% of the ocean unmapped. Flood myths cluster on coasts drowned 10,000 years ago.", href: "https://archivum-rho.vercel.app/blog/creatures.html#009" },
  { id: "013", name: "MISHIPE SHU", epithet: "The Lynx of the Deep Water", culture: "OJIBWE", rarity: "uncommon", isCreature: true, status: "LEDGER OPEN", blurb: "It keeps the lake's ledger. 10,000 shipwrecks in the Great Lakes. Payment due.", href: "https://archivum-rho.vercel.app/blog/creatures.html#013" },
];

export const ARTIFACTS: Card[] = [
  { id: "A1", name: "SEALING WAX", rarity: "common", isCreature: false, blurb: "The Eighth Seal. Do not break it twice." },
  { id: "A2", name: "REDACTION STAMP", rarity: "common", isCreature: false, blurb: "Some words are deleted to protect the reader." },
  { id: "A3", name: "CATALOGUER'S INK", rarity: "common", isCreature: false, blurb: "Cataloguer 07's bottle. It does not run dry. We checked." },
  { id: "A4", name: "FLOOD TABLET", rarity: "common", isCreature: false, blurb: "Fragment of a warning, 4,000 years old. The water came anyway." },
  { id: "A5", name: "INDEX CARD 44", rarity: "common", isCreature: false, blurb: "Blank. It was not blank yesterday." },
  { id: "A6", name: "COPPER OFFERING", rarity: "common", isCreature: false, blurb: "For the lynx. Always pay the lynx." },
  { id: "A7", name: "NIGHT GLASS", rarity: "common", isCreature: false, blurb: "Obsidian lens. Shows the sky as it was, not as it is." },
  { id: "A8", name: "SOUNDING WEIGHT", rarity: "common", isCreature: false, blurb: "Lead line, 200 fathoms. It has measured things we did not ask about." },
];

export const ALL_CARDS: Card[] = [...CREATURES, ...ARTIFACTS];

export const CARD_MAP: Record<string, Card> = Object.fromEntries(
  ALL_CARDS.map((c) => [c.id, c])
);

export const TOTAL_CREATURES = CREATURES.length; // 13

export const RANKS = [
  { min: 0, name: "INTERN" },
  { min: 100, name: "JUNIOR CATALOGUER" },
  { min: 300, name: "CATALOGUER" },
  { min: 700, name: "SENIOR CATALOGUER" },
  { min: 1400, name: "ARCHIVIST" },
  { min: 2600, name: "KEEPER OF THE ARCHIVE" },
  { min: 5000, name: "CATALOGUER PRIME" },
];

export function rankFor(points: number) {
  let current = RANKS[0];
  let next: (typeof RANKS)[number] | null = null;
  for (const r of RANKS) {
    if (points >= r.min) current = r;
    else {
      next = r;
      break;
    }
  }
  return { current, next };
}
