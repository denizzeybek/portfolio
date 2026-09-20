import { computed } from 'vue'

import { toNote } from '@/content/parseNote'
import { renderMarkdown } from '@/content/renderMarkdown'
import { i18n } from '@/i18n'

import type { Locale } from '@/i18n'
import type { INote } from '@/types/note.types'
import type { ComputedRef } from 'vue'

const FALLBACK_LOCALE: Locale = 'en'
const FILENAME_PATTERN = /\/([^/]+)\.(en|tr)\.md$/

const rawNotes: Record<string, string> = import.meta.glob<string>('../content/notes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** Reads the locale a note file carries in its name: `<slug>.<locale>.md`. */
export function localeOfPath(path: string): Locale {
  const match = FILENAME_PATTERN.exec(path)
  const locale = match?.[2]
  return locale === 'tr' ? 'tr' : FALLBACK_LOCALE
}

/** Newest first, comparing the ISO `date` field. */
export function sortByDateDescending(notes: readonly INote[]): INote[] {
  return [...notes].sort((a, b) => b.date.localeCompare(a.date))
}

/** Drafts are visible while developing and hidden in a production build. */
export function selectPublished(notes: readonly INote[], production: boolean): INote[] {
  if (!production) return [...notes]
  return notes.filter((note) => note.draft !== true)
}

/**
 * One entry per slug, in the reader's language. A post that has not been translated yet falls
 * back to its English version rather than disappearing from the list.
 */
export function selectLocale(notes: readonly INote[], locale: Locale): INote[] {
  const bySlug = new Map<string, INote>()

  for (const note of notes) {
    const current = bySlug.get(note.slug)
    if (current === undefined || (current.locale !== locale && note.locale === locale)) {
      bySlug.set(note.slug, note)
    }
  }

  return [...bySlug.values()]
}

const allNotes: readonly INote[] = sortByDateDescending(
  Object.entries(rawNotes).map(([path, raw]) => ({
    ...toNote(raw, renderMarkdown),
    locale: localeOfPath(path),
  })),
)

export interface IUseNotes {
  notes: readonly INote[]
  publishedNotes: ComputedRef<INote[]>
  findBySlug: (slug: string) => INote | undefined
}

/**
 * Every note in `src/content/notes/`, parsed once, filtered to the active locale. It reads the
 * shared i18n instance rather than `useI18n()`, so it also works outside a component.
 */
export function useNotes(): IUseNotes {
  const publishedNotes = computed(() =>
    selectLocale(
      selectPublished(allNotes, import.meta.env.PROD),
      i18n.global.locale.value as Locale,
    ),
  )

  const findBySlug = (slug: string): INote | undefined =>
    publishedNotes.value.find((note) => note.slug === slug)

  return { notes: allNotes, publishedNotes, findBySlug }
}
