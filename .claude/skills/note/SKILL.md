---
name: note
description: Draft or revise a note in src/content/notes/. Use when writing the site's long-form technical notes, which must stay free of employer-confidential material.
---

# Note

Read `.claude/rules/content.md` first — the confidentiality rules there are hard.

## Inputs
- The topic and the author's own position on it (ask if it is not stated).
- `src/content/notes/` for tone and for what is already covered.

## Shape
- 1000–1400 words. One argument, defended, with at least two concrete examples.
- Frontmatter:
  ```yaml
  ---
  title: Migrating Vue 2 to Vue 3 without a freeze
  slug: vue-2-to-3-without-a-freeze
  date: 2026-09-21
  summary: A migration plan that ships features while it runs, and what it costs.
  tags: [vue, migration, typescript]
  readingMinutes: 4
  ---
  ```
- Structure: the problem in two sentences → why the obvious approach fails → the approach taken
  → a short concrete example with real code → the trade-off → what the author would do
  differently.

## Rules
- First person, direct, no hedging and no marketing voice.
- Every claim is either reasoned from first principles or demonstrated in the example. No
  invented metrics, no internal numbers, no employer detail.
- Code examples are written for the note, runnable, under 25 lines, TypeScript or Vue.
- No AI-essay tropes: no "In today's fast-paced world", no rhetorical question openers, no
  three-item summary that repeats the intro.
- Close with the honest limit of the approach — where it breaks down, or what it costs.

## Turkish
The `.tr.md` file is written in Turkish from the idea, never rendered out of the English one. No
inverted sentences, no calqued idioms, no English clause chains. See the Turkish section of
`.claude/rules/content.md` — it is the rule most likely to be broken.

## After writing
Update the note index if one exists, then check the reading time, the word count and that the
note names no employer alongside internal detail.
