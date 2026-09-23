import data from "@/lib/creatures-data.json";

const BASE = "https://archivum-album.vercel.app";

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function GET() {
  const items = (data as { id: string; title: string; quote: string; content: string }[])
    .map((c) => `    <item>
      <title>${c.title}</title>
      <link>${BASE}/creatures/${c.id}</link>
      <guid>${BASE}/creatures/${c.id}</guid>
      <description>${c.quote}</description>
      <content:encoded><![CDATA[${c.content}]]></content:encoded>
    </item>`)
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>ARCHIVUM — Creature Files</title>
    <link>${BASE}/creatures</link>
    <description>Mythology × science. Every creature is a real phenomenon recorded by ancient civilizations.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
