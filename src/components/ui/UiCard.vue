<template>
  <div class="overflow-hidden rounded-md border border-line-strong bg-surface">
    <div v-if="$slots.header" class="border-b border-line-strong px-4 py-2.5">
      <slot name="header" />
    </div>
    <div class="px-4 py-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-t border-line-strong px-4 py-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
