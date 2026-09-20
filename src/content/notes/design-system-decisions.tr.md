---
title: Sonradan pahalıya patlayan design system kararları
slug: design-system-decisions
date: 2026-07-02
summary: Variant isimlendirmesi, slot sınırları ve token semantiği seçerken ucuz; elli component onlara bağlandıktan sonra değiştirmesi acımasız.
tags: [design-systems, api-design]
readingMinutes: 5
draft: true
---

Bir design system'de ters giden şeylerin çoğu görsel değil. API tasarımı: iki prop olması gereken
bir `type` prop'u, bir rol yerine bir renge göre isimlendirilmiş bir token, sahiplenmesi gerekirken
slot kabul eden bir primitive. Bunların hiçbiri ilk ayda acıtmıyor ve elli component onları
tükettikten sonra hepsini değiştirmek neredeyse imkânsız.
