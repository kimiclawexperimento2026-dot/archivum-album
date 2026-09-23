"use client";

import { useEffect } from "react";
import { useArchive } from "@/lib/store";

export default function ReferralCapture() {
  const { refBy, setRefBy, addReferralOpen } = useArchive();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setRefBy(ref);
      addReferralOpen();
      // clean the URL — the Archive leaves no traces
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [setRefBy, addReferralOpen]);

  return null;
}

export function ReferralBox() {
  const { npub, localId, referralOpens } = useArchive();
  const code = npub ?? localId;
  const link =
    typeof window !== "undefined" ? `${window.location.origin}/?ref=${encodeURIComponent(code)}` : "";

  return (
    <div className="border border-bone/15 bg-coal p-5">
      <p className="font-mono text-[10px] tracking-dossier text-ash">RECRUITMENT PROTOCOL</p>
      <p className="mt-2 text-sm text-bone">
        Every recruit who breaches their first pack through your link marks you as their
        recruiter. The Archive keeps ledgers.{" "}
        <span className="text-ash">Rewards unlock with the $ARCH era.</span>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={link}
          className="w-full bg-void px-3 py-2 font-mono text-[11px] text-bone outline-none ring-1 ring-bone/15"
          onFocus={(e) => e.target.select()}
        />
        <button
          onClick={() => navigator.clipboard?.writeText(link)}
          className="whitespace-nowrap border border-gold/60 px-4 py-2 font-mono text-[10px] tracking-dossier text-gold hover:bg-gold hover:text-void"
        >
          COPY LINK
        </button>
      </div>
      <p className="mt-3 font-mono text-[9px] tracking-dossier text-ash">
        RECRUITS ON RECORD: {referralOpens}
      </p>
    </div>
  );
}
