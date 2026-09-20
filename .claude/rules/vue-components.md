---
paths:
  - "src/**/*.vue"
---
# Vue components

Hard rules for every `.vue` file. Component review starts here.

## 1. File shell

- Order: `<template>` → `<script setup lang="ts">` → `<style scoped>` (style only when a token
  cannot express it — almost never).
- `lang="ts"` is mandatory. A plain `<script>` fails review.
- One component per file, `PascalCase.vue`, name matches the file.

## 2. Size limit — 250 lines, hard

Counted on the whole SFC. A PreToolUse hook blocks a write that crosses it, and
`npm run check:size` fails the build. When a file approaches the limit, split:

1. Template too big → child components in `./_components/` next to the parent.
2. Script too big → a composable in `src/composables/` (shared) or `./_composables/` (local).
3. Repeated blocks → `v-for` plus a small item component.
4. Types too big → `src/types/` or `./_etc/<thing>.ts`.

Never ship the fat version "for now".

## 3. Folder layout around a view

```
src/views/<feature>/
  index.vue          page entry
  _components/       feature-local children
  _composables/      feature-local useXxx.ts
  _etc/              feature-local types and constants
```

Do not invent `utils/`, `hooks/` or `helpers/` when one of these already fits.

## 4. Before you write, search

| Before adding… | Look in |
|---|---|
| a button, tag, link, card | `src/components/ui/` |
| layout chrome | `src/components/layout/` |
| a formatting helper | `src/composables/` |
| a colour, font or radius | `src/assets/main.css` (`@theme`) |

If an existing primitive is 80% right, extend it. Forking one needs a line in the commit body
saying why.

## 5. Template

Read top-down: wrapper → loading/empty state → header → content → footer → portaled UI.

- Key every `v-for` with a stable id, never the index unless the list is static.
- No `v-if` and `v-for` on the same element; wrap in `<template v-if>`.
- No complex expressions inline — move to a `computed`.
- No inline `style="…"`; classes only, and they resolve to tokens.
- Semantic elements: a real `<button>`, `<a href>`, `<nav>`, `<article>`. Never a clickable
  `<div>` — the keyboard has to reach everything.
- Icon-only controls carry `aria-label`.

## 6. `<script setup>` order

Mandatory, top to bottom:

```ts
// 1. imports: vue / vue-router → third party → @/ aliases → relative → type-only last
// 2. interfaces & types
// 3. defineProps
// 4. defineEmits
// 5. composables
// 6. refs / reactive state
// 7. computed
// 8. functions (arrow only)
// 9. watch / lifecycle
// 10. defineExpose (rare)
```

- Props and emits are typed with an interface (`IProps`, `IEmits`), never the object literal form.
- `withDefaults` for optional props; no default object literals scattered in the template.
- Functions are `const fn = () => {}`. No `function` declarations in setup.

## 7. Accessibility, non-negotiable

- Text contrast ≥ 4.5:1 against its background (≥ 3:1 at 24px and above). The muted token
  (`text-ink-muted`) is the floor — never invent a fainter grey for body copy.
- Touch targets ≥ 44px.
- `prefers-reduced-motion` respected wherever something moves.
