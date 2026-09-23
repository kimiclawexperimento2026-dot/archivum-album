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
  NETWORK,
  NETWORK_PASSPHRASE,
} from "../../lib/archivum";

const PRESALE_ADDR = DISTRIBUTION;
const RATE = 500; // ARCH per XLM — fixed, published, immutable
const MIN_XLM = 1;
const MAX_XLM = 50;
const PRESALE_CAP = 25_000_000; // hard cap on total presale issuance

type Stats = { issued: number; alive: boolean };

export default function PresaleClient() {
  const [stats, setStats] = useState<Stats>({ issued: 0, alive: false });
  const [amount, setAmount] = useState("10");
  const [wallet, setWallet] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [soldOut, setSoldOut] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const r = await fetch(`${HORIZON}/accounts/${PRESALE_ADDR}`);
      if (!r.ok) {
        setStats({ issued: 0, alive: false });
        return;
      }
      const j = await r.json();
      let arch = 0;
      for (const b of j.balances ?? []) {
        if (b.asset_code === ASSET_CODE) arch = parseFloat(b.balance); // issuer holds negative = issued so far
      }
      const issued = arch < 0 ? -arch : 0;
      setStats({ issued, alive: true });
      setSoldOut(issued >= PRESALE_CAP);
    } catch {
      /* horizon unavailable — keep last known values */
    }
  }, []);

  useEffect(() => {
    loadStats();
    const t = setInterval(loadStats, 15000);
    return () => clearInterval(t);
  }, [loadStats]);

  useEffect(() => {
    freighterIsConnected().then((r) => {
      if (r.isConnected) setStatus("Freighter detected. Connect to buy.");
    });
  }, []);

  const connect = async () => {
    try {
      const r = await requestAccess();
      if (r && r.address) {
        setWallet(r.address);
        setStatus("Wallet connected.");
      }
    } catch {
      setStatus("Freighter not found — install it at freighter.app and set the network to PUBLIC.");
    }
  };

  const buy = async () => {
    const xlm = parseFloat(amount);
    if (isNaN(xlm) || xlm < MIN_XLM || xlm > MAX_XLM) {
      setStatus(`Invalid amount. Min ${MIN_XLM} XLM, max ${MAX_XLM} XLM per purchase.`);
      return;
    }
    if (!wallet) {
      setStatus("Connect your wallet first.");
      return;
    }
    setBusy(true);
    setStatus("Building the transaction...");
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
      setStatus("Sign in the Freighter extension...");
      const signed = await signTransaction(tx.toXDR(), {
        networkPassphrase: NETWORK_PASSPHRASE,
      });
      if (!signed || signed.error) throw new Error(signed?.error || "signature declined");
      setStatus("Broadcasting to the blockchain...");
      const res = await fetch(`${HORIZON}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tx=${encodeURIComponent(signed.signedTxXdr)}`,
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail || "submission failed");
      setStatus(
        `✓ Sent! ${xlm} XLM received — ${(xlm * RATE).toLocaleString("en-US")} $ARCH are minted and delivered to your wallet automatically within seconds.`
      );
      setTimeout(loadStats, 12000);
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const expected = (parseFloat(amount) || 0) * RATE;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-[10px] uppercase tracking-[0.35em] text-gold/80">
        Live on Stellar mainnet
      </p>
      <h1
        className="mt-3 text-4xl sm:text-5xl text-bone"
        style={{ fontFamily: "var(--font-display), serif" }}
      >
        $ARCH Presale
      </h1>
      <p className="mt-4 text-sm text-bone/60 leading-relaxed">
        No signup. No card. No middleman. You send XLM to the contract address below and the
        watcher delivers your tokens <em className="text-bone/80">automatically</em> — usually
        within 30 seconds. Tokens are minted at purchase, so supply can never exceed the cap.
      </p>

      {/* GUIDED TOUR — what this screen is and how to use it */}
      <details className="dossier mt-8 p-5 group">
        <summary className="cursor-pointer text-[10px] tracking-[0.3em] text-gold select-none">
          ▸ NEW HERE? HOW THE PRESALE WORKS — 3 STEPS
        </summary>
        <ol className="mt-4 space-y-3 text-xs leading-relaxed text-bone/70 list-none">
          <li>
            <span className="text-gold font-mono">STEP 1 — WALLET.</span> Install the Freighter
            browser extension (freighter.app) and switch it to the{" "}
            <span className="text-bone">PUBLIC network</span>. This is your account: no email, no
            password, your key is your identity.
          </li>
          <li>
            <span className="text-gold font-mono">STEP 2 — TRUSTLINE.</span> Add the{" "}
            <span className="text-bone">$ARCH</span> asset to Freighter so it can receive tokens:
            Freighter → Add Asset → code <span className="text-bone">ARCHIVUM</span>, issuer{" "}
            <span className="font-mono text-bone/80 break-all">{PRESALE_ADDR.slice(0, 24)}…</span>
          </li>
          <li>
            <span className="text-gold font-mono">STEP 3 — SEND.</span> Enter an amount (1–50 XLM),
            connect, and sign. The fixed rate is{" "}
            <span className="text-bone">1 XLM = 500 $ARCH</span>. Delivery is automatic — you will
            see the tokens in Freighter within seconds.
          </li>
        </ol>
        <p className="mt-4 border-t border-bone/10 pt-3 text-[10px] leading-relaxed text-bone/40">
          WHAT IS $ARCH? The utility token of the ARCHIVUM bestiary. It buys sealed creature packs
          (100 $ARCH per pack, burned forever), and anchors future Archive mechanics. Fully
          auditable on the Stellar ledger.
        </p>
      </details>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="dossier p-4">
          <div className="text-[9px] tracking-[0.25em] text-bone/40">ISSUED SO FAR</div>
          <div className="mt-2 font-mono text-2xl text-gold">
            {stats.issued.toLocaleString("en-US")}
          </div>
          <div className="text-[10px] font-mono text-bone/40">
            of {PRESALE_CAP.toLocaleString("en-US")} $ARCH cap
          </div>
        </div>
        <div className="dossier p-4">
          <div className="text-[9px] tracking-[0.25em] text-bone/40">FIXED RATE</div>
          <div className="mt-2 font-mono text-2xl text-bone">
            1 <span className="text-bone/40">XLM</span> = {RATE}{" "}
            <span className="text-bone/40">$ARCH</span>
          </div>
          <div className="text-[10px] font-mono text-bone/40">
            min {MIN_XLM} · max {MAX_XLM} XLM per purchase
          </div>
        </div>
      </div>

      <div className="dossier mt-6 p-5">
        <div className="text-[9px] tracking-[0.25em] text-bone/40">
          PRESALE CONTRACT ADDRESS
        </div>
        <div className="mt-2 break-all font-mono text-xs text-bone/80">{PRESALE_ADDR}</div>
        <button
          onClick={() => navigator.clipboard.writeText(PRESALE_ADDR)}
          className="mt-3 border border-gold/40 px-3 py-1 text-[10px] tracking-[0.2em] text-gold hover:bg-gold hover:text-void transition-colors"
        >
          COPY ADDRESS
        </button>
      </div>

      <div className="dossier mt-6 p-5">
        {wallet ? (
          <p className="text-[11px] font-mono text-bone/60">
            WALLET: <span className="text-gold">{wallet.slice(0, 12)}…{wallet.slice(-6)}</span>
          </p>
        ) : (
          <p className="text-[11px] font-mono text-bone/40">
            Wallet not connected — Freighter (Public network) required.
          </p>
        )}

        <div className="mt-4 flex items-end gap-3">
          <label className="block flex-1">
            <span className="text-[9px] tracking-[0.25em] text-bone/40">AMOUNT (XLM)</span>
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
              CONNECT WALLET
            </button>
          ) : (
            <button
              onClick={buy}
              disabled={busy || soldOut}
              className="flex-1 bg-gold px-4 py-3 text-xs tracking-[0.25em] text-void hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {soldOut ? "PRESALE CAP REACHED" : busy ? "PROCESSING..." : "BUY $ARCH"}
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
        <span className="text-bone/60">Before you send:</span> verify this address on the public
        ledger —{" "}
        <a
          href={`https://stellar.expert/explorer/${NETWORK}/account/${PRESALE_ADDR}`}
          target="_blank"
          rel="noreferrer"
          className="text-gold/80 underline underline-offset-4"
        >
          inspect it on StellarExpert
        </a>
        . Deliveries are fully automatic. Never trust any other address claiming to sell $ARCH.
      </div>

      <div className="mt-8 flex gap-6 text-[10px] tracking-[0.25em] text-bone/40">
        <Link href="/" className="hover:text-bone">← BACK</Link>
        <Link href="/album" className="hover:text-bone">ALBUM</Link>
        <Link href="/packs" className="hover:text-bone">PACKS</Link>
      </div>
    </main>
  );
}
