import type { Metadata } from "next";
import PresaleClient from "./PresaleClient";

export const metadata: Metadata = {
  title: "$ARCH Presale — ARCHIVUM",
  description:
    "Compre ARCHIVUM ($ARCH) direto da blockchain: envie XLM, receba tokens automaticamente. Sem cadastro, sem Stripe, sem intermediários. TESTNET demo.",
  alternates: { canonical: "https://archivum-album.vercel.app/presale" },
  openGraph: {
    title: "$ARCH Presale — ARCHIVUM",
    description:
      "Envie XLM → receba $ARCH automaticamente. Contrato-espécie: nenhum humano toca nos fundos.",
    url: "https://archivum-album.vercel.app/presale",
    siteName: "ARCHIVUM",
    type: "website",
    images: ["/emblem.svg"],
  },
};

export default function PresalePage() {
  return <PresaleClient />;
}
