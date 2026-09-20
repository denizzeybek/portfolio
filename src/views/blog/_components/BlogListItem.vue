<template>
  <RouterLink
    :to="{ name: 'post', params: { slug: note.slug } }"
    class="group flex gap-6 border-t border-line py-6 no-underline sm:gap-10"
  >
    <span class="hidden w-24 shrink-0 font-mono text-xs leading-7 text-ink-faint sm:block">
      {{ publishedAt }}
      <span class="block text-ink-faint/70">{{ t('blog.minutes', { count: note.readingMinutes }) }}</span>
    </span>

    <span class="flex-grow">
      <span class="block font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
        {{ note.title }}
      </span>
      <span class="block max-w-[70ch] pt-2 font-prose text-base leading-relaxed text-ink-muted sm:text-[17px]">
        {{ note.summary }}
      </span>
      <span class="flex flex-wrap items-center gap-2 pt-3.5">
        <UiTag v-for="tag in note.tags" :key="tag">{{ tag }}</UiTag>
        <span class="font-mono text-xs text-ink-faint sm:hidden">{{ publishedAt }}</span>
      </span>
    </span>

    <span
      aria-hidden="true"
      class="self-center font-mono text-lg text-accent transition-transform duration-150 group-hover:translate-x-1"
    >
      →
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import UiTag from '@/components/ui/UiTag.vue'
import { formatNoteDate } from '@/composables/useNoteDate'

import type { INote } from '@/types/note.types'

interface IProps {
  note: INote
}

const props = defineProps<IProps>()

const { t, locale } = useI18n()

const publishedAt = computed(() => formatNoteDate(props.note.date, 'short', locale.value))
</script>
