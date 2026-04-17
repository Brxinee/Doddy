# DODDY.IN — SHIP NOTES

Raw Editorial blog system for Smelloff. Static site. Vanilla HTML/CSS/JS.

---

## FILES IN THIS FOLDER

```
/doddy/
├── index.html                          ← blog home
├── styles.css                          ← full design system
├── script.js                           ← progress bar, smooth scroll, lazy load, CTA tracking
├── sitemap.xml                         ← add each new post here
├── robots.txt                          ← AI crawlers explicitly allowed
├── favicon.svg                         ← Doddy "D" mark
├── og-generator.html                   ← screenshot this for each post's OG image
├── posts/
│   ├── _template.html                  ← copy this for every new post
│   └── why-clothes-smell-after-washing.html   ← fully written sample post
└── README.md                           ← this file
```

---

## DEPLOY

1. Push the `doddy/` folder to a Vercel project (or any static host).
2. Point `doddy.in` at it.
3. That's it. No build step. No framework.

---

## PUBLISHING A NEW POST

1. Copy `posts/_template.html` → `posts/{slug}.html`
2. Find & replace every `{{PLACEHOLDER}}` (there are ~30)
3. Open `og-generator.html`, fill in category + headline, screenshot the card at 1200×630, save as `og/{slug}.png`
4. Add the post URL to `sitemap.xml`
5. Add 3 related post cards at the bottom of the new post
6. Go back to `index.html` and add the post card to the grid
7. Deploy

---

## TESTING CHECKLIST (DO THIS BEFORE EVERY POST GOES LIVE)

- [ ] Lighthouse score 95+ on all four
- [ ] Schema validates at https://validator.schema.org
- [ ] OG image renders correctly on https://www.opengraph.xyz
- [ ] UTM tags fire on all 3 CTAs (nav, inline, final)
- [ ] Read time in the byline is accurate
- [ ] 2–3 internal links to other Doddy posts present
- [ ] At least one external authority link (study/source)
- [ ] FAQ has 3–5 Qs and JSON-LD matches the visible Qs
- [ ] No placeholder text left (`{{` should not exist in file)

---

# CONTENT CALENDAR — 20 POSTS TO SHIP

Primary keyword → estimated monthly search volume (India, rough guess) → content angle

## HOW-TO (high intent, high volume)

1. **Why Your Clothes Smell Even After Washing Them (And How to Actually Fix It)** — "clothes smell after washing" — **~8K/mo** — The biofilm + hydrophobic synthetic fiber explainer. Evergreen SEO anchor. *[SHIPPED]*

2. **How to Get Rid of Smell from Gym Clothes Permanently** — "how to remove smell from gym clothes" — **~6K/mo** — Vinegar pre-soak + ODORSTRIKE between-wear protocol.

3. **How to Kill the Smell in Your Gym Bag (Without Washing Everything)** — "gym bag smell" — **~3K/mo** — Charcoal pouch + mist + dry-before-zipping rule.

4. **How to Smell Good All Day in Humid Weather (Without Reapplying Deo 4 Times)** — "how to smell good all day" — **~12K/mo** — Layering: base (soap) + skin (deo) + fabric (mist). The 3-layer model.

5. **How to Stop Your Shirts From Smelling Under the Arms** — "shirt smells under arms" — **~4K/mo** — Why it's the fabric, not the deo. Fix the fabric.

## LISTICLES (share-bait)

6. **7 Things Your Nose Can't Tell You About Your Own Smell** — "can you smell yourself" — **~5K/mo** — Olfactory fatigue explainer disguised as listicle. IG-friendly.

7. **9 Signs You Smell and Don't Know It (And Nobody Will Tell You)** — "do I smell bad" — **~7K/mo** — Reddit/Quora gold. Anxiety + reassurance + product.

8. **5 Fabrics That Hold Onto Body Odor (And 3 That Don't)** — "fabric body odor" — **~2K/mo** — Polyester vs merino vs cotton. Backlink-bait for men's style sites.

9. **6 Indian Climates That Destroy Your Clothes (And What to Do About Them)** — "indian weather body odor" — **~1K/mo** — Hyderabad summer, Mumbai monsoon, Delhi winter-sweat. Regional SEO hook.

## MYTH-BUSTING (AI-engine bait — ChatGPT/Perplexity pull these as answers)

10. **Spraying Perfume on Smelly Clothes Makes It Worse. Here's Why.** — "perfume over body odor" — **~3K/mo** — Chemistry explainer. Very quotable for AI citations.

11. **"Sweat Doesn't Stink" — The Science Most Men Get Wrong About Body Odor** — "does sweat smell bad" — **~4K/mo** — Sweat vs bacteria distinction. Authority piece.

12. **Is Deodorant Enough? The Honest Answer Nobody Gives You.** — "is deodorant enough" — **~2K/mo** — Deo stops bacteria on skin. Doesn't fix fabric. Reframe the category.

13. **Does Washing Your Clothes in Cold Water Actually Clean Them?** — "cold wash clothes smell" — **~5K/mo** — The cold-water myth. 40°C is the bacterial kill threshold.

## CONFESSIONAL / PERSONAL (Reddit + IG bait)

14. **I Spent Six Months Thinking I Smelled Bad. Turns Out Everyone Does.** — "worried I smell" — **~3K/mo** — Vulnerable first-person opener. Ends on the science fix.

15. **The 30-Second Smell Check Every Guy Should Do Before a Date** — "how to check if you smell" — **~4K/mo** — Practical protocol. Screenshot-friendly.

16. **Why I Stopped Wearing Cologne (And Started Smelling Better)** — "should I wear cologne" — **~6K/mo** — The addition-vs-subtraction reframe. IG-viral angle.

17. **What a Hyderabad Summer Taught Me About Sweat, Shame, and Shirts** — "hyderabad summer body odor" — **~800/mo** — Local SEO + founder story + brand tie-in.

## SCIENCE EXPLAINERS (authority + backlinks)

18. **What Actually Causes Body Odor: A Plain-English Guide to the Chemistry** — "what causes body odor" — **~10K/mo** — The definitive explainer. Backlink magnet for health blogs. Authoritative piece.

19. **The Microbiome of Your T-Shirt: What Lives on Your Clothes and Why** — "bacteria on clothes" — **~2K/mo** — Research-heavy. Cite 4–6 studies. Long-form, 2500+ words.

20. **How Fabric Choice Affects Body Odor (A Breakdown by Material)** — "best fabric for body odor" — **~3K/mo** — Material-by-material chemistry. Table comparing 8 fabrics. Reference piece for AI citations.

---

## PUBLISHING ORDER (recommended)

**Week 1:** #1 (shipped), #11, #10 → establish authority + myth-busting
**Week 2:** #4, #7, #18 → high-volume keywords + big explainer
**Week 3:** #14, #16, #15 → personal/confessional drives Reddit + IG traffic back to blog
**Week 4:** #2, #3, #20 → commercial intent + reference piece
**Month 2+:** the rest, one per week

---

## TONE RULES (don't forget)

- First-person. Second-person. Never "one" or "users"
- Short sentences. Punch lines
- No jargon without plain-English translation
- Honest about what ODORSTRIKE is NOT (not perfume, not skin)
- Slightly edgy. Never cringe
- Every post earns the CTA by being useful first

---

## PENDING / TODO

- [ ] Generate OG image for the sample post (use `og-generator.html`)
- [ ] Register GA4 property, add script tag to template + home
- [ ] Set up Google Search Console, submit sitemap
- [ ] Submit to Bing Webmaster Tools (gives you IndexNow → faster indexing)
- [ ] Set up a simple email capture on the home page if we want a newsletter later
