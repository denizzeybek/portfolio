---
paths:
  - "src/**/*.vue"
  - "src/assets/*.css"
---
# Styling

Tailwind v4, css-first. There is no `tailwind.config.js`; the theme lives in
`src/assets/main.css` under `@theme`.

## Tokens are the only source of colour

| Use | Token utility |
|---|---|
| page background | `bg-canvas` |
| panel / card | `bg-surface`, `bg-surface-raised` |
| hairline / border | `border-line`, `border-line-strong` |
| body text | `text-ink` |
| secondary text | `text-ink-muted` |
| timestamps, counters | `text-ink-faint` |
| accent, active state | `text-accent`, `border-accent`, `bg-accent-wash` |

Forbidden in components: raw hex (`#0b0c0b`), `rgb()`, `hsl()`, Tailwind's stock palette
(`text-gray-400`, `bg-zinc-900`), and arbitrary values (`text-[#8fd6b4]`, `p-[13px]`).
If a value is missing, add a token to `@theme` and use it.

## Type

- `font-mono` — meta labels, timestamps, counters, code. The site's default.
- `font-display` — headings and UI.
- `font-prose` — long-form note body only. Measure stays at `max-w-[68ch]`.

Three faces, no more. Never `Inter`, `Roboto` or `Arial`.

## Layout

- Flex and grid with `gap`. No margin stacks to fake spacing between siblings.
- Spacing uses the default scale (`p-4`, `gap-6`). No arbitrary pixel values.
- The page works at 390px wide with a 16px gutter and no horizontal scroll. Check every view.

## Motion

- Transitions are 150–250ms on `opacity`, `transform`, `border-color` and `color` only.
- Everything that moves sits behind `motion-safe:`; `prefers-reduced-motion` gets the static
  version, not a slower one.
