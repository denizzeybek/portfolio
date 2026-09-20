# portfolio

Deniz Zeybek's personal site: a writing-led portfolio. No client screenshots, no proprietary
product detail — the proof is the writing and the craft of the site itself.

The site is also the worked example for one of its own notes ("AI-based development"), so the
conventions here are not decoration: they are the thing being demonstrated. Keep them tight.

## Hard rules
- **Never publish employer-confidential material.** No client names tied to internal detail, no
  product screenshots, no internal metrics, no code from a private repo. Notes describe the
  author's own judgement and generic patterns. See `.claude/rules/content.md`.
- **250 lines per file, hard.** Vue SFCs, TypeScript modules, composables — all of it. The
  `check:size` script and a PreToolUse hook enforce it. Split instead of shipping a fat file.
- **No hardcoded colours, fonts or spacing scales.** Tokens live in `src/assets/main.css`;
  components use Tailwind utilities that map to them. See `.claude/rules/styling.md`.
- **Design system first.** Before writing markup, check `src/components/ui/` for an existing
  primitive. Extend it rather than forking it.
- **No hardcoded user-facing strings.** Every visible string comes from `src/locales/en.json` and
  `src/locales/tr.json`, through `t('scope.key')`. See `.claude/rules/i18n.md`.
- **TypeScript everywhere.** `lang="ts"` on every `<script setup>`, no `any`, no non-null `!`.
- **Comments:** only `// TODO:` / `// FIXME:` / `// HACK:` and lint directives. Explanation goes
  in a JSDoc block or in the note, not in line noise. See `.claude/rules/comment-policy.md`.

## Stack
- Vue 3 (`<script setup>`, Composition API) + TypeScript
- Vite 8, Tailwind CSS v4 (css-first `@theme` tokens, no `tailwind.config.js`)
- Vue Router 5, vue-i18n 11 (en + tr), `@vueuse/core`
- Vitest + `@vue/test-utils`, specs in `__tests__/` mirroring `src/`

## Layout
```
__tests__/             vitest specs, mirroring the src/ tree one for one
src/
  assets/main.css        design tokens + base layer — the single source of visual truth
  components/ui/         the design system: Ui*.vue primitives, nothing feature-specific
  components/layout/     AppHeader, AppFooter
  composables/           useXxx.ts, one concern each
  content/notes/         the notes themselves (markdown + typed frontmatter)
  locales/               en.json + tr.json — every visible string
  i18n/                  vue-i18n setup and locale resolution
  router/                routes, lazy-loaded views
  types/                 shared types
  views/                 page entries; feature-local parts in _components/ next to them
```

## Commands
```
npm run dev          # vite dev server
npm run build        # type-check + build
npm run type-check   # vue-tsc --noEmit
npm run lint         # eslint --fix
npm test             # vitest
npm run check:size   # fails on any file over 250 lines
```

## Claude Code setup in this repo
- `.claude/rules/` — the mandatory rule files; load the one matching what you are touching.
- `.claude/skills/` — `ui-component` (add a design-system primitive), `note` (draft a note).
- `.claude/agents/` — `fe-implementer` (build a view or component), `fe-reviewer` (review a diff
  against the rules).
- `.claude/hooks/` — enforce the 250-line limit and the comment policy before a write lands.
- `.claude/commands/` — `/commit`, `/ship`.

## Done means
Type-check clean, lint clean, tests pass, `check:size` passes, no new file over 250 lines, and the
page still reads correctly at 390px wide. See `.claude/rules/done-checklist.md`.
