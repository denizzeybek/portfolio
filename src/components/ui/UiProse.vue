<template>
  <div class="ui-prose max-w-[68ch] font-prose text-lg leading-[1.75] text-ink">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/*
 * The note body arrives as rendered markdown, so its elements cannot carry utility
 * classes. Everything here resolves to a token from src/assets/main.css.
 */
.ui-prose :deep(h2) {
  margin: 2.5rem 0 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}

.ui-prose :deep(h3) {
  margin: 2rem 0 0;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-ink);
}

.ui-prose :deep(p) {
  margin: 0.875rem 0 0;
  color: var(--color-ink);
}

.ui-prose :deep(ul),
.ui-prose :deep(ol) {
  margin: 0.875rem 0 0;
  padding-left: 1.25rem;
}

.ui-prose :deep(li) {
  margin-top: 0.375rem;
}

.ui-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.ui-prose :deep(a:hover) {
  color: var(--color-accent-strong);
}

.ui-prose :deep(blockquote) {
  margin: 1.5rem 0 0;
  border-left: 2px solid var(--color-accent);
  padding: 0.25rem 0 0.25rem 1.25rem;
  font-style: italic;
  color: var(--color-ink);
}

.ui-prose :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-accent-strong);
}

.ui-prose :deep(pre) {
  margin: 1.375rem 0 0;
  overflow-x: auto;
  border: 1px solid var(--color-line-strong);
  border-radius: 4px;
  background-color: var(--color-surface);
  padding: 1rem;
}

.ui-prose :deep(pre code) {
  font-size: 0.8125rem;
  line-height: 1.75;
  color: var(--color-ink);
}

.ui-prose :deep(strong) {
  font-weight: 500;
  color: var(--color-accent-strong);
}

.ui-prose :deep(hr) {
  margin: 2rem 0 0;
  border: 0;
  border-top: 1px solid var(--color-line);
}
</style>
