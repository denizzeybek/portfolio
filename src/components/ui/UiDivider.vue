<template>
  <hr :class="['border-0 border-t', strong ? 'border-line-strong' : 'border-line']" />
</template>

<script setup lang="ts">
interface IProps {
  strong?: boolean
}

withDefaults(defineProps<IProps>(), { strong: false })
</script>
