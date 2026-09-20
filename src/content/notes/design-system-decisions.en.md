---
title: The design-system decisions that get expensive later
slug: design-system-decisions
date: 2026-07-02
summary: Variant naming, slot boundaries and token semantics are cheap to choose and brutal to change once fifty components depend on them.
tags: [design-systems, api-design]
readingMinutes: 7
draft: false
---

Most of what goes wrong with a design system is not visual. It is API design: a `type` prop that
should have been two props, a token named after a colour instead of a role, a primitive that
accepted a slot it should have owned. None of these hurt in the first month, and all of them are
near-impossible to change once fifty components consume them.

I have built one of these: fifty-odd components adopted across three products. In every decision
below, the cheap version and the expensive version look identical in review. The difference shows
up only when something has to change.

## Booleans multiply, unions enumerate

Nobody designs a boolean button API. It accretes. Someone needs a filled button, so `primary` is
added. Someone needs a bigger one: `large`. Someone needs a quiet one on a dark panel: `ghost`.
Three one-line diffs, each obviously fine on its own.

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  primary?: boolean
  secondary?: boolean
  large?: boolean
  ghost?: boolean
}
const props = defineProps<IProps>()

const classes = computed(() => [
  props.primary && 'bg-accent text-canvas',
  props.secondary && 'border border-line-strong text-ink',
  props.ghost && 'bg-transparent text-ink-muted',
  props.large ? 'px-5 text-sm' : 'px-4 text-xs',
])
</script>
```

Four booleans is sixteen states. Somebody designed three of them. The compiler accepts all
sixteen, and what `primary ghost` renders is decided by the order the `&&` expressions happen to
sit in — an accident of how the file grew, now load-bearing, because a screen relies on it.

The union version says what is supported and nothing else.

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}
const props = withDefaults(defineProps<IProps>(), { variant: 'solid', size: 'md' })

const VARIANTS: Record<NonNullable<IProps['variant']>, string> = {
  solid: 'bg-accent text-canvas hover:bg-accent-strong',
  outline: 'border border-accent text-accent hover:bg-accent-wash',
  ghost: 'border border-line-strong text-ink hover:text-accent',
}
const SIZES: Record<NonNullable<IProps['size']>, string> = {
  sm: 'min-h-11 px-4 text-xs',
  md: 'min-h-11 px-5 text-sm',
}

const classes = computed(() => [VARIANTS[props.variant], SIZES[props.size]])
</script>
```

That is `src/components/ui/UiButton.vue` on this site, near enough verbatim. Six states, all six
drawn by somebody, and `variant="primary"` fails to compile, so the typo never reaches a
screenshot. The `Record<NonNullable<IProps['variant']>, string>` is the part I would not give up:
adding a member to the union is a type error until the lookup table has the entry, so the API and
the implementation cannot drift apart.

Booleans win by default because each arrives alone. No pull request adds sixteen states; each adds
one flag, and nobody ever holds the total.

## A token named after its colour is a colour

`grey-3` and `blue-500` record what a value looks like. `ink-muted` and `accent` record what it is
for. That distance is the difference between a theme change that edits one file and a theme change
that reads every call site in three products.

When a component says `text-grey-3`, the name has thrown the intent away. Six months later
somebody wants secondary text darker for contrast, and "which `grey-3` meant secondary text?" has
no answer in the token layer. It has to be recovered from usage: this one is muted body copy, that
one a hairline border, the third a disabled label that must not move. Nothing can script that,
because the intent was never written down. The rename is an audit.

The tokens here are `canvas`, `surface`, `line`, `ink`, `ink-muted`, `accent`, `accent-wash`. Not
one names a colour, so I can swap the whole palette in `main.css` without opening a component.

The rule is sharper than "avoid colour words": a semantic name is only useful if it means one
thing. If `accent` is the brand colour *and* the focus ring *and* the link colour, then the day
accessibility demands a higher-contrast ring, you are reading call sites again. Two roles that
share a value today are still two tokens, and the duplication is the point.

## The component everyone forks

Every library has one component that keeps getting copied into a product with three lines changed.
The reflex reading is a discipline problem: corners cut, review too soft, another reminder about
reuse. That is almost always wrong. A fork is a precise bug report: I needed to own this part of
the render and your API would not let me.

