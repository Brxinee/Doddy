const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// ─── Config ──────────────────────────────────────────────────────────────────

const SITE = {
  url: 'https://doddy.in',
  name: 'Doddy',
  author: 'Brainee',
  twitter: '@smell0ff',
  description: 'Notes on building Smelloff, design, and whatever I\'m figuring out.',
  email: 'xbrainee@gmail.com',
};

const DIRS = {
  content: path.join(__dirname, 'content/posts'),
  templates: path.join(__dirname, 'templates'),
  static: path.join(__dirname, 'static'),
  dist: path.join(__dirname, 'dist'),
};

const TOPIC_DESCRIPTIONS = {
  'Building Smelloff': 'The real story of building a D2C fabric-care brand from scratch, solo, in Hyderabad.',
  'Design': 'Design decisions made in public — branding, typography, restraint, and the reasoning behind each call.',
  'Marketing': 'What actually works for a bootstrapped D2C brand in India. Experiments, failures, and surprises.',
  'Notes': 'Miscellaneous writing — thoughts that don\'t fit a category but needed to exist somewhere.',
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function readTemplate(name) {
  return fs.readFileSync(path.join(DIRS.templates, name), 'utf-8');
}

function render(template, vars) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{{${k}}}`).join(v != null ? String(v) : '');
  }
  // Clear unreplaced placeholders
  out = out.replace(/\{\{[^}]+\}\}/g, '');
  return out;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function readTime(text) {
  return Math.ceil(text.split(/\s+/).length / 200);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function isoDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function excerpt(text, len = 160) {
  const plain = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > len ? plain.slice(0, len).replace(/\s\S+$/, '') + '…' : plain;
}

// ─── Markdown Processing ─────────────────────────────────────────────────────

function processMarkdown(content) {
  const renderer = new marked.Renderer();

  renderer.heading = function(text, level) {
    const id = slugify(typeof text === 'string' ? text : text.text || '');
    const t = typeof text === 'string' ? text : text.text || '';
    return `<h${level} id="${id}">${t}</h${level}>\n`;
  };

  renderer.link = function(href, title, text) {
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://')) && !href.includes('doddy.in');
    const extra = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const t = title ? ` title="${title}"` : '';
    return `<a href="${href}"${t}${extra}>${text}</a>`;
  };

  marked.setOptions({ renderer, gfm: true });
  return marked.parse(content);
}

function generateTOC(html) {
  const headings = [];
  const re = /<h2[^>]+id="([^"]+)"[^>]*>(.*?)<\/h2>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    headings.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, '') });
  }
  if (headings.length < 3) return '';

  const items = headings.map(h => `<li><a class="toc-link" href="#${h.id}">${h.text}</a></li>`).join('\n');
  return `<nav class="toc" aria-label="Table of contents">
  <h4 class="toc-heading">Contents</h4>
  <ul class="toc-list">${items}</ul>
</nav>`;
}

// ─── Post Loading ─────────────────────────────────────────────────────────────

function loadPosts() {
  const files = fs.readdirSync(DIRS.content).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(DIRS.content, file), 'utf-8');
    const { data, content } = matter(raw);
    if (data.draft) continue;

    const html = processMarkdown(content);
    const toc = generateTOC(html);
    const slug = data.slug || slugify(data.title || file.replace('.md', ''));

    posts.push({
      title: data.title || '',
      dek: data.dek || '',
      date: data.date || new Date(),
      updated: data.updated || data.date || new Date(),
      topic: data.topic || 'Notes',
      topic_slug: slugify(data.topic || 'notes'),
      tags: data.tags || [],
      slug,
      description: data.description || '',
      hero: data.hero || '',
      content: html,
      toc,
      minutes: readTime(content),
      date_formatted: formatDate(data.date),
      date_iso: isoDate(data.date),
      canonical: `${SITE.url}/posts/${slug}/`,
      og_image: data.hero ? `${SITE.url}${data.hero}` : `${SITE.url}/images/og-default.png`,
    });
  }

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ─── HTML Builders ───────────────────────────────────────────────────────────

function buildPostRow(post) {
  return `<article class="post-row">
  <a href="/posts/${post.slug}/" class="post-row-link">
    <span class="post-row-date">${isoDate(post.date)}</span>
    <span class="topic-pill">${post.topic}</span>
    <span class="post-row-title">${post.title}</span>
    <span class="post-row-dek">${post.dek}</span>
  </a>
</article>`;
}

function buildFeaturedCard(post) {
  return `<article class="featured-post">
  <a href="/posts/${post.slug}/" class="featured-post-link">
    <div class="featured-topic"><span class="topic-pill">${post.topic}</span></div>
    <h2 class="featured-title">${post.title}</h2>
    <p class="featured-dek">${post.dek}</p>
    <div class="featured-meta">${post.date_formatted} &middot; ${post.minutes} min read</div>
  </a>
</article>`;
}

function buildTopicStrip(topics) {
  return topics.map(([name, count]) =>
    `<a href="/topics/${slugify(name)}/" class="topic-pill-lg">${name} <span class="topic-count">${count}</span></a>`
  ).join('');
}

function buildTagsHtml(tags) {
  if (!tags || !tags.length) return '';
  return `<div class="tags-row">${tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>`;
}

function buildRelatedPosts(post, posts) {
  const related = posts.filter(p => p.slug !== post.slug && p.topic === post.topic).slice(0, 3);
  if (!related.length) return '';
  const cards = related.map(p => `<article class="related-card">
  <a href="/posts/${p.slug}/" class="related-card-link">
    <span class="topic-pill">${p.topic}</span>
    <h3 class="related-title">${p.title}</h3>
    <p class="related-dek">${p.dek}</p>
    <span class="related-meta">${p.date_formatted} &middot; ${p.minutes} min read</span>
  </a>
</article>`).join('');
  return `<section class="related-posts"><h3 class="related-heading">Related</h3><div class="related-grid">${cards}</div></section>`;
}

function buildPrevNext(post, posts) {
  const idx = posts.findIndex(p => p.slug === post.slug);
  const prev = posts[idx + 1];
  const next = posts[idx - 1];
  const prevHtml = prev
    ? `<a href="/posts/${prev.slug}/" class="prev-next-link prev-link">← ${prev.title}</a>`
    : '';
  const nextHtml = next
    ? `<a href="/posts/${next.slug}/" class="prev-next-link next-link">${next.title} →</a>`
    : '';
  return { prevHtml, nextHtml };
}

function buildHeroImg(post) {
  if (!post.hero) return '';
  return `<img src="${post.hero}" alt="${post.title}" class="post-hero" loading="eager" width="1200" height="675">`;
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

function buildPostJsonLd(post) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date_iso,
    dateModified: isoDate(post.updated),
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.canonical },
    author: { '@type': 'Person', name: SITE.author, url: `${SITE.url}/about/` },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/images/logo.png` },
    },
    image: { '@type': 'ImageObject', url: post.og_image },
    url: post.canonical,
    keywords: (post.tags || []).join(', '),
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function buildBreadcrumbJsonLd(post) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Writing', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: post.topic, item: `${SITE.url}/topics/${post.topic_slug}/` },
      { '@type': 'ListItem', position: 3, name: post.title, item: post.canonical },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// ─── Page Builders ───────────────────────────────────────────────────────────

