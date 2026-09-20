---
title: The design-system decisions that get expensive later
slug: design-system-decisions
date: 2026-07-02
summary: Variant naming, slot boundaries and token semantics are cheap to choose and brutal to change once fifty components depend on them.
tags: [design-systems, api-design]
readingMinutes: 5
draft: true
---

Most of what goes wrong with a design system is not visual. It is API design: a `type` prop that
should have been two props, a token named after a colour instead of a role, a primitive that
accepted a slot it should have owned. None of these hurt in the first month, and all of them are
near-impossible to change once fifty components consume them.
