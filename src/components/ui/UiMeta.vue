<template>
  <component :is="tag" class="font-mono text-meta tracking-[0.14em] text-ink-faint uppercase">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface IProps {
  tag?: 'span' | 'div' | 'h2'
}

withDefaults(defineProps<IProps>(), { tag: 'div' })
</script>
