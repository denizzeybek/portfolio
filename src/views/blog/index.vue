<template>
  <section class="flex max-w-[68ch] flex-col gap-4">
    <UiMeta>{{ t('blog.eyebrow') }}</UiMeta>
    <h1
      class="font-display text-[30px] leading-tight font-bold tracking-tight text-ink sm:text-[40px]"
    >
      {{ t('blog.headline') }}
    </h1>
    <p class="font-prose text-lg leading-relaxed text-ink-muted">{{ t('blog.intro') }}</p>
  </section>

  <section class="flex flex-col">
    <div class="flex items-baseline justify-between pb-5">
      <UiMeta tag="h2">{{ t('blog.all') }}</UiMeta>
      <UiMeta>{{ t('blog.count', { count: notes.length }) }}</UiMeta>
    </div>

    <BlogListItem v-for="note in notes" :key="note.slug" :note="note" />
    <UiDivider />
    <p v-if="notes.length === 0" class="pt-6 font-mono text-sm text-ink-muted">
      {{ t('blog.empty') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useSeo } from '@/composables/useSeo'
import UiDivider from '@/components/ui/UiDivider.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
import { useNotes } from '@/composables/useNotes'

import BlogListItem from './_components/BlogListItem.vue'

const { t } = useI18n()
const { publishedNotes: notes } = useNotes()

useSeo(() => ({
  title: `${t('blog.eyebrow')} — ${t('site.name')}`,
  description: t('blog.intro'),
  path: '/blog',
}))
</script>
