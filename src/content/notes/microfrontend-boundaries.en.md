---
title: Where to draw a microfrontend boundary
slug: microfrontend-boundaries
date: 2026-06-05
summary: Module federation makes splitting a frontend easy, which is the problem. The boundary should follow ownership, not the folder structure.
tags: [architecture, module-federation]
readingMinutes: 7
draft: false
---

Module federation made splitting a frontend into deployable pieces a configuration exercise, and
that is precisely why so many of these architectures end up worse than the monolith they replaced.
The tooling will happily let you draw the boundary along the folder structure; the only boundary
that pays for its overhead is one that follows who owns and releases the thing.

I have worked inside a microfrontend architecture built on Webpack Module Federation, and the part I
did not expect was how little of the difficulty was technical. What is hard is everything the split
implies about how people work.

## The Tuesday test

Before anyone opens a webpack config, I ask one question about the piece they want to split out: can
it be deployed on a Tuesday afternoon, by the people who own it, without asking anyone else for
anything? Not "is it technically possible to deploy separately" — federation makes that true of
almost any folder. Can it actually go out. Does it have its own pipeline, its own version, and a
rollback that does not touch the host.

If the answer is yes, you have a boundary and the overhead you are taking on buys something real. If
the answer is no — if shipping it still means a coordinated release, a host bump, or a message asking
someone else to redeploy — you do not have a boundary. You have a build split. You have added a
request on the critical path, a version negotiation over every shared library, and a stack trace that
now stops at a module living in another repository. In exchange you have a smaller folder.

A boundary is a team contract before it is a build config, and the config is the easy part. That is
why "should this be a remote?" is rarely answerable by reading the code: the answer is in the release
process and the on-call rota.

## Federation removed the constraint, not the question

For a long time the reason not to split a frontend was that splitting was expensive: your own loader,
a fight over the router, weeks of infrastructure work to justify before a single user saw anything.
That cost was doing useful work as a filter, because only the cases with a real payoff survived the
conversation. Federation removed the cost, and with it the filter. A remote is now twenty lines of
config and a pipeline, so proposals that would never have survived a serious argument go straight
through — the folder is getting large, the build takes too long, one page wants a different framework.
Those are not architectural reasons; they are reasons that are cheap to act on now, and no tooling
will tell you the difference on your behalf.

## What arrives with the second remote

The first remote is cheap and therefore misleading. Everything expensive shows up with the second
one.

Shared dependencies stop being each team's own business. Two remotes each bringing their own Vue,
router and store library means two runtimes on one page, and for anything that carries identity — a
router, reactivity, a store, a theme provider — a second copy is a bug, not a cost. So you make them
singletons:

```ts
// webpack.config.ts — the host and every remote ship this block verbatim
shared: {
  vue: { singleton: true, requiredVersion: '^3.4.0', strictVersion: true },
  'vue-router': { singleton: true, requiredVersion: '^4.3.0', strictVersion: true },
  pinia: { singleton: true, requiredVersion: '^2.1.0', strictVersion: true },
  '@acme/ui': { singleton: true, requiredVersion: '^2.0.0' },
},
```

Read that block again. No team here can upgrade Vue, the router or the design system on its own
schedule. `strictVersion` turns a mismatch into a loud error at load time instead of a silent second
copy, which is the right setting and also the moment the architecture admits what it is. You did not
decouple the teams; you moved the coupling out of the import graph, where a compiler enforced it, into
a version range repeated across five repositories, where a human enforces it in a meeting.

The rest follows. The design system drifts: a remote built against version 2.1 of the button sits next
to a host on 2.4, and the difference is four pixels of padding nobody owns. Auth gets duplicated,
because every remote needs to know who the user is — until two refresh implementations disagree and
the user is logged out by whichever remote noticed first. Error handling goes the same way. And
debugging becomes repository archaeology: the symptom is in the host, the cause is in a remote, and
reproducing it means running three dev servers and hoping their versions agree.

None of this argues against microfrontends. It is the bill, and it arrives whether the split was
justified or not, so the split had better be buying something.

## What earns a boundary

**A different release cadence.** A checkout flow that ships twice a day and a reporting section that
ships monthly want different pipelines. Forced into one, the slow thing gates the fast one.

**A different team with its own on-call.** If a pager goes off at 3am and one group is expected to
answer for that code, that group has to be able to ship a fix without waking anyone else up. This
one justifies more remotes than all the others together.

**A genuinely separate domain.** Not a separate page — a separate domain, with its own vocabulary and
its own reasons to change. If both pieces change every time a requirement changes, they are one thing
wearing two names.

**A piece that must survive the host being rewritten.** An admin shell gets replaced every few years;
an embedded editor or a widget shipped to third parties should not be rewritten with it. Here
isolation is the point.

## What does not

"Our build is slow." Fix the build. Two slow builds plus a runtime integration step is not faster; it
just makes the slowness someone else's problem.

"The folder is big." That is a folder. A large one is a naming problem.

"We want React on this one page." Say that sentence out loud in the design review, with both bundle
sizes on the screen, and see who agrees. Sometimes people do, and then it is a real decision made in
the open. What a framework choice should not be is a side effect of a boundary justified on other
grounds.

## Contracts, not a shared store

Once the boundary is real, the next decision is how the pieces talk. My position is narrow: a
versioned props-and-events surface, owned by the remote, and nothing else.

```ts
// contracts/reports-panel.ts — owned by the remote, versioned, imported by the host
export interface ReportsPanelProps {
  readonly organisationId: string
  readonly period: { from: string; to: string }
  readonly locale: 'en' | 'tr'
}

export interface ReportsPanelEvents {
  (e: 'export-requested', format: 'csv' | 'pdf'): void
  (e: 'failed', detail: { code: string; message: string }): void
}
```

That file is the entire agreement. It can be reviewed and versioned, a breaking change to it looks
like one, and the remote can be rewritten behind it without the host noticing. Adding a field means
opening this file and arguing for it, which is the friction a boundary is supposed to have.

What teams reach for instead is a shared store:

```ts
// don't: the host and three remotes all reach into one store
import { useAppStore } from '@acme/shared-store'

const store = useAppStore()
store.filters.period = { from, to }   // who else reacts to this?
store.reports.rows = rows             // who else writes here?
```

This is convenient for about a month. Then no remote can be understood on its own, because its
behaviour depends on writes made in other repositories. The store's shape becomes an API four teams
change without review, a mutation in one remote breaks another's render, and the fix needs a
coordinated deploy. That is a distributed monolith with extra steps: the coupling of a monolith plus
the latency, versioning and debugging story of a distributed system. If two pieces need to share
mutable state that freely, they were probably never separate.

## Where it breaks

With one team, microfrontends are a cost with no payer. Every item on that bill still gets charged,
and the thing it buys — independent release by independent owners — has nobody to buy it. One team
with three remotes is one team paying distributed-system tax to talk to itself.

The shared-dependency negotiation never ends. Every major version of the framework, the router and
the design system becomes a cross-team scheduling problem, and the answer is either a lockstep upgrade nobody has time for or a runtime
tolerant of two versions, which costs bundle size and buys a class of bug that only appears in
production.

And local development gets meaningfully worse, the cost nobody puts on an architecture diagram.
Running the app means running the host plus whichever remotes you need,
hot reload gets less reliable across the boundary, and your versions are not the deployed ones. That
is a tax paid daily by everyone, including the people who never go near the boundary. I would pay it
for two teams with separate on-call. I would not pay it for a large folder.
