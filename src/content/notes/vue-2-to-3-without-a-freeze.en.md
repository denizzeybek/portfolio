---
title: Migrating Vue 2 to Vue 3 without a freeze
slug: vue-2-to-3-without-a-freeze
date: 2026-08-14
summary: A migration that keeps shipping features while it runs, why the big-bang branch loses, and what the parallel-build approach costs.
tags: [vue, migration]
readingMinutes: 7
draft: false
---

Every Vue 2 migration plan I have been handed started with the same sentence: freeze feature work
for a sprint and cut over. That plan has never once survived contact with a product roadmap, and
the long-lived migration branch it produces rots faster than the codebase it is trying to replace.
The version I would defend runs the two builds side by side and moves one route at a time, which
is slower on paper and finishes sooner in practice.

I have led exactly this migration on a product with a shared component library, which is the
configuration that makes the ordering question interesting. Everything imports the library, and the
library imports things that have their own opinions about which major version of Vue exists.

## Why the freeze loses

The freeze does not get rejected because the people funding the work are short-sighted. It gets
rejected because it is a bad bet, and they can see that without knowing any Vue. A big-bang rewrite
puts months between two working states. During those months there is nothing to demo, nothing to
release, and no way to tell a 40% done branch from a 70% done one — the only signal available is
somebody's estimate of their own remaining work, which is the least reliable number in software.

The technical failure is worse than the political one. A migration branch that lives for three
months accumulates conflicts with a mainline that has kept moving, and each conflict is between code
you rewrote and code a colleague wrote afterwards in a file you no longer recognise. Resolving those
is not migration work. It is archaeology, and it produces the subtle kind of bug: a prop renamed on
one side of the merge and not the other, in a component nobody opens until a customer does.

A branch also cannot be de-risked incrementally. The thing that actually blows a Vue 3 schedule is
never the components. It is the one dependency that never shipped a Vue 3 version. On a branch you
find it in week six, with four hundred commits behind you and no way to ship any of them.

## One way to write a component, agreed before the first file moves

The incremental path means running both APIs in the same repository for a while. That period is
survivable, but it costs discipline, and the discipline has to be settled before the first file
moves rather than negotiated per pull request.

The agreement I would insist on is three lines long. New components are written in `<script setup>`
with TypeScript, with no exception for small ones. A component you touch for a feature gets
converted in that pull request if it is a leaf, and gets left alone if it is not — a drive-by
migration of a widely imported component is how a two-day feature turns into a branch that four
people have to review. Everything else stays in the Options API until its turn comes up in the plan.

Written down like that it is a rule file and a lint rule, not a conversation. The reason to be this
rigid is that the alternative is not flexibility, it is two house styles that both look correct to a
new hire. I have read codebases where the migration finished two years earlier and you can still
tell which files were written during it.

## Order: the library first, leaves next, shells last

The instinct is to start with the app shell, because the shell feels like the foundation. It is the
opposite of where to start. The shell is where every assumption in the application meets: the
router, the global state, the layout, the plugins. Migrating it first means migrating all of those
at once, with nothing underneath you yet stable.

The order comes out of the import graph instead. Sort by inbound imports and migrate ascending. The
shared component library goes first, because every route depends on it and nothing else can move
until it can be consumed from a Vue 3 context. Then leaf routes: a settings page, a report screen,
the kind of view that imports plenty and is imported by nothing. Each one is a self-contained
proof, reviewable by one person and releasable on its own. The shells go last, once the layer
beneath them has stopped moving.

The corollary is worth stating plainly, because enthusiasm keeps violating it: anything with a lot
of inbound imports is migrated last, not first. A base button used in three hundred places is not a
good warm-up exercise. It is the change that touches three hundred files, and you want to make it
when the target style is already settled and proven somewhere smaller.

## The components are the easy half

Converting the Options API to `<script setup>` is mechanical enough to be pleasant. A small total,
before:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    lines: { type: Array as () => { amount: number }[], required: true },
    currency: { type: String, default: 'EUR' },
  },
  computed: {
    total(): number {
      return this.lines.reduce((sum, line) => sum + line.amount, 0)
    },
  },
})
</script>

