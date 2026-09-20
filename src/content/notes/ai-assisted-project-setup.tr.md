---
title: Bir projeyi AI gerçekten geliştirebilsin diye kurmak
slug: ai-assisted-project-setup
date: 2026-09-20
summary: Bir full-stack projenin ilk iki günü, agent'ın o projede ne kadar işe yarayacağını belirliyor. Feature yazmadan önce kurduğum şeyler.
tags: [ai-assisted, openapi, typescript]
readingMinutes: 7
---

Yakın zamanda çalıştığım bir full-stack projede ilk iki gün boyunca tek bir feature yazmadım.
Onun yerine backend'in OpenAPI dokümanından TypeScript client'ı generate ettim, compiler'ı
sonuna kadar sıkılaştırdım, saniyeler içinde biten bir test komutu kurdum ve ekibin
konvansiyonlarını agent'ın kendi başına okuyabileceği dosyalara yazdım. Sonrasında iş belirgin
biçimde hızlandı.

İnsanların modele yorduğu hızın büyük kısmı aslında repoya ait bir özellik. Aynı modeli, aynı
prompt'ları iki farklı projede kullanıyorsunuz: birinde agent feature'ı bitiriyor ve kontroller
yeşil kalıyor, diğerinde makul görünen bir şey üretiyor ve siz öğleden sonranızı onu sökmekle
geçiriyorsunuz. Aradaki fark, reponun agent'a ne kadar şey söyleyebildiği ve bunu ne kadar hızlı
söylediği.

## Feature'la başlamak neden tutmuyor

Akla ilk gelen sıra şu: ticket'ı aç, agent endpoint dokümanına baksın ve yazsın. Agent bir fetch
çağrısı yazıyor, alan isimlerini tahmin ediyor, listenin doğrudan mı yoksa bir envelope içinde mi
döndüğünü tahmin ediyor, enum değerlerini tahmin ediyor. Tahminlerin hepsi makul görünüyor.
Asıl sorun da burada: makul ama yanlış kod gürültüyle patlamıyor, üç ekran sonra tarayıcıda
patlıyor ve bunu yakalayan tek mekanizma diff'i okuyan ben oluyorum. Agent iş üretmekte hızlı ama
ürettiğini doğrulayacak bir yolu yok; o yüzden type sistemi ben oluyorum. Bu da yapılabilecek en
kötü iş bölümü ve kod tabanı büyüdükçe daha da kötüleşiyor.

Üstelik model iyileştikçe bu durum daha da tehlikeli hale geliyor. Doğrulama imkânı olmadan
inandırıcı kod yazan bir model, her review'ın maliyetini artırıyor: hatalar bariz olmaktan çıkıp
ince hatalara dönüşüyor, ince hatalar da canlıya çıkan hatalar oluyor.

## O iki günde tam olarak ne kuruluyor

İlk feature branch'i açılmadan önce repoda şunlar var:

- generate edilmiş bir API client ve network'e kimin çıkabileceğini söyleyen tek bir kural
- strict flag'leri açılmış bir `tsconfig`, çoğu ekibin atladığı flag'ler dahil
- tek komuta bağlanmış lint ve format, böylece stil tartışması review'a hiç girmiyor
- saniyeler içinde biten bir test komutu ve kopyalanacak örnek olarak gerçek bir test
- agent'ın kendi başına yüklediği dört konvansiyon dosyası
- her review'da tekrar söyleyeceğim her kural için bir hook

Hiçbiri zekice şeyler değil. Ama toplamı, soran bir agent ile tahmin eden bir agent arasındaki
farkı belirliyor.

## İlk commit generate edilen client

Kurulan ilk şey API client'ı oluyor; ortada henüz tek bir view bile yok. Backend `openapi.json`
yayınlıyor, generator bunu küçük bir paket içinde type'lara ve typed bir fetch client'ına
çeviriyor. Ama asıl belirleyici olan generator değil, üstüne koyduğum kural: o paketin dışından
hiçbir yer network'e çıkmıyor. Component içinde `fetch` yok, store'da elle açılmış axios instance'ı
yok. Her çağrı, tek bir ince modülde ismi olan bir fonksiyon.

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

On iki satır, ama projenin bütün ekonomisini değiştiriyorlar. Adı değişen bir alan artık demoda
karşınıza `undefined` olarak çıkmıyor, çağrının yapıldığı yerde compile hatası veriyor. Filtre
eklemesi istenen bir agent `schema.d.ts`'i okuyup hangi query parametrelerinin gerçekten var
olduğunu görüyor ve uydurmayı bırakıyor. Backend breaking change çıkardığında ise client'ı yeniden
generate etmek, elinize doğrudan migration planı niyetine kullanabileceğiniz bir hata listesi
veriyor.

Bu yapıyı ayakta tutan şey kuralın kendisi. Tek bir istisna yeter: spec'e henüz girmemiş bir
endpoint için `fetch` çağıran bir component, bir sonraki agent için emsal haline gelir.
Konvansiyonlar dokümandan değil koddan öğrenilir; bu hem insanlar hem modeller için geçerli.

## Strict type'lar geri bildirim döngüsünün kendisi

