<template>
  <section class="flex flex-col gap-10 lg:flex-row lg:gap-16">
    <div class="lg:w-[660px]">
      <UiMeta class="pb-4">{{ t('home.eyebrow') }}</UiMeta>
      <h1
        class="font-display text-[40px] leading-[1.05] font-bold tracking-tight text-ink sm:text-[58px]"
      >
        {{ t('home.headline') }}
      </h1>
      <p class="max-w-[60ch] pt-5 font-display text-xl leading-snug text-ink sm:text-2xl">
        {{ t('home.roleLine') }}
      </p>
      <p class="max-w-[60ch] pt-6 font-prose text-lg leading-relaxed text-ink sm:text-[19px]">
        {{ t('home.facts') }}
      </p>
      <p class="max-w-[60ch] pt-4 font-prose text-lg leading-relaxed text-ink sm:text-[19px]">
        {{ t('home.intro') }}
      </p>
      <p class="max-w-[60ch] pt-4 font-prose text-lg leading-relaxed text-ink sm:text-[19px]">
        {{ t('home.agents') }}
      </p>
      <p class="max-w-[60ch] pt-4 font-prose text-lg leading-relaxed text-ink-muted sm:text-[19px]">
        <i18n-t keypath="home.nda" tag="span" scope="global">
          <template #notes>
            <UiLink :to="{ name: 'blog' }">{{ t('home.ndaLink') }}</UiLink>
          </template>
        </i18n-t>
      </p>
    </div>

    <NowPanel class="lg:flex-grow" />
  </section>

  <section id="experience" class="flex flex-col">
    <div class="flex items-baseline justify-between pb-5">
      <UiMeta tag="h2">{{ t('home.experience') }}</UiMeta>
      <UiLink :to="{ name: 'blog' }" tone="quiet" :underline="false" class="font-mono text-meta">
        {{ t('home.readNotes') }}
      </UiLink>
    </div>

    <ExperienceList />
    <UiDivider />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { SITE_ORIGIN, useSeo } from '@/composables/useSeo'
import { CONTACT } from '@/content/site'
import UiDivider from '@/components/ui/UiDivider.vue'
import UiLink from '@/components/ui/UiLink.vue'
import UiMeta from '@/components/ui/UiMeta.vue'

import ExperienceList from './_components/ExperienceList.vue'
import NowPanel from './_components/NowPanel.vue'

const { t } = useI18n()

useSeo(() => ({
  title: `${t('site.name')} — ${t('site.role')}`,
  description: t('home.facts'),
  path: '/',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: t('site.name'),
    jobTitle: t('site.role'),
    url: SITE_ORIGIN,
    email: `mailto:${CONTACT.email}`,
    sameAs: [CONTACT.github, CONTACT.linkedin],
  },
}))
</script>
