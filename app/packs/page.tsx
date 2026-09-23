import type { Metadata } from "next";
import PacksClient from "./PacksClient";

export const metadata: Metadata = {
  title: "Packs — ARCHIVUM",
  description:
    "Abra packs do álbum ARCHIVUM. Queime $ARCHIVUM no ledger e revele criaturas — o hash da transação decide. Colecione as 10. Troque as repetidas.",
  openGraph: {
    title: "Packs — ARCHIVUM",
    description: "Queime $ARCHIVUM, revele criaturas, complete o álbum.",
    url: "https://archivum-album.vercel.app/packs",
  },
};

export default function PacksPage() {
  return <PacksClient />;
}
