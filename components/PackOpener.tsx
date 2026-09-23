"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { openPack } from "@/lib/pack";
import { useArchive } from "@/lib/store";
import { CARD_MAP, RARITY_COLOR, RARITY_LABEL } from "@/lib/data";
import Link from "next/link";

type Phase = "sealed" | "breaching" | "reveal";

export default function PackOpener() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [revealed, setRevealed] = useState(0);
  const {
    owned,
    pityEpic,
    pityLegendary,
    addCard,
    recordPack,
    setLastPack,
  } = useArchive();

  const breach = () => {
    if (phase !== "sealed") return;
    setPhase("breaching");
    setTimeout(() => {
      const result = openPack({ pityEpic, pityLegendary });
      result.cards.forEach((c) => {
        addCard(c.id, c.isCreature, !(c.id in owned));
      });
      recordPack(result.newEpicPlus, result.newLegendary);
      setLastPack(result.cards.map((c) => c.id));
      setPhase("reveal");
      setRevealed(0);
      let i = 0;
      const iv = setInterval(() => {
        i += 1;
        setRevealed(i);
        if (i >= 5) clearInterval(iv);
      }, 420);
    }, 1600);
  };

  const lastPack = useArchive((s) => s.openedCards);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {phase === "sealed" && (
          <motion.button
            key="sealed"
            onClick={breach}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group relative mx-auto block h-72 w-56 cursor-pointer select-none sm:h-80 sm:w-64"
            aria-label="Breach containment pack"
          >
            <div className="absolute inset-0 rounded-sm border border-bone/15 bg-coal shadow-card" />
            <div className="absolute inset-2 rounded-sm border border-gold/25" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/70 shadow-goldglow">
                <span className="font-mono text-[10px] tracking-dossier text-gold">A·R·C·H</span>
              </div>
              <p className="font-mono text-[10px] tracking-dossier text-ash">CONTAINMENT PACK</p>
              <p className="mt-1 font-display text-xl text-bone">File Batch 001</p>
            </div>
            <div className="absolute inset-x-0 bottom-4 text-center font-mono text-[10px] tracking-dossier text-ash transition-colors group-hover:text-gold">
              BREACH CONTAINMENT →
            </div>
          </motion.button>
        )}

        {phase === "breaching" && (
          <motion.div
            key="breaching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative mx-auto h-72 w-56 overflow-hidden rounded-sm border border-ember/50 bg-coal sm:h-80 sm:w-64"
          >
            <motion.div
              animate={{ x: [-3, 3, -2, 2, 0], rotate: [-1, 1, -0.5, 0.5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="absolute inset-2 rounded-sm border border-ember/40"
            />
            <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-ember/15 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="animate-flicker font-mono text-xs tracking-dossier text-ember">
                BREACH IN PROGRESS
              </p>
            </div>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
              {lastPack.map((id, i) => {
                const card = CARD_MAP[id];
                if (!card) return null;
                const isNew = i < revealed;
                return (
                  <motion.div
                    key={`${id}-${i}`}
                    initial={{ y: 40, opacity: 0, rotateY: 90 }}
                    animate={isNew ? { y: 0, opacity: 1, rotateY: 0 } : {}}
                    transition={{ type: "spring", stiffness: 120, damping: 16 }}
                    className={`relative rounded-sm border bg-coal p-4 shadow-card ${RARITY_COLOR[card.rarity]}`}
                  >
                    <p className="font-mono text-[9px] tracking-dossier opacity-70">
                      {card.isCreature ? `FILE ${card.id}` : `ITEM ${card.id}`}
                    </p>
                    <h3 className="mt-2 font-display text-lg leading-tight">{card.name}</h3>
                    {card.epithet && (
                      <p className="mt-1 text-[11px] italic opacity-80">{card.epithet}</p>
                    )}
                    <p className="mt-3 font-mono text-[9px] tracking-dossier opacity-70">
                      {RARITY_LABEL[card.rarity]}
                    </p>
                    {isNew && (
                      <motion.span
                        initial={{ scale: 2.2, opacity: 0, rotate: 8 }}
                        animate={{ scale: 1, opacity: 1, rotate: -6 }}
                        transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
                        className="stamp absolute -right-2 -top-2 text-gold"
                      >
                        Contained
                      </motion.span>
                    )}
                    {card.isCreature && card.rarity === "legendary" && (
                      <div className="pointer-events-none absolute inset-0 rounded-sm shadow-goldglow" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setPhase("sealed")}
                className="border border-gold/60 px-6 py-3 font-mono text-xs tracking-dossier text-gold transition-colors hover:bg-gold hover:text-void"
              >
                BREACH ANOTHER
              </button>
              <Link
                href="/album"
                className="border border-bone/25 px-6 py-3 font-mono text-xs tracking-dossier text-bone transition-colors hover:bg-bone hover:text-void"
              >
                FILE TO ALBUM →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
