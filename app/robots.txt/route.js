// robots.txt
export function GET() {
  return new Response(
    `# Allow all crawlers for public pages
User-agent: *
Allow: /
Allow: /signup
Allow: /login
Allow: /upgrade
Allow: /success
Allow: /terms
Allow: /privacy
Allow: /update-password
Allow: /error

# Disallow private/dashboard pages
Disallow: /dashboard/*
Disallow: /book/*
Disallow: /auth/confirm

# Sitemap
Sitemap: https://schedulee.app/sitemap.xml
`,
    {
      headers: {
        "content-type": "text/plain",
      },
    }
  );
}
