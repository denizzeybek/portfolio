---
title: Microfrontend sınırı nereye çizilir
slug: microfrontend-boundaries
date: 2026-06-05
summary: Module federation bir frontend'i bölmeyi kolaylaştırıyor, sorun da bu. Sınır klasör yapısını değil, sahipliği takip etmeli.
tags: [architecture, module-federation]
readingMinutes: 7
draft: false
---

Module federation, bir frontend'i deploy edilebilir parçalara bölmeyi sıradan bir konfigürasyon
işine çevirdi. Bu mimarilerin bu kadar çoğunun yerini aldıkları monolith'ten daha kötü bitmesinin
sebebi de tam olarak bu. Tooling, sınırı klasör yapısına göre çizmenize hiç itiraz etmiyor; oysa
kendi maliyetini çıkaran tek sınır, o parçaya kimin sahip olduğunu ve onu kimin release ettiğini
takip eden sınır.

Webpack Module Federation üzerine kurulu bir microfrontend mimarisinde çalıştım. Beni şaşırtan şey,
zorluğun neredeyse hiç teknik olmamasıydı. Asıl zor olan, bir parçayı ayırmanın ekiplerin çalışma
düzenine getirdiği yükümlülükler.

## Salı testi

Kimse webpack config'ini açmadan önce, ayırmak istediği parça hakkında tek bir soru soruyorum: bu
parça bir salı öğleden sonra, sahibi olan ekip tarafından, kimseden bir şey istemeden deploy
edilebiliyor mu? Sorduğum şey "teknik olarak ayrı deploy edilebilir mi" değil; federation bunu
neredeyse her klasör için doğru hale getiriyor. Gerçekten çıkabiliyor mu? Kendi pipeline'ı, kendi
versiyonu ve host'a dokunmayan bir rollback'i var mı?

Cevap evetse elinizde bir sınır var ve üstlendiğiniz overhead gerçek bir şey satın alıyor. Cevap
hayırsa — yayına almak hâlâ koordineli bir release, bir host güncellemesi ya da birinden yeniden
deploy etmesini isteyen bir mesaj gerektiriyorsa — elinizde sınır yok. Elinizde bir build bölmesi
var. Critical path'e bir istek eklendi, her shared library için bir versiyon pazarlığı doğdu ve
stack trace artık başka bir repoda duran bir modülde kesiliyor. Karşılığında daha küçük bir
klasörünüz oldu.

Bir sınır, build config olmadan önce bir ekip sözleşmesi; config ise işin kolay kısmı. "Bu parça
remote olsun mu?" sorusunun cevabı da bu yüzden kod okunarak bulunamıyor. Cevap release sürecinde
ve on-call listesinde duruyor.

## Federation kısıtı kaldırdı, soruyu kaldırmadı

Uzun süre boyunca bir frontend'i bölmemenin sebebi, bölmenin pahalı olmasıydı. Kendi loader'ınızı
yazıyordunuz, router yüzünden tartışıyordunuz ve tek bir kullanıcı bir şey görmeden önce birinin
haftalar sürecek altyapı işini savunması gerekiyordu. O maliyet aslında bir filtre işi görüyordu,
çünkü tartışmayı yalnızca gerçekten karşılığı olan durumlar atlatıyordu. Federation maliyeti
kaldırdı, filtreyi de beraberinde götürdü. Bugün bir remote yirmi satır config ve bir pipeline
demek; o yüzden ciddi bir tartışmadan asla sağ çıkamayacak öneriler doğrudan geçiyor: klasör
büyüdü, build uzun sürüyor, bir sayfada başka bir framework isteniyor. Bunlar mimari gerekçe değil.
Bunlar artık ucuza yapılabilen şeyler ve ikisi aynı şey değil. Tooling de bu farkı sizin yerinize
söylemiyor.

## İkinci remote'la birlikte gelenler

İlk remote ucuz, o yüzden de yanıltıcı. Pahalı olan her şey ikinciyle birlikte geliyor.

