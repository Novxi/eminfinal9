
export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  src: string;
  tags: string[];
  date: string;
  description: string;
  location?: string;
  company?: string;
  scope?: string;
  featured?: boolean;
  width?: number;
  height?: number;
}

export const galleryCategories = [
  "Tümü",
  "Güvenlik Kamera",
  "Yangın Alarm",
  "Hırsız Alarm",
  "Plaka Okuma",
  "Fiber Optik",
  "Network Altyapı",
  "Geçiş Kontrol",
  "IP Santral",
  "Enerji Sistemleri",
  "Web Siteleri",
  "Mobil Uygulamalar",
  "Elektrik Proje",
  "AKINSOFT Yazılım Çözümleri"
];

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Kurumsal Web Sitesi Projesi",
    category: "Web Siteleri",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    tags: ["web", "kurumsal", "tasarım"],
    date: "2024-02-15",
    description: "Modern ve kullanıcı dostu arayüzü ile kurumsal kimliği yansıtan web sitesi projesi.",
    location: "İstanbul",
    company: "Emin Teknoloji A.Ş.",
    scope: "UI/UX Tasarımı, Frontend ve Backend Geliştirme",
    featured: true,
    width: 2426,
    height: 1515
  },
  {
    id: "2",
    title: "E-Ticaret Platformu",
    category: "Web Siteleri",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop",
    tags: ["e-ticaret", "web", "satış"],
    date: "2024-01-20",
    description: "Yüksek performanslı ve güvenli altyapıya sahip e-ticaret platformu.",
    location: "Ankara",
    company: "Global Market Ltd.",
    scope: "E-Ticaret Altyapısı, Ödeme Sistemleri Entegrasyonu",
    featured: true,
    width: 2653,
    height: 1768
  },
  {
    id: "3",
    title: "Mobil Satış Uygulaması",
    category: "Mobil Uygulamalar",
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
    tags: ["mobil", "app", "ios", "android"],
    date: "2023-12-10",
    description: "Kullanıcı deneyimini odağına alan, yüksek dönüşüm oranlı mobil alışveriş uygulaması.",
    location: "İzmir",
    company: "Moda Dünyası",
    scope: "iOS ve Android Uygulama Geliştirme",
    width: 2670,
    height: 1780
  },
  {
    id: "4",
    title: "Güvenlik Kamera İzleme Merkezi",
    category: "Güvenlik Kamera",
    src: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2670&auto=format&fit=crop",
    tags: ["cctv", "güvenlik", "kamera"],
    date: "2023-11-05",
    description: "7/24 aktif izleme ve kayıt sağlayan yüksek çözünürlüklü güvenlik kamera sistemi.",
    location: "Bursa",
    company: "Sanayi Bölgesi Yönetimi",
    scope: "IP Kamera Kurulumu, İzleme Merkezi Kurulumu",
    featured: true,
    width: 2670,
    height: 1780
  },
  {
    id: "5",
    title: "Geçiş Kontrol Sistemi",
    category: "Geçiş Kontrol",
    src: "https://images.unsplash.com/photo-1558002038-1091a1661116?q=80&w=2670&auto=format&fit=crop",
    tags: ["access control", "güvenlik", "kartlı geçiş"],
    date: "2023-10-15",
    description: "Personel ve ziyaretçi takibi için geliştirilen güvenli geçiş kontrol sistemi.",
    location: "Kocaeli",
    company: "Lojistik Merkezi",
    scope: "Kartlı Geçiş ve Turnike Sistemleri",
    width: 2670,
    height: 1780
  },
  {
    id: "6",
    title: "Yangın Algılama Sistemi",
    category: "Yangın Alarm",
    src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
    tags: ["yangın", "alarm", "güvenlik"],
    date: "2023-09-20",
    description: "Erken uyarı sistemi ile tesis güvenliğini sağlayan adresli yangın algılama sistemi.",
    location: "Antalya",
    company: "Tatil Köyü",
    scope: "Adresli Yangın Algılama ve İhbar Sistemi",
    width: 2574,
    height: 1716
  },
  {
    id: "7",
    title: "AKINSOFT ERP Entegrasyonu",
    category: "AKINSOFT Yazılım Çözümleri",
    src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
    tags: ["erp", "yazılım", "akinsoft"],
    date: "2023-08-30",
    description: "İş süreçlerini optimize eden kapsamlı AKINSOFT ERP yazılım çözümü entegrasyonu.",
    location: "İstanbul",
    company: "Üretim Fabrikası",
    scope: "Wolvox ERP Kurulumu ve Personel Eğitimi",
    featured: true,
    width: 2565,
    height: 1710
  },
  {
    id: "8",
    title: "Plaka Tanıma Sistemi",
    category: "Plaka Okuma",
    src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2698&auto=format&fit=crop",
    tags: ["pts", "plaka", "otopark"],
    date: "2023-08-05",
    description: "Site ve otopark girişleri için yüksek doğruluk oranlı plaka tanıma sistemi.",
    location: "Ankara",
    company: "Modern Konut Sitesi",
    scope: "PTS Kamera ve Yazılım Kurulumu",
    width: 2698,
    height: 1518
  },
  {
    id: "9",
    title: "Hırsız Alarm Sistemi",
    category: "Hırsız Alarm",
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop",
    tags: ["alarm", "hırsız", "güvenlik"],
    date: "2023-07-12",
    description: "Ev ve işyerleri için akıllı sensörlerle donatılmış hırsız alarm sistemi.",
    location: "İzmir",
    company: "Özel Villa Projesi",
    scope: "Kablosuz Alarm Sistemi Kurulumu",
    width: 2670,
    height: 1780
  },
  {
    id: "10",
    title: "Network Altyapı Kablolama",
    category: "Network Altyapı",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop",
    tags: ["network", "kablolama", "altyapı"],
    date: "2023-06-25",
    description: "Yüksek hızlı veri transferi sağlayan yapısal kablolama ve network altyapı projesi.",
    location: "İstanbul",
    company: "Plaza Ofisleri",
    scope: "Cat6 Kablolama ve Kabinet Düzenleme",
    width: 2669,
    height: 1779
  },
  {
    id: "11",
    title: "Fiber Optik Sonlandırma",
    category: "Fiber Optik",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop",
    tags: ["fiber", "optik", "internet"],
    date: "2023-06-10",
    description: "Uzun mesafeli ve kayıpsız veri iletimi için fiber optik kablolama ve sonlandırma.",
    location: "Bursa",
    company: "Üniversite Kampüsü",
    scope: "Fiber Optik Kablo Çekimi ve Füzyon Ek",
    width: 2670,
    height: 1780
  },
  {
    id: "12",
    title: "IP Santral Sistemi",
    category: "IP Santral",
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop",
    tags: ["santral", "ip", "telefon"],
    date: "2023-05-15",
    description: "Kurumsal iletişim ihtiyaçları için esnek ve ölçeklenebilir IP santral çözümü.",
    location: "İstanbul",
    company: "Çağrı Merkezi",
    scope: "IP Santral Kurulumu ve IP Telefon Entegrasyonu",
    featured: true,
    width: 2612,
    height: 1740
  },
  {
    id: "13",
    title: "Enerji Sistemleri Kurulumu",
    category: "Enerji Sistemleri",
    src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2670&auto=format&fit=crop",
    tags: ["enerji", "elektrik", "altyapı"],
    date: "2023-04-20",
    description: "Kesintisiz güç kaynağı ve enerji altyapı sistemleri kurulumu.",
    location: "Ankara",
    company: "Veri Merkezi",
    scope: "UPS ve Jeneratör Entegrasyonu",
    width: 2670,
    height: 1780
  },
  {
    id: "14",
    title: "Elektrik Proje Çizimi",
    category: "Elektrik Proje",
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2670&auto=format&fit=crop",
    tags: ["proje", "elektrik", "mühendislik"],
    date: "2023-03-15",
    description: "Endüstriyel tesisler için detaylı elektrik proje ve mühendislik hizmetleri.",
    location: "İzmir",
    company: "Tekstil Fabrikası",
    scope: "Elektrik Tesisat Projesi ve Aydınlatma Tasarımı",
    width: 2670,
    height: 1780
  }
];

