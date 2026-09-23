// Reveal determinístico ancorado no ledger Stellar.
// A semente é o hash da transação de queima — qualquer um pode reexecutar e conferir.

import { Card } from "./data";
import { openPack, DrawContext, PackResult } from "./pack";

export function txSeed(txHash: string): () => number {
  // mulberry32 sobre SHA-256(txHash + domínio ARCHIVUM)
  let h = 0x811c9dc5;
  const s = `archivum-pack:${txHash}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function openPackFromTx(txHash: string, ctx: DrawContext): PackResult {
  return openPack(ctx, txSeed(txHash));
}

// Reexecuta o histórico de queimas em ordem, reconstruindo pity.
// O ledger inteiro de um colecionador é derivável por qualquer pessoa.
export function replayPacks(txHashes: string[]): { ctx: DrawContext; pulls: Card[][] } {
  const ctx: DrawContext = { pityEpic: 0, pityLegendary: 0 };
  const pulls: Card[][] = [];
  for (const tx of txHashes) {
    const r = openPackFromTx(tx, { ...ctx });
    pulls.push(r.cards);
    if (r.newLegendary) {
      ctx.pityLegendary = 0;
      ctx.pityEpic = 0;
    } else if (r.newEpicPlus) {
      ctx.pityEpic = 0;
      ctx.pityLegendary++;
    } else {
      ctx.pityEpic++;
      ctx.pityLegendary++;
    }
  }
  return { ctx, pulls };
}
