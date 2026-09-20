import { renderMarkdown } from '@/content/renderMarkdown'
import { toNote } from '@/content/parseNote'

import type { INote } from '@/types/note.types'

const rawNotes: Record<string, string> = import.meta.glob<string>(
  '../content/notes/*.md',
  { query: '?raw', import: 'default', eager: true },
)

/** Newest first, comparing the ISO `date` field. */
export function sortByDateDescending(notes: readonly INote[]): INote[] {
  return [...notes].sort((a, b) => b.date.localeCompare(a.date))
}

/** Drafts are visible while developing and hidden in a production build. */
export function selectPublished(notes: readonly INote[], production: boolean): INote[] {
  if (!production) return [...notes]
  return notes.filter((note) => note.draft !== true)
}

const allNotes: readonly INote[] = sortByDateDescending(
  Object.values(rawNotes).map((raw) => toNote(raw, renderMarkdown)),
)

const visibleNotes: readonly INote[] = selectPublished(allNotes, import.meta.env.PROD)

export interface IUseNotes {
  notes: readonly INote[]
  publishedNotes: readonly INote[]
  findBySlug: (slug: string) => INote | undefined
}

/** Every note in `src/content/notes/`, parsed and validated once, sorted newest first. */
export function useNotes(): IUseNotes {
  const findBySlug = (slug: string): INote | undefined =>
    visibleNotes.find((note) => note.slug === slug)

  return { notes: allNotes, publishedNotes: visibleNotes, findBySlug }
}
