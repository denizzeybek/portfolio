<template>
  <img :src="src" :alt="alt" width="18" height="12" class="inline-block rounded-[1px]" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Locale } from '@/i18n'

interface IProps {
  locale: Locale
  alt?: string
}

const props = withDefaults(defineProps<IProps>(), { alt: '' })

const src = computed(() => `/flags/${props.locale}.svg`)
</script>
