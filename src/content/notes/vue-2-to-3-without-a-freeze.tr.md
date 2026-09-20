---
title: Vue 2'den Vue 3'e freeze olmadan geçmek
slug: vue-2-to-3-without-a-freeze
date: 2026-08-14
summary: Kendisi sürerken feature çıkarmaya devam eden bir migration, big-bang branch'in neden kaybettiği ve paralel build yaklaşımının maliyeti.
tags: [vue, migration]
readingMinutes: 7
draft: false
---

Elime verilen her Vue 2 migration planı aynı cümleyle başladı: bir sprint boyunca feature işini
dondur ve geçişi yap. Bu plan bir ürün roadmap'iyle temas ettiğinde bir kez olsun ayakta kalmadı ve
ürettiği uzun ömürlü migration branch'i, yerine geçmeye çalıştığı kod tabanından daha hızlı
çürüyor. Benim savunacağım versiyon iki build'i yan yana çalıştırıp her seferinde tek bir route
taşıyor; kâğıt üstünde daha yavaş, pratikte daha erken bitiyor.

Bu migration'ı ortak bir component kütüphanesi olan bir üründe bizzat yürüttüm ve sıralama sorusunu
ilginç kılan şey de tam olarak bu yapı. Her şey kütüphaneyi import ediyor, kütüphane de Vue'nun
hangi major versiyonunun var olduğu konusunda kendi fikri olan paketleri import ediyor.

## Freeze neden kaybediyor

Freeze, işi finanse eden insanlar kısa görüşlü olduğu için reddedilmiyor. Kötü bir bahis olduğu için
reddediliyor; bunu görmek için de Vue bilmek gerekmiyor. Big-bang bir rewrite, iki çalışan durumun
arasına aylar koyuyor. O aylar boyunca gösterilecek bir şey yok, çıkarılacak bir sürüm yok ve %40
bitmiş bir branch'i %70 bitmiş bir branch'ten ayırmanın hiçbir yolu yok. Elinizdeki tek sinyal,
birinin kendi kalan işi hakkındaki tahmini oluyor; yazılımdaki en güvenilmez sayı da o.

Teknik başarısızlık siyasi olandan daha kötü. Üç ay yaşayan bir migration branch'i, hareket etmeye
devam eden bir mainline'la çatışma biriktiriyor. Her çatışma da sizin yeniden yazdığınız kodla, bir
meslektaşınızın sonradan artık tanımadığınız bir dosyaya yazdığı kod arasında çıkıyor. Bunları
çözmek migration işi değil, arkeoloji. Ürettiği hata da ince türden: merge'ün bir tarafında adı
değişen, diğer tarafında değişmeyen bir prop; hem de kimsenin bir müşteri açana kadar açmadığı bir
component'te.

Bir branch'in riski parça parça azaltamaması da ayrı bir sorun. Vue 3 takvimini gerçekten patlatan
şey hiçbir zaman component'ler olmuyor. Vue 3 sürümü hiç çıkmamış tek bir dependency oluyor.
Branch'te çalışıyorsanız onu altıncı haftada, arkanızda dört yüz commit varken ve hiçbirini canlıya
çıkaramazken fark ediyorsunuz.

## Component nasıl yazılacak: ilk dosya taşınmadan önce

Incremental yol, iki API'yi bir süre aynı repoda yan yana çalıştırmak demek. O dönem yaşanabilir bir
dönem ama disiplin istiyor. Disiplinin de her pull request'te yeniden tartışılması değil, ilk dosya
taşınmadan önce karara bağlanması gerekiyor.

Israrcı olduğum anlaşma üç satır. Yeni component'ler TypeScript ile ve `<script setup>` içinde
yazılıyor; küçük olanlar için istisna yok. Bir feature için elinizin değdiği component, yaprak bir
component'se aynı pull request içinde dönüştürülüyor; değilse olduğu gibi bırakılıyor — çok yerden
import edilen bir component'e yol üstü dokunmak, iki günlük bir işi dört kişinin review etmesi
gereken bir branch'e çeviriyor. Geri kalan her şey, planda sırası gelene kadar Options API'de
kalıyor.

Böyle yazıldığında bu bir rule dosyası ve bir lint kuralı oluyor, tartışma konusu olmaktan çıkıyor.
Bu kadar katı olmanın sebebi de şu: alternatif esneklik değil, yeni gelen birine ikisi de doğru
görünen iki ayrı ev stili. Migration'ı iki yıl önce bitmiş kod tabanları okudum ve hangi dosyaların
o dönemde yazıldığı hâlâ belli oluyordu.

## Sıra: önce kütüphane, sonra yapraklar, en sonda kabuklar

İlk akla gelen, app shell'den başlamak oluyor; shell temel gibi duruyor çünkü. Oysa başlanacak yerin
tam tersi orası. Shell, uygulamadaki bütün varsayımların buluştuğu yer: router, global state,
layout, plugin'ler. Onu en başta taşımak, altınızda henüz oturmuş hiçbir katman yokken bunların
hepsini birden taşımak demek.

Sıra bunun yerine import grafiğinden çıkıyor. Kendisine gelen import sayısına göre sıralıyor ve
küçükten büyüğe taşıyorsunuz. En başa ortak component kütüphanesi giriyor; her route ona bağlı ve o
bir Vue 3 context'inden kullanılabilir hale gelene kadar başka hiçbir şey ilerlemiyor. Sonra yaprak
route'lar geliyor: bir ayarlar sayfası, bir rapor ekranı, çok şey import edip hiçbir yerden import
edilmeyen türden view'lar. Her biri kendi içinde kapanan bir kanıt oluyor; tek kişinin review
edebileceği, kendi başına canlıya çıkabilecek bir parça. Kabuklar ise en sona kalıyor, altındaki
katman hareket etmeyi bıraktığında.

Bunun doğal sonucunu açıkça yazmak gerekiyor, çünkü heves sürekli bu kuralı çiğniyor: kendisine çok
import gelen şeyler en son taşınıyor, ilk değil. Üç yüz yerde kullanılan bir base button iyi bir
ısınma egzersizi değil; üç yüz dosyaya dokunan değişikliğin kendisi. Onu, hedef stil daha küçük bir
yerde oturmuş ve kanıtlanmışken yapmak istiyorsunuz.

## Component'ler kolay yarısı

Options API'den `<script setup>`'a geçmek, keyifli sayılacak kadar mekanik bir iş. Küçük bir toplam,
önce:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    lines: { type: Array as () => { amount: number }[], required: true },
    currency: { type: String, default: 'EUR' },
  },
  computed: {
    total(): number {
      return this.lines.reduce((sum, line) => sum + line.amount, 0)
    },
  },
})
</script>

<template>
  <output>{{ total.toFixed(2) }} {{ currency }}</output>
</template>
```

Sonra:

```vue
<script setup lang="ts">
import { computed } from 'vue'

type Line = { amount: number }

const props = withDefaults(defineProps<{ lines: Line[]; currency?: string }>(), {
  currency: 'EUR',
})

const total = computed(() => props.lines.reduce((sum, line) => sum + line.amount, 0))
</script>

<template>
  <output>{{ total.toFixed(2) }} {{ currency }}</output>
</template>
```

Daha kısa; üstelik prop'lar artık üstüne cast yapıştırılmış bir runtime tanımı değil, gerçek bir
type. Bu şekildeki iki yüz component, bir review'cının gözle kontrol edebileceği bir haftalık sıkıcı
iş. Migration tahmininize ağırlığı veren şey bu kısımsa, tahmin yanlış.

## Takvimi belirleyen şey ekosistem

Zamanı yiyen şey component'lerin etrafındaki her şey. En büyük parça state management: namespaced
modülleri, string'le çağrılan mutation'ları ve umutla type'lanmış getter'ları olan bir Vuex store'u,
compiler'ın içini görebildiği Pinia store'larına dönüyor.

```ts
import type { Module } from 'vuex'

interface State { items: Line[] }

export const invoice: Module<State, unknown> = {
  namespaced: true,
  state: () => ({ items: [] }),
  getters: {
    total: (state) => state.items.reduce((sum, line) => sum + line.amount, 0),
  },
  mutations: {
    setItems(state, items: Line[]) { state.items = items },
  },
  actions: {
    async load({ commit }) { commit('setItems', await fetchLines()) },
  },
}
```

Pinia karşılığı aynı davranış, aradaki dolaylılık kalkmış halde:

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useInvoiceStore = defineStore('invoice', () => {
  const items = ref<Line[]>([])
  const total = computed(() => items.value.reduce((sum, line) => sum + line.amount, 0))

  async function load() {
    items.value = await fetchLines()
  }

  return { items, total, load }
})
```

`dispatch('invoice/load')`, compiler'ın hiç kontrol etmediği bir string'di.
`useInvoiceStore().load()` ise type'ı olan bir fonksiyon çağrısı. Vue 3'ün altına bir Vuex shim'i
koyup geçmek yerine store işini düzgün yapmanın bütün gerekçesi bu.

State'in yanında build var; artık bir config dosyası değil, kendi başına bir iş kalemi. Component
kütüphanesinin kendi dependency'leri var; kütüphane taşınabilmeden önce onların taşınması gerekiyor.
Ve asıl risk var: Vue 3 sürümü hiç çıkmamış olan kütüphane. Buna verilebilecek üç cevap var —
değiştirmek, fork'lamak ya da gerçekten kullandığınız kısmını kendiniz yazmak. Üçü de haftalarla
ölçülüyor. `package.json` içindeki Vue'ya bağlı her satırın denetimi de bu yüzden birinci haftaya,
hiçbir component taşınmadan önceye, cevabın planı hâlâ değiştirebileceği ana ait.

## Type'lar ve testler işi umuda bırakmıyor

Bu işi dikkatli bir çabadan kontrol edilebilir bir çabaya çeviren şey TypeScript. Adı değişen bir
prop, imzası değişen bir emit, Vuex'ten çıkmış bir getter: compiler bunların çağrıldığı her yeri
buluyor. Grep'in asla yakalayamayacağı yerler ve bu yıl kimsenin açmadığı component'ler de buna
dahil. Aynı migration'ı type'sız bir kod tabanında yapmak, işi `git grep` ve bir sözle yapmak demek.
Tutmayan kısmı da o söz oluyor.

Testler burada, sıradan feature işlerinde olduğundan daha fazla yerini hak ediyor. İşe yarayanlar,
iç yapıya değil davranışa bakan component testleri: mount et, prop ver, render çıktısını ve emit
edilen event'leri kontrol et. Bu seviyedeki bir test, component'in içinde hangi API'nin
kullanıldığıyla ilgilenmiyor; yani dönüşümden önce de sonra da aynı test geçiyor. Bütün mesele de
bu. Bir dosyayı taşıyıp emin olmanızı sağlayan şey o; taşıyıp sürümden önce birinin akışı
tıklamasını ummanızı değil.

## Nerede tıkanıyor

Çifte bakım dönemi gerçek ve kimse o dönemi sevmiyor. Aylar boyunca elinizde iki component stili,
muhtemelen iki state kütüphanesi ve ikisine de hizmet etmek zorunda olan bir build oluyor. Ortak bir
davranıştaki düzeltme arada bir iki kez yazılıyor. Bu, hiçbir zaman sürüm çıkaramaz duruma
düşmemenin bedeli; ve bir bedel, dipnot değil.

Tahmin yanlış çıkacak; üstelik yanlış çıkacağı yer ekosistem tarafı olacak. Component sayısı
bilinebilir bir şey ve iyi tahmin ediliyor. Terk edilmiş tek bir dependency'nin kaç hafta
götüreceği ise, biri onun içinde iki gün geçirmeden bilinemiyor. Ben artık o araştırmayı bilinçli
olarak en başa koyuyorum ve ondan önce üretilen her sayıyı tahmin sayıyorum.

Disiplin sorunu da kendi kendine çözülmüyor. Tek bir component stilinde anlaşamayan bir ekip, iki
stilli bir kod tabanı üretiyor; migration da bunun sebebi değil, bahanesi oluyor. O anlaşmaya iş
başlamadan önce bir toplantıda varılamıyorsa, bu çeyrekte çözülmeye değer sorun migration değil.
