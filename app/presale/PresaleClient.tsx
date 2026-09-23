"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  isConnected as freighterIsConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

import {
  ASSET_CODE,
  DISTRIBUTION,
  HORIZON,
  ISSUER,
  NETWORK,
  NETWORK_PASSPHRASE,
} from "../../lib/archivum";

const PRESALE_ADDR = DISTRIBUTION;
const RATE = 500; // ARCH por XLM (mainnet — ao vivo)
const MIN_XLM = 1;
const MAX_XLM = 50;

type Stats = { arch: number; xlm: number };

export default function PresaleClient() {
  const [stats, setStats] = useState<Stats>({ arch: 0, xlm: 0 });
  const [amount, setAmount] = useState("10");
  const [wallet, setWallet] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [soldOut, setSoldOut] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const r = await fetch(`${HORIZON}/accounts/${PRESALE_ADDR}`);
      const j = await r.json();
      let arch = 0;
      let xlm = 0;
      for (const b of j.balances ?? []) {
        if (b.asset_code === ASSET_CODE) arch = parseFloat(b.balance);
        if (b.asset_type === "native") xlm = parseFloat(b.balance) - 19990; // aprox. reserva
      }
      setStats({ arch, xlm: Math.max(0, xlm) });
      setSoldOut(arch < RATE * MIN_XLM);
    } catch {
      /* horizon indisponível — mantém último valor */
    }
  }, []);

  useEffect(() => {
    loadStats();
    const t = setInterval(loadStats, 15000);
    return () => clearInterval(t);
  }, [loadStats]);

  useEffect(() => {
    freighterIsConnected().then((r) => {
      if (r.isConnected) setStatus("Freighter detectada. Conecte para comprar.");
    });
  }, []);

  const connect = async () => {
    try {
      const r = await requestAccess();
      if (r && r.address) {
        setWallet(r.address);
        setStatus("Carteira conectada.");
      }
    } catch {
      setStatus("Freighter não encontrado — instale em freighter.app e ative a rede TESTNET.");
    }
  };

  const buy = async () => {
    const xlm = parseFloat(amount);
    if (isNaN(xlm) || xlm < MIN_XLM || xlm > MAX_XLM) {
      setStatus(`Valor inválido. Mín ${MIN_XLM} XLM, máx ${MAX_XLM} XLM.`);
      return;
    }
    if (!wallet) {
      setStatus("Conecte a carteira primeiro.");
      return;
    }
    setBusy(true);
    setStatus("Construindo transação...");
    try {
      const StellarSdk = await import("stellar-sdk");
      const server = new StellarSdk.Horizon.Server(HORIZON);
      const account = await server.loadAccount(wallet);
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: PRESALE_ADDR,
            asset: StellarSdk.Asset.native(),
            amount: xlm.toFixed(7),
          })
        )
        .addMemo(StellarSdk.Memo.text("ARCHIVUM PRESALE"))
        .setTimeout(30)
        .build();
      setStatus("Assine na extensão Freighter...");
      const signed = await signTransaction(tx.toXDR(), {
        networkPassphrase: NETWORK_PASSPHRASE,
      });
      if (!signed || signed.error) throw new Error(signed?.error || "assinatura recusada");
      setStatus("Enviando para a blockchain...");
      const res = await fetch(`${HORIZON}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tx=${encodeURIComponent(signed.signedTxXdr)}`,
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail || "falha no envio");
      setStatus(`✓ Enviado! ${xlm} XLM a caminho — ${(xlm * RATE).toLocaleString("en-US")} $ARCH chegam automaticamente em segundos.`);
      setTimeout(loadStats, 12000);
    } catch (e: unknown) {
      setStatus(`Erro: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const expected = (parseFloat(amount) || 0) * RATE;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-[10px] uppercase tracking-[0.35em] text-gold/80">
        Fase 2 — Demonstração TESTNET
      </p>
      <h1
        className="mt-3 text-4xl sm:text-5xl text-bone"
        style={{ fontFamily: "var(--font-display), serif" }}
      >
        Pré-venda <span className="text-gold">$ARCH</span>
      </h1>
      <p className="mt-4 text-sm text-bone/60 leading-relaxed">
        Sem cadastro. Sem Stripe. Sem intermediário. Você envia XLM para o endereço-contrato e o
        watcher entrega seus tokens <em className="text-bone/80">automaticamente</em> — em até 15
        segundos. Ninguém toca nos fundos no caminho.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="dossier p-4">
          <div className="text-[9px] tracking-[0.25em] text-bone/40">INVENTÁRIO DISPONÍVEL</div>
          <div className="mt-2 font-mono text-2xl text-gold">
            {stats.arch.toLocaleString("en-US")}
          </div>
          <div className="text-[10px] font-mono text-bone/40">$ARCH restantes</div>
        </div>
        <div className="dossier p-4">
          <div className="text-[9px] tracking-[0.25em] text-bone/40">TAXA FIXA</div>
          <div className="mt-2 font-mono text-2xl text-bone">
            1 <span className="text-bone/40">XLM</span> = {RATE}{" "}
            <span className="text-bone/40">$ARCH</span>
          </div>
          <div className="text-[10px] font-mono text-bone/40">mín {MIN_XLM} · máx {MAX_XLM} XLM</div>
        </div>
      </div>

      <div className="dossier mt-6 p-5">
        <div className="text-[9px] tracking-[0.25em] text-bone/40">ENDEREÇO-CONTRATO DA PRÉ-VENDA</div>
        <div className="mt-2 break-all font-mono text-xs text-bone/80">{PRESALE_ADDR}</div>
        <button
          onClick={() => navigator.clipboard.writeText(PRESALE_ADDR)}
          className="mt-3 border border-gold/40 px-3 py-1 text-[10px] tracking-[0.2em] text-gold hover:bg-gold hover:text-void transition-colors"
        >
          COPIAR ENDEREÇO
        </button>
      </div>

      <div className="dossier mt-6 p-5">
        {wallet ? (
          <p className="text-[11px] font-mono text-bone/60">
            CARTEIRA: <span className="text-gold">{wallet.slice(0, 12)}…{wallet.slice(-6)}</span>
          </p>
        ) : (
          <p className="text-[11px] font-mono text-bone/40">
            Carteira não conectada — Freighter (TESTNET) necessária.
          </p>
        )}

        <div className="mt-4 flex items-end gap-3">
          <label className="block flex-1">
            <span className="text-[9px] tracking-[0.25em] text-bone/40">QUANTIDADE (XLM)</span>
            <input
              type="number"
              min={MIN_XLM}
              max={MAX_XLM}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full border border-bone/20 bg-transparent px-3 py-2 font-mono text-lg text-bone outline-none focus:border-gold"
            />
          </label>
          <div className="pb-2 font-mono text-sm text-gold">
            ≈ {expected.toLocaleString("en-US")} $ARCH
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          {!wallet ? (
            <button
              onClick={connect}
              className="flex-1 border border-gold px-4 py-3 text-xs tracking-[0.25em] text-gold hover:bg-gold hover:text-void transition-colors"
            >
              CONECTAR CARTEIRA
            </button>
          ) : (
            <button
              onClick={buy}
              disabled={busy || soldOut}
              className="flex-1 bg-gold px-4 py-3 text-xs tracking-[0.25em] text-void hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {soldOut ? "INVENTÁRIO ESGOTADO" : busy ? "PROCESSANDO..." : "COMPRAR $ARCH"}
            </button>
          )}
        </div>

        {status && (
          <p className="mt-4 border-l-2 border-gold/60 pl-3 text-xs font-mono text-bone/70 leading-relaxed">
            {status}
          </p>
        )}
      </div>

      <div className="mt-6 border border-bone/10 p-4 text-[11px] leading-relaxed text-bone/40">
        <span className="text-bone/60">⚠ TESTNET —</span> tokens sem valor real. Este é o protótipo
        do contrato-espécie de pré-venda: na mainnet, o mesmo fluxo roda com USDC reais, taxa e
        endereço auditáveis, e inventário travado por contrato. Explorador:{" "}
        <a
          href={`https://stellar.expert/explorer/${NETWORK}/account/${PRESALE_ADDR}`}
          target="_blank"
          rel="noreferrer"
          className="text-gold/80 underline underline-offset-4"
        >
          ver endereço no StellarExpert
        </a>
        .
      </div>

      <div className="mt-8 flex gap-6 text-[10px] tracking-[0.25em] text-bone/40">
        <Link href="/" className="hover:text-bone">← VOLTAR</Link>
        <Link href="/album" className="hover:text-bone">ÁLBUM</Link>
        <Link href="/packs" className="hover:text-bone">PACKS</Link>
      </div>
    </main>
  );
}
