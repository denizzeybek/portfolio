import { describe, expect, it } from 'vitest'

import {
  localeOfPath,
  selectLocale,
  selectPublished,
  sortByDateDescending,
  useNotes,
} from '@/composables/useNotes'

import type { INote } from '@/types/note.types'

function makeNote(slug: string, date: string, draft = false, locale: 'en' | 'tr' = 'en'): INote {
  return {
    title: slug,
    slug,
    date,
    summary: `Summary of ${slug}.`,
    tags: ['testing'],
    readingMinutes: 3,
    draft,
    body: 'Body.',
    html: '<p>Body.</p>',
    locale,
  }
}

describe('sortByDateDescending', () => {
  it('puts the newest note first', () => {
    const sorted = sortByDateDescending([
      makeNote('older', '2026-01-05'),
      makeNote('newest', '2026-09-20'),
      makeNote('middle', '2026-05-11'),
    ])

    expect(sorted.map((note) => note.slug)).toEqual(['newest', 'middle', 'older'])
  })

  it('leaves the input array untouched', () => {
    const input = [makeNote('older', '2026-01-05'), makeNote('newest', '2026-09-20')]

    sortByDateDescending(input)

    expect(input.map((note) => note.slug)).toEqual(['older', 'newest'])
  })
})

describe('selectPublished', () => {
  it('drops drafts in a production build', () => {
    const selected = selectPublished(
      [makeNote('published', '2026-09-20'), makeNote('hidden', '2026-09-19', true)],
      true,
    )

    expect(selected.map((note) => note.slug)).toEqual(['published'])
  })

  it('keeps drafts outside a production build', () => {
    const selected = selectPublished(
      [makeNote('published', '2026-09-20'), makeNote('hidden', '2026-09-19', true)],
      false,
    )

    expect(selected.map((note) => note.slug)).toEqual(['published', 'hidden'])
  })
})

describe('useNotes', () => {
  it('loads every note file in the content folder', () => {
    expect(useNotes().notes.length).toBeGreaterThanOrEqual(4)
  })

  it('shows one version per slug in the active language', () => {
    const { publishedNotes } = useNotes()
    const slugs = publishedNotes.value.map((note) => note.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('returns the notes sorted newest first', () => {
    const dates = useNotes().notes.map((note) => note.date)

    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates)
  })

  it('renders each note body to html', () => {
    const [first] = useNotes().notes

    expect(first?.html).toMatch(/<p>/)
  })

  it('finds a note by its slug', () => {
    const note = useNotes().findBySlug('ai-assisted-project-setup')

    expect(note?.slug).toBe('ai-assisted-project-setup')
  })

  it('returns undefined for a slug that does not exist', () => {
    expect(useNotes().findBySlug('no-such-note')).toBeUndefined()
  })
})

describe('localeOfPath', () => {
  it('reads the locale out of the file name', () => {
    expect(localeOfPath('../content/notes/a-post.tr.md')).toBe('tr')
    expect(localeOfPath('../content/notes/a-post.en.md')).toBe('en')
  })

  it('falls back to English for a file without a locale suffix', () => {
    expect(localeOfPath('../content/notes/a-post.md')).toBe('en')
  })
})

describe('selectLocale', () => {
  const english = makeNote('shared', '2026-09-01', false, 'en')
  const turkish = makeNote('shared', '2026-09-01', false, 'tr')
  const englishOnly = makeNote('solo', '2026-08-01', false, 'en')

  it('keeps one version per slug', () => {
    expect(selectLocale([english, turkish], 'tr')).toHaveLength(1)
  })

  it('prefers the language the reader is in', () => {
    expect(selectLocale([english, turkish], 'tr')[0]?.locale).toBe('tr')
    expect(selectLocale([english, turkish], 'en')[0]?.locale).toBe('en')
  })

  it('falls back to the other language rather than hiding an untranslated post', () => {
    const selected = selectLocale([englishOnly], 'tr')

    expect(selected).toHaveLength(1)
    expect(selected[0]?.locale).toBe('en')
  })
})
