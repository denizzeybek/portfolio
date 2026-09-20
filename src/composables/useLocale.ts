import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { LOCALES, STORAGE_KEY } from '@/i18n'

import type { Locale } from '@/i18n'
import type { ComputedRef } from 'vue'

interface IUseLocale {
  locale: ComputedRef<Locale>
  otherLocale: ComputedRef<Locale>
  toggleLocale: () => void
}

/** Flips between the two locales and remembers the choice for the next visit. */
export function useLocale(): IUseLocale {
  const { locale: activeLocale } = useI18n()

  const locale = computed(() => activeLocale.value as Locale)
  const otherLocale = computed<Locale>(() => (locale.value === 'en' ? 'tr' : 'en'))

  const toggleLocale = (): void => {
    const next = otherLocale.value
    activeLocale.value = next
    document.documentElement.lang = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      return
    }
  }

  return { locale, otherLocale, toggleLocale }
}

export { LOCALES }
