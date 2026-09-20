<template>
  <section class="flex max-w-[68ch] flex-col gap-4">
    <UiMeta>{{ t('notes.eyebrow') }}</UiMeta>
    <h1
      class="font-display text-[30px] leading-tight font-bold tracking-tight text-ink sm:text-[40px]"
    >
      {{ t('notes.headline') }}
    </h1>
    <p class="font-prose text-lg leading-relaxed text-ink-muted">{{ t('notes.intro') }}</p>
  </section>

  <section class="flex flex-col">
    <div class="flex items-baseline justify-between pb-5">
      <UiMeta tag="h2">{{ t('notes.all') }}</UiMeta>
      <UiMeta>{{ t('notes.count', { count: notes.length }) }}</UiMeta>
    </div>

    <NoteListItem v-for="note in notes" :key="note.slug" :note="note" />
    <UiDivider />
    <p v-if="notes.length === 0" class="pt-6 font-mono text-sm text-ink-muted">
      {{ t('notes.empty') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import UiDivider from '@/components/ui/UiDivider.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
import { useNotes } from '@/composables/useNotes'

import NoteListItem from './_components/NoteListItem.vue'

const { t } = useI18n()
const { publishedNotes: notes } = useNotes()
</script>
