<template>
  <aside class="flex flex-col gap-6 border-line lg:border-l lg:pl-8">
    <div>
      <UiMeta class="pb-2.5">Now</UiMeta>
      <p class="font-mono text-[13px] leading-relaxed text-ink">
        {{ NOW.role }}
        <span class="block text-accent">{{ NOW.availability }}</span>
      </p>
    </div>

    <div>
      <UiMeta class="pb-2.5">Working with</UiMeta>
      <p class="font-mono text-[13px] leading-7 text-ink">
        <span v-for="line in NOW.stack" :key="line" class="block">{{ line }}</span>
      </p>
    </div>

    <div>
      <UiMeta class="pb-2.5">Elsewhere</UiMeta>
      <p class="flex flex-col gap-1.5 font-mono text-[13px]">
        <UiLink :href="CONTACT.github">{{ CONTACT.githubLabel }}</UiLink>
        <UiLink :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</UiLink>
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import UiLink from '@/components/ui/UiLink.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
import { CONTACT, NOW } from '@/content/site'
</script>
