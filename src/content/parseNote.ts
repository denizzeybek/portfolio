import type { INote, IParsedFrontmatter, NoteFrontmatterValue } from '@/types/note.types'

const FENCE = '---'
const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/
const WORDS_PER_MINUTE = 200

function stripQuotes(value: string): string {
  const quoted = /^(['"])(.*)\1$/.exec(value)
  if (!quoted) return value
  const inner = quoted[2]
  return inner === undefined ? value : inner
}

function parseInlineArray(value: string): string[] {
  const inner = value.slice(1, -1).trim()
  if (inner === '') return []
  return inner
    .split(',')
    .map((item) => stripQuotes(item.trim()))
    .filter((item) => item !== '')
}

function parseScalar(value: string): NoteFrontmatterValue {
  if (value.startsWith('[') && value.endsWith(']')) return parseInlineArray(value)
  if (value === 'true') return true
  if (value === 'false') return false
  if (NUMBER_PATTERN.test(value)) return Number(value)
  return stripQuotes(value)
}

/**
 * Splits a note file into its frontmatter map and markdown body.
 *
 * Supports the subset of YAML the notes actually use: `key: value` pairs whose value is a
 * string, number, boolean or inline array (`tags: [vue, migration]`). A file without an
 * opening fence is treated as all body.
 */
export function parseFrontmatter(raw: string): IParsedFrontmatter {
  const normalised = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const lines = normalised.split('\n')
  if (lines[0]?.trim() !== FENCE) return { data: {}, body: normalised.trim() }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === FENCE)
  if (closingIndex === -1) {
    throw new Error('Note frontmatter is missing its closing "---" fence.')
  }

  const data: Record<string, NoteFrontmatterValue> = {}
  for (const line of lines.slice(1, closingIndex)) {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf(':')
    if (separator === -1) {
      throw new Error(`Note frontmatter line is not a "key: value" pair: "${trimmed}".`)
    }

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim()
    if (key === '') {
      throw new Error(`Note frontmatter line has an empty key: "${trimmed}".`)
    }
    data[key] = value === '' ? '' : parseScalar(value)
  }

  return { data, body: lines.slice(closingIndex + 1).join('\n').trim() }
}

/** Reading time at 200 words per minute, rounded up, never below one minute. */
export function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter((word) => word !== '').length
  if (words === 0) return 1
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

function requireString(
  data: Record<string, NoteFrontmatterValue>,
  field: string,
  slugHint: string,
): string {
  const value = data[field]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Note ${slugHint} is missing required frontmatter field "${field}".`)
  }
  return value
}

function requireTags(
  data: Record<string, NoteFrontmatterValue>,
  slugHint: string,
): string[] {
  const value = data.tags
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Note ${slugHint} is missing required frontmatter field "tags".`)
  }
  return value
}

function readReadingMinutes(
  data: Record<string, NoteFrontmatterValue>,
  body: string,
): number {
  const value = data.readingMinutes
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value
  return estimateReadingMinutes(body)
}

function readDraft(data: Record<string, NoteFrontmatterValue>): boolean {
  return data.draft === true
}

/**
 * Parses one note file into a validated `INote`.
 *
 * Throws on missing or malformed frontmatter so bad content fails at import time rather than
 * rendering half-broken in a view.
 */
export function toNote(raw: string, renderMarkdown: (md: string) => string): INote {
  const { data, body } = parseFrontmatter(raw)
  const slugValue = data.slug
  const slugHint = typeof slugValue === 'string' && slugValue !== '' ? `"${slugValue}"` : '(unknown)'

  return {
    title: requireString(data, 'title', slugHint),
    slug: requireString(data, 'slug', slugHint),
    date: requireString(data, 'date', slugHint),
    summary: requireString(data, 'summary', slugHint),
    tags: requireTags(data, slugHint),
    readingMinutes: readReadingMinutes(data, body),
    draft: readDraft(data),
    body,
    html: renderMarkdown(body),
  }
}
