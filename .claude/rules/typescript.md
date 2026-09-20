---
paths:
  - "src/**/*.ts"
  - "src/**/*.vue"
---
# TypeScript

- **No `any`.** Not in props, not in a cast, not in a catch. `unknown` plus a narrowing guard.
- **No non-null `!`.** Narrow with `if (!x) return` or give the value a default.
- **No `as` to silence an error.** A cast is allowed only to narrow a genuine union after a
  runtime check.
- Public API of a module is explicit: exported functions declare their return type.
- `import type { … }` for types, always last in the import block.
- Interfaces are `IPascalCase` (`IProps`, `INote`), type aliases and unions are `PascalCase`.
- Discriminated unions over optional-field soup: `{ kind: 'note' } | { kind: 'project' }`.
- Content coming from markdown frontmatter is validated at the edge — parse it once into a typed
  `INote`, and let the rest of the app trust the type.
