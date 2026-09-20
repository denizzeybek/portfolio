import { describe, expect, it } from 'vitest'

import { estimateReadingMinutes, parseFrontmatter, toNote } from './parseNote'

const identity = (md: string): string => md

const frontmatter = [
  '---',
  'title: A note about parsing',
  'slug: a-note-about-parsing',
  'date: 2026-09-20',
  'summary: Short enough to fit.',
  'tags: [vue, migration]',
  'readingMinutes: 7',
  'draft: true',
  '---',
  '',
  'The body starts here.',
].join('\n')

describe('parseFrontmatter', () => {
  it('reads a quoted or bare string value as a string', () => {
    const { data } = parseFrontmatter(frontmatter)

    expect(data.title).toBe('A note about parsing')
  })

  it('splits an inline array into a list of trimmed strings', () => {
    const { data } = parseFrontmatter(frontmatter)

    expect(data.tags).toEqual(['vue', 'migration'])
  })

  it('reads an empty inline array as an empty list', () => {
    const { data } = parseFrontmatter('---\ntags: []\n---\nBody')

    expect(data.tags).toEqual([])
  })

  it('reads a numeric value as a number', () => {
    const { data } = parseFrontmatter(frontmatter)

    expect(data.readingMinutes).toBe(7)
  })

  it('reads a boolean value as a boolean', () => {
    const { data } = parseFrontmatter(frontmatter)

    expect(data.draft).toBe(true)
  })

  it('returns the markdown after the closing fence as the body', () => {
    const { body } = parseFrontmatter(frontmatter)

    expect(body).toBe('The body starts here.')
  })

  it('keeps a colon inside a value intact', () => {
    const { data } = parseFrontmatter('---\nsummary: One thing: then another\n---\n')

    expect(data.summary).toBe('One thing: then another')
  })

  it('treats a file without an opening fence as all body', () => {
    const { data, body } = parseFrontmatter('Just markdown.\n')

    expect({ data, body }).toEqual({ data: {}, body: 'Just markdown.' })
  })

  it('throws when the closing fence is missing', () => {
    expect(() => parseFrontmatter('---\ntitle: Unclosed\n')).toThrow(/closing/i)
  })

  it('strips surrounding quotes from a quoted string', () => {
    const { data } = parseFrontmatter('---\ntitle: "Quoted: yes"\n---\n')

    expect(data.title).toBe('Quoted: yes')
  })
})

describe('estimateReadingMinutes', () => {
  it('rounds two hundred words up to one minute', () => {
    expect(estimateReadingMinutes('word '.repeat(200))).toBe(1)
  })

  it('rounds a part-read minute up to the next whole minute', () => {
    expect(estimateReadingMinutes('word '.repeat(201))).toBe(2)
  })

  it('returns one minute for an empty body', () => {
    expect(estimateReadingMinutes('   \n  ')).toBe(1)
  })
})

describe('toNote', () => {
  it('returns a note carrying its validated frontmatter', () => {
    const note = toNote(frontmatter, identity)

    expect(note.slug).toBe('a-note-about-parsing')
  })

  it('renders the body with the supplied renderer', () => {
    const note = toNote(frontmatter, (md) => `<p>${md}</p>`)

    expect(note.html).toBe('<p>The body starts here.</p>')
  })

  it('estimates the reading time when frontmatter omits it', () => {
    const raw = frontmatter
      .replace('readingMinutes: 7\n', '')
      .replace('The body starts here.', 'word '.repeat(450))

    expect(toNote(raw, identity).readingMinutes).toBe(3)
  })

  it('defaults draft to false when frontmatter omits it', () => {
    const note = toNote(frontmatter.replace('draft: true\n', ''), identity)

    expect(note.draft).toBe(false)
  })

  it('names the missing field when a required string is absent', () => {
    const raw = frontmatter.replace('summary: Short enough to fit.\n', '')

    expect(() => toNote(raw, identity)).toThrow(/"summary"/)
  })

  it('names the slug of the offending note in the error', () => {
    const raw = frontmatter.replace('title: A note about parsing\n', '')

    expect(() => toNote(raw, identity)).toThrow(/a-note-about-parsing/)
  })

  it('rejects a note whose tags list is empty', () => {
    const raw = frontmatter.replace('tags: [vue, migration]', 'tags: []')

    expect(() => toNote(raw, identity)).toThrow(/"tags"/)
  })
})
