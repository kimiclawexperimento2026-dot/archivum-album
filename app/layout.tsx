import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ReferralCapture from "@/components/ReferralBox";
import Link from "next/link";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://archivum-album.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "ARCHIVUM — The Creature Archive",
    template: "%s | ARCHIVUM",
  },
  description:
    "13 creatures from world mythologies, each backed by real science. Breach containment packs, contain the files, climb the Archive Rank. No email. No password. Your key is your identity.",
  keywords: [
    "ARCHIVUM",
    "digital sticker album",
    "creatures",
    "mythology",
    "science",
    "collectible",
    "nostr",
    "web3",
    "gamification",
  ],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "ARCHIVUM",
    title: "ARCHIVUM — The Creature Archive",
    description:
      "Every mythology on Earth kept the same files. We catalogued them. Breach the packs.",
    images: [{ url: "/emblem.svg", width: 1200, height: 630, alt: "ARCHIVUM seal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARCHIVUM — The Creature Archive",
    description:
      "13 creatures from world mythologies, each backed by real science. Breach the packs.",
    images: ["/emblem.svg"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="grain min-h-screen bg-void font-mono text-bone antialiased">
        <ReferralCapture />
        <header className="sticky top-0 z-40 border-b border-bone/10 bg-void/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/60 font-mono text-[9px] tracking-widest text-gold">
                A
              </span>
              <span className="font-display text-xl tracking-wide text-bone">ARCHIVUM</span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/packs"
                className="font-mono text-[10px] tracking-dossier text-ash transition-colors hover:text-gold"
              >
                PACKS
              </Link>
              <Link
                href="/album"
                className="font-mono text-[10px] tracking-dossier text-ash transition-colors hover:text-gold"
              >
                ALBUM
              </Link>
              <Link
                href="/presale"
                className="font-mono text-[10px] tracking-dossier text-gold transition-colors hover:text-bone"
              >
                PRESALE
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
        <footer className="border-t border-bone/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
            <p className="font-mono text-[10px] tracking-dossier text-ash">
              ARCHIVUM © 2026 — THE ARCHIVE REMEMBERS
            </p>
            <div className="flex items-center gap-5 font-mono text-[10px] tracking-dossier text-ash">
              <a
                href="https://nostr.com/npub18eqze4e5xn20pql4e0ul3gxm25shmpg32cvzarzyl8nnguvwpeeszrycjx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                NOSTR ↗
              </a>
              <span>archivum@archivum-album.vercel.app</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
