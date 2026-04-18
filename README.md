# Doddy

Personal blog by Brainee — notes on building Smelloff, design, and whatever I'm figuring out.

Static site generator: Node.js → HTML. Zero runtime frameworks.

## Local Development

```bash
npm install
npm run dev     # builds and serves on localhost:3000
```

Or just build:

```bash
npm run build   # outputs to dist/
```

## Adding a Post

Create a new `.md` file in `content/posts/`:

```yaml
---
title: "Post Title"
dek: "One-line hook"
date: 2026-05-01
topic: "Building Smelloff"   # or Design / Marketing / Notes
tags: ["founder", "d2c"]
slug: "post-slug"
description: "SEO meta description, 150-160 chars."
hero: "/images/hero.jpg"     # optional
draft: false
---

Your content here...
```

Run `npm run build` — the post appears automatically.

## Project Structure

```
content/posts/    — markdown source files
templates/        — HTML templates (base shell + page layouts)
static/           — CSS, JS, fonts, images (copied as-is to dist/)
build.js          — build script
dist/             — generated output (deploy this)
```

## Deploy to Vercel

```bash
vercel --prod
```

Vercel is configured via `vercel.json` to run `node build.js` and serve `dist/`.

## Topics

- **Building Smelloff** — `/topics/building-smelloff/`
- **Design** — `/topics/design/`
- **Marketing** — `/topics/marketing/`
- **Notes** — `/topics/notes/`

To add a new topic, just use it in a post's frontmatter. The build creates the topic page automatically.
