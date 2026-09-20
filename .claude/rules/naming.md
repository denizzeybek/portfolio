---
paths:
  - "src/**"
---
# Naming

| Thing | Convention | Example |
|---|---|---|
| component file | `PascalCase.vue` | `UiButton.vue` |
| design-system primitive | `Ui` prefix | `UiTag.vue` |
| view entry | `index.vue` inside a feature folder | `views/notes/index.vue` |
| feature-local folder | `_` prefix | `_components/`, `_composables/` |
| composable | `useThing.ts`, returns an object | `useNotes.ts` |
| type file | `thing.types.ts` | `note.types.ts` |
| markdown note | `kebab-case.md`, dated in frontmatter | `vue-2-to-3-migration.md` |
| css token | kebab, semantic not literal | `--color-ink-muted`, never `--color-grey-3` |

- Props are camelCase in script, kebab-case in template.
- Emits are past-tense or intent-named: `select`, `dismiss`, `update:modelValue`.
- Boolean props read as a state, not a question: `disabled`, `compact` — never `isDisabled`.
