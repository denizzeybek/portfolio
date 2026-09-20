---
title: Where to draw a microfrontend boundary
slug: microfrontend-boundaries
date: 2026-06-05
summary: Module federation makes splitting a frontend easy, which is the problem. The boundary should follow ownership, not the folder structure.
tags: [architecture, module-federation]
readingMinutes: 5
draft: true
---

Module federation made splitting a frontend into deployable pieces a configuration exercise, and
that is precisely why so many of these architectures end up worse than the monolith they replaced.
The tooling will happily let you draw the boundary along the folder structure; the only boundary
that pays for its overhead is one that follows who owns and releases the thing.