function buildPostPage(post, posts, baseTemplate, postTemplate) {
  const { prevHtml, nextHtml } = buildPrevNext(post, posts);

  const content = render(postTemplate, {
    title: post.title,
    dek: post.dek,
    topic: post.topic,
    topic_slug: post.topic_slug,
    date_formatted: post.date_formatted,
    date_iso: post.date_iso,
    minutes: post.minutes,
    canonical: post.canonical,
    hero_img: buildHeroImg(post),
    toc: post.toc,
    content: post.content,
    tags_html: buildTagsHtml(post.tags),
    prev_post: prevHtml,
    next_post: nextHtml,
    related_posts: buildRelatedPosts(post, posts),
  });

  return render(baseTemplate, {
    page_title: `${post.title} — ${SITE.name}`,
    meta_description: post.description,
    canonical: post.canonical,
    og_type: 'article',
    og_title: post.title,
    og_description: post.description,
    og_image: post.og_image,
    og_url: post.canonical,
    body_class: 'page-post',
    extra_head: buildPostJsonLd(post) + '\n' + buildBreadcrumbJsonLd(post),
    main_content: content,
    extra_scripts: '',
  });
}

function buildHomePage(posts, baseTemplate, homeTemplate) {
  const topics = Object.entries(
    posts.reduce((acc, p) => { acc[p.topic] = (acc[p.topic] || 0) + 1; return acc; }, {})
  );

  const featured = posts[0];
  const rest = posts.slice(1);

  const postsList = buildFeaturedCard(featured) + rest.map(buildPostRow).join('');
  const topicsStrip = buildTopicStrip(topics);

  const content = render(homeTemplate, { posts_list: postsList, topics_strip: topicsStrip });

  return render(baseTemplate, {
    page_title: `${SITE.name} — ${SITE.description}`,
    meta_description: SITE.description,
    canonical: `${SITE.url}/`,
    og_type: 'website',
    og_title: SITE.name,
    og_description: SITE.description,
    og_image: `${SITE.url}/images/og-default.png`,
    og_url: `${SITE.url}/`,
    body_class: 'page-home',
    extra_head: '',
    main_content: content,
    extra_scripts: '',
  });
}

