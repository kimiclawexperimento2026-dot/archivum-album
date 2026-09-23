"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ArchiveState {
  owned: Record<string, number>; // cardId -> count
  packsOpened: number;
  points: number;
  pityEpic: number;
  pityLegendary: number;
  npub: string | null;
  refBy: string | null;
  localId: string;
  referralOpens: number; // packs opened via my referral link (tracked client-side now)
  openedCards: string[]; // last pack, for reveal UI

  addCard: (id: string, isCreature: boolean, isNew: boolean) => void;
  recordPack: (newEpicPlus: boolean, newLegendary: boolean) => void;
  setNpub: (npub: string) => void;
  setRefBy: (ref: string) => void;
  setLastPack: (ids: string[]) => void;
  addReferralOpen: () => void;
}

const LOCAL_KEY = "archivum-archive-v1";

function genId(): string {
  return "cat-" + Math.random().toString(36).slice(2, 10);
}

export const useArchive = create<ArchiveState>()(
  persist(
    (set, get) => ({
      owned: {},
      packsOpened: 0,
      points: 0,
      pityEpic: 0,
      pityLegendary: 0,
      npub: null,
      refBy: null,
      localId: genId(),
      referralOpens: 0,
      openedCards: [],

      addCard: (id, isCreature, isNew) => {
        const s = get();
        const owned = { ...s.owned, [id]: (s.owned[id] ?? 0) + 1 };
        let points = s.points + (isCreature ? 20 : 5);
        if (isNew && isCreature) points += 80; // first containment bonus
        if (isNew && !isCreature) points += 5;
        set({ owned, points });
      },

      recordPack: (newEpicPlus, newLegendary) => {
        const s = get();
        set({
          packsOpened: s.packsOpened + 1,
          points: s.points + 10,
          pityEpic: newEpicPlus ? 0 : s.pityEpic + 1,
          pityLegendary: newLegendary ? 0 : s.pityLegendary + 1,
        });
      },

      setNpub: (npub) => set({ npub }),
      setRefBy: (ref) => {
        if (!get().refBy && ref !== get().localId) set({ refBy: ref });
      },
      setLastPack: (ids) => set({ openedCards: ids }),
      addReferralOpen: () => set({ referralOpens: get().referralOpens + 1 }),
    }),
    { name: LOCAL_KEY }
  )
);
