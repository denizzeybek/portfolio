import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ORIGIN = 'https://denizzeybek.dev'
const NOTES_DIR = 'src/content/notes'

const slugOf = (file) => {
  const frontmatter = readFileSync(join(NOTES_DIR, file), 'utf8').split('---')[1] ?? ''
  const match = /^slug:\s*(.+)$/m.exec(frontmatter)
  const draft = /^draft:\s*true$/m.test(frontmatter)
  return draft ? null : match?.[1]?.trim()
}

const slugs = [
  ...new Set(
    readdirSync(NOTES_DIR)
      .filter((file) => file.endsWith('.en.md'))
      .map(slugOf)
      .filter(Boolean),
  ),
]

const urls = ['/', '/blog', ...slugs.map((slug) => `/blog/${slug}`)]
const today = new Date().toISOString().slice(0, 10)

const body = urls
  .map((path) => `  <url><loc>${ORIGIN}${path}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')

writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
)

console.log(`sitemap — ${urls.length} urls`)
