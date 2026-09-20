---
paths:
  - "src/**/*.spec.ts"
---
# Testing

Vitest plus `@vue/test-utils`. Tests live in `__tests__/` at the repo root, mirroring `src/`
exactly: `src/components/ui/UiButton.vue` is tested by `__tests__/components/ui/UiButton.spec.ts`,
and `src/views/post/_etc/headings.ts` by `__tests__/views/post/_etc/headings.spec.ts`. A test
imports through the `@/` alias, never a relative path back into `src/`.

**Worth testing**
- Design-system primitives: the variant matrix renders, and the accessibility contract holds
  (a `UiButton` is a real button, an icon-only one has a label).
- Composables and pure helpers: `useNotes` sorting and filtering, frontmatter parsing, the
  reading-time estimate.
- Anything with branching logic that a reader cannot verify by eye.

**Not worth testing**
- Presentational markup, class strings, or that a heading contains the text you just typed.
- Router wiring, unless a guard has logic.
- Snapshots of whole pages. They fail on every design tweak and prove nothing.

Rules: no network in unit tests, no `setTimeout` waits (use fake timers), one behaviour per
`it`, and the test name says the behaviour, not the function name.
