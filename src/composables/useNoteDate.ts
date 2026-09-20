type DateStyle = 'short' | 'long'

const FORMATS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { year: 'numeric', month: '2-digit' },
  long: { year: 'numeric', month: 'long', day: 'numeric' },
}

/** Formats an ISO note date. `short` reads 2026.09, `long` reads 20 September 2026. */
export function formatNoteDate(iso: string, style: DateStyle = 'long'): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const formatted = new Intl.DateTimeFormat('en-GB', FORMATS[style]).format(date)
  return style === 'short' ? formatted.replace('/', '.').split('.').reverse().join('.') : formatted
}