function buildTopicPage(topic, topicPosts, baseTemplate, topicTemplate) {
  const topicSlug = slugify(topic);
  const description = TOPIC_DESCRIPTIONS[topic] || `All posts about ${topic}.`;
  const canonical = `${SITE.url}/topics/${topicSlug}/`;

  const postsList = topicPosts.map(buildPostRow).join('');

  const content = render(topicTemplate, {
    topic_name: topic,
    topic_slug: topicSlug,
    topic_description: description,
    post_count: topicPosts.length,
    posts_list: postsList,
  });

  return render(baseTemplate, {
    page_title: `${topic} — ${SITE.name}`,
    meta_description: description,
    canonical,
    og_type: 'website',
    og_title: `${topic} — ${SITE.name}`,
    og_description: description,
    og_image: `${SITE.url}/images/og-default.png`,
    og_url: canonical,
    body_class: 'page-topic',
    extra_head: '',
    main_content: content,
    extra_scripts: '',
  });
}

function buildArchivePage(posts, baseTemplate, archiveTemplate) {
  const byYear = {};
  for (const p of posts) {
    const yr = new Date(p.date).getFullYear();
    if (!byYear[yr]) byYear[yr] = [];
    byYear[yr].push(p);
  }

  const archiveHtml = Object.keys(byYear).sort((a, b) => b - a).map(yr => {
    const rows = byYear[yr].map(p =>
      `<li class="archive-row"><span class="archive-date">${isoDate(p.date)}</span> <a href="/posts/${p.slug}/">${p.title}</a></li>`
    ).join('');
    return `<div class="archive-year"><h2 class="archive-year-heading">${yr}</h2><ul class="archive-year-list">${rows}</ul></div>`;
  }).join('');

  const content = render(archiveTemplate, { archive_html: archiveHtml });

  return render(baseTemplate, {
    page_title: `Archive — ${SITE.name}`,
    meta_description: 'All posts on Doddy, grouped by year.',
    canonical: `${SITE.url}/archive/`,
    og_type: 'website',
    og_title: `Archive — ${SITE.name}`,
    og_description: 'Every post, reverse chronological.',
    og_image: `${SITE.url}/images/og-default.png`,
    og_url: `${SITE.url}/archive/`,
    body_class: 'page-archive',
    extra_head: '',
    main_content: content,
    extra_scripts: '',
  });
}