<template>
  <output>{{ total.toFixed(2) }} {{ currency }}</output>
</template>
```

And after:

```vue
<script setup lang="ts">
import { computed } from 'vue'

type Line = { amount: number }

const props = withDefaults(defineProps<{ lines: Line[]; currency?: string }>(), {
  currency: 'EUR',
})

const total = computed(() => props.lines.reduce((sum, line) => sum + line.amount, 0))
</script>

<template>
  <output>{{ total.toFixed(2) }} {{ currency }}</output>
</template>
```

Shorter, and the props are a real type instead of a runtime declaration with a cast bolted onto it.
Two hundred components of that shape are a week of unexciting work a reviewer can check by eye. If
your migration estimate is dominated by this part, the estimate is wrong.

## The ecosystem is the schedule

What takes the time is everything around the components. State management is the largest piece: a
Vuex store with namespaced modules, string-keyed mutations and getters typed by hope becomes a set
of Pinia stores the compiler can see through.

```ts
import type { Module } from 'vuex'

interface State { items: Line[] }

export const invoice: Module<State, unknown> = {
  namespaced: true,
  state: () => ({ items: [] }),
  getters: {
    total: (state) => state.items.reduce((sum, line) => sum + line.amount, 0),
  },
  mutations: {
    setItems(state, items: Line[]) { state.items = items },
  },
  actions: {
    async load({ commit }) { commit('setItems', await fetchLines()) },
  },
}
```

The Pinia equivalent is the same behaviour with the indirection removed:

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useInvoiceStore = defineStore('invoice', () => {
  const items = ref<Line[]>([])
  const total = computed(() => items.value.reduce((sum, line) => sum + line.amount, 0))

  async function load() {
    items.value = await fetchLines()
  }

  return { items, total, load }
})
```

`dispatch('invoice/load')` was a string the compiler never checked. `useInvoiceStore().load()` is a
function call with a type. That is the whole argument for doing the store properly rather than
shimming Vuex into Vue 3 and moving on.

Next to state there is the build, which stops being a config file and becomes a piece of work in its
own right; the component library's own dependencies, which have to be migrated before the library
can be; and the real risk, the library that never shipped a Vue 3 version at all. There are three
answers to that one: replace it, fork it, or write the part of it you actually use. All three are
measured in weeks. Which is why the audit of every Vue-coupled entry in `package.json` belongs in
week one, before any component moves, while the answer can still change the plan.

## Types and tests are what make it safe rather than hopeful

TypeScript is what turns this from a careful effort into a checkable one. A renamed prop, a changed
emit signature, a getter that moved out of Vuex: the compiler finds every call site, including the
ones a grep would never match and the ones in a component nobody has opened this year. Running the
same migration on an untyped codebase means doing the work with `git grep` and a promise, and the
promise is the part that fails.

Tests earn their place here more than in ordinary feature work. The useful ones are component tests
written against behaviour rather than internals: mount it, pass props, assert the rendered output
and the emitted events. A test at that level does not care which API the component uses internally,
which means the same test passes before and after the conversion. That is the whole point. It is
what lets you move a file and know, instead of moving a file and hoping somebody clicks through the
flow before release.

## Where it breaks

The double maintenance period is real and nobody enjoys it. For a stretch of months you have two
component styles, possibly two state libraries, and a build that has to serve both. A fix in a
shared behaviour occasionally gets written twice. That is the price of never being unable to ship,
and it is a price, not a footnote.

The estimate will be wrong, and it will be wrong on the ecosystem part. The component count is
knowable and estimates well. The number of weeks the one abandoned dependency will cost is not
knowable until somebody has spent two days inside it. I would now schedule that investigation
first, deliberately, and treat every number produced before it as a guess.

And the discipline problem does not solve itself. A team that cannot agree on one component style
will produce a codebase with two, and the migration will be the excuse rather than the cause. If
that agreement is not reachable in a meeting before the work starts, the migration is not the
problem worth solving this quarter.
