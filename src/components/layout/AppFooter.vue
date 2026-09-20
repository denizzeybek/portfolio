<template>
  <footer id="contact" class="flex flex-col gap-8 border-t border-line pt-6">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-display text-xl font-medium text-ink">{{ t('contact.title') }}</p>
        <p class="pt-2 font-mono text-[13px] text-ink-muted">{{ t('contact.subtitle') }}</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <UiButton variant="outline" :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</UiButton>
        <UiButton variant="ghost" :href="CONTACT.cvUrl">{{ t('contact.downloadCv') }}</UiButton>
      </div>
    </div>

    <dl class="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="detail in details" :key="detail.label">
        <dt class="font-mono text-meta tracking-[0.14em] text-ink-faint uppercase">
          {{ detail.label }}
        </dt>
        <dd class="m-0 pt-1.5 font-mono text-[13px] text-ink">
          <UiLink v-if="detail.href" :href="detail.href">{{ detail.value }}</UiLink>
          <span v-else>{{ detail.value }}</span>
        </dd>
      </div>
    </dl>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import UiButton from '@/components/ui/UiButton.vue'
import UiLink from '@/components/ui/UiLink.vue'
import { CONTACT } from '@/content/site'

const { t } = useI18n()

const details = computed(() => [
  { label: t('contact.based'), value: t('contact.locationValue') },
  { label: t('contact.availability'), value: t('contact.availabilityValue') },
  { label: t('contact.contract'), value: t('contact.contractValue') },
  { label: t('contact.languages'), value: t('contact.languagesValue') },
  { label: t('contact.education'), value: t('contact.educationValue') },
  { label: 'LinkedIn', value: CONTACT.linkedinLabel, href: CONTACT.linkedin },
  { label: 'GitHub', value: CONTACT.githubLabel, href: CONTACT.github },
  { label: t('contact.email'), value: CONTACT.email, href: `mailto:${CONTACT.email}` },
])
</script>
