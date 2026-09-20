<template>
  <footer
    id="contact"
    class="flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between"
  >
    <div>
      <p class="font-display text-xl font-medium text-ink">Hiring for a senior Vue role?</p>
      <p class="pt-2 font-mono text-[13px] text-ink-muted">
        Remote, worldwide or EMEA. Contract or full-time.
      </p>
    </div>
    <div class="flex flex-wrap gap-3">
      <UiButton variant="outline" :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</UiButton>
      <UiButton variant="ghost" :href="CONTACT.cvUrl">Download CV</UiButton>
    </div>
  </footer>
</template>

<script setup lang="ts">
import UiButton from '@/components/ui/UiButton.vue'
import { CONTACT } from '@/content/site'
</script>
