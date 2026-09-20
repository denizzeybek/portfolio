# Anti-patterns — reject on sight

- A file over 250 lines. Split it.
- A raw hex, `rgb()` or Tailwind stock colour in a component.
- A clickable `<div>` or `<span>`, or `role="button"` on a non-button.
- `any`, `!`, or `as` used to silence the compiler.
- A new UI primitive that duplicates one in `src/components/ui/`.
- Utility classes overriding a design-system primitive's own look from the outside.
- `v-html` on anything that did not come from this repo's own markdown pipeline.
- A note that names an employer's internal detail, metric, client or screen.
- Commented-out code, or a comment that restates the line below it.
- A dependency added for something the platform already does (date formatting, fetch, uuid).
- Animation without a `motion-safe:` guard.
- Copy written as a `data-props`-style config object when it is just text in the template.
