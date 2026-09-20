# portfolio

Deniz Zeybek's personal site — a writing-led portfolio. Vue 3, TypeScript, Vite and Tailwind v4.

There is no project gallery here on purpose: almost everything I have built is under NDA, so the
site carries the reasoning instead of the screenshots.

## Running it

```bash
npm install
npm run dev
```

## Checks

```bash
npm run type-check   # vue-tsc
npm run lint         # eslint --fix
npm test             # vitest
npm run check:size   # fails on any src file over 250 lines
npm run build
```

## Layout

```
src/
  assets/main.css     design tokens (@theme) — the only place colours and fonts are defined
  components/ui/      the design system: UiButton, UiLink, UiTag, UiCard, UiMeta, UiDivider, UiProse
  components/layout/  AppHeader, AppFooter
  composables/        useNotes, useNoteDate
  content/notes/      the notes, markdown with typed frontmatter
  views/              home, note, about, notFound — feature-local parts in _components/
```

## Conventions

The repo is set up for agentic development, and that setup is itself the subject of one of the
notes. `CLAUDE.md` holds the hard rules; `.claude/rules/` holds one file per concern;
`.claude/hooks/` enforces the three that must not be negotiable (250-line files, token-only
colours, comment policy); `.claude/skills/` and `.claude/agents/` hold the repeatable recipes.
