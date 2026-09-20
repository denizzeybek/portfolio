---
title: Setting up a project so an AI can actually build it
slug: ai-assisted-project-setup
date: 2026-09-20
summary: The first two days of a full-stack project decide how useful an agent will be on it. Here is what I build before any feature.
tags: [ai-assisted, openapi, typescript]
readingMinutes: 5
---

On a recent full-stack project I spent the first two days writing no features at all. I generated
a TypeScript client from the backend's OpenAPI document, turned the compiler up as far as it would
go, and wrote the team's conventions down as files an agent reads on its own. Everything after
that moved faster, and not by a small margin.

## Why starting with the feature fails

The tempting order is to open the ticket and let the agent work from the endpoint documentation.
It writes a fetch call, guesses the field names, guesses whether the list comes back bare or
wrapped in an envelope, and guesses the enum members. Every guess is plausible. That is the
problem: plausible wrong code does not fail loudly, it fails in the browser three screens later,
and the only detector in the loop is me reading the diff. The agent is fast at producing work and
has no way to check it, so I become the type system. That is the worst possible division of
labour, and it gets worse as the codebase grows.

## The generated client is the first commit

So the first thing built is the API client, before any view exists. The backend publishes
`openapi.json`; a generator turns it into types and a typed fetch client in one small package.
The rule on top of it matters more than the generator: nothing outside that package calls the
network. No `fetch` in a component, no ad-hoc axios instance in a store. Every call is a named
function in one thin module.

```ts
import createClient from 'openapi-fetch'

import type { paths } from './schema'

const api = createClient<paths>({ baseUrl: import.meta.env.VITE_API_URL })

export async function getTimeEntries(weekStart: string) {
  const { data, error } = await api.GET('/time-entries', {
    params: { query: { weekStart } },
  })
  if (error) throw new Error(error.title)
  return data.items
}
```

Twelve lines, and they change the economics of the whole project. A renamed field is now a
compile error at the call site instead of an `undefined` in a demo. An agent asked to add a
filter can read `schema.d.ts` and see exactly which query parameters exist, so it stops inventing
them. And when the backend ships a breaking change, regenerating produces a list of errors that
is, in effect, the migration plan.

## Strict types are the feedback loop

A coding agent is only as good as the signal it gets after each edit. Strictness is that signal.
No `any`, no non-null assertions, unchecked index access on, exact optional property types on,
unused locals treated as errors. Then the agent can run the type-checker and the unit tests
itself, read the failures, and fix them without asking. My experience is that the ratio of
useful-to-wasted turns tracks almost directly with how fast and how specific that loop is: a
failure that names the file, the line and the expected type produces a correct second attempt,
while "something is undefined at runtime" produces guesswork.

## Conventions as files, not as prompt text

The last piece is writing down how the codebase works somewhere the agent reads every time, not
in a prompt I retype. I split it four ways, and the split is the useful part.

- **Rules** are preferences with reasons: naming, component shape, what a note may contain. The
  model weighs them. They belong in short files scoped by path glob, so only the relevant one
  loads.
- **Hooks** are walls. A file over 250 lines, a raw hex colour, a narrating `//` comment: these
  are rejected mechanically before the write lands. No negotiation, no politeness, no reliance on
  the model remembering.
- **Skills** are procedures. "How a design-system primitive is added here" is six steps and a
  checklist; written once, it is followed the same way every time.
- **Agents** are roles with narrow tool sets. An implementer that writes, a reviewer that only
  reads and reports. Splitting them stops the same context from both producing work and
  approving it.

The distinction I would defend hardest is rules versus hooks. Anything I would reject in review
every single time should not be a rule, because a rule is advice and advice gets weighed against
other advice. It should be a hook, because a hook is a fact about the repository.

## Where it breaks

The honest cost is the two days. On a throwaway prototype you will never recover them, and I have
skipped all of this on week-long work without regret. The break-even is somewhere around a
codebase that two or more people will keep touching for a quarter.

The generated client inherits the schema's lies with a completely straight face. A field the
backend can null but marks required, a status modelled as `string` instead of a union: the types
now assert something false, and they assert it more convincingly than handwritten ones would.
Generation makes the frontend's safety a function of someone else's spec discipline, which is a
real dependency, not a free win.

Hooks tuned too tight burn turns. A hard line limit met by a good 280-line module produces a bad
split into two files that do not deserve separate names. I now add a hook after I have seen the
mistake twice, not in anticipation of it.

And strict types only prove the shapes are right. They say nothing about whether the week starts
on Monday, whether the totals should round, or whether any of it was worth building. That part
has not been delegated and, so far, does not look like it will be.