The response that feels helpful and makes things worse is a prop per case. `iconLeft`, then
`iconRight`, then `badgeText`, then `titleTooltip`, then `headerAlign`. Each is an afternoon's work
and a permanent obligation: three products may be passing it, so it can never be removed. After
two years the component is a configuration language with no grammar, half of whose props are
mutually exclusive with nothing saying so.

Slots put the boundary in the right place. The library keeps what it exists to guarantee — spacing,
border, focus, keyboard behaviour — and hands the caller the content.

```vue
<template>
  <section class="rounded-md border border-line bg-surface">
    <header class="flex items-baseline justify-between border-b border-line px-5 py-3">
      <slot name="header">
        <h3 class="m-0 text-sm text-ink">{{ title }}</h3>
      </slot>
      <slot name="actions" />
    </header>
    <div class="px-5 py-4"><slot /></div>
  </section>
</template>

<script setup lang="ts">
interface IProps {
  title?: string
}
defineProps<IProps>()
</script>
```

The `title` prop stays, because the common call should be one line. The `header` slot means the
uncommon call — a link, an icon, a truncating tooltip, a count badge — never needs the library to
learn about it. The simple case is short and the strange case is possible without a negotiation.

The hatch has a limit. A slot that lets a caller replace the focus ring or the disabled semantics
is a hole, not a hatch: slots for content and for regions, never for the behaviour the component
exists to guarantee.

## Who is allowed to override

Most libraries ship without answering this, which is itself an answer: anyone, from anywhere, with
a more specific selector. Utility CSS makes it a one-liner. `<UiButton class="bg-red-500">` works,
passes review because it is one word in a diff, and ships.

What happened is that a screen in another repository took an undeclared dependency on the button's
internals. No version number, no import, nothing to grep for from inside the library. And the
library can no longer change that background, because it cannot enumerate who leans on it.

So the line I write down is that the caller owns the box and the library owns the paint. Margin,
width, grid placement: the caller's business. Colour, radius, typography, focus ring: the
library's, and a missing variant is a pull request to the library rather than a class at the call
site. Here that is one sentence in the styling rules and a hook that rejects a raw hex
under `src/components/ui/`. You can only safely change what nobody was able to reach into.

## Shared means versioned

Three consumers do not change the code. They change who pays for a mistake. On one product a
breaking rename is an afternoon: rename, type-check, fix the call sites, done. With three it is a
task in two other teams' sprints, competing with work they already committed to, and you do not
get to schedule it. That fact is the whole of versioning policy.

Additive first, then. Add the new variant beside the old one instead of replacing it; add the new
prop with a default that preserves today's behaviour. A release nobody has to read is a release
everybody installs, and a library only delivers value at the version people are on. The
alternative sits unadopted for two quarters and ends with three products on three majors — and
three majors of one design system is three design systems.

Deprecation windows with dates, then. Mark the old prop `@deprecated` in the type, where every
editor shows it at the call site; a JSDoc tag reaches more developers than a changelog entry. Keep
it working for an agreed number of releases, and announce the version it breaks in before that
version exists. I would rather carry a dead prop for two releases than hand a team a migration it
cannot fit in — the alternative is a consumer pinning an old version and forking, which drops us
back into the previous section.

## Where it breaks

Every rule above costs somebody the thing they wanted to do quickly. A boolean is faster to add
than a variant union; a prop is less thinking than a slot with a sensible default. When a team
needs the screen on Thursday, strict APIs are friction that protects nothing yet. The protection
arrives in year two and the bill arrives in week one, which is the wrong order for getting
agreement.

A design system with two consumers is usually premature, and with one it is not a design system at
all: it is a components directory carrying a release process it does not need. The break-even is
roughly where changing a shared component means negotiating with somebody who is not in the room.
Below that line, extract on the second real duplication, not the first guess about one.

And the honest one about unions, since I argued hardest for them. A union encodes what design has
decided. If design has not decided, the union is a fiction with types around it: you invent three
variants, ship them, and find out in month four that the real axis was density, or emphasis, or
something nobody had a word for. A wrong union is a breaking change. A wrong boolean is just an
unused prop. Strict APIs make good decisions cheap to keep and bad ones expensive to leave. That
is the trade I take, and it assumes I can tell which kind I am making.
