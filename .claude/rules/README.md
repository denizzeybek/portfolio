# Rules

Machine-readable project rules for Claude Code. `CLAUDE.md` at the repo root links here.

| File | Scope |
|---|---|
| [vue-components.md](./vue-components.md) | SFC shell, 250-line limit, `<script setup>` order, template rules |
| [design-system.md](./design-system.md) | When a `Ui*` primitive is required, how to add one |
| [styling.md](./styling.md) | Tailwind v4 tokens, forbidden raw values, dark-first palette |
| [typescript.md](./typescript.md) | No `any`, no `!`, explicit public APIs, type-only imports |
| [naming.md](./naming.md) | Files, folders, composables, props, emits |
| [content.md](./content.md) | What a note may and may not say — confidentiality first |
| [comment-policy.md](./comment-policy.md) | Allowed `//` comments |
| [anti-patterns.md](./anti-patterns.md) | Reject on sight |
| [testing.md](./testing.md) | What earns a test and what does not |
| [commits.md](./commits.md) | Conventional Commits |
| [done-checklist.md](./done-checklist.md) | Verify before calling a task done |

## How to use them
1. Read `CLAUDE.md` first for architecture and stack.
2. Load the rule file matching the concern you are touching.
3. Every rule is mandatory unless the user overrides it in conversation.
4. On conflict, the more specific file wins.
