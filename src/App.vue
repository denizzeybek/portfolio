<template>
  <div class="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-12 px-4 py-8 sm:gap-14 sm:px-12 lg:px-24">
    <AppHeader />
    <main class="flex flex-grow flex-col gap-14">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>
