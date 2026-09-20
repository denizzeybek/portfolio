<template>
  <component :is="tag" :class="classes" :type="isButton ? type : undefined" :href="href">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
  type?: 'button' | 'submit'
  href?: string
}

const props = withDefaults(defineProps<IProps>(), {
  variant: 'solid',
  size: 'md',
  type: 'button',
  href: undefined,
})

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-sm font-mono transition-colors duration-150 no-underline'

const VARIANTS: Record<NonNullable<IProps['variant']>, string> = {
  solid: 'bg-accent text-canvas hover:bg-accent-strong',
  outline: 'border border-accent text-accent hover:bg-accent-wash',
  ghost: 'border border-line-strong text-ink hover:border-accent hover:text-accent',
}

const SIZES: Record<NonNullable<IProps['size']>, string> = {
  sm: 'min-h-11 px-4 text-xs',
  md: 'min-h-11 px-5 text-sm',
}

const isButton = computed(() => props.href === undefined)
const tag = computed(() => (isButton.value ? 'button' : 'a'))
const classes = computed(() => [BASE, VARIANTS[props.variant], SIZES[props.size]])
</script>