function buildAboutPage(baseTemplate, aboutTemplate) {
  const content = aboutTemplate;
  return render(baseTemplate, {
    page_title: `About — ${SITE.name}`,
    meta_description: 'Brainee is the solo founder of Smelloff, building D2C in Hyderabad. Doddy is where he writes.',
    canonical: `${SITE.url}/about/`,
    og_type: 'website',
    og_title: `About — ${SITE.name}`,
    og_description: 'Who writes Doddy and why.',
    og_image: `${SITE.url}/images/og-default.png`,
    og_url: `${SITE.url}/about/`,
    body_class: 'page-about',
    extra_head: '',
    main_content: content,
    extra_scripts: '',
  });
}

function build404Page(posts, baseTemplate, notFoundTemplate) {
  const recent = posts.slice(0, 5);
  const recentHtml = `<ul class="not-found-posts">${recent.map(p =>
    `<li><a href="/posts/${p.slug}/">${p.title}</a></li>`
  ).join('')}</ul>`;

  const content = render(notFoundTemplate, { recent_posts_html: recentHtml });

  return render(baseTemplate, {
    page_title: `404 — ${SITE.name}`,
    meta_description: 'Page not found.',
    canonical: `${SITE.url}/404.html`,
    og_type: 'website',
    og_title: `404 — ${SITE.name}`,
    og_description: 'This page wandered off.',
    og_image: `${SITE.url}/images/og-default.png`,
    og_url: `${SITE.url}/404.html`,
    body_class: 'page-404',
    extra_head: '',
    main_content: content,
    extra_scripts: '',
  });
}

// ─── Feed / Index Generators ─────────────────────────────────────────────────

