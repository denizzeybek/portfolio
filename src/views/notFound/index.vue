<template>
  <section class="flex flex-col gap-4">
    <UiMeta>{{ t('notFound.code') }}</UiMeta>
    <h1 class="font-display text-3xl font-bold text-ink">{{ t('notFound.title') }}</h1>
    <p class="font-mono text-sm text-ink-muted">{{ t('notFound.body') }}</p>
    <UiLink :to="{ name: 'notes' }">{{ t('notFound.back') }}</UiLink>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import UiLink from '@/components/ui/UiLink.vue'
import UiMeta from '@/components/ui/UiMeta.vue'

const { t } = useI18n()
</script>
