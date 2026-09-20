---
description: Full pre-release check, then build
---

1. `npm run type-check && npm run lint && npm test && npm run check:size`.
2. `npm run build`.
3. Walk `.claude/rules/done-checklist.md` and report each item as pass or fail.
4. Report the bundle size and anything that grew unexpectedly. Do not deploy.