Shared dependency'ler artık her ekibin kendi meselesi olmaktan çıkıyor. İki remote'un her birinin
kendi Vue'sunu, kendi router'ını ve kendi store kütüphanesini getirmesi, tek sayfada iki runtime
demek. Kimliği olan şeyler için — router, reactivity, store, tema sağlayıcı — ikinci bir kopya
maliyet değil, doğrudan bug. O yüzden bunları singleton yapıyorsunuz:

```ts
// webpack.config.ts — the host and every remote ship this block verbatim
shared: {
  vue: { singleton: true, requiredVersion: '^3.4.0', strictVersion: true },
  'vue-router': { singleton: true, requiredVersion: '^4.3.0', strictVersion: true },
  pinia: { singleton: true, requiredVersion: '^2.1.0', strictVersion: true },
  '@acme/ui': { singleton: true, requiredVersion: '^2.0.0' },
},
```

Bu bloğun ne söylediğine bir daha bakın. Bu sistemde hiçbir ekip Vue'yu, router'ı ya da design
system'i kendi takvimine göre yükseltemez. `strictVersion`, uyuşmazlığı sessiz bir ikinci kopya
yerine yükleme anında patlayan bir hataya çeviriyor; doğru ayar bu ve mimarinin ne olduğunu kabul
ettiği an da bu. Ekipleri birbirinden ayırmadınız. Coupling'i compiler'ın zorladığı yerden, yani
import grafiğinden çıkardınız ve bir insanın toplantıda zorladığı yere, yani beş repoda tekrarlanan
bir versiyon aralığına taşıdınız.

Gerisi peşinden geliyor. Design system kayıyor: button'ın 2.1'ine göre build edilmiş bir remote,
2.4'te olan bir host'un yanında duruyor ve aradaki fark, sahibi olmayan dört piksel padding. Auth
ikiye katlanıyor, çünkü her remote kullanıcının kim olduğunu bilmek zorunda; iki farklı refresh kodu
anlaşamadığı gün de kullanıcıyı önce fark eden remote çıkışa gönderiyor. Error handling aynı yolu
izliyor. Debugging ise repo arkeolojisine dönüşüyor: belirti host'ta, sebep remote'ta ve olayı
tekrar üretmek için üç dev server açıp versiyonlarının uyuşmasını ummak gerekiyor.

Bunların hiçbiri microfrontend'e karşı bir argüman değil. Bunlar faturanın kalemleri ve bu fatura,
bölme haklı olsa da olmasa da geliyor. O yüzden bölmenin karşılığında gerçekten bir şey alması
gerekiyor.

## Sınırı hak eden şeyler

**Farklı bir release ritmi.** Günde iki kez çıkan bir checkout akışı ile ayda bir çıkan bir
raporlama bölümü gerçekten farklı pipeline istiyor. Aynı pipeline'a sıkıştırıldıklarında yavaş olan,
hızlı olanı bekletiyor.

**Kendi on-call'u olan farklı bir ekip.** Gece üçte telefon çalıyorsa ve o koddan belirli bir grup
sorumlu tutuluyorsa, o grubun kimseyi uyandırmadan düzeltme çıkarabilmesi gerekiyor. Bu gerekçe tek
başına, diğerlerinin toplamından daha fazla remote'u haklı çıkarıyor.

**Gerçekten ayrı bir domain.** Ayrı bir sayfa değil; kendi sözlüğü ve kendi değişme sebepleri olan
ayrı bir domain. İki parça her gereksinim değişikliğinde birlikte değişiyorsa, onlar iki isim
takınmış tek bir şey.

**Host yeniden yazılsa da ayakta kalması gereken bir parça.** Bir admin kabuğu birkaç yılda bir
değişiyor; içine gömülü bir editör ya da üçüncü taraflara verilen bir widget onunla birlikte yeniden
yazılmamalı. Burada izolasyon işin amacı.

## Hak etmeyen gerekçeler

"Build'imiz yavaş." Build'i düzeltin. İki yavaş build ve üstüne bir runtime entegrasyon adımı
hiçbir şeyi hızlandırmıyor; yavaşlığı sadece başkasının sorunu yapıyor.

"Klasör çok büyüdü." O bir klasör. Büyük bir klasör isimlendirme sorunu.

