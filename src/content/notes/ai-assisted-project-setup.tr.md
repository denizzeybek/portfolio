---
title: Bir projeyi AI gerçekten geliştirebilsin diye kurmak
slug: ai-assisted-project-setup
date: 2026-09-20
summary: Bir full-stack projenin ilk iki günü, agent'ın o projede ne kadar işe yarayacağını belirliyor. Feature'lardan önce kurduğum şeyler.
tags: [ai-assisted, openapi, typescript]
readingMinutes: 5
---

Yakın zamanda çalıştığım bir full-stack projede ilk iki günü hiç feature yazmadan geçirdim.
Backend'in OpenAPI dokümanından bir TypeScript client generate ettim, compiler'ı gidebildiği kadar
sıkılaştırdım ve ekibin konvansiyonlarını agent'ın kendi başına okuduğu dosyalar olarak yazdım.
Ondan sonrası daha hızlı ilerledi, hem de az farkla değil.

## Neden feature'la başlamak işe yaramıyor

Cazip olan sıra, ticket'ı açıp agent'ı endpoint dokümantasyonu üzerinden çalıştırmak. Bir fetch
çağrısı yazıyor, alan isimlerini tahmin ediyor, listenin çıplak mı yoksa bir envelope içinde mi
döndüğünü tahmin ediyor, enum üyelerini tahmin ediyor. Her tahmin makul görünüyor. Sorun da bu:
makul ama yanlış kod yüksek sesle patlamıyor, üç ekran sonra tarayıcıda patlıyor ve döngüdeki tek
detektör diff'i okuyan ben oluyorum. Agent iş üretmekte hızlı ve ürettiğini kontrol etmenin bir
yolu yok, dolayısıyla type sistemi ben oluyorum. Bu mümkün olan en kötü iş bölümü ve kod tabanı
büyüdükçe daha da kötüleşiyor.

## İlk commit generate edilen client

Bu yüzden kurulan ilk şey API client'ı oluyor, henüz tek bir view bile yokken. Backend
`openapi.json` yayınlıyor; bir generator bunu tek bir küçük paket içinde type'lara ve typed bir
fetch client'ına çeviriyor. Üstüne koyduğum kural generator'ın kendisinden daha önemli: o paketin
dışından hiçbir şey network'e çıkmıyor. Component içinde `fetch` yok, store'da ad-hoc bir axios
instance'ı yok. Her çağrı, tek bir ince modülde isimlendirilmiş bir fonksiyon.

```ts
import createClient from 'openapi-fetch'

import type { paths } from './schema'

const api = createClient<paths>({ baseUrl: import.meta.env.VITE_API_URL })

export async function getTimeEntries(weekStart: string) {
  const { data, error } = await api.GET('/time-entries', {
    params: { query: { weekStart } },
  })
  if (error) throw new Error(error.title)
  return data.items
}
```

On iki satır ve bütün projenin ekonomisini değiştiriyorlar. İsmi değişen bir alan artık demo'da
bir `undefined` değil, çağrı yerinde bir compile hatası. Filtre eklemesi istenen bir agent
`schema.d.ts`'i okuyup hangi query parametrelerinin var olduğunu tam olarak görebiliyor, böylece
onları uydurmayı bırakıyor. Backend breaking change çıkardığında ise yeniden generate etmek,
fiilen migration planı olan bir hata listesi üretiyor.

## Strict type'lar geri bildirim döngüsüdür

Bir coding agent, her düzenlemeden sonra aldığı sinyal kadar iyi. Sıkılık da o sinyal. `any` yok,
non-null assertion yok, kontrolsüz index erişimi açık, exact optional property types açık,
kullanılmayan local'ler hata sayılıyor. O zaman agent type-checker'ı ve unit testleri kendi
çalıştırıp hataları okuyabiliyor ve sormadan düzeltebiliyor. Benim deneyimim, işe yarayan turların
boşa giden turlara oranının neredeyse doğrudan bu döngünün ne kadar hızlı ve ne kadar spesifik
olduğuna bağlı olduğu: dosyayı, satırı ve beklenen type'ı söyleyen bir hata doğru bir ikinci
deneme üretiyor, "runtime'da bir şey undefined" ise tahmin üretiyor.

## Konvansiyonlar prompt metni değil, dosya olarak

Son parça, kod tabanının nasıl çalıştığını her seferinde yeniden yazdığım bir prompt'a değil,
agent'ın her seferinde okuduğu bir yere yazmak. Bunu dörde ayırdım ve işe yarayan kısmı bu ayrımın
kendisi.

- **Rules**, gerekçesi olan tercihler: isimlendirme, component şekli, bir notun neler
  içerebileceği. Model bunları tartıyor. Path glob'la kapsamı daraltılmış kısa dosyalarda durmaları
  gerekiyor, böylece sadece ilgili olan yükleniyor.
- **Hooks** duvar. 250 satırı geçen bir dosya, ham bir hex renk, anlatan bir `//` comment: bunlar
  yazma işlemi yere inmeden mekanik olarak reddediliyor. Müzakere yok, nezaket yok, modelin
  hatırlamasına bel bağlamak yok.
- **Skills** prosedür. "Burada bir design system primitive'i nasıl eklenir" altı adım ve bir
  checklist; bir kez yazıldığında her seferinde aynı şekilde uygulanıyor.
- **Agents**, tool seti daraltılmış roller. Yazan bir implementer, sadece okuyup rapor eden bir
  reviewer. Bunları ayırmak, aynı context'in hem işi üretip hem onaylamasını engelliyor.

En hararetle savunacağım ayrım rules ile hooks arasındaki. Review'da her seferinde reddedeceğim
bir şey rule olmamalı, çünkü rule tavsiyedir ve tavsiye başka tavsiyelerle tartılır. Hook olmalı,
çünkü hook repo hakkında bir olgudur.

## Nerede tıkanıyor

Dürüst maliyet o iki gün. Atılacak bir prototipte onları asla geri kazanamazsınız; bir haftalık
işlerde bunların tamamını atladım ve pişman olmadım. Başabaş noktası, iki veya daha fazla kişinin
bir çeyrek boyunca dokunmaya devam edeceği bir kod tabanı civarında bir yerde.

Generate edilen client, şemanın yalanlarını hiç yüzü kızarmadan devralıyor. Backend'in null
bırakabildiği ama required işaretlediği bir alan, union yerine `string` olarak modellenmiş bir
status: type'lar artık yanlış bir şey iddia ediyor ve bunu elle yazılmış olanlardan daha inandırıcı
biçimde iddia ediyor. Generation, frontend'in güvenliğini başkasının spec disiplininin bir
fonksiyonu yapıyor; bu bedava bir kazanç değil, gerçek bir bağımlılık.

Fazla sıkı ayarlanmış hook'lar tur yakıyor. 280 satırlık iyi bir modülün karşısına konan katı bir
satır limiti, ayrı isimleri hak etmeyen iki dosyaya kötü bir bölünme üretiyor. Artık bir hook'u,
hatayı iki kez gördükten sonra ekliyorum, olacağını öngörerek değil.

Strict type'lar da sadece shape'lerin doğru olduğunu kanıtlıyor. Haftanın pazartesi mi başladığı,
toplamların yuvarlanması gerekip gerekmediği ya da bunların herhangi birinin yapmaya değer olup
olmadığı hakkında hiçbir şey söylemiyorlar. O kısım devredilmedi ve şimdiye kadar devredilecek
gibi de görünmüyor.
