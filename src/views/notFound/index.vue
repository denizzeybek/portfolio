<template>
  <section class="flex flex-col gap-4">
    <UiMeta>404</UiMeta>
    <h1 class="font-display text-3xl font-bold text-ink">This page does not exist.</h1>
    <p class="font-mono text-sm text-ink-muted">The link may be old, or I moved something.</p>
    <UiLink :to="{ name: 'home' }">Back to all notes</UiLink>
  </section>
</template>

<script setup lang="ts">
import UiLink from '@/components/ui/UiLink.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
</script>
