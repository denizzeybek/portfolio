---
paths:
  - "src/content/**"
---
# Content rules

The notes are the substance of this site. They are also the biggest risk: the author's work is
almost entirely under NDA.

## Never
- Name an employer alongside internal detail: architecture, metrics, incidents, roadmap, clients.
- Reproduce code, screenshots, schemas or copy from a private repo.
- Quote internal numbers ("we cut load time by X%", "N enterprise clients") as evidence.
- Describe a specific product screen closely enough to identify it.

## Always
- Write from the author's own judgement: the decision, the trade-off, what he would do again.
- Use invented-but-honest examples built for the note, in this repo, with fake data.
- Keep employers as context only, the way a CV states them: role and period, nothing more.
- Prefer a generic pattern ("a timesheet-shaped app with a generated API client") over a
  recognisable one.

## Shape of a note
- 600–900 words, one argument, a concrete example, a stated trade-off.
- Frontmatter: `title`, `slug`, `date` (ISO), `summary` (≤ 160 chars), `tags`, `readingMinutes`.
- Code blocks are runnable and short — under 25 lines, TypeScript or Vue, no pseudo-code.
- The last section says what the author would do differently, or where the approach breaks down.
