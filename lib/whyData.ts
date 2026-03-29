import { ShieldCheck, Zap, Eye, BarChart3, Layers, MessageSquare } from 'lucide-react';

export const whyHero = {
  headline: "Neden Emin Bilgi İşlem?",
  subheadline: "Zayıf akım sistemlerinde ileri mühendislik hesaplamaları ve global standartlarla, güvenliği bir lüks değil, standart haline getiriyoruz. Projelerinizi yarının teknolojisiyle bugünden inşa edin.",
  badges: [
    "İleri Mühendislik",
    "Teknik Uzmanlık",
    "Global Standartlar",
    "7/24 Kesintisiz Destek"
  ]
};

export const trustMetrics = [
  { label: "Mühendislik Hassasiyeti", value: "%100", note: "Hata payı sıfır" },
  { label: "Sertifikalı Uzman", value: "20+", note: "Teknik kadro" },
  { label: "Yıllık Bakım", value: "7/24", note: "Kesintisiz destek" },
  { label: "Müşteri Memnuniyeti", value: "%100", note: "Referans bazlı" },
  { label: "Tamamlanan Proje", value: "500+", note: "Başarı hikayesi" },
  { label: "Sektörel Deneyim", value: "15 Yıl", note: "Köklü geçmiş" }
];

export const comparisonData = {
  leftTitle: "Emin Bilgi İşlem",
  rightTitle: "Standart Firmalar",
  rows: [
    {
      topic: "Mühendislik Yaklaşımı",
      us: "İhtiyaca özel, simülasyon destekli mühendislik hesaplamaları ve verimlilik odaklı tasarım.",
      typical: "Ezbere dayalı, standart ve çoğu zaman ihtiyacı tam karşılamayan kurulumlar."
    },
    {
      topic: "Teknik Kadro",
      us: "Sürekli eğitim alan, global sertifikalı ve güncel teknolojiye hakim uzman mühendis kadrosu.",
      typical: "Yetersiz teknik bilgiye sahip, denetimsiz ve geçici personel."
    },
    {
      topic: "Ekipman Kalitesi",
      us: "Global markalar ve performans testlerinden geçmiş, uzun ömürlü ve onaylı donanımlar.",
      typical: "Düşük kaliteli, garanti dışı kalmaya meyilli ve arıza riski yüksek ucuz ekipmanlar."
    },
    {
      topic: "Satış Sonrası Destek",
      us: "7/24 kesintisiz teknik servis, periyodik sistem bakımı ve anında müdahale garantisi.",
      typical: "Kurulum sonrası ulaşılamayan veya teknik sorunlara geç dönen destek ekipleri."
    },
    {
      topic: "Proje Yönetimi",
      us: "Uçtan uca şeffaf süreç yönetimi, düzenli raporlama ve anahtar teslim çözümler.",
      typical: "Belirsiz teslim süreleri, gizli maliyetler ve koordinasyon eksikliği."
    }
  ]
};

export const guarantees = [
  {
    title: "Performans Garantisi",
    desc: "Kurduğumuz sistemlerin vaat edilen performans değerlerini %100 karşılayacağını garanti ediyoruz.",
    icon: Zap
  },
  {
    title: "Süreklilik Garantisi",
    desc: "Bakım anlaşmalı sistemlerimizde %99.9 çalışma süresi (uptime) taahhüt ediyoruz.",
    icon: ShieldCheck
  },
  {
    title: "Şeffaf Maliyet",
    desc: "Proje başında belirlenen bütçe dışında hiçbir gizli maliyetle karşılaşmayacağınızın sözünü veriyoruz.",
    icon: BarChart3
  }
];

export const principles = [
  {
    title: "Mühendislik ve Teknik Uzmanlık",
    desc: "Zayıf akım gibi karmaşık sistemlerde işin ehliyle çalışmanın güvenini yaşayın.",
    icon: ShieldCheck,
    details: [
      "İleri Mühendislik Çözümleri",
      "Sertifikalı ve Uzman Kadro",
      "Hata Payı Sıfır Hedefi"
    ]
  },
  {
    title: "Kalite ve Standartlara Uyumluluk",
    desc: "ISO, EN ve TSE standartları bizim için bir seçenek değil, zorunluluktur.",
    icon: Zap,
    details: [
      "Uluslararası Standartlarda Uygulama",
      "Global Markalarla İş Ortaklığı",
      "%100 Yönetmelik Uyumu"
    ]
  },
  {
    title: "Uçtan Uca (Entegre) Hizmet",
    desc: "Farklı sistemler için farklı firmalarla uğraşmanıza gerek kalmadan tek elden çözüm.",
    icon: Layers,
    details: [
      "Anahtar Teslim Projeler",
      "Tam Entegre Akıllı Sistemler",
      "Tek Merkezden Yönetim"
    ]
  },
  {
    title: "Güven ve Satış Sonrası Destek",
    desc: "Sistemleriniz kurulduktan sonra da 7/24 yanınızdayız.",
    icon: MessageSquare,
    details: [
      "Kesintisiz Teknik Destek",
      "Periyodik Bakım Hizmetleri",
      "Ölçeklenebilir Altyapılar"
    ]
  },
  {
    title: "Verimlilik ve Optimizasyon",
    desc: "Bütçenizi en verimli şekilde kullanarak en yüksek performansı elde edin.",
    icon: BarChart3,
    details: [
      "Maliyet ve Performans Dengesi",
      "Optimize Edilmiş Çözümler",
      "Sürdürülebilir Teknoloji"
    ]
  }
];

export const howWeWork = {
  title: "Nasıl Çalışıyoruz?",
  steps: [
    {
      name: "Keşif & Analiz",
      desc: "Sahanın fiziksel koşulları ve güvenlik ihtiyaçları yerinde tespit edilir.",
      deliverables: ["Keşif Raporu", "Risk Analizi", "İhtiyaç Listesi"]
    },
    {
      name: "Mühendislik & Proje",
      desc: "İhtiyaca uygun teknik hesaplamalarla en verimli sistem tasarlanır.",
      deliverables: ["Teknik Çizimler", "Sistem Mimarisi", "Ekipman Planı"]
    },
    {
      name: "Kurulum & Montaj",
      desc: "Sertifikalı uzman ekibimiz tarafından standartlara uygun montaj yapılır.",
      deliverables: ["Kablolama", "Cihaz Montajı", "Sistem Entegrasyonu"]
    },
    {
      name: "Test & Devreye Alma",
      desc: "Sistem tüm senaryolarda test edilir ve %100 çalışır halde teslim edilir.",
      deliverables: ["Performans Testi", "Kullanıcı Eğitimi", "Teslim Tutanağı"]
    },
    {
      name: "Bakım & Destek",
      desc: "Süreklilik için periyodik kontroller ve 7/24 teknik destek sağlanır.",
      deliverables: ["Bakım Takvimi", "7/24 Servis", "Sistem Güncellemeleri"]
    }
  ]
};

export const qualityChecks = [
  "Uluslararası Standart Uyumu (ISO/EN)",
  "Saha Keşif ve Risk Analizi",
  "Ekipman Performans Testleri",
  "Kablolama ve Sinyal Kalitesi",
  "Sistem Entegrasyon Kontrolü",
  "Uçtan Uca Güvenlik Testi",
  "Kullanıcı Eğitim ve Dokümantasyon"
];

export const faqs = [
  {
    q: "Hangi markalarla çalışıyorsunuz?",
    a: "Dünyanın en güvenilir ve performans testlerinden geçmiş global markalarıyla (Honeywell, Cisco, Bosch vb.) iş ortaklığı yapıyoruz."
  },
  {
    q: "Satış sonrası destek süreci nasıl işliyor?",
    a: "7/24 teknik servis hattımız ve periyodik bakım anlaşmalarımızla sistemlerinizin sürekliliğini garanti altına alıyoruz."
  },
  {
    q: "Mevcut sistemlerimizi entegre edebilir misiniz?",
    a: "Evet, mevcut altyapınızı analiz ederek yeni teknolojilerle konuşan, tam entegre bir yapıya dönüştürebiliyoruz."
  },
  {
    q: "Ücretsiz keşif hizmetiniz neleri kapsıyor?",
    a: "Uzman mühendislerimiz sahanızı ziyaret ederek mevcut riskleri analiz eder, ihtiyaçlarınızı belirler ve size en verimli çözüm yol haritasını içeren detaylı bir rapor sunar. Bu hizmetimiz tamamen ücretsizdir ve herhangi bir taahhüt gerektirmez."
  }
];

export const ctaContent = {
  headline: "Projenizi Mühendislik Gücüyle İnşa Edelim.",
  subtext: "İhtiyaçlarınızı analiz edelim, en verimli ve güvenli yol haritasını birlikte çıkaralım.",
  buttons: [
    { label: "Ücretsiz Keşif İste", primary: true },
    { label: "Teknik Bilgi Al", primary: false }
  ]
};