Bir coding agent, her düzenlemeden sonra aldığı sinyal kadar iyi çalışıyor. O sinyali veren şey de
sıkılık.

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Son üçü çoğu ekibin atladığı ayarlar ve burada asıl işe yarayanlar da onlar. Bunlar açıkken agent
type-checker'ı ve testleri kendi çalıştırıyor, çıkan hataları okuyor ve bana sormadan düzeltiyor.
İşe yarayan turların boşa giden turlara oranı, neredeyse tamamen bu döngünün hızına ve
netliğine bağlı: dosyayı, satırı ve beklenen type'ı söyleyen bir hata doğru bir ikinci deneme
getiriyor; "runtime'da bir şey undefined" ise sadece yeni bir tahmin getiriyor.

Hız da en az netlik kadar önemli. Dört saniye süren bir type-check her düzenlemeden sonra
çalıştırılıyor; doksan saniye sürende ise kimse beklemiyor, en sonda bir kere çalıştırılıyor ve
karşınıza kimsenin ayıramayacağı bir yığın değişiklik çıkıyor.

## İkinci sözleşme: testler

Type'lar shape'in doğru olduğunu kanıtlıyor. Testler ise davranışın doğru olduğunu kanıtlıyor ve
derlenen bir kod için "bu yanlış" diyebilen tek mekanizma onlar.

Agent'tan tam kapsama istemiyorum; o istek, birinin az önce yazdığı başlığın gerçekten o başlık
olduğunu doğrulayan yüz tane değersiz test üretiyor. Test edilmeyi hak eden şey, okuyucunun gözle
doğrulayamayacağı mantık: sıralama, filtreleme, tarih hesabı, taslak ile yayımlanmış içerik
arasındaki sınır. Repoda duran tek bir iyi örnek, bir paragraf talimattan daha çok iş görüyor;
agent o örneğin şeklini, isimlendirmesini ve ayrıntı seviyesini kopyalıyor.

## Konvansiyonlar prompt metni değil, dosya

Son parça, kod tabanının nasıl çalıştığını her seferinde yeniden yazdığım bir prompt'a değil,
agent'ın her seferinde okuduğu dosyalara yazmak. Bunu dört başlığa ayırdım ve asıl işe yarayan
şey bu ayrımın kendisi.

- **Rules**, gerekçesi olan tercihler: isimlendirme, component şekli, bir yazının neler
  içerebileceği. Model bunları tartıyor. Path glob'la kapsamı daraltılmış kısa dosyalarda durmaları
  gerekiyor ki her seferinde sadece ilgili olan yüklensin.
- **Hooks** ise duvar görevi görüyor. 250 satırı aşan bir dosya, ham bir hex renk, satırın altını
  tekrarlayan bir `//` comment: bunlar yazma işlemi diske inmeden mekanik olarak reddediliyor.
  Pazarlık yok, nezaket yok, modelin hatırlamasına güvenmek yok.
- **Skills**, prosedürler. "Bu projede design system primitive'i nasıl eklenir" sorusunun cevabı
  altı adım ve bir kontrol listesi; bir kez yazılıyor ve her seferinde aynı şekilde uygulanıyor.
- **Agents**, tool seti daraltılmış roller. Yazan bir implementer, yalnızca okuyup rapor eden bir
  reviewer. Bu ikisini ayırmak, aynı context'in hem işi üretmesini hem de onaylamasını engelliyor.

En çok savunduğum ayrım, rules ile hooks arasındaki ayrım. Review'da her seferinde reddedeceğim
bir şey rule olmamalı, çünkü rule bir tavsiyedir ve tavsiye başka tavsiyelerle tartılır. Öyle bir
şey hook olmalı, çünkü hook repo hakkında bir olgudur.

Bunun ikinci bir etkisi daha var: kuralları yazmak, ekip içindeki görüş ayrılıklarını görünür
kılıyor. Üç kişinin birbirinden biraz farklı anladığı bir konvansiyon, tek cümleye indirildiğinde
ayakta kalamıyor. Bu bir hafta boyunca rahatsız edici oluyor, sonrasında ise değiyor.

## Nerede tıkanıyor

Dürüst maliyet o iki gün. Atılacak bir prototipte o iki günü asla geri kazanamazsınız; bir
haftalık işlerde ben de bunların hepsini atladım ve pişman olmadım. Başabaş noktası, iki veya daha
fazla kişinin bir çeyrek boyunca dokunmaya devam edeceği bir kod tabanı.

Generate edilen client, şemadaki yanlışları hiç sorgulamadan devralıyor. Backend'in null
dönebildiği halde required işaretlediği bir alan, union yerine `string` olarak modellenmiş bir
status: artık type'lar yanlış bir şey iddia ediyor ve bunu elle yazılmış type'lardan daha
inandırıcı biçimde iddia ediyor. Generation, frontend'in güvenliğini başkasının spec disiplinine
bağlıyor; bu bedava bir kazanç değil, gerçek bir bağımlılık.

Fazla sıkı ayarlanmış hook'lar da kazandırdığından fazlasını götürüyor. 280 satırlık düzgün bir
modülün karşısına dikilen katı bir satır limiti, ayrı isimleri hak etmeyen iki dosyaya bölünmüş
kötü bir yapı üretiyor. Ben artık bir hook'u, hatayı iki kez gördükten sonra ekliyorum; olacağını
tahmin ederek değil.

Strict type'lar ise yalnızca shape'lerin doğru olduğunu kanıtlıyor. Haftanın pazartesi mi
başladığı, toplamların yuvarlanması gerekip gerekmediği, hatta bütün bu işin yapılmaya değer olup
olmadığı hakkında hiçbir şey söylemiyorlar. O kısım hâlâ devredilmiş değil ve şimdilik
devredilecek gibi de görünmüyor.