function buildSitemap(posts) {
  const staticPages = ['/', '/archive/', '/about/', '/topics/'];
  const topicPages = [...new Set(posts.map(p => `/topics/${p.topic_slug}/`))];

  const urls = [
    ...staticPages,
    ...topicPages,
    ...posts.map(p => `/posts/${p.slug}/`),
  ].map(loc => `  <url><loc>${SITE.url}${loc}</loc><changefreq>weekly</changefreq></url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function buildRSS(posts) {
  const items = posts.slice(0, 20).map(p => `  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>${p.canonical}</link>
    <guid>${p.canonical}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description><![CDATA[${p.dek}]]></description>
    <author>${SITE.email} (${SITE.author})</author>
  </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name}</title>
    <link>${SITE.url}</link>
    <description>${SITE.description}</description>
    <language>en-in</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

function buildJSONFeed(posts) {
  const items = posts.slice(0, 20).map(p => ({
    id: p.canonical,
    url: p.canonical,
    title: p.title,
    summary: p.dek,
    date_published: new Date(p.date).toISOString(),
    author: { name: SITE.author },
    tags: p.tags,
  }));

  return JSON.stringify({
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE.name,
    home_page_url: SITE.url,
    feed_url: `${SITE.url}/feed.json`,
    description: SITE.description,
    authors: [{ name: SITE.author, url: `${SITE.url}/about/` }],
    items,
  }, null, 2);
}

function buildSearchIndex(posts) {
  return JSON.stringify(posts.map(p => ({
    title: p.title,
    dek: p.dek,
    slug: p.slug,
    topic: p.topic,
    tags: p.tags,
    excerpt: excerpt(p.content, 200),
    url: `/posts/${p.slug}/`,
  })), null, 2);
}

// ─── Main Build ───────────────────────────────────────────────────────────────

async function build() {
  const t0 = Date.now();

  await fs.emptyDir(DIRS.dist);
  await fs.copy(DIRS.static, DIRS.dist);
  await fs.ensureDir(path.join(DIRS.dist, 'posts'));
  await fs.ensureDir(path.join(DIRS.dist, 'topics'));
  await fs.ensureDir(path.join(DIRS.dist, 'archive'));
  await fs.ensureDir(path.join(DIRS.dist, 'about'));

  const posts = loadPosts();
  const baseTemplate = readTemplate('base.html');
  const postTemplate = readTemplate('post.html');
  const homeTemplate = readTemplate('home.html');
  const topicTemplate = readTemplate('topic.html');
  const archiveTemplate = readTemplate('archive.html');
  const aboutTemplate = readTemplate('about.html');
  const notFoundTemplate = readTemplate('404.html');

  // Post pages
  for (const post of posts) {
    const html = buildPostPage(post, posts, baseTemplate, postTemplate);
    const dir = path.join(DIRS.dist, 'posts', post.slug);
    await fs.ensureDir(dir);
    await fs.writeFile(path.join(dir, 'index.html'), html);
  }

  // Homepage
  await fs.writeFile(
    path.join(DIRS.dist, 'index.html'),
    buildHomePage(posts, baseTemplate, homeTemplate)
  );

  // Topic pages
  const topics = [...new Set(posts.map(p => p.topic))];
  for (const topic of topics) {
    const topicPosts = posts.filter(p => p.topic === topic);
    const html = buildTopicPage(topic, topicPosts, baseTemplate, topicTemplate);
    const dir = path.join(DIRS.dist, 'topics', slugify(topic));
    await fs.ensureDir(dir);
    await fs.writeFile(path.join(dir, 'index.html'), html);
  }

  // Topics index
  const topicsIndexHtml = render(baseTemplate, {
    page_title: `Topics — ${SITE.name}`,
    meta_description: 'All topics on Doddy.',
    canonical: `${SITE.url}/topics/`,
    og_type: 'website',
    og_title: `Topics — ${SITE.name}`,
    og_description: 'Browse posts by topic.',
    og_image: `${SITE.url}/images/og-default.png`,
    og_url: `${SITE.url}/topics/`,
    body_class: 'page-topics',
    extra_head: '',
    main_content: `<section class="topics-index"><h1 class="topics-index-title">Topics</h1><div class="topics-strip">${buildTopicStrip(topics.map(t => [t, posts.filter(p => p.topic === t).length]))}</div></section>`,
    extra_scripts: '',
  });
  await fs.ensureDir(path.join(DIRS.dist, 'topics'));
  await fs.writeFile(path.join(DIRS.dist, 'topics', 'index.html'), topicsIndexHtml);

  // Archive
  await fs.writeFile(
    path.join(DIRS.dist, 'archive', 'index.html'),
    buildArchivePage(posts, baseTemplate, archiveTemplate)
  );

  // About
  await fs.writeFile(
    path.join(DIRS.dist, 'about', 'index.html'),
    buildAboutPage(baseTemplate, aboutTemplate)
  );

  // 404
  await fs.writeFile(
    path.join(DIRS.dist, '404.html'),
    build404Page(posts, baseTemplate, notFoundTemplate)
  );

  // Feeds
  await fs.writeFile(path.join(DIRS.dist, 'sitemap.xml'), buildSitemap(posts));
  await fs.writeFile(path.join(DIRS.dist, 'rss.xml'), buildRSS(posts));
  await fs.writeFile(path.join(DIRS.dist, 'feed.json'), buildJSONFeed(posts));
  await fs.writeFile(path.join(DIRS.dist, 'search-index.json'), buildSearchIndex(posts));

  // robots.txt
  await fs.writeFile(path.join(DIRS.dist, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);

  const ms = Date.now() - t0;
  console.log(`✓ Built ${posts.length} posts, ${topics.length} topics in ${ms}ms`);
  console.log(`\nDeploy: vercel --prod`);
}

build().catch(err => { console.error('Build failed:', err); process.exit(1); });
