# Doddy.in

Real grooming talk for Indian men. Built with Next.js 14 (App Router) + MDX + Tailwind + TypeScript.

## Local setup

```bash
npm install
cp .env.example .env.local
# fill in the values in .env.local
npm run dev
```

Visit http://localhost:3000

## Environment variables

Create `.env.local` (local) and add the same keys to Vercel project settings (production):

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your full site URL, e.g. `https://doddy.in` |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID, e.g. `G-XXXXXXX` |
| `NEXT_PUBLIC_SHEETS_URL` | Apps Script Web App URL for newsletter |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console verification token |

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/doddy.git
git push -u origin main
```

## Deploy to Vercel

1. Go to vercel.com → New Project → Import the GitHub repo.
2. Framework preset: Next.js (auto-detected).
3. Add the env vars from the table above under Environment Variables.
4. Click Deploy.
5. After deploy, go to Settings → Domains → add `doddy.in`. Vercel will give you DNS records to add at your registrar.

## Newsletter (Google Sheets)

The full setup steps are inside `google-apps-script.js`. Quick version:

1. Create a Google Sheet with headers `Timestamp | Name | Email | Phone | Source`.
2. Extensions → Apps Script → paste the contents of `google-apps-script.js`.
3. Deploy → New deployment → Web app → Anyone → Deploy.
4. Copy the URL into `NEXT_PUBLIC_SHEETS_URL` on Vercel.
5. Redeploy.

## Google Analytics 4

1. Create a GA4 property at analytics.google.com.
2. Copy the Measurement ID (`G-XXXXXXX`).
3. Add as `NEXT_PUBLIC_GA4_ID` in Vercel env vars.
4. Redeploy.

## Google Search Console

1. Go to search.google.com/search-console.
2. Add a property for `doddy.in`.
3. Pick "HTML tag" verification, copy the `content` value from the meta tag.
4. Paste it into `NEXT_PUBLIC_GSC_VERIFICATION` on Vercel.
5. Redeploy, then click Verify in Search Console.
6. Submit the sitemap: `https://doddy.in/sitemap.xml`.

## Adding a new blog post

Create a new file in `content/posts/your-slug.mdx`:

```mdx
---
title: "Your post title"
date: "2026-05-01"
category: "Sweat & Smell"
author: "Brainee"
excerpt: "One-line teaser for previews and SEO."
---

Your post content in MDX. Markdown works, plus React components if you want.

## Headings work

Lists, **bold**, [links](https://smelloff.in), > blockquotes, all of it.
```

Categories must match one of: Sweat & Smell, Grooming, Hygiene, Style, Confidence, Gym & Fitness.

Commit, push, Vercel auto-deploys. Done.

## File structure

```
app/                 Next.js App Router pages
  posts/[slug]/      Single post page
  category/[slug]/   Category pages
  sitemap.ts         Auto sitemap
  robots.ts          Auto robots
  rss.xml/route.ts   RSS feed
components/          Header, Footer, Newsletter, SmelloffCTA, PostCard
content/posts/       MDX blog posts (just add files here)
lib/posts.ts         Post loading + categories
google-apps-script.js  Newsletter backend code
```

## Notes

- Smelloff CTA at the bottom of every post rotates between 5 founder-style variants on each page load.
- Reading time is auto-calculated from the MDX content.
- Schema.org Article markup is auto-generated on every post.
- Open Graph + Twitter cards work via the Next.js metadata API.
- Dark mode toggle is in the header (top right) and persists via localStorage.

— Brainee
