<template>
  <aside class="flex shrink-0 flex-col gap-6 lg:w-44">
    <UiLink :to="{ name: 'home' }" tone="quiet" :underline="false" class="font-mono text-xs">
      ← all notes
    </UiLink>

    <div>
      <UiMeta class="pb-2">Published</UiMeta>
      <p class="font-mono text-xs text-ink">{{ publishedAt }}</p>
    </div>

    <div>
      <UiMeta class="pb-2">Reading</UiMeta>
      <p class="font-mono text-xs text-ink">{{ note.readingMinutes }} minutes</p>
    </div>

    <div v-if="headings.length > 0" class="hidden lg:block">
      <UiMeta class="pb-2">On this page</UiMeta>
      <nav class="flex flex-col gap-2 font-mono text-xs">
        <UiLink v-for="heading in headings" :key="heading.id" :href="`#${heading.id}`" tone="quiet">
          {{ heading.text }}
        </UiLink>
      </nav>
    </div>

    <div class="flex flex-wrap gap-2">
      <UiTag v-for="tag in note.tags" :key="tag">{{ tag }}</UiTag>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import UiLink from '@/components/ui/UiLink.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
import UiTag from '@/components/ui/UiTag.vue'
import { formatNoteDate } from '@/composables/useNoteDate'

import type { INoteHeading } from '../_etc/note.types'
import type { INote } from '@/types/note.types'

interface IProps {
  note: INote
  headings: INoteHeading[]
}

const props = defineProps<IProps>()

const publishedAt = computed(() => formatNoteDate(props.note.date, 'long'))
</script>
