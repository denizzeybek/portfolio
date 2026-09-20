<template>
  <header class="flex items-baseline justify-between border-b border-line pb-4">
    <RouterLink to="/" class="font-display text-[15px] font-bold tracking-tight text-ink no-underline">
      Deniz Zeybek
    </RouterLink>
    <nav class="flex gap-5 font-mono text-xs sm:gap-7">
      <UiLink to="/" tone="quiet" :underline="false">Notes</UiLink>
      <UiLink to="/about" tone="quiet" :underline="false">About</UiLink>
      <UiLink href="#contact" tone="quiet" :underline="false">Contact</UiLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import UiLink from '@/components/ui/UiLink.vue'
</script>
