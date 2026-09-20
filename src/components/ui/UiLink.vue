<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
  </RouterLink>
  <a v-else :href="href" :class="classes" :rel="external ? 'noreferrer' : undefined">
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { RouteLocationRaw } from 'vue-router'

interface IProps {
  to?: RouteLocationRaw
  href?: string
  tone?: 'accent' | 'quiet'
  underline?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  to: undefined,
  href: undefined,
  tone: 'accent',
  underline: true,
})

const TONES: Record<NonNullable<IProps['tone']>, string> = {
  accent: 'text-accent hover:text-accent-strong',
  quiet: 'text-ink-muted hover:text-accent',
}

const external = computed(() => props.href?.startsWith('http') ?? false)

const classes = computed(() => [
  'transition-colors duration-150',
  TONES[props.tone],
  props.underline ? 'underline decoration-accent/35 underline-offset-4' : 'no-underline',
])
</script>
