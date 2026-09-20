import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import tr from '@/locales/tr.json'

export const LOCALES = ['en', 'tr'] as const
export type Locale = (typeof LOCALES)[number]

/**
 * The locales the site actually serves. Turkish is written and kept in sync, but it is not
 * published until a native pass has been done on the copy: a translation that reads like one
 * is worse than no translation. Add 'tr' back here to turn the language switch on.
 */
export const ENABLED_LOCALES: readonly Locale[] = ['en']

export const STORAGE_KEY = 'portfolio.locale'
const FALLBACK: Locale = 'en'

function isEnabled(value: string | null): value is Locale {
  return value !== null && ENABLED_LOCALES.includes(value as Locale)
}

/** Stored choice first, then the browser, then English — limited to the enabled locales. */
export function resolveInitialLocale(stored: string | null, languages: readonly string[]): Locale {
  if (isEnabled(stored)) return stored

  for (const language of languages) {
    const short = language.slice(0, 2).toLowerCase()
    if (isEnabled(short)) return short
  }
  return FALLBACK
}

function readStoredLocale(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(readStoredLocale(), navigator.languages ?? []),
  fallbackLocale: FALLBACK,
  messages: { en, tr },
})
