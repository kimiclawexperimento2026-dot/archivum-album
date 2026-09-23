"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  isConnected as freighterIsConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import {
  ASSET_CODE,
  HORIZON,
  ISSUER,
  NETWORK,
  NETWORK_PASSPHRASE,
  PACK_PRICE,
  cardArt,
} from "../../lib/archivum";
import { Card, ALL_CARDS, RARITY_COLOR, RARITY_LABEL } from "../../lib/data";
import { DrawContext } from "../../lib/pack";
import { openPackFromTx, replayPacks } from "../../lib/reveal";

type Phase = "idle" | "opening" | "reveal";

export default function PacksClient() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [ctx, setCtx] = useState<DrawContext>({ pityEpic: 0, pityLegendary: 0 });
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState("");
  const [revealed, setRevealed] = useState<Card[]>([]);
  const [owned, setOwned] = useState<Map<string, number>>(new Map());
  const [flipIdx, setFlipIdx] = useState(0);

  const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  // O histórico de queimas VIVE no ledger: pagamentos de ARCH ao emissor = packs.
  // Reexecutando em ordem, qualquer um reconstrói a coleção — sem nosso servidor.
  const loadUser = useCallback(async (addr: string) => {
    try {
      const r = await fetch(`${HORIZON}/accounts/${addr}`);
      if (!r.ok) {
        setBalance(0);
        setOwned(new Map());
        return;
      }
      const j = await r.json();
      let arch = 0;
      for (const b of j.balances ?? []) {
        if (b.asset_code === ASSET_CODE && b.asset_issuer === ISSUER)
          arch = parseFloat(b.balance);
      }
      setBalance(arch);

      const pr = await fetch(`${HORIZON}/accounts/${addr}/payments?limit=200&order=asc`);
      const pj = await pr.json();
      const burns: string[] = [];
      const seen = new Set<string>();
      for (const p of pj._embedded?.records ?? []) {
        if (
          p.type === "payment" &&
          p.asset_code === ASSET_CODE &&
          p.asset_issuer === ISSUER &&
          p.to === ISSUER &&
          !seen.has(p.transaction_hash)
        ) {
          seen.add(p.transaction_hash);
          burns.push(p.transaction_hash);
        }
      }
      const { ctx, pulls } = replayPacks(burns);
      setCtx(ctx);
      const counts = new Map<string, number>();
      pulls.flat().forEach((c) => counts.set(c.id, (counts.get(c.id) ?? 0) + 1));
      setOwned(counts);
    } catch {
      /* horizon indisponível — mantém estado */
    }
  }, []);

  useEffect(() => {
    freighterIsConnected().then((r) => {
      if (!r.isConnected) return;
      requestAccess()
        .then((a) => {
          setWallet(a.address);
          loadUser(a.address);
        })
        .catch(() => {});
    });
  }, [loadUser]);

  const connect = async () => {
    try {
      const r = await requestAccess();
      setWallet(r.address);
      await loadUser(r.address);
      setStatus("Carteira conectada. O Arquivo reconhece você.");
    } catch {
      setStatus("Acesso negado. A porta permanece trancada.");
    }
  };

  const openPack = async () => {
    if (!wallet) return;
    setPhase("opening");
    setStatus("Assinando a queima…");
    try {
      const StellarSdk = await import("stellar-sdk");
      const server = new StellarSdk.Horizon.Server(HORIZON);
      const account = await server.loadAccount(wallet);
      const asset = new StellarSdk.Asset(ASSET_CODE, ISSUER);
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          StellarSdk.Operation.payment({ destination: ISSUER, asset, amount: PACK_PRICE })
        )
        .setTimeout(180)
        .build();
      const signed = await signTransaction(tx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
      setStatus("Selando no ledger…");
      const result = await server.submitTransaction(
        StellarSdk.TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK_PASSPHRASE)
      );
      const pulls = openPackFromTx(result.hash, ctx);
      setRevealed(pulls.cards);
      setPhase("reveal");
      setFlipIdx(0);
      pulls.cards.forEach((_, i) => setTimeout(() => setFlipIdx(i + 1), 420 * (i + 1)));
      setStatus("");
      loadUser(wallet);
    } catch (e: any) {
      setPhase("idle");
      setStatus(
        e?.message?.toLowerCase?.().includes("cancel")
          ? "Transação recusada. O Arquivo aguarda."
          : "Falha na abertura. Tente novamente."
      );
    }
  };

  const mythicPull = revealed.some((c) => c.rarity === "epic" || c.rarity === "legendary");
  const shareText = revealed.length
    ? `I opened an ARCHIVUM pack and pulled ${revealed
        .map((c) => `${c.name} [${c.rarity.toUpperCase()}]`)
        .join(" · ")}. ${mythicPull ? "The Archive favors me. " : ""}https://archivum-album.vercel.app/packs`
    : "";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#8a8578]">
        {NETWORK === "testnet" ? "Testnet — protótipo" : "Live — rede principal"}
      </p>
      <h1 className="mt-3 font-serif text-5xl text-[#e8e4da]">Abrir um Pack</h1>
      <p className="mt-4 max-w-xl text-[#a8a396]">
        Cada pack custa <span className="text-[#c9a227]">{PACK_PRICE} ${ASSET_CODE}</span>,
        queimados para sempre. Cinco cartas saem do selo — e o hash da sua transação é a
        semente do sorteio. Publicamos as odds. O ledger é o árbitro. Ninguém pode manipular.
      </p>

      {!wallet ? (
        <button
          onClick={connect}
          className="mt-10 border border-[#c9a227] px-8 py-4 font-mono text-sm uppercase tracking-widest text-[#c9a227] transition-colors hover:bg-[#c9a227] hover:text-black"
        >
          Conectar Freighter
        </button>
      ) : (
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <div className="font-mono text-xs text-[#8a8578]">
            <div>{short(wallet)}</div>
            <div className="mt-1 text-[#e8e4da]">
              {balance?.toLocaleString() ?? "…"} ${ASSET_CODE}
            </div>
            <div className="mt-1 text-[#4a4a4c]">
              pity e{ctx.pityEpic}/15 · L{ctx.pityLegendary}/60
            </div>
          </div>
          <button
            onClick={openPack}
            disabled={phase === "opening" || (balance ?? 0) < parseInt(PACK_PRICE)}
            className="border border-[#c9a227] bg-[#c9a227] px-8 py-4 font-mono text-sm uppercase tracking-widest text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            {phase === "opening" ? "Selando…" : "Queimar e revelar"}
          </button>
          {(balance ?? 0) < parseInt(PACK_PRICE) && (
            <a
              href="/presale"
              className="font-mono text-xs uppercase tracking-widest text-[#8a8578] underline"
            >
              Saldo insuficiente — pré-venda
            </a>
          )}
        </div>
      )}
      {status && <p className="mt-6 font-mono text-xs text-[#8a8578]">{status}</p>}

      <AnimatePresence>
        {phase === "reveal" && revealed.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#c9a227]">
              O ledger revelou
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {revealed.map((c, i) => (
                <motion.div
                  key={c.id + i}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={flipIdx > i ? { rotateY: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={c.rarity === "legendary" ? "shadow-[0_0_38px_#c9a22744]" : c.rarity === "epic" ? "shadow-[0_0_30px_#8a202055]" : ""}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cardArt(c.id)}
                    alt={c.name}
                    className="w-full border border-[#2a2a2c]"
                  />
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest">
                    <span className={RARITY_COLOR[c.rarity].split(" ")[0]}>{RARITY_LABEL[c.rarity]}</span>
                  </div>
                  <div className="font-serif text-lg leading-tight text-[#e8e4da]">{c.name}</div>
                  {c.epithet && (
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[#8a8578]">
                      {c.epithet}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setPhase("idle");
                  setRevealed([]);
                }}
                className="border border-[#2a2a2c] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[#a8a396] hover:border-[#c9a227] hover:text-[#c9a227]"
              >
                Abrir outro
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="border border-[#2a2a2c] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[#a8a396] hover:border-[#c9a227] hover:text-[#c9a227]"
              >
                Compartilhar no X
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {wallet && (
        <div className="mt-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#8a8578]">
            Coleção — {owned.size}/{ALL_CARDS.length} arquivos ·{" "}
            {Array.from(owned.values()).reduce((s, n) => s + n, 0)} cartas
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {ALL_CARDS.map((c) => {
              const has = owned.has(c.id);
              return (
                <div
                  key={c.id}
                  className={`border p-2 ${has ? "border-[#c9a22766]" : "border-[#1a1a1c] opacity-50"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={has ? cardArt(c.id) : "/emblem.svg"}
                    alt={has ? c.name : "Classified"}
                    className={has ? "w-full" : "w-full opacity-15 grayscale"}
                  />
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-widest">
                    {has ? (
                      <span className={RARITY_COLOR[c.rarity].split(" ")[0]}>
                        {c.id} ×{owned.get(c.id)} · {RARITY_LABEL[c.rarity]}
                      </span>
                    ) : (
                      <span className="text-[#4a4a4c]">{c.id} · CLASSIFIED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