"Bu sayfada React kullanmak istiyoruz." Bu cümleyi design review'da yüksek sesle söyleyin, iki
bundle boyutu da ekranda olsun ve kimin katıldığına bakın. Bazen insanlar katılıyor; o zaman da
açıkça verilmiş gerçek bir karar oluyor. Olmaması gereken şey, framework seçiminin başka
gerekçelerle savunulmuş bir sınırın yan etkisi olarak gelmesi.

## Shared store değil, contract

Sınır gerçek olduktan sonraki karar, parçaların nasıl konuştuğu. Benim durduğum yer dar: remote'un
sahip olduğu, versiyonlanmış bir props ve event yüzeyi, başka hiçbir şey.

```ts
// contracts/reports-panel.ts — owned by the remote, versioned, imported by the host
export interface ReportsPanelProps {
  readonly organisationId: string
  readonly period: { from: string; to: string }
  readonly locale: 'en' | 'tr'
}

export interface ReportsPanelEvents {
  (e: 'export-requested', format: 'csv' | 'pdf'): void
  (e: 'failed', detail: { code: string; message: string }): void
}
```

O dosya anlaşmanın tamamı. Review edilebiliyor, versiyonlanabiliyor, içindeki breaking change
breaking change gibi görünüyor ve remote bu dosyanın arkasında baştan yazılsa host farkına varmıyor.
Bir alan eklemek de bu dosyayı açıp gerekçe sunmayı gerektiriyor; bir sınırın yaratması gereken
sürtünme tam olarak bu.

Ekiplerin bunun yerine uzandığı şey shared store oluyor:

```ts
// don't: the host and three remotes all reach into one store
import { useAppStore } from '@acme/shared-store'

const store = useAppStore()
store.filters.period = { from, to }   // who else reacts to this?
store.reports.rows = rows             // who else writes here?
```

Bu, bir ay kadar rahat bir çözüm. Sonrasında hiçbir remote tek başına anlaşılamıyor, çünkü davranışı
başka repolardaki kodun yaptığı yazmalara bağlı. Store'un şekli, dört ekibin review'suz değiştirdiği
bir API'ye dönüşüyor; bir remote'taki mutation başka bir remote'un render'ını bozuyor ve düzeltme
koordineli deploy istiyor. Bu, üstüne birkaç adım eklenmiş dağıtık bir monolith: monolith'in
coupling'i artı dağıtık bir sistemin latency'si, versiyonlaması ve debugging hikâyesi. İki parça
mutable state'i bu kadar serbest paylaşmak zorundaysa, o parçalar zaten hiç ayrı değildi.

## Nerede tıkanıyor

Tek ekiple microfrontend, ödeyeni olmayan bir maliyet. Faturanın her kalemi yine karşınıza çıkıyor,
ama satın aldığı şeyin — bağımsız sahiplerin bağımsız release'i — alıcısı yok. Üç remote'u olan tek bir
ekip, kendi kendisiyle konuşmak için dağıtık sistem vergisi ödüyor.

Shared dependency pazarlığı hiç bitmiyor. Framework'ün, router'ın ve design system'in her major
versiyonu ekipler arası bir takvim sorununa dönüşüyor. Cevap ya kimsenin zamanı olmayan topluca bir
upgrade oluyor ya da iki versiyona birden dayanan bir runtime; o da bundle boyutuna mal oluyor ve
karşılığında yalnızca production'da görünen bir hata sınıfı veriyor.

Local development de belirgin biçimde kötüleşiyor; bu da hiçbir mimari şemada görünmediği için
kimsenin hesaba katmadığı maliyet. Uygulamayı çalıştırmak, host'un yanında ihtiyaç duyduğunuz
remote'ları da çalıştırmak demek; hot reload sınırın iki yakası arasında daha az güvenilir çalışıyor
ve sizin makinenizdeki versiyonlar production'daki versiyonlar değil. Bu, projedeki herkesin her gün
ödediği bir vergi; sınıra hiç yaklaşmayanlar dahil. İki ekip ve ayrı on-call için bu vergiyi öderim.
Büyük bir klasör için ödemem.
