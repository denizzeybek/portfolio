---
title: Microfrontend sınırı nereye çizilir
slug: microfrontend-boundaries
date: 2026-06-05
summary: Module federation bir frontend'i bölmeyi kolaylaştırıyor, sorun da bu. Sınır klasör yapısını değil, sahipliği takip etmeli.
tags: [architecture, module-federation]
readingMinutes: 5
draft: true
---

Module federation, bir frontend'i deploy edilebilir parçalara bölmeyi bir konfigürasyon işine
çevirdi ve bu mimarilerin bu kadar çoğunun yerini aldıkları monolith'ten daha kötü bitmesinin
sebebi tam olarak bu. Tooling, sınırı klasör yapısı boyunca çizmenize gönül rahatlığıyla izin
verir; overhead'ini hak eden tek sınır, o şeye kimin sahip olduğunu ve onu kimin release ettiğini
takip eden sınır.
