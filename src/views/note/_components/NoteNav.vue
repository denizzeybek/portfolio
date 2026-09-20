<template>
  <nav class="flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:justify-between">
    <RouterLink
      v-if="previous"
      :to="{ name: 'note', params: { slug: previous.slug } }"
      class="flex-grow no-underline"
    >
      <UiMeta class="pb-1.5">{{ t('note.previous') }}</UiMeta>
      <span class="font-display text-base text-ink">{{ previous.title }}</span>
    </RouterLink>

    <RouterLink
      v-if="next"
      :to="{ name: 'note', params: { slug: next.slug } }"
      class="flex-grow no-underline sm:text-right"
    >
      <UiMeta class="pb-1.5">{{ t('note.next') }}</UiMeta>
      <span class="font-display text-base text-ink">{{ next.title }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import UiMeta from '@/components/ui/UiMeta.vue'

import type { INote } from '@/types/note.types'

interface IProps {
  previous?: INote
  next?: INote
}

defineProps<IProps>()

const { t } = useI18n()
</script>
