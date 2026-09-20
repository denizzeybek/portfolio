import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import tr from '@/locales/tr.json'

export const LOCALES = ['en', 'tr'] as const
export type Locale = (typeof LOCALES)[number]

export const STORAGE_KEY = 'portfolio.locale'
const FALLBACK: Locale = 'en'

function isLocale(value: string | null): value is Locale {
  return value !== null && LOCALES.includes(value as Locale)
}

/** Stored choice first, then the browser, then English. */
export function resolveInitialLocale(
  stored: string | null,
  languages: readonly string[],
): Locale {
  if (isLocale(stored)) return stored

  for (const language of languages) {
    const short = language.slice(0, 2).toLowerCase()
    if (isLocale(short)) return short
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
