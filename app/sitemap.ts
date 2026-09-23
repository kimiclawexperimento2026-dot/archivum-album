import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://archivum-album.vercel.app";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/packs`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/album`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];
}
