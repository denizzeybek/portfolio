<template>
  <ol class="flex list-none flex-col p-0">
    <li v-for="item in EXPERIENCE" :key="item.id" class="border-t border-line py-7">
      <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 class="font-display text-xl font-medium tracking-tight text-ink">
          {{ t(`experience.${item.id}.role`) }}
          <span class="text-ink-muted">· {{ item.company }}</span>
        </h3>
        <span class="font-mono text-xs text-ink-faint">{{ t(`experience.${item.id}.period`) }}</span>
      </div>

      <p class="max-w-[68ch] pt-2.5 font-prose text-base leading-relaxed text-ink sm:text-[17px]">
        {{ t(`experience.${item.id}.summary`) }}
      </p>

      <ul class="flex list-none flex-col gap-2 p-0 pt-4">
        <li
          v-for="(highlight, index) in highlightsOf(item.id)"
          :key="index"
          class="flex max-w-[68ch] gap-3 font-prose text-base leading-relaxed text-ink-muted"
        >
          <span aria-hidden="true" class="pt-[7px] font-mono text-xs text-accent-dim">—</span>
          <span>{{ highlight }}</span>
        </li>
      </ul>

      <div class="flex flex-wrap gap-2 pt-4">
        <UiTag v-for="tag in item.stack" :key="tag">{{ tag }}</UiTag>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import UiTag from '@/components/ui/UiTag.vue'
import { EXPERIENCE } from '@/content/site'

const { t, tm, rt } = useI18n()

/** `highlights` is a list in the locale files, so it needs the message API rather than `t`. */
const highlightsOf = (id: string): string[] => {
  const entries = tm(`experience.${id}.highlights`)
  if (!Array.isArray(entries)) return []
  return entries.map((entry) => rt(entry as Parameters<typeof rt>[0]))
}
</script>
