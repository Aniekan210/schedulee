export function GET() {
    return new Response(
        `# Allow all crawlers for public pages
User-agent: *
Allow: /
Allow: /signup
Allow: /login
Allow: /upgrade
Allow: /success

# Disallow private/dashboard pages
Disallow: /dashboard/*
Disallow: /book/*

# Sitemap
Sitemap: https://schedulee.app/sitemap.xml
`,
        {
            headers: {
                'content-type': 'text/plain',
            },
        }
    );
}