---
title: Sonradan pahalıya patlayan design system kararları
slug: design-system-decisions
date: 2026-07-02
summary: Variant isimlendirmesi, slot sınırları ve token semantiği seçerken ucuz; elli component onlara bağlandıktan sonra değiştirmesi acımasız.
tags: [design-systems, api-design]
readingMinutes: 7
draft: false
---

Bir design system'de ters giden şeylerin çoğu görsel değil, API tasarımıyla ilgili: aslında iki
prop olması gereken bir `type` prop'u, rolüne göre değil rengine göre isimlendirilmiş bir token,
kendi markup'ını yönetmesi gerekirken dışarıya slot açan bir primitive. Bunların hiçbiri ilk ayda
canınızı yakmıyor. Elli component onları kullanmaya başladıktan sonra ise değiştirmek neredeyse
imkânsız hale geliyor.

Ben de böyle bir kütüphane kurdum: elli küsur component, sonunda üç ayrı ürün tarafından
kullanıldı. Aşağıdaki kararların ortak yanı şu: ucuz olan sürüm ile pahalıya patlayan sürüm
review'da birbirinin aynısı görünüyor. Fark, ancak bir şeyin değişmesi gerektiğinde ortaya çıkıyor.

## Boolean'lar çoğalıyor, union'lar sayıyor

Boolean'lardan oluşan bir button API'ını kimse tasarlamıyor. O API kendi kendine birikiyor. Birine
dolu bir button gerekiyor, `primary` ekleniyor. Birine daha büyüğü gerekiyor: `large`. Birine koyu
bir panelde duracak sessiz bir button gerekiyor: `ghost`. Üç ayrı tek satırlık diff ve her biri
kendi başına gayet makul görünüyor.

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  primary?: boolean
  secondary?: boolean
  large?: boolean
  ghost?: boolean
}
const props = defineProps<IProps>()

const classes = computed(() => [
  props.primary && 'bg-accent text-canvas',
  props.secondary && 'border border-line-strong text-ink',
  props.ghost && 'bg-transparent text-ink-muted',
  props.large ? 'px-5 text-sm' : 'px-4 text-xs',
])
</script>
```

Dört boolean on altı durum demek. Bunlardan üçünü biri tasarladı. Compiler on altısını da kabul
ediyor ve `primary ghost` ikilisinin ne çizdiğine `&&` ifadelerinin dosyada hangi sırada durduğu
karar veriyor. O sıra bir tasarım kararı değil, dosyanın nasıl büyüdüğüne bağlı bir kaza. Yine de
artık kritik, çünkü bir ekran ona güveniyor.

Union'lı sürüm ise neyin desteklendiğini söylüyor, fazlasını söylemiyor.

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}
const props = withDefaults(defineProps<IProps>(), { variant: 'solid', size: 'md' })

const VARIANTS: Record<NonNullable<IProps['variant']>, string> = {
  solid: 'bg-accent text-canvas hover:bg-accent-strong',
  outline: 'border border-accent text-accent hover:bg-accent-wash',
  ghost: 'border border-line-strong text-ink hover:text-accent',
}
const SIZES: Record<NonNullable<IProps['size']>, string> = {
  sm: 'min-h-11 px-4 text-xs',
  md: 'min-h-11 px-5 text-sm',
}

const classes = computed(() => [VARIANTS[props.variant], SIZES[props.size]])
</script>
```

Bu, bu sitedeki `src/components/ui/UiButton.vue` dosyasının neredeyse aynısı. Altı durum var ve
altısını da biri çizdi. `variant="primary"` yazıldığında kod derlenmiyor; yani o yazım hatası
hiçbir zaman bir ekran görüntüsüne kadar gitmiyor. Vazgeçmeyeceğim kısım da şu satır:
`Record<NonNullable<IProps['variant']>, string>`. Union'a yeni bir üye eklendiğinde, lookup
tablosunda karşılığı açılana kadar type hatası alıyorsunuz. API ile implementation birbirinden ayrı
düşemiyor.

Boolean'ların varsayılan olarak kazanmasının sebebi, her birinin tek başına gelmesi. Hiçbir pull
request on altı durumu birden eklemiyor; her biri tek bir flag ekliyor ve toplamı kimse elinde
tutmuyor.

## Rengine göre isimlendirilen token bir renktir

`grey-3` ve `blue-500`, bir değerin neye benzediğini kaydediyor. `ink-muted` ve `accent` ise ne işe
yaradığını kaydediyor. Aradaki mesafe, tek bir dosyayı düzenleyen bir theme değişikliği ile üç
üründeki bütün kullanım yerlerini okumak zorunda kalan bir theme değişikliği arasındaki fark.

Bir component `text-grey-3` yazdığında isim, niyeti çöpe atmış oluyor. Altı ay sonra biri ikincil
metnin kontrast için daha koyu olmasını istiyor ve "hangi `grey-3` ikincil metindi?" sorusunun token
katmanında cevabı yok. Cevap kullanımdan çıkarılmak zorunda: buradaki soluk gövde metni, şuradaki
saç teli kalınlığında bir border, üçüncüsü de hiç kıpırdamaması gereken bir disabled etiket. Bunu
script'e de döktüremiyorsunuz, çünkü niyet hiçbir yere yazılmadı. Rename sandığınız şey bir denetim
çalışması.

Bu sitedeki token'lar şunlar: `canvas`, `surface`, `line`, `ink`, `ink-muted`, `accent`,
`accent-wash`. Hiçbiri bir rengin adı değil. O yüzden bütün paleti `main.css` içinde
değiştirebiliyorum, tek bir component'i açmam gerekmiyor.

Kural "renk isimlerinden kaçın"dan daha keskin: semantik bir isim, ancak tek bir anlam taşıyorsa
işe yarıyor. `accent` hem marka rengi, hem focus ring'i, hem de link rengi ise, erişilebilirlik daha
yüksek kontrastlı bir ring istediği gün yine kullanım yerlerini okumaya başlıyorsunuz. Bugün aynı
değeri paylaşan iki rol, yine iki ayrı token olmalı. Asıl kazanç da o tekrarın kendisinde.

## Herkesin fork'ladığı component

Her kütüphanede bir component var; sürekli bir ürünün içine kopyalanıyor ve üç satırı
değiştiriliyor. İlk akla gelen okuma bunu disiplin sorunu sayıyor: köşe kesiliyor, review yeterince
sıkı değil, yeniden kullanım için bir hatırlatma daha gönderelim. Bu okuma neredeyse her zaman
yanlış. Fork aslında çok net bir hata raporu: render'ın bu parçasını sahiplenmem gerekiyordu ve
API'ın buna izin vermedi.

Duyarlı görünen ama işi daha da kötüleştiren cevap, her durum için bir prop eklemek. Önce
`iconLeft`, sonra `iconRight`, sonra `badgeText`, sonra `titleTooltip`, sonra `headerAlign`. Her
biri bir öğleden sonralık iş ve kalıcı bir yükümlülük: üç ürün onu geçiyor olabilir, yani artık
kaldırılamıyor. İki yıl sonra elinizde grameri olmayan bir konfigürasyon dili kalıyor; prop'ların
yarısı birbiriyle çelişiyor ve bunu söyleyen hiçbir şey yok.

Slot'lar sınırı doğru yere koyuyor. Kütüphane, garanti etmek için var olduğu şeyi elinde tutuyor:
boşluk, border, focus, klavye davranışı. İçeriği ise çağırana bırakıyor.

```vue
<template>
  <section class="rounded-md border border-line bg-surface">
    <header class="flex items-baseline justify-between border-b border-line px-5 py-3">
      <slot name="header">
        <h3 class="m-0 text-sm text-ink">{{ title }}</h3>
      </slot>
      <slot name="actions" />
    </header>
    <div class="px-5 py-4"><slot /></div>
  </section>
</template>

<script setup lang="ts">
interface IProps {
  title?: string
}
defineProps<IProps>()
</script>
```

`title` prop'u yerinde kalıyor, çünkü sık yapılan çağrı tek satır olmalı. `header` slot'u sayesinde
ise sık olmayan çağrı kütüphaneye hiç uğramıyor: bir link, bir icon, taşarsa kısalan bir tooltip,
bir sayaç badge'i. Basit durum kısa kalıyor, tuhaf durum ise pazarlık gerektirmeden mümkün oluyor.

Bu kaçış yolunun bir sınırı var. Çağırana focus ring'i ya da disabled davranışını değiştirme izni
veren bir slot, kaçış yolu değil delik. Slot'lar içerik ve bölge için; component'in garanti etmek
için var olduğu davranış için değil.

## Dışarıdan kim override edebilir

Çoğu kütüphane bu soruyu cevaplamadan yayınlanıyor, ki bu da bir cevap: isteyen, istediği yerden,
daha özgül bir selector'la. Utility CSS bunu tek satıra indiriyor. `<UiButton class="bg-red-500">`
çalışıyor, diff'te tek kelime olduğu için review'dan geçiyor ve canlıya çıkıyor.

Olan şu: başka bir repodaki bir ekran, button'ın iç yapısına bildirilmemiş bir bağımlılık kurdu.
Ortada versiyon numarası yok, import yok, kütüphanenin içinden grep'leyebileceğiniz hiçbir şey yok.
Kütüphane de artık o arka plan rengini değiştiremiyor, çünkü kimin ona yaslandığını sayamıyor.

Bu yüzden yazdığım sınır şu: kutu çağıranın, boya kütüphanenin. Margin, genişlik, grid yerleşimi
çağıranın işi. Renk, radius, tipografi, focus ring ise kütüphanenin işi; eksik bir variant, çağrı
yerine eklenen bir class değil, kütüphaneye açılan bir pull request demek. Bu sitedeki karşılığı,
styling kurallarındaki tek bir cümle ve `src/components/ui/` altında ham hex rengi reddeden bir
hook. Sadece kimsenin elini uzatamadığı şeyi güvenle değiştirebiliyorsunuz.

## Paylaşılan şey versiyonlanır

Aynı kütüphaneyi üç ürünün kullanması kodu değiştirmiyor; hatanın bedelini kimin ödediğini
değiştiriyor. Tek ürün varken breaking bir rename bir öğleden sonra sürüyor: ismi değiştir,
type-check'i çalıştır, çağrı yerlerini düzelt, bitti. Üç ürün varken aynı rename başka iki ekibin
sprint'inde bir işe dönüşüyor ve onların zaten söz verdiği işlerle yarışıyor. Takvimini de siz
belirlemiyorsunuz. Versiyonlama politikasının tamamı bu olgudan çıkıyor.

O yüzden önce additive gitmek gerekiyor. Yeni variant'ı eskisinin yerine koymak yerine yanına
ekliyorsunuz; yeni prop'u, bugünkü davranışı koruyan bir default ile ekliyorsunuz. Kimsenin okumak
zorunda olmadığı bir release, herkesin kurduğu release oluyor; kütüphane de ancak insanların
gerçekten kullandığı versiyonda değer üretiyor. Diğer yol iki çeyrek boyunca kimse tarafından
alınmıyor ve sonunda üç ürün üç farklı major'da kalıyor. Tek bir design system'in üç major'ı, üç
ayrı design system demek.

Sonra tarihli deprecation pencereleri geliyor. Eski prop'u type içinde `@deprecated` ile
işaretliyorsunuz; her editor bunu çağrı yerinde gösteriyor ve bir JSDoc etiketi changelog
kaydından çok daha fazla geliştiriciye ulaşıyor. Üzerinde anlaşılan sayıda release boyunca
çalışmaya devam ediyor. Hangi versiyonda kırılacağını da o versiyon ortaya çıkmadan önce
duyuruyorsunuz. Ölü bir prop'u iki release taşımayı, bir ekibe sığdıramayacağı bir migration
vermeye tercih ederim. Alternatifinde bir ürün eski versiyonda sabitleniyor ve kütüphaneyi
fork'luyor; bu da bizi bir önceki bölüme geri götürüyor.

## Nerede tıkanıyor

Yukarıdaki her kural, birinin hızlıca yapmak istediği şeyi elinden alıyor. Bir boolean eklemek
variant union'ı yazmaktan hızlı; bir prop, makul bir default'u olan bir slot'tan daha az düşünmek
demek. Bir ekibin perşembeye o ekranı çıkarması gerekiyorsa sıkı API'lar sadece sürtünme oluyor ve
henüz hiçbir şeyi korumuyorlar. Koruma ikinci yılda geliyor, fatura ise ilk hafta geliyor. Anlaşmaya
varmak için de en kötü sıra bu.

İki ürünün kullandığı bir design system genellikle erken kurulmuş oluyor. Tek ürün kullanıyorsa
design system bile sayılmıyor: ihtiyacı olmayan bir release sürecini taşıyan bir components dizini.
Başabaş noktası kabaca şu: paylaşılan bir component'i değiştirmek, odada olmayan biriyle
konuşmayı gerektirmeye başladığı an. O noktanın altındaysanız ikinci gerçek tekrarda ayırın, ilk
tekrar tahmininde değil.

Bir de union'lar hakkında dürüst olanı söylemek gerekiyor, çünkü en çok onları savundum. Union,
tasarımın verdiği kararı kodluyor. Tasarım henüz karar vermediyse union, etrafına type sarılmış bir
kurgu oluyor: üç variant uyduruyorsunuz, yayınlıyorsunuz ve dördüncü ayda asıl eksenin yoğunluk mu,
vurgu mu, yoksa kimsenin adını koymadığı başka bir şey mi olduğunu öğreniyorsunuz. Yanlış bir union
breaking change demek. Yanlış bir boolean ise sadece kullanılmayan bir prop. Sıkı API'lar doğru
kararları korumayı ucuzlatıyor, yanlış kararlardan çıkmayı pahalılaştırıyor. Ben bu takası kabul
ediyorum; ama bu, hangisini yaptığımı ayırt edebildiğimi varsayıyor.
