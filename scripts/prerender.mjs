import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import MarkdownIt from 'markdown-it'

import en from '../src/locales/en.json' with { type: 'json' }

const ORIGIN = 'https://denizzeybek.dev'
const OG_IMAGE = `${ORIGIN}/og.png`
const NOTES_DIR = 'src/content/notes'
const DIST = 'dist'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })
const template = readFileSync(join(DIST, 'index.html'), 'utf8')

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function readNote(file) {
  const raw = readFileSync(join(NOTES_DIR, file), 'utf8')
  const [, frontmatter = '', ...rest] = raw.split('---')
  const field = (name) => new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(frontmatter)?.[1]?.trim() ?? ''
  if (/^draft:\s*true$/m.test(frontmatter)) return null

  return {
    slug: field('slug'),
    title: field('title'),
    summary: field('summary'),
    date: field('date'),
    tags: field('tags').replace(/[[\]]/g, '').split(',').map((tag) => tag.trim()),
    html: md.render(rest.join('---').trim()),
  }
}

const notes = readdirSync(NOTES_DIR)
  .filter((file) => file.endsWith('.en.md'))
  .map(readNote)
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date))

function head({ title, description, path, type, publishedAt, jsonLd }) {
  const url = `${ORIGIN}${path}`
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="Deniz Zeybek" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ]
  if (publishedAt) tags.push(`<meta property="article:published_time" content="${publishedAt}" />`)
  if (jsonLd) tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`)
  return tags.map((tag) => `    ${tag}`).join('\n')
}

/** The app replaces this on mount; it exists so crawlers that do not run JS still read the page. */
function write(route) {
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escape(route.description)}" />`,
    )
    .replace('</head>', `${head(route)}\n  </head>`)
    .replace('<div id="app"></div>', `<div id="app">${route.body}</div>`)

  const file =
    route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path.slice(1), 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  return file
}

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Deniz Zeybek',
  jobTitle: en.site.role,
  url: ORIGIN,
  email: 'mailto:zeybekdeniz64@gmail.com',
  sameAs: ['https://github.com/denizzeybek', 'https://linkedin.com/in/denizzeybek'],
}

const routes = [
  {
    path: '/',
    title: `${en.site.name} — ${en.site.role}`,
    description: en.home.facts,
    type: 'website',
    jsonLd: person,
    body: `<h1>${escape(en.site.name)}</h1><p>${escape(en.home.roleLine)}</p><p>${escape(en.home.facts)}</p><p>${escape(en.home.intro)}</p><p>${escape(en.home.agents)}</p>`,
  },
  {
    path: '/blog',
    title: `${en.blog.eyebrow} — ${en.site.name}`,
    description: en.blog.intro,
    type: 'website',
    body: `<h1>${escape(en.blog.headline)}</h1><p>${escape(en.blog.intro)}</p><ul>${notes
      .map((note) => `<li><a href="/blog/${note.slug}">${escape(note.title)}</a></li>`)
      .join('')}</ul>`,
  },
  ...notes.map((note) => ({
    path: `/blog/${note.slug}`,
    title: `${note.title} — ${en.site.name}`,
    description: note.summary,
    type: 'article',
    publishedAt: note.date,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: note.title,
      description: note.summary,
      datePublished: note.date,
      keywords: note.tags.join(', '),
      author: { '@type': 'Person', name: en.site.name, url: ORIGIN },
      mainEntityOfPage: `${ORIGIN}/blog/${note.slug}`,
    },
    body: `<article><h1>${escape(note.title)}</h1><p>${escape(note.summary)}</p>${note.html}</article>`,
  })),
]

for (const route of routes) write(route)
console.log(`prerender — ${routes.length} routes`)
