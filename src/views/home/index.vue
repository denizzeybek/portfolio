<template>
  <section class="flex flex-col gap-10 lg:flex-row lg:gap-16">
    <div class="lg:w-[660px]">
      <UiMeta class="pb-4">{{ t('home.eyebrow') }}</UiMeta>
      <h1
        class="font-display text-[34px] leading-[1.08] font-bold tracking-tight text-ink sm:text-[52px]"
      >
        {{ t('home.headline') }}
      </h1>
      <p class="max-w-[60ch] pt-6 font-prose text-lg leading-relaxed text-ink sm:text-[19px]">
        {{ t('home.intro') }}
      </p>
      <p class="max-w-[60ch] pt-4 font-prose text-lg leading-relaxed text-ink sm:text-[19px]">
        {{ t('home.agents') }}
      </p>
      <p class="max-w-[60ch] pt-4 font-prose text-lg leading-relaxed text-ink-muted sm:text-[19px]">
        <i18n-t keypath="home.nda" tag="span" scope="global">
          <template #notes>
            <UiLink :to="{ name: 'notes' }">{{ t('home.ndaLink') }}</UiLink>
          </template>
        </i18n-t>
      </p>
    </div>

    <NowPanel class="lg:flex-grow" />
  </section>

  <section id="experience" class="flex flex-col">
    <div class="flex items-baseline justify-between pb-5">
      <UiMeta tag="h2">{{ t('home.experience') }}</UiMeta>
      <UiLink :to="{ name: 'notes' }" tone="quiet" :underline="false" class="font-mono text-meta">
        {{ t('home.readNotes') }}
      </UiLink>
    </div>

    <ExperienceList />
    <UiDivider />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import UiDivider from '@/components/ui/UiDivider.vue'
import UiLink from '@/components/ui/UiLink.vue'
import UiMeta from '@/components/ui/UiMeta.vue'

import ExperienceList from './_components/ExperienceList.vue'
import NowPanel from './_components/NowPanel.vue'

const { t } = useI18n()
</script>
