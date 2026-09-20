---
name: ui-component
description: Add or change a design-system primitive in src/components/ui/. Use when a view needs a button, tag, card, link, meta label or prose wrapper that does not exist yet, or when an existing primitive needs a new variant.
---

# Design-system primitive

Read `.claude/rules/design-system.md`, `.claude/rules/vue-components.md` and
`.claude/rules/styling.md` first. Then:

1. **Check it does not exist.** List `src/components/ui/`. If something is 80% right, add a
   variant to it instead of a new file, and say so in the commit body.
2. **Decide it is a primitive.** No feature knowledge, no router awareness beyond `UiLink`, no
   content. Otherwise it belongs beside its view in `_components/`.
3. **Write the SFC** in this shape:

```vue
<template>
  <button :class="classes" :type="type" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
  type?: 'button' | 'submit'
}

const props = withDefaults(defineProps<IProps>(), {
  variant: 'solid',
  size: 'md',
  type: 'button',
})

const classes = computed(() => [BASE, VARIANTS[props.variant], SIZES[props.size]])
</script>
```

   - Variant and size maps are `const` records above the component or in `./_etc/`, keyed by the
     union — never an if-chain in the template.
   - Every class resolves to a token. A raw hex is blocked by a hook.
4. **Write `<Name>.spec.ts` beside it**: one case per variant, one accessibility expectation
   (it renders a real `<button>`, an icon-only variant requires `aria-label`).
5. **Stay under 250 lines.** Near the limit means it is two primitives.
6. Run `npm run type-check && npm test && npm run check:size`.
