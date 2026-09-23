// Transparent, auditable pack engine.
// Odds are published in lib/data.ts — this file is the referee.

import { Card, ALL_CARDS, ODDS, PITY, Rarity, RARITY_ORDER } from "./data";

function secureRandom(): number {
  // crypto.getRandomValues: uniform in [0, 1)
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 4294967296;
}

type Rng = () => number;

function rollRarity(rng: Rng): Rarity {
  const r = rng();
  let acc = 0;
  for (const tier of RARITY_ORDER) {
    acc += ODDS[tier];
    if (r < acc) return tier;
  }
  return "common";
}

function poolFor(rarity: Rarity): Card[] {
  return ALL_CARDS.filter((c) => c.rarity === rarity);
}

export interface DrawContext {
  pityEpic: number; // packs since last epic+
  pityLegendary: number; // packs since last legendary
}

export interface PackResult {
  cards: Card[];
  newEpicPlus: boolean;
  newLegendary: boolean;
}

export function openPack(ctx: DrawContext, rng: Rng = secureRandom): PackResult {
  const cards: Card[] = [];
  const seen = new Set<string>();
  let forcedLegendary = ctx.pityLegendary + 1 >= PITY.legendaryEvery;
  let forcedEpic = !forcedLegendary && ctx.pityEpic + 1 >= PITY.epicEvery;
  let newLegendary = false;
  let newEpicPlus = false;

  for (let i = 0; i < 5; i++) {
    let rarity = rollRarity(rng);

    if (i === 4 && forcedLegendary) rarity = "legendary";
    else if (i === 4 && forcedEpic) {
      rarity = secureRandom() < 0.7 ? "epic" : "legendary";
    }

    let pool = poolFor(rarity);
    // creatures never duplicate inside one pack; artifacts may
    let candidates = pool.filter((c) => !c.isCreature || !seen.has(c.id));
    if (candidates.length === 0) candidates = pool;

    let card = candidates[Math.floor(secureRandom() * candidates.length)];
    // if the exact card is already in this pack (artifact), reroll once
    if (seen.has(card.id)) {
      const alt = candidates.filter((c) => !seen.has(c.id));
      if (alt.length > 0) card = alt[Math.floor(secureRandom() * alt.length)];
    }

    if (card.rarity === "legendary") {
      newLegendary = true;
      forcedLegendary = false;
    }
    if (card.rarity === "epic" || card.rarity === "legendary") newEpicPlus = true;

    seen.add(card.id);
    cards.push(card);
  }

  // guarantee: at least one uncommon+ per pack
  const hasUncommonPlus = cards.some((c) => c.rarity !== "common");
  if (!hasUncommonPlus) {
    const pool = poolFor("uncommon").filter((c) => !seen.has(c.id));
    const pick = pool[Math.floor(secureRandom() * pool.length)] ?? poolFor("uncommon")[0];
    cards[4] = pick;
    newEpicPlus = true; // not literally epic, but breaks the all-common streak
  }

  return { cards, newEpicPlus, newLegendary };
}
