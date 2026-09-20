import MarkdownIt from 'markdown-it'

/**
 * Shared renderer for note bodies. `html: false` is deliberate: notes are trusted content, but
 * escaping raw HTML keeps the rendered output inside the site's own typography styles.
 */
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

/** Renders a markdown body to HTML. */
export function renderMarkdown(source: string): string {
  return md.render(source)
}
