---
title: Vue 2'den Vue 3'e freeze olmadan geçmek
slug: vue-2-to-3-without-a-freeze
date: 2026-08-14
summary: Kendisi sürerken feature çıkarmaya devam eden bir migration, big-bang branch'in neden kaybettiği ve paralel build yaklaşımının maliyeti.
tags: [vue, migration]
readingMinutes: 5
draft: true
---

Elime verilen her Vue 2 migration planı aynı cümleyle başladı: bir sprint boyunca feature işini
dondur ve geçişi yap. Bu plan bir ürün roadmap'iyle temas ettiğinde bir kez olsun ayakta kalmadı ve
ürettiği uzun ömürlü migration branch'i, yerine geçmeye çalıştığı kod tabanından daha hızlı
çürüyor. Benim savunacağım versiyon iki build'i yan yana çalıştırıp her seferinde tek bir route
taşıyor; kâğıt üstünde daha yavaş, pratikte daha erken bitiyor.
