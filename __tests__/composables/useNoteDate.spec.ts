import { describe, expect, it } from 'vitest'

import { formatNoteDate } from '@/composables/useNoteDate'

describe('formatNoteDate', () => {
  it('renders the short style as year.month', () => {
    expect(formatNoteDate('2026-09-20', 'short')).toBe('2026.09')
  })

  it('renders the long style as a readable date', () => {
    expect(formatNoteDate('2026-09-20', 'long')).toBe('20 September 2026')
  })

  it('returns the input untouched when it is not a date', () => {
    expect(formatNoteDate('not-a-date')).toBe('not-a-date')
  })
})
