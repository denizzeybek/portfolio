<template>
  <header class="flex items-baseline justify-between border-b border-line pb-4">
    <RouterLink
      :to="{ name: 'home' }"
      class="font-display text-[15px] font-bold tracking-tight text-ink no-underline"
    >
      {{ t('site.name') }}
    </RouterLink>

    <nav class="flex items-center gap-5 font-mono text-xs sm:gap-7">
      <UiLink :to="{ name: 'home' }" tone="quiet" :underline="false">{{ t('nav.home') }}</UiLink>
      <UiLink :to="{ name: 'blog' }" tone="quiet" :underline="false">{{ t('nav.blog') }}</UiLink>
      <UiLink href="#contact" tone="quiet" :underline="false">{{ t('nav.contact') }}</UiLink>
      <button
        v-if="canSwitch"
        type="button"
        class="inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent font-mono text-xs text-ink-muted transition-colors duration-150 hover:text-accent"
        :aria-label="t('nav.switchLanguage', { language: t('nav.switchTo') })"
        @click="toggleLocale"
      >
        <UiFlag :locale="otherLocale" />
        <span>{{ t('nav.switchTo') }}</span>
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import UiFlag from '@/components/ui/UiFlag.vue'
import UiLink from '@/components/ui/UiLink.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { canSwitch, otherLocale, toggleLocale } = useLocale()
</script>
