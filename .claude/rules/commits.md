# Commits

Conventional Commits, imperative subject, ≤ 72 chars, no trailing period.

```
feat(ui): add UiTag with stack and status variants
fix(notes): keep code blocks from overflowing on mobile
refactor(home): split the log section out of index.vue
docs(claude): document the 250-line rule
chore(deps): bump vite to 8.3
```

- Scope is the folder or feature: `ui`, `notes`, `home`, `router`, `claude`, `deps`.
- Body explains why, not what, and is required when the change forks or replaces an existing
  pattern.
- One concern per commit. A design change and a refactor are two commits.
