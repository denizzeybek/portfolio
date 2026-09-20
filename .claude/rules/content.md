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

## Two languages
Every post exists as `<slug>.en.md` and `<slug>.tr.md`. Same slug, date, tags and draft flag in
both; only `title`, `summary` and the body are translated.

**The Turkish version is written, not translated.** Write the argument again in Turkish, from the
idea, and let the sentences find their own shape. Then read it aloud: if it sounds like something
rendered out of English, rewrite the paragraph.

Rules that catch the usual damage:
- **No inverted sentences.** The verb ends the sentence. `Sorun da burada: …`, never
  `Burada sorun, …`.
- **No calqued idioms.** "and not by a small margin", "burn turns", "with a straight face",
  "walls" — these have no Turkish equivalent and produce nonsense. Say the thing plainly instead.
- **No English syntax in Turkish clothes.** Long chains of nested relative clauses are English
  habits; Turkish carries the same load in two shorter sentences.
- Industry terms the local market uses in English stay in English, with Turkish suffixes:
  `agent'ın`, `type'lar`, `hook'lar`, `commit`, `build`, `design system`. Do not invent calques
  like "yapı taşı hattı".
- Read the two versions side by side at the end: same sections, same argument, same honesty about
  the trade-off. Not the same sentences.

## Shape of a note
- 1000–1400 words. Shorter than that reads like a summary of a post rather than a post: one
  argument, at least two concrete examples, and the trade-off stated in full.
- Frontmatter: `title`, `slug`, `date` (ISO), `summary` (≤ 160 chars), `tags`, `readingMinutes`.
- Code blocks are runnable and short — under 25 lines, TypeScript or Vue, no pseudo-code. Two or
  three per post: an example the reader can copy beats a paragraph describing it.
- The last section says what the author would do differently, or where the approach breaks down.
