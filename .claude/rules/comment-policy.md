---
paths:
  - "src/**"
  - "scripts/**"
---
# Comment policy

Allowed `//` comments:

- `// TODO: <real next step>`
- `// FIXME: <what is broken>`
- `// HACK: <why this is here and what would replace it>`
- lint and compiler directives: `// eslint-disable-next-line …`, `// @ts-expect-error <reason>`

Everything else is noise and is blocked by the comment-policy hook. Explanation that earns its
place goes in a JSDoc block above the thing:

```ts
/** Parses frontmatter once at build time so views can trust INote. */
```

Never narrate the obvious (`// set the title`), never leave commented-out code, never leave a
comment that repeats the function name.
