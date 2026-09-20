<template>
  <section class="flex max-w-[68ch] flex-col gap-6">
    <UiMeta>About</UiMeta>
    <h1 class="font-display text-[30px] leading-tight font-bold tracking-tight text-ink sm:text-[40px]">
      Six years of Vue, mostly on things other people depend on.
    </h1>
    <UiProse>
      <p>
        I build frontends for products that outlive their first architecture: analytics dashboards,
        design systems shared across teams, and the migrations that keep them alive. Vue and
        TypeScript are where I am deepest; React is a tool I reach for, not a thing I claim.
      </p>
      <p>
        Since 2025 I have worked with coding agents every day — not as autocomplete, but as a
        teammate that needs the same things a new hire needs: a written contract, conventions it
        cannot quietly break, and a reviewer. Most of what I have learned about that is in the
        notes.
      </p>
      <p>
        I work remotely from Turkey, on GMT+3, and I am open to senior roles worldwide or across
        EMEA.
      </p>
    </UiProse>
    <div class="flex flex-wrap gap-3 pt-2">
      <UiButton variant="outline" :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</UiButton>
      <UiButton variant="ghost" :href="CONTACT.github">{{ CONTACT.githubLabel }}</UiButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from '@/components/ui/UiButton.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
import UiProse from '@/components/ui/UiProse.vue'
import { CONTACT } from '@/content/site'
</script>
