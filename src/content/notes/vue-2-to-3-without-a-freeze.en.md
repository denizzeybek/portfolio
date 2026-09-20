---
title: Migrating Vue 2 to Vue 3 without a freeze
slug: vue-2-to-3-without-a-freeze
date: 2026-08-14
summary: A migration that keeps shipping features while it runs, why the big-bang branch loses, and what the parallel-build approach costs.
tags: [vue, migration]
readingMinutes: 5
draft: true
---

Every Vue 2 migration plan I have been handed started with the same sentence: freeze feature work
for a sprint and cut over. That plan has never once survived contact with a product roadmap, and
the long-lived migration branch it produces rots faster than the codebase it is trying to replace.
The version I would defend runs the two builds side by side and moves one route at a time, which
is slower on paper and finishes sooner in practice.
