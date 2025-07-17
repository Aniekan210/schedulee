// sitemap.xml
export function GET() {
  const publicPages = [
    { url: "/", lastModified: new Date(), priority: 1.0 },
    { url: "/signup", lastModified: new Date(), priority: 0.9 },
    { url: "/login", lastModified: new Date(), priority: 0.8 },
    { url: "/upgrade", lastModified: new Date(), priority: 0.7 },
    { url: "/cancel", lastModified: new Date(), priority: 0.4 },
    { url: "/return", lastModified: new Date(), priority: 0.4 },
    { url: "/success", lastModified: new Date(), priority: 0.5 },
    { url: "/error", lastModified: new Date(), priority: 0.5 },
    { url: "/update-password", lastModified: new Date(), priority: 0.4 },
    { url: "/terms", lastModified: new Date(), priority: 0.6 },
    { url: "/privacy", lastModified: new Date(), priority: 0.6 },
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${publicPages
    .map(
      (page) => `
    <url>
      <loc>https://schedulee.app${page.url}</loc>
      <lastmod>${page.lastModified.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `
    )
    .join("")}
</urlset>`,
    {
      headers: {
        "content-type": "application/xml",
      },
    }
  );
}
