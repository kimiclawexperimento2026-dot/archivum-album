"use client";

import { useEffect, useState } from "react";
import { useArchive } from "@/lib/store";
import { hexToNpub } from "@/lib/bech32";

declare global {
  interface Window {
    nostr?: { getPublicKey(): Promise<string> };
  }
}

export default function NostrConnect() {
  const { npub, setNpub } = useArchive();
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(typeof window !== "undefined" && !!window.nostr);
  }, []);

  const connect = async () => {
    if (!window.nostr) return;
    try {
      const hex = await window.nostr.getPublicKey();
      setNpub(hexToNpub(hex));
    } catch {
      // user rejected — stay silent, the Archive is patient
    }
  };

  const disconnect = () => setNpub("");

  if (npub) {
    return (
      <div className="flex items-center gap-3 border border-sage/40 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-sage" />
        <span className="font-mono text-[10px] tracking-dossier text-sage">
          IDENTITY: {npub.slice(0, 12)}…{npub.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="font-mono text-[10px] tracking-dossier text-ash hover:text-redact"
        >
          RELEASE
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {available ? (
        <button
          onClick={connect}
          className="border border-gold/60 px-4 py-2 font-mono text-[10px] tracking-dossier text-gold transition-colors hover:bg-gold hover:text-void"
        >
          IDENTIFY (NOSTR KEY)
        </button>
      ) : (
        <p className="font-mono text-[10px] tracking-dossier text-ash">
          NO NOSTR EXTENSION — BROWSING AS LOCAL IDENTITY
        </p>
      )}
    </div>
  );
}
