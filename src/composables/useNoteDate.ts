type DateStyle = 'short' | 'long'

const FORMATS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { year: 'numeric', month: '2-digit' },
  long: { year: 'numeric', month: 'long', day: 'numeric' },
}

/** Formats an ISO note date. `short` reads 2026.09, `long` reads it out in the active locale. */
export function formatNoteDate(iso: string, style: DateStyle = 'long', locale = 'en'): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const tag = locale === 'tr' ? 'tr-TR' : 'en-GB'
  const formatted = new Intl.DateTimeFormat(style === 'short' ? 'en-GB' : tag, FORMATS[style]).format(date)
  return style === 'short' ? formatted.replace('/', '.').split('.').reverse().join('.') : formatted
}
