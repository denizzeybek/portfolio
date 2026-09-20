---
paths:
  - "src/components/**"
---
# Design system

`src/components/ui/` is the design system. It is small on purpose: every primitive there must
earn its place by being used in at least two spots, or by encoding a rule that would otherwise
be retyped (focus ring, meta-label casing, prose measure).

## The primitives

| Component | Owns |
|---|---|
| `UiButton.vue` | actions; `variant` = `solid` \| `outline` \| `ghost`, `size` = `sm` \| `md` |
| `UiLink.vue` | inline and standalone links, internal (router) and external, underline behaviour |
| `UiTag.vue` | short metadata chips: stack, status, year |
| `UiCard.vue` | bordered surface with optional header and footer slots |
| `UiMeta.vue` | the uppercase monospace label used above every section |
| `UiDivider.vue` | the hairline rule between log rows and sections |
| `UiProse.vue` | long-form wrapper: measure, rhythm, heading scale, code and quote styling |

## Adding one

1. It is a primitive only if it carries no feature knowledge. Anything that knows about notes,
   the home page or routing is a feature component and belongs next to its view.
2. Props are a typed `IProps` interface with a `variant`/`size` union — not booleans multiplying
   into combinations (`primary` + `large` + `ghost` is three props too many).
3. Every visual value comes from a token. A raw hex in `src/components/ui/` fails review.
4. Slots over props for content. `default`, then named slots for regions.
5. It ships with a `.spec.ts` covering the variant matrix and one accessibility expectation
   (role, label, or focusability).
6. It stays under 250 lines, like everything else. A primitive near the limit is a sign it is
   really two primitives.

## Using one

- A view never restyles a primitive from outside with utility classes that override its look
  (`class="bg-red-500"` on a `UiButton` is a review failure). If a variant is missing, add the
  variant to the primitive.
- Layout around a primitive (margin, grid placement) is the caller's job and is fine to pass.
