import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { ENABLED_LOCALES, LOCALES, STORAGE_KEY } from '@/i18n'

import type { Locale } from '@/i18n'
import type { ComputedRef } from 'vue'

interface IUseLocale {
  locale: ComputedRef<Locale>
  otherLocale: ComputedRef<Locale>
  canSwitch: boolean
  toggleLocale: () => void
}

/** Flips between the enabled locales and remembers the choice for the next visit. */
export function useLocale(): IUseLocale {
  const { locale: activeLocale } = useI18n()

  const locale = computed(() => activeLocale.value as Locale)
  const otherLocale = computed<Locale>(
    () => ENABLED_LOCALES.find((candidate) => candidate !== locale.value) ?? locale.value,
  )
  const canSwitch = ENABLED_LOCALES.length > 1

  const toggleLocale = (): void => {
    const next = otherLocale.value
    if (next === locale.value) return
    activeLocale.value = next
    document.documentElement.lang = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      return
    }
  }

  return { locale, otherLocale, canSwitch, toggleLocale }
}

export { LOCALES }
