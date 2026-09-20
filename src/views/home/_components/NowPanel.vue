<template>
  <aside class="flex flex-col gap-6 border-line lg:border-l lg:pl-8">
    <div>
      <UiMeta class="pb-2.5">{{ t('now.title') }}</UiMeta>
      <p class="font-mono text-[13px] leading-relaxed text-ink">
        {{ t('now.role') }}
        <span class="block text-accent">{{ t('now.availability') }}</span>
      </p>
    </div>

    <div>
      <UiMeta class="pb-2.5">{{ t('now.workingWith') }}</UiMeta>
      <p class="font-mono text-[13px] leading-7 text-ink">
        <span v-for="line in STACK" :key="line" class="block">{{ line }}</span>
      </p>
    </div>

    <div>
      <UiMeta class="pb-2.5">{{ t('now.elsewhere') }}</UiMeta>
      <p class="flex flex-col gap-1.5 font-mono text-[13px]">
        <UiLink :href="CONTACT.github">{{ CONTACT.githubLabel }}</UiLink>
        <UiLink :href="CONTACT.linkedin">{{ CONTACT.linkedinLabel }}</UiLink>
        <UiLink :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</UiLink>
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import UiLink from '@/components/ui/UiLink.vue'
import UiMeta from '@/components/ui/UiMeta.vue'
import { CONTACT, STACK } from '@/content/site'

const { t } = useI18n()
</script>
