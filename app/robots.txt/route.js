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
Allow: /cancel
Allow: /dashboard/*

# Disallow private pages
Disallow: /book/*
Disallow: /auth/confirm
Disallow: /return

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
