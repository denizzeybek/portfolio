import { describe, expect, it } from 'vitest'

import { selectPublished, sortByDateDescending, useNotes } from './useNotes'

import type { INote } from '@/types/note.types'

function makeNote(slug: string, date: string, draft = false): INote {
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

    expect(note?.title).toBe('Setting up a project so an AI can actually build it')
  })

  it('returns undefined for a slug that does not exist', () => {
    expect(useNotes().findBySlug('no-such-note')).toBeUndefined()
  })
})
