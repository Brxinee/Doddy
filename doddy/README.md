# Doddy.in — self-hosted blog

Static HTML/CSS/JS blog inspired by SeoFlex, reskinned in Smelloff aesthetic (matte black + acid green + Barlow Condensed).

## Structure

```
doddy/
├── index.html                    # Homepage / blog index
├── about.html                    # About page
├── styles.css                    # All styles (shared)
├── script.js                     # Nav + share logic (shared)
├── sitemap.xml                   # For Google Search Console
├── robots.txt                    # For crawlers
├── vercel.json                   # Clean URLs config
└── posts/
    ├── _template.html            # Copy this for new posts
    ├── zero-to-one-d2c-india.html
    ├── why-brands-fail-on-instagram.html
    └── building-a-landing-page-that-converts.html
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import the repo
3. Framework preset: **Other** (no build command, no output dir)
4. Deploy
5. In Vercel → Settings → Domains → add `doddy.in` and `www.doddy.in`
6. At your domain registrar, add the DNS records Vercel shows you

## Fix the Google Search Console "item not available" error

The error you were hitting before was because you were submitting Blogger-style URLs that didn't actually exist as real pages. This site has **real pages at real URLs**, so indexing will work.

Steps:
1. Go to search.google.com/search-console
2. Add property → `https://doddy.in`
3. Verify (easiest: DNS TXT record method in Vercel)
4. In Search Console → Sitemaps → submit: `https://doddy.in/sitemap.xml`
5. Wait 1–3 days for Google to crawl

Every post already has:
- Unique `<title>` and meta description
- Canonical URL
- Open Graph tags
- JSON-LD Article schema
- Real H1, semantic HTML

These are the things Google actually needs to index blog content.

## Add a new post

1. Copy `posts/_template.html` → rename to `posts/your-post-slug.html`
2. Find every `[EDIT]` comment and replace
3. Write your post inside `<div class="article-content">` using `<h2>`, `<h3>`, `<p>`, `<ul>`, `<blockquote>`, and `<div class="callout">`
4. Add the new URL to `sitemap.xml`
5. Add a card to `index.html` inside `.post-grid` (copy an existing `<article class="post-card">`)
6. Push to GitHub → Vercel auto-deploys

## Customize

- Colors: top of `styles.css` under `:root`
- Fonts: Google Fonts link in each HTML `<head>`
- Logo text: change `DODDY` in the header + footer across all files (5 places)

## Notes

- Newsletter form currently just fakes success. Wire it to Formspree, ConvertKit, or your own endpoint in `script.js`.
- Post thumbnails use CSS typography blocks, not images. If you want real images, replace the `.post-thumb` `<div>` with `<img>` inside each post card.
- All external links (Smelloff, Instagram, email) point at your existing channels — change if needed.
