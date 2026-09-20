---
description: Stage, review and commit the current work against the project rules
---

1. `git status` and `git diff` to see the change.
2. Run `npm run type-check`, `npm run lint`, `npm test`, `npm run check:size`. Stop and report if
   anything fails — never commit on red.
3. Group the change into one concern. If it is two concerns, make two commits.
4. Write the message per `.claude/rules/commits.md`: Conventional Commit, imperative subject,
   body explaining why when the change forks or replaces an existing pattern.
5. Commit. Do not push unless asked.
