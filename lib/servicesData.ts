import { 
  LucideIcon, Camera, Flame, Lock, Network, Server, Zap, Wifi, Globe, 
  Smartphone, Fingerprint, Activity, Scan, Monitor 
} from 'lucide-react';

export interface FAQItem {
  q: string;
  a: string;
}

export interface Service {
  id: string;
  title: string;
  category: 'Güvenlik' | 'Altyapı' | 'Yazılım' | 'Enerji';
  tagline: string;
  problem: string;
  solution: string;
  features: string[];
  process_steps: string[];
  deliverables: string[];
  faq: FAQItem[];
  icon: string;
  color: string;
  metrics?: { label: string; value: string }[];
}

export const services: Service[] = [
  {
    id: 'guvenlik-kamera',
    title: 'Güvenlik Kamera',
    category: 'Güvenlik',
    tagline: 'Yapay zeka destekli izleme ve kayıt sistemleri.',
    problem: 'Kör noktalar ve düşük çözünürlüklü eski sistemler güvenlik zafiyeti oluşturur.',
    solution: '4K UHD çözünürlük and AI nesne tanıma ile 7/24 kesintisiz, akıllı izleme sağlıyoruz.',
    features: ['4K UHD Gece Görüşü', 'AI Nesne Tanıma', 'Mobil İzleme', 'Bulut Kayıt Desteği'],
    process_steps: ['Saha Keşfi', 'Projelendirme', 'Montaj', 'Sistem Testi'],
    deliverables: ['Kamera Sistemi', 'Kayıt Cihazı', 'Mobil Uygulama Erişimi', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'Gece görüşü ne kadar etkili?', a: 'Sıfır ışıkta bile 30-50 metreye kadar net görüntü sağlayan IR ve Starlight teknolojilerini kullanıyoruz.' }],
    icon: 'Camera',
    color: '#0ea5e9',
    metrics: [{ label: 'Çözünürlük', value: '4K UHD' }, { label: 'Yapay Zeka', value: '%99 Doğruluk' }]
  },
  {
    id: 'yangin-alarm',
    title: 'Yangın Alarm',
    category: 'Güvenlik',
    tagline: 'Erken uyarı sensörleri ve akıllı adresli sistemler.',
    problem: 'Geç fark edilen yangınlar telafisi mümkün olmayan hasarlara yol açar.',
    solution: 'Hassas algılama ve anında uyarı veren LPCB onaylı adresli sistemler kuruyoruz.',
    features: ['LPCB Onaylı', 'Adresli Panel', 'Hassas Algılama', 'Otomatik İtfaiye Bildirimi'],
    process_steps: ['Risk Analizi', 'Sensör Yerleşimi', 'Kablolama', 'Devreye Alma'],
    deliverables: ['Yangın Paneli', 'Duman Dedektörleri', 'Sirenler', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'Bakım periyodu nedir?', a: 'Yönetmelik gereği ve sistem sağlığı için 6 ayda bir periyodik bakım öneriyoruz.' }],
    icon: 'Flame',
    color: '#ef4444',
    metrics: [{ label: 'Tepki Süresi', value: '< 3sn' }, { label: 'Onay', value: 'LPCB' }]
  },
  {
    id: 'hirsiz-alarm',
    title: 'Hırsız Alarm',
    category: 'Güvenlik',
    tagline: 'Profesyonel koruma ve mobil bildirim altyapısı.',
    problem: 'Geleneksel kilitler tek başına caydırıcı değildir ve müdahalede geç kalınır.',
    solution: 'Mobil bildirimli, merkezi gözlem istasyonu bağlantılı hibrit sistemler sunuyoruz.',
    features: ['Kablosuz Hibrit', 'Pet-Friendly', 'Merkezi Gözlem', 'Panik Butonu'],
    process_steps: ['Zafiyet Analizi', 'Ekipman Seçimi', 'Kurulum', 'Eğitim'],
    deliverables: ['Alarm Paneli', 'Hareket Sensörleri', 'Manyetik Kontaklar', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'Evcil hayvanım alarmı çaldırır mı?', a: 'Hayır, kullandığımız dedektörler belirli bir kiloya kadar olan evcil hayvanları algılamaz.' }],
    icon: 'Lock',
    color: '#f59e0b',
    metrics: [{ label: 'Bağlantı', value: 'Hibrit' }, { label: 'Mobil', value: '7/24 Aktif' }]
  },
  {
    id: 'plaka-okuma',
    title: 'Plaka Okuma',
    category: 'Güvenlik',
    tagline: 'Site ve otopark girişleri için otomatik plaka tanıma.',
    problem: 'Manuel giriş kontrolleri zaman kaybına ve güvenlik açıklarına neden olur.',
    solution: '%99.8 tanıma oranı ile bariyer otomasyonuna entegre hızlı geçiş sistemleri.',
    features: ['%99.8 Tanıma', 'Bariyer Kontrolü', 'Loglama Sistemi', 'Kara Liste Uyarı'],
    process_steps: ['Açı Analizi', 'Kamera Montajı', 'Yazılım Kurulumu', 'Veritabanı Entegrasyonu'],
    deliverables: ['LPR Kamera', 'Yazılım Lisansı', 'Yönetim Paneli', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'Gece plaka okur mu?', a: 'Evet, özel IR aydınlatmalı LPR kameralarımız zifiri karanlıkta bile net okuma yapar.' }],
    icon: 'Scan',
    color: '#10b981',
    metrics: [{ label: 'Doğruluk', value: '%99.8' }, { label: 'Hız', value: '< 1sn' }]
  },
  {
    id: 'fiber-optik',
    title: 'Fiber Optik',
    category: 'Altyapı',
    tagline: 'Yüksek hızlı veri iletimi ve sonlandırma hizmetleri.',
    problem: 'Bakır kablolama mesafesi ve hızı modern veri ihtiyaçlarını karşılamaz.',
    solution: 'Uçtan uca fiber altyapı, fusion ek ve OTDR test raporu ile yüksek hız garantisi.',
    features: ['Fusion Ek', 'OTDR Test Raporu', 'Gpon Altyapı', 'Yüksek Bant Genişliği'],
    process_steps: ['Kablo Çekimi', 'Sonlandırma', 'Fusion Ek', 'OTDR Testi'],
    deliverables: ['Fiber Altyapı', 'Test Raporları', 'Sonlandırma Kutuları', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'OTDR testi neden önemli?', a: 'Kablodaki kayıpları ve ek kalitesini bilimsel olarak kanıtlar, arıza tespitini kolaylaştırır.' }],
    icon: 'Activity',
    color: '#8b5cf6',
    metrics: [{ label: 'Hız', value: '10Gbps+' }, { label: 'Test', value: 'OTDR' }]
  },
  {
    id: 'network-altyapi',
    title: 'Network Altyapı',
    category: 'Altyapı',
    tagline: 'Kurumsal ağ kurulumu ve kabinet düzenleme.',
    problem: 'Düzensiz kablolama ve yanlış yapılandırılmış ağlar kopmalara neden olur.',
    solution: 'Cat6/7 standartlarında sertifikalı kablolama ve profesyonel switch konfigürasyonu.',
    features: ['Cat6/Cat7 Kablo', 'Switch Konfig', 'Firewall Güvenlik', 'Kabinet Düzenleme'],
    process_steps: ['Keşif', 'Yapısal Kablolama', 'Etiketleme', 'Konfigürasyon'],
    deliverables: ['Network Şeması', 'Test Sonuçları', 'Kurulu Sistem', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'Eski kabinleri düzenliyor musunuz?', a: 'Evet, karmaşık kabinleri profesyonel etiketleme ve düzenleme ile modernize ediyoruz.' }],
    icon: 'Network',
    color: '#0ea5e9',
    metrics: [{ label: 'Standart', value: 'Cat6/7' }, { label: 'Güvenlik', value: 'Firewall' }]
  },
  {
    id: 'gecis-kontrol',
    title: 'Geçiş Kontrol',
    category: 'Güvenlik',
    tagline: 'Kartlı, şifreli ve biyometrik geçiş sistemleri.',
    problem: 'Anahtar yönetimi zordur ve kimin nereye girdiğini takip etmek imkansızdır.',
    solution: 'Yüz tanıma ve kartlı sistemlerle tam denetim ve PDKS entegrasyonu sağlıyoruz.',
    features: ['Yüz Tanıma', 'PDKS Entegrasyon', 'Turnike Kontrol', 'Mobil Geçiş'],
    process_steps: ['Yetki Planlama', 'Donanım Montajı', 'Yazılım Entegrasyonu', 'Tanımlamalar'],
    deliverables: ['Okuyucular', 'Kontrol Panelleri', 'Yönetim Yazılımı', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'Elektrik kesilirse ne olur?', a: 'Sistemlerimiz akü desteği ile çalışmaya devam eder veya güvenli modda kapıları açar.' }],
    icon: 'Fingerprint',
    color: '#3b82f6',
    metrics: [{ label: 'Biyometrik', value: 'Yüz/Parmak' }, { label: 'Kapasite', value: 'Sınırsız' }]
  },
  {
    id: 'ip-santral',
    title: 'IP Santral',
    category: 'Altyapı',
    tagline: 'Bulut tabanlı ve yerel iletişim çözümleri.',
    problem: 'Eski tip santraller yüksek maliyetli ve esneklikten uzaktır.',
    solution: 'Sınırsız hat kapasiteli, sesli karşılama ve görüntülü görüşme destekli IP çözümler.',
    features: ['Sınırsız Hat', 'Sesli Karşılama', 'Görüntülü Görüşme', 'Mobil Dahili'],
    process_steps: ['İhtiyaç Analizi', 'Numara Taşıma', 'Kurulum', 'Dahili Tanımlama'],
    deliverables: ['IP Telefonlar', 'Santral Yazılımı/Donanımı', 'Ses Kayıt Sistemi', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'Dışarıdayken ofis telefonuma bakabilir miyim?', a: 'Evet, mobil uygulama sayesinde akıllı telefonunuzu dahili numaranız gibi kullanabilirsiniz.' }],
    icon: 'Server',
    color: '#6366f1',
    metrics: [{ label: 'Hat', value: 'Sınırsız' }, { label: 'Kalite', value: 'HD Ses' }]
  },
  {
    id: 'enerji-sistemleri',
    title: 'Enerji Sistemleri',
    category: 'Enerji',
    tagline: 'UPS ve Araç Şarj İstasyonları kurulumu.',
    problem: 'Enerji dalgalanmaları hassas cihazlara zarar verir ve iş sürekliliğini bozar.',
    solution: 'Online UPS sistemleri ve modern elektrikli araç şarj üniteleri kurulumu.',
    features: ['Online UPS', 'Şarj Üniteleri', 'Yük Dengeleme', 'Akü İzleme'],
    process_steps: ['Güç Analizi', 'Ürün Seçimi', 'Kablolama', 'Test'],
    deliverables: ['UPS Ünitesi', 'Şarj İstasyonu', 'Güç Panosu', '2 Yıl Teknik Servis Garantisi'],
    faq: [{ q: 'Araç şarjı ne kadar sürer?', a: 'İstasyonun gücüne ve aracın kapasitesine göre 2 ile 8 saat arasında değişmektedir.' }],
    icon: 'Zap',
    color: '#fbbf24',
    metrics: [{ label: 'UPS', value: 'Online' }, { label: 'Şarj', value: 'AC/DC' }]
  },
  {
    id: 'web-siteleri',
    title: 'Web Siteleri',
    category: 'Yazılım',
    tagline: 'Kurumsal web sitesi ve özel yazılım çözümleri.',
    problem: 'Yavaş ve mobil uyumsuz siteler müşteri kaybına neden olur.',
    solution: 'SEO uyumlu, yüksek performanslı ve modern arayüzlü web projeleri.',
    features: ['SEO Uyumlu', 'Hızlı Performans', 'Yönetim Paneli', 'Responsive Tasarım'],
    process_steps: ['Tasarım', 'Geliştirme', 'İçerik Girişi', 'Yayın'],
    deliverables: ['Web Sitesi', 'Yönetim Paneli', 'Eğitim Dokümanı', '1 Yıl Teknik Destek Garantisi'],
    faq: [{ q: 'Google\'da üst sıralara çıkar mıyım?', a: 'Sitenizi teknik SEO kurallarına %100 uyumlu geliştiriyoruz, bu da sıralamanızı olumlu etkiler.' }],
    icon: 'Globe',
    color: '#14b8a6',
    metrics: [{ label: 'Hız', value: 'A+ Skor' }, { label: 'SEO', value: '%100 Uyum' }]
  },
  {
    id: 'mobil-uygulamalar',
    title: 'Mobil Uygulamalar',
    category: 'Yazılım',
    tagline: 'iOS ve Android için native ve hibrit uygulamalar.',
    problem: 'Sadece web sitesi üzerinden hizmet vermek kullanıcı bağlılığını düşürür.',
    solution: 'Hızlı, kullanıcı dostu ve API entegrasyonlu mobil uygulama çözümleri.',
    features: ['Cross-Platform', 'Push Bildirim', 'API Entegrasyon', 'Mağaza Yayınlama'],
    process_steps: ['Wireframe', 'UI/UX Tasarım', 'Kodlama', 'Mağaza Onayı'],
    deliverables: ['iOS Uygulaması', 'Android Uygulaması', 'Admin Panel', '1 Yıl Teknik Destek Garantisi'],
    faq: [{ q: 'Mağaza süreçlerini siz mi yönetiyorsunuz?', a: 'Evet, Apple App Store ve Google Play Store yayınlama süreçlerini uçtan uca yönetiyoruz.' }],
    icon: 'Smartphone',
    color: '#f43f5e',
    metrics: [{ label: 'Platform', value: 'iOS/Android' }, { label: 'Teknoloji', value: 'React Native' }]
  },
  {
    id: 'elektrik-proje',
    title: 'Elektrik Proje',
    category: 'Enerji',
    tagline: 'Mühendislik planlama ve taahhüt hizmetleri.',
    problem: 'Hatalı projeler maliyet artışına ve güvenlik risklerine yol açar.',
    solution: 'Mühendislik standartlarında OG/AG proje çizimi ve topraklama ölçümleri.',
    features: ['OG/AG Proje', 'Topraklama Ölçüm', 'Aydınlatma Hesabı', 'Pano Tasarımı'],
    process_steps: ['Hesaplamalar', 'Çizim', 'Onay Süreci', 'Uygulama'],
    deliverables: ['Onaylı Proje', 'Ölçüm Raporları', 'Hakediş Dosyası', 'Resmi Onay Garantisi'],
    faq: [{ q: 'Topraklama ölçümü zorunlu mu?', a: 'Evet, iş sağlığı ve güvenliği yönetmelikleri gereği yıllık periyodik ölçüm zorunludur.' }],
    icon: 'Wifi',
    color: '#64748b',
    metrics: [{ label: 'Mühendislik', value: 'Sertifikalı' }, { label: 'Standart', value: 'TSE/IEC' }]
  },
  {
    id: 'akinsoft-yazilim',
    title: 'AKINSOFT Yazılım Çözümleri',
    category: 'Yazılım',
    tagline: 'Wolvox ERP, Ön Muhasebe ve E-Dönüşüm Çözümleri.',
    problem: 'İşletme süreçlerinin manuel takibi hata payını artırır ve verimliliği düşürür.',
    solution: 'Türkiye\'nin lider ERP yazılımı ile stoktan üretime tam kontrol.',
    features: ['ERP Entegrasyonu', 'E-Fatura & Arşiv', 'Stok Yönetimi', 'Üretim Takip'],
    process_steps: ['Analiz', 'Veri Aktarımı', 'Eğitim', 'Destek'],
    deliverables: ['Yazılım Lisansı', 'Eğitim', 'Destek Paketi', 'AKINSOFT Lisans Garantisi'],
    faq: [{ q: 'E-Faturaya geçiş zor mu?', a: 'Hayır, AKINSOFT ile e-dönüşüm süreçlerini birkaç saat içinde tamamlıyoruz.' }],
    icon: 'Monitor',
    color: '#0ea5e9',
    metrics: [{ label: 'Pazar Payı', value: 'Lider' }, { label: 'Destek', value: 'Yerinde/Uzak' }]
  }
];

export const ctaData = {
  headline: "Teknolojinizi Geleceğe Hazırlayalım",
  subtext: "İhtiyaçlarınıza en uygun mühendislik çözümünü birlikte planlayalım.",
  buttons: [
    "Hemen Teklif Al",
    "WhatsApp Destek"
  ]
};
