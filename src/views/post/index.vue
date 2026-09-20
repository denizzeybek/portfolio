<template>
  <article v-if="note" class="flex flex-col gap-10 lg:flex-row lg:gap-14">
    <PostAside :note="note" :headings="headings" />

    <div class="max-w-[68ch] flex-grow">
      <h1
        class="font-display text-[30px] leading-[1.12] font-bold tracking-tight text-ink sm:text-[44px]"
      >
        {{ note.title }}
      </h1>
      <p class="pt-5 font-prose text-xl leading-relaxed text-ink-muted">{{ note.summary }}</p>

      <UiProse class="pt-8">
        <!-- eslint-disable-next-line vue/no-v-html -- markdown-it renders this repo's own notes with html:false -->
        <div v-html="body" />
      </UiProse>

      <PostNav class="mt-11" :previous="previous" :next="next" />
    </div>
  </article>

  <section v-else class="flex flex-col gap-4">
    <UiMeta>{{ t('notFound.code') }}</UiMeta>
    <h1 class="font-display text-3xl font-bold text-ink">{{ t('post.missingTitle') }}</h1>
    <UiLink :to="{ name: 'blog' }">{{ t('post.missingBack') }}</UiLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import UiLink from '@/components/ui/UiLink.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
import UiProse from '@/components/ui/UiProse.vue'
import { useNotes } from '@/composables/useNotes'

import PostAside from './_components/PostAside.vue'
import PostNav from './_components/PostNav.vue'
import { extractHeadings, withHeadingIds } from './_etc/headings'

import type { INote } from '@/types/note.types'

interface IProps {
  slug: string
}

const props = defineProps<IProps>()

const { t } = useI18n()

const { publishedNotes, findBySlug } = useNotes()

const note = computed(() => findBySlug(props.slug))
const body = computed(() => (note.value ? withHeadingIds(note.value.html) : ''))
const headings = computed(() => (note.value ? extractHeadings(note.value.html) : []))

const index = computed(() => publishedNotes.findIndex((item: INote) => item.slug === props.slug))
const previous = computed(() => (index.value > 0 ? publishedNotes[index.value - 1] : undefined))
const next = computed(() => (index.value >= 0 ? publishedNotes[index.value + 1] : undefined))
</script>
