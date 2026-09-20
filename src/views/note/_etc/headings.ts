import type { INoteHeading } from './note.types'

const HEADING_PATTERN = /<h2[^>]*>(.*?)<\/h2>/g
const TAG_PATTERN = /<[^>]+>/g

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
}

/** Pulls the h2 outline out of rendered note HTML, and gives each one an anchor id. */
export function extractHeadings(html: string): INoteHeading[] {
  return [...html.matchAll(HEADING_PATTERN)].map((match) => {
    const text = (match[1] ?? '').replace(TAG_PATTERN, '').trim()
    return { id: slugifyHeading(text), text }
  })
}

/** Rewrites the rendered h2 tags so their ids match the outline links. */
export function withHeadingIds(html: string): string {
  return html.replace(HEADING_PATTERN, (_full, inner: string) => {
    const text = inner.replace(TAG_PATTERN, '').trim()
    return `<h2 id="${slugifyHeading(text)}">${inner}</h2>`
  })
}
