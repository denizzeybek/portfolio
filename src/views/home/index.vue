<template>
  <section class="flex flex-col gap-10 lg:flex-row lg:gap-16">
    <div class="lg:w-[660px]">
      <UiMeta class="pb-4">Senior Frontend Engineer · Vue · TypeScript</UiMeta>
      <h1
        class="font-display text-[34px] leading-[1.08] font-bold tracking-tight text-ink sm:text-[52px]"
      >
        I write about the decisions that make a frontend survive its third year.
      </h1>
      <p class="max-w-[60ch] pt-6 font-prose text-lg leading-relaxed text-ink sm:text-[19px]">
        Six years of Vue and TypeScript: migrations that could not stop the roadmap, design systems
        that had to outlive their authors, and lately an AI-assisted way of working that changed how
        I plan a project before the first commit.
      </p>
      <p class="max-w-[60ch] pt-4 font-prose text-lg leading-relaxed text-ink-muted sm:text-[19px]">
        Most of my work sits behind an NDA, so this site is not a gallery. It is what I think,
        written down.
      </p>
    </div>

    <NowPanel class="lg:flex-grow" />
  </section>

  <section id="notes" class="flex flex-col">
    <div class="flex items-baseline justify-between pb-5">
      <UiMeta tag="h2">Notes</UiMeta>
      <UiMeta>{{ countLabel }}</UiMeta>
    </div>

    <NoteListItem v-for="note in notes" :key="note.slug" :note="note" />
    <UiDivider />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import UiDivider from '@/components/ui/UiDivider.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
import { useNotes } from '@/composables/useNotes'

import NoteListItem from './_components/NoteListItem.vue'
import NowPanel from './_components/NowPanel.vue'

const { publishedNotes } = useNotes()

const notes = publishedNotes
const countLabel = computed(() => `${notes.length} published`)
</script>
