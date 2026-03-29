import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Flame, BellRing, Car, Zap, Network, 
  Fingerprint, PhoneCall, BatteryCharging, Globe, 
  Smartphone, Lightbulb, Database, ArrowRight, CheckCircle2, 
  ShieldCheck, ChevronLeft, Send, Sparkles, Check, X, Plus,
  Building2, Ruler, Calendar, Upload, FileText, Info,
  Clock, MapPin, User, Mail, Phone, Briefcase,
  Layers, Target, DollarSign, MessageSquare, Shield, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Types & Constants ---

type ServiceId = 
  | 'cctv' | 'yangin' | 'hirsiz' | 'plaka' | 'fiber' 
  | 'network' | 'gecis' | 'santral' | 'enerji' 
  | 'web' | 'mobil' | 'elektrik' | 'akinsoft';

interface FormData {
  // Step 1: Usage Type
  usageType: 'home' | 'business' | '';
  
  // Step 2: Location Detail
  locationType: string;
  
  // Step 3: Service Selection (Multi)
  selectedServices: ServiceId[];
  
  // Step 4: Reasons (Dynamic)
  reasons: Record<string, string>;
  
  // Step 5: Project Scope (Dynamic)
  projectScope: Record<string, any>;
  aiCamera: boolean;
  
  // Step 6: Budget & Warranty
  budget: number;
  extraWarranty: number;
  
  // Step 7: Contact Info
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  contactPreference: 'phone' | 'email' | 'whatsapp';
  password?: string;
  
  // Step 8: Legal
  kvkkConsent: boolean;
  notes: string;
}

const INITIAL_DATA: FormData = {
  usageType: '',
  locationType: '',
  selectedServices: [],
  reasons: {},
  projectScope: {},
  aiCamera: false,
  budget: 35000,
  extraWarranty: 0,
  name: '', company: '', email: '', phone: '', location: '',
  contactPreference: 'phone',
  password: '',
  kvkkConsent: false,
  notes: ''
};

const services = [
  { id: 'cctv', title: 'Güvenlik Kamera (CCTV)', icon: Camera, desc: 'Yapay zeka destekli izleme çözümleri', reasons: ['Hırsızlık önleme', 'Personel takibi', '7/24 Uzaktan izleme', 'Olay kanıtı toplama'] },
  { id: 'yangin', title: 'Yangın Algılama', icon: Flame, desc: 'Akıllı adresli yangın sistemleri', reasons: ['Can güvenliği', 'Mal varlığı koruması', 'Yasal zorunluluk', 'Erken uyarı ihtiyacı'] },
  { id: 'hirsiz', title: 'Hırsız Alarm', icon: BellRing, desc: 'Kablosuz ve hibrit güvenlik sistemleri', reasons: ['İzinsiz giriş tespiti', 'Caydırıcılık', 'Panik butonu ihtiyacı', 'Sigorta gereksinimleri'] },
  { id: 'plaka', title: 'Plaka Tanıma', icon: Car, desc: 'Yüksek doğruluklu otopark ve yol kontrolü', reasons: ['Otopark yönetimi', 'Site giriş kontrolü', 'Hızlı geçiş ihtiyacı', 'Güvenlik denetimi'] },
  { id: 'fiber', title: 'Fiber Optik Altyapı', icon: Zap, desc: 'Yüksek hızlı veri iletim çözümleri', reasons: ['Yüksek hız ihtiyacı', 'Uzun mesafe veri aktarımı', 'Kesintisiz bağlantı', 'Geleceğe hazır altyapı'] },
  { id: 'network', title: 'Network & IT', icon: Network, desc: 'Kurumsal ağ ve sunucu altyapısı', reasons: ['Ağ güvenliği', 'Veri yedekleme', 'Sistem stabilizasyonu', 'VPN/Uzak erişim'] },
  { id: 'gecis', title: 'Geçiş Kontrol', icon: Fingerprint, desc: 'Biyometrik ve kartlı geçiş sistemleri', reasons: ['Yetkisiz alan kısıtlaması', 'Giriş-çıkış takibi', 'PDKS entegrasyonu', 'Güvenli geçiş noktaları'] },
  { id: 'santral', title: 'IP Santral & Haberleşme', icon: PhoneCall, desc: 'Bulut ve yerel haberleşme çözümleri', reasons: ['Maliyet tasarrufu', 'Esnek çalışma', 'CRM entegrasyonu', 'Profesyonel karşılama'] },
  { id: 'enerji', title: 'Enerji Sistemleri', icon: BatteryCharging, desc: 'Kesintisiz güç ve güneş enerjisi', reasons: ['Enerji tasarrufu', 'Kesintisiz çalışma', 'Doğa dostu çözüm', 'Maliyet düşürme'] },
  { id: 'web', title: 'Web Yazılım', icon: Globe, desc: 'Kurumsal web ve e-ticaret çözümleri', reasons: ['Dijital varlık oluşturma', 'Satış artırma', 'Marka bilinirliği', 'Operasyonel verimlilik'] },
  { id: 'mobil', title: 'Mobil Uygulama', icon: Smartphone, desc: 'iOS ve Android uygulama geliştirme', reasons: ['Müşteri sadakati', 'Mobil erişilebilirlik', 'Süreç yönetimi', 'Yenilikçi hizmet'] },
  { id: 'elektrik', title: 'Elektrik Proje', icon: Lightbulb, desc: 'Zayıf akım ve kuvvetli akım projeleri', reasons: ['Yeni tesis kurulumu', 'Modernizasyon', 'Enerji verimliliği', 'Teknik danışmanlık'] },
  { id: 'akinsoft', title: 'AKINSOFT Çözümleri', icon: Database, desc: 'ERP, MRP ve ticari yazılım entegrasyonu', reasons: ['Muhasebe yönetimi', 'Stok takibi', 'Üretim planlama', 'Dijital dönüşüm'] }
];

const steps = [
  { id: 1, title: 'Kullanım Amacı', desc: 'Sistemi nerede kullanacaksınız?' },
  { id: 2, title: 'Mekan Detayı', desc: 'Uygulama yapılacak alanın tipi nedir?' },
  { id: 3, title: 'Hizmet Seçimi', desc: 'İhtiyacınız olan çözümleri seçin (Birden fazla seçebilirsiniz).' },
  { id: 4, title: 'İhtiyaç Sebebi', desc: 'Bu hizmetlere neden ihtiyaç duyuyorsunuz?' },
  { id: 5, title: 'Proje Kapsamı', desc: 'Seçtiğiniz hizmetlere özel detaylar.' },
  { id: 6, title: 'Bütçe ve Garanti', desc: 'Planlamanızı ve güvencenizi belirleyin.' },
  { id: 7, title: 'İletişim Bilgileri', desc: 'Size nasıl ulaşabiliriz?' },
  { id: 8, title: 'Özet ve Gönder', desc: 'Talebinizi kontrol edin.' }
];

// --- Helper Components ---

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-between mb-8 px-2">
    {steps.map((s, idx) => (
      <React.Fragment key={s.id}>
        <div className="flex flex-col items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
            currentStep >= s.id 
              ? 'bg-primary text-primary-foreground shadow-primary/40 shadow-lg' 
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            {currentStep > s.id ? <Check size={14} strokeWidth={3} /> : s.id}
          </div>
          <span className={`text-[10px] uppercase tracking-tighter hidden md:block ${
            currentStep === s.id ? 'text-primary font-bold' : 'text-muted-foreground'
          }`}>
            {s.title.split(' ')[0]}
          </span>
        </div>
        {idx < steps.length - 1 && (
          <div className="flex-1 h-px mx-2 bg-border relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-primary/50"
              initial={{ x: '-100%' }}
              animate={{ x: currentStep > s.id ? '0%' : '-100%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// --- Main Component ---

export const QuotePage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('quote_form_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_DATA, ...parsed };
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Settings fetch error:", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && formData.email.includes('@') && formData.email.includes('.')) {
        setIsCheckingEmail(true);
        try {
          const response = await fetch('/api/auth/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
          });
          const data = await response.json();
          setEmailExists(data.exists);
          if (data.exists) {
            updateData({ password: '' });
          }
        } catch (error) {
          console.error("Email check failed:", error);
        } finally {
          setIsCheckingEmail(false);
        }
      } else {
        setEmailExists(null);
        updateData({ password: '' });
      }
    };

    if (!currentUser) {
      const timer = setTimeout(checkEmail, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.email, currentUser]);

  useEffect(() => {
    localStorage.setItem('quote_form_data', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleNext = () => setStep(s => Math.min(s + 1, steps.length));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const updateData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. If password is provided and email doesn't exist, create account
      if (formData.password && !emailExists && !currentUser) {
        try {
          const regResponse = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password
            })
          });
          
          if (regResponse.ok) {
            const regData = await regResponse.json();
            localStorage.setItem('user', JSON.stringify(regData.user));
            localStorage.setItem('token', regData.token);
          }
        } catch (error) {
          console.error("Auto-registration failed:", error);
        }
      }
      
      // 2. Prepare quote object
      const quoteId = `QR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newQuote = {
        id: quoteId,
        customer: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        service: formData.selectedServices.map(sid => services.find(s => s.id === sid)?.title).join(', '),
        date: new Date().toLocaleDateString('tr-TR'),
        status: 'Yeni',
        budget: formatCurrency(formData.budget),
        details: formData
      };

      // 3. Submit to backend
      const response = await fetch('/api/quotes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuote)
      });

      if (!response.ok) {
        throw new Error('Teklif gönderilemedi');
      }

      setIsSuccess(true);
      localStorage.removeItem('quote_form_data');
    } catch (error) {
      console.error("Submission error:", error);
      alert("Teklif gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.usageType;
      case 2: return !!formData.locationType;
      case 3: return formData.selectedServices.length > 0;
      case 4: return formData.selectedServices.every(s => !!formData.reasons[s]);
      case 5: return formData.selectedServices.every(s => {
        const scope = formData.projectScope[s];
        return scope && Object.keys(scope).length >= 2; // Assuming 2 questions per service
      });
      case 6: return formData.budget >= 35000;
      case 7: return !!(formData.name && formData.email && formData.phone);
      case 8: return formData.kvkkConsent;
      default: return true;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  // --- Render Helpers ---

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {[
              { id: 'home', title: 'Ev / Konut', icon: Building2, desc: 'Villa, Daire, Müstakil Ev', color: 'from-blue-500/10 to-indigo-500/10' },
              { id: 'business', title: 'İş Yeri / Ticari', icon: Briefcase, desc: 'Ofis, Fabrika, Depo, Mağaza', color: 'from-emerald-500/10 to-teal-500/10' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => updateData({ usageType: type.id as any })}
                className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center text-left gap-8 group overflow-hidden ${
                  formData.usageType === type.id 
                    ? 'bg-primary/5 border-primary shadow-[0_20px_60px_rgba(var(--primary-rgb),0.1)] scale-[1.01]' 
                    : 'bg-card/30 border-border/40 hover:border-primary/40 hover:bg-card/50 hover:shadow-xl hover:shadow-black/5'
                }`}
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                <div className={`relative z-10 p-6 rounded-2xl transition-all duration-500 ${
                  formData.usageType === type.id 
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-110' 
                    : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105'
                }`}>
                  <type.icon size={40} strokeWidth={1.5} />
                </div>

                <div className="relative z-10 flex-1 space-y-1">
                  <h3 className={`text-2xl font-black tracking-tighter transition-colors duration-500 ${
                    formData.usageType === type.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium opacity-80">
                    {type.desc}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div className="relative z-10 ml-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    formData.usageType === type.id 
                      ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg' 
                      : 'border-border group-hover:border-primary/50'
                  }`}>
                    {formData.usageType === type.id && <Check size={16} strokeWidth={4} />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );
      case 2:
        const baseLocations = formData.usageType === 'home' 
          ? ['Villa', 'Daire', 'Müstakil Ev', 'Yazlık', 'Rezidans']
          : ['Fabrika', 'Depo', 'Ofis / Plaza', 'Mağaza / Showroom', 'AVM', 'Otel', 'Hastane', 'Okul'];
        const locations = [...baseLocations, 'Diğer'];
        
        return (
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => updateData({ locationType: loc })}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 text-left flex items-center gap-6 overflow-hidden ${
                  formData.locationType === loc || (loc === 'Diğer' && formData.locationType && !baseLocations.includes(formData.locationType))
                    ? 'bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/10 scale-[1.01]' 
                    : 'bg-card/30 border-border/40 hover:border-primary/40 hover:bg-card/50 text-foreground'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  (formData.locationType === loc || (loc === 'Diğer' && formData.locationType && !baseLocations.includes(formData.locationType)))
                    ? 'bg-white/20 text-white' 
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  <Building2 size={24} />
                </div>
                <div className="text-lg font-black tracking-tight flex-1">{loc}</div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  (formData.locationType === loc || (loc === 'Diğer' && formData.locationType && !baseLocations.includes(formData.locationType)))
                    ? 'bg-white border-white text-primary scale-110' 
                    : 'border-border group-hover:border-primary/50'
                }`}>
                  {(formData.locationType === loc || (loc === 'Diğer' && formData.locationType && !baseLocations.includes(formData.locationType))) && <Check size={14} strokeWidth={4} />}
                </div>

                {(formData.locationType === loc || (loc === 'Diğer' && formData.locationType && !baseLocations.includes(formData.locationType))) && (
                  <motion.div 
                    layoutId="active-loc"
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"
                  />
                )}
              </button>
            ))}

            <AnimatePresence>
              {(formData.locationType === 'Diğer' || (formData.locationType && !baseLocations.includes(formData.locationType))) && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Lütfen mekan tipini belirtin..."
                      value={formData.locationType === 'Diğer' ? '' : formData.locationType}
                      onChange={e => updateData({ locationType: e.target.value || 'Diğer' })}
                      className="w-full p-6 rounded-2xl border-2 bg-card/50 border-primary/50 focus:border-primary outline-none text-lg font-bold transition-all shadow-xl shadow-primary/5"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {services.map(s => {
              const Icon = s.icon;
              const isSelected = formData.selectedServices.includes(s.id as ServiceId);
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    const next = isSelected 
                      ? formData.selectedServices.filter(id => id !== s.id)
                      : [...formData.selectedServices, s.id as ServiceId];
                    updateData({ selectedServices: next });
                  }}
                  className={`relative flex items-center p-6 rounded-2xl border-2 transition-all duration-500 group text-left overflow-hidden ${
                    isSelected 
                      ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10 scale-[1.01]' 
                      : 'bg-card/30 border-border/40 hover:border-primary/40 hover:bg-card/50 hover:shadow-lg hover:shadow-black/5'
                  }`}
                >
                  <div className={`p-4 rounded-xl transition-all duration-500 ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30' 
                      : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105'
                  }`}>
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  
                  <div className="flex-1 ml-6">
                    <h3 className={`font-black text-lg tracking-tight transition-colors duration-500 ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed opacity-80 font-medium">
                      {s.desc}
                    </p>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ml-4 ${
                    isSelected 
                      ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg' 
                      : 'border-border group-hover:border-primary/50'
                  }`}>
                    {isSelected && <Check size={16} strokeWidth={4} />}
                  </div>
                  
                  {/* Subtle background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-700 ${isSelected ? 'opacity-100' : ''}`} />
                </button>
              );
            })}
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 max-w-3xl mx-auto">
            {formData.selectedServices.map(sid => {
              const s = services.find(x => x.id === sid);
              if (!s) return null;
              const Icon = s.icon;
              return (
                <div key={sid} className="space-y-6 p-8 bg-card/30 border border-border/40 rounded-[2.5rem] shadow-xl shadow-black/5">
                  <div className="flex items-center gap-5 mb-2">
                    <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter">{s.title}</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {s.reasons?.map(reason => (
                      <button
                        key={`${sid}-${reason}`}
                        onClick={() => updateData({ reasons: { ...formData.reasons, [sid]: reason } })}
                        className={`group relative p-5 rounded-2xl border-2 text-left text-sm font-bold transition-all duration-300 flex items-center justify-between ${
                          formData.reasons[sid] === reason 
                            ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' 
                            : 'bg-muted/30 border-border/50 hover:border-primary/40 hover:bg-card/50'
                        }`}
                      >
                        <span>{reason}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          formData.reasons[sid] === reason 
                            ? 'bg-white border-white text-primary scale-110' 
                            : 'border-border group-hover:border-primary/50'
                        }`}>
                          {formData.reasons[sid] === reason && <Check size={12} strokeWidth={4} />}
                        </div>
                      </button>
                    ))}
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Diğer sebep..."
                        value={formData.reasons[sid] && !s.reasons?.includes(formData.reasons[sid]) ? formData.reasons[sid] : ''}
                        onChange={e => updateData({ reasons: { ...formData.reasons, [sid]: e.target.value } })}
                        className="w-full p-5 rounded-2xl border-2 bg-muted/20 border-border/50 focus:border-primary/50 outline-none text-sm font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            {formData.selectedServices.map(sid => {
              const s = services.find(x => x.id === sid);
              if (!s) return null;
              const Icon = s.icon;
              
              // More granular dynamic questions
              let questions: { key: string, label: string, options: string[] }[] = [];
              
              if (sid === 'cctv' || sid === 'hirsiz' || sid === 'yangin') {
                questions = [
                  { key: 'areaSize', label: 'Alan Büyüklüğü', options: ['< 100m²', '100-500m²', '500-2000m²', '> 2000m²'] },
                  { key: 'complexity', label: 'Sistem Karmaşıklığı', options: ['Standart', 'Gelişmiş', 'Entegre / Akıllı'] }
                ];
              } else if (sid === 'web' || sid === 'mobil') {
                questions = [
                  { key: 'platform', label: 'Platform / Teknoloji', options: ['iOS/Android', 'Web Panel', 'E-Ticaret', 'Kurumsal'] },
                  { key: 'timeline', label: 'Hedeflenen Süre', options: ['1 Ay', '3 Ay', '6 Ay+', 'Acil'] }
                ];
              } else if (sid === 'fiber' || sid === 'network') {
                questions = [
                  { key: 'nodes', label: 'Uç Sayısı', options: ['1-10', '10-50', '50-200', '200+'] },
                  { key: 'infrastructure', label: 'Altyapı Durumu', options: ['Yeni Kurulum', 'Revizyon', 'Ek Kapasite'] }
                ];
              } else {
                questions = [
                  { key: 'scale', label: 'Proje Ölçeği', options: ['Bireysel', 'KOBİ', 'Kurumsal / Fabrika'] },
                  { key: 'urgency', label: 'Aciliyet', options: ['Bilgi Almak İstiyorum', 'Hemen Başlanmalı', '1 Ay İçinde'] }
                ];
              }

              return (
                <div key={sid} className="space-y-6 p-8 bg-card/40 border border-border/50 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:bg-primary/10" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">{s.title} Kapsamı</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 relative z-10">
                    {questions.map(q => (
                      <div key={q.key} className="space-y-4">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {q.label}
                        </label>
                        <div className="flex flex-col gap-2">
                          {q.options.map(opt => (
                            <button
                              key={`${q.key}-${opt}`}
                              onClick={() => {
                                const current = formData.projectScope[sid] || {};
                                updateData({ projectScope: { ...formData.projectScope, [sid]: { ...current, [q.key]: opt } } });
                              }}
                              className={`group relative p-4 rounded-xl border-2 text-left text-xs font-bold transition-all duration-300 flex items-center justify-between overflow-hidden ${
                                formData.projectScope[sid]?.[q.key] === opt
                                  ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.01]'
                                  : 'bg-muted/30 border-border/50 hover:border-primary/40 hover:bg-card/50'
                              }`}
                            >
                              <span className="relative z-10">{opt}</span>
                              <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                formData.projectScope[sid]?.[q.key] === opt
                                  ? 'bg-white border-white text-primary scale-110'
                                  : 'border-border group-hover:border-primary/50'
                              }`}>
                                {formData.projectScope[sid]?.[q.key] === opt && <Check size={10} strokeWidth={4} />}
                              </div>
                              {formData.projectScope[sid]?.[q.key] === opt && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {sid === 'cctv' && (
                      <div className="pt-8 border-t border-border/30 mt-8 relative">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] z-20"
                        >
                          Önerilen Teknoloji
                        </motion.div>
                        
                        <div className={`relative rounded-[2.5rem] transition-all duration-700 ${formData.aiCamera ? 'p-[2px]' : 'p-0'}`}>
                          {formData.aiCamera && (
                            <motion.div
                              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-primary via-purple-500 to-primary opacity-50 blur-md"
                              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                              style={{ backgroundSize: '200% 200%' }}
                            />
                          )}
                          
                          <button
                            onClick={() => updateData({ aiCamera: !formData.aiCamera })}
                            className={`w-full group relative p-8 rounded-[calc(2.5rem-2px)] border-2 transition-all duration-700 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden ${
                              formData.aiCamera 
                                ? 'border-transparent shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] scale-[1.02] bg-card/95 backdrop-blur-xl' 
                                : 'bg-card/30 border-border/40 hover:border-primary/40 hover:bg-card/50'
                            }`}
                          >
                            {/* Animated Background for AI Camera */}
                            {formData.aiCamera && (
                              <>
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                              </>
                            )}

                            <div className="flex items-center gap-6 relative z-10">
                              <div className="relative">
                                <motion.div 
                                  animate={formData.aiCamera ? { 
                                    scale: [1, 1.15, 1],
                                    rotate: [0, 5, -5, 0]
                                  } : {}}
                                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                  className={`p-5 rounded-2xl transition-all duration-700 relative z-10 ${
                                    formData.aiCamera 
                                      ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]' 
                                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                                  }`}
                                >
                                  <Sparkles size={36} strokeWidth={1.5} />
                                </motion.div>
                                {formData.aiCamera && (
                                  <motion.div 
                                    className="absolute inset-0 bg-primary rounded-2xl blur-2xl -z-10"
                                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                )}
                              </div>

                              <div className="text-left space-y-1">
                                <div className="flex items-center gap-3">
                                  <h4 className={`text-xl md:text-2xl font-black tracking-tighter transition-colors duration-500 ${
                                    formData.aiCamera ? 'text-primary drop-shadow-sm' : 'text-foreground'
                                  }`}>
                                    Yapay Zeka Destekli Kamera
                                  </h4>
                                  {formData.aiCamera && (
                                    <motion.span 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="px-2.5 py-1 bg-primary text-primary-foreground text-[9px] font-black rounded-md uppercase tracking-widest shadow-lg shadow-primary/30"
                                    >
                                      Aktif
                                    </motion.span>
                                  )}
                                </div>
                                <p className="text-xs md:text-sm font-medium text-muted-foreground max-w-sm leading-relaxed">
                                  Akıllı nesne tespiti, yüz tanıma ve anlık mobil bildirimler ile <span className="text-primary font-bold">maksimum güvenlik.</span>
                                </p>
                                <div className={`inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full text-[11px] font-bold transition-colors duration-500 ${
                                  formData.aiCamera ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted/50 text-muted-foreground border border-transparent'
                                }`}>
                                  <Zap size={14} className={formData.aiCamera ? 'text-primary' : ''} /> 
                                  +{settings?.aiCameraMonthlyFee || 250}₺ / Ay
                                </div>
                              </div>
                            </div>

                            <div className="relative z-10">
                              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
                                formData.aiCamera 
                                  ? 'bg-primary border-primary text-white scale-110 shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]' 
                                  : 'border-border group-hover:border-primary/50'
                              }`}>
                                {formData.aiCamera ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  >
                                    <Check size={24} strokeWidth={4} />
                                  </motion.div>
                                ) : (
                                  <Plus size={24} className="text-muted-foreground group-hover:text-primary" />
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 6:
        return (
          <div className="space-y-12 max-w-2xl mx-auto">
            <div className="space-y-8 p-8 bg-card/40 border border-border/50 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:bg-primary/10" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <DollarSign size={14} className="text-primary" /> Tahmini Bütçe Aralığı
                  </label>
                  <h3 className="text-2xl font-black tracking-tighter">Yatırım Planınız</h3>
                </div>
                
                <div className="relative group/input">
                  <input 
                    type="text"
                    value={formData.budget.toLocaleString('tr-TR')}
                    onChange={(e) => {
                      const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                      updateData({ budget: val });
                    }}
                    className="w-full md:w-48 bg-muted/30 border-2 border-border/50 rounded-2xl px-4 py-3 text-2xl font-black text-primary text-right focus:border-primary focus:bg-card outline-none transition-all pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-black text-lg">₺</span>
                </div>
              </div>

              <div className="relative pt-10 pb-4 px-2">
                {/* Custom Slider Track */}
                <div className="absolute top-[3.25rem] left-2 right-2 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/80"
                    initial={false}
                    animate={{ width: `${((formData.budget - 35000) / (8000000 - 35000)) * 100}%` }}
                  />
                </div>
                
                <input 
                  type="range"
                  min="35000"
                  max="8000000"
                  step="5000"
                  value={formData.budget}
                  onChange={e => updateData({ budget: parseInt(e.target.value) })}
                  className="relative z-10 w-full h-2 bg-transparent appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                />
                
                <div className="flex justify-between mt-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Minimum</span>
                    <span className="text-xs font-bold text-foreground">35.000 ₺</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Maksimum</span>
                    <span className="text-xs font-bold text-foreground">8.000.000 ₺</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-3 ml-2">
                <ShieldCheck size={16} className="text-primary" /> Ek Garanti Süresi
              </label>
              <div className="flex flex-col gap-3">
                {[0, 1, 2, 3, 5].map(year => (
                  <button
                    key={year}
                    onClick={() => updateData({ extraWarranty: year })}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 flex items-center justify-between overflow-hidden ${
                      formData.extraWarranty === year 
                        ? 'bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.01]' 
                        : 'bg-card/30 border-border/40 hover:border-primary/40 hover:bg-card/50'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        formData.extraWarranty === year 
                          ? 'bg-white/20 text-white' 
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        <Clock size={24} />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-black tracking-tight">
                          {year === 0 ? 'Standart Garanti' : `+${year} Yıl Ek Garanti`}
                        </div>
                        <div className={`text-xs font-medium opacity-70 ${formData.extraWarranty === year ? 'text-white' : 'text-muted-foreground'}`}>
                          {year === 0 
                            ? '2 Yıl standart üretici garantisi' 
                            : `${2 + year} yıl toplam güvence (+${year * (settings?.warrantyFee || 500)}₺)`}
                        </div>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      formData.extraWarranty === year 
                        ? 'bg-white border-white text-primary scale-110 shadow-lg' 
                        : 'border-border group-hover:border-primary/50'
                    }`}>
                      {formData.extraWarranty === year && <Check size={16} strokeWidth={4} />}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center italic">
                * Standart 2 yıl üretici garantisine ek olarak sunulur.
              </p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-primary" /> Ad Soyad *
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => updateData({ name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-card/40 border border-border/50 rounded-2xl px-6 py-4 text-foreground focus:border-primary/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={14} className="text-primary" /> Firma Adı
                </label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={e => updateData({ company: e.target.value })}
                  placeholder="Şirketiniz (Opsiyonel)"
                  className="w-full bg-card/40 border border-border/50 rounded-2xl px-6 py-4 text-foreground focus:border-primary/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} className="text-primary" /> E-posta *
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => updateData({ email: e.target.value })}
                  placeholder="ornek@sirket.com"
                  className={`w-full bg-card/40 border rounded-2xl px-6 py-4 text-foreground focus:border-primary/50 outline-none transition-all ${
                    emailExists === false ? 'border-success/30' : 'border-border/50'
                  }`}
                />
                {isCheckingEmail && (
                  <p className="text-[10px] text-muted-foreground animate-pulse">E-posta kontrol ediliyor...</p>
                )}
                {emailExists === false && !currentUser && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-success/5 border border-success/20 rounded-xl space-y-3"
                  >
                    <p className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} /> Bu e-posta ile henüz bir hesabınız yok!
                    </p>
                    <p className="text-xs text-muted-foreground">Teklifinizi takip etmek için bir şifre belirleyerek hesabınızı hemen oluşturabilirsiniz.</p>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Lock size={12} className="text-primary" /> Şifre Belirleyin
                      </label>
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={e => updateData({ password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-success/30 rounded-xl px-4 py-3 text-sm focus:border-success outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} className="text-primary" /> Telefon *
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => updateData({ phone: e.target.value })}
                  placeholder="+90 5xx xxx xx xx"
                  className="w-full bg-card/40 border border-border/50 rounded-2xl px-6 py-4 text-foreground focus:border-primary/50 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> Proje Lokasyonu
              </label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => updateData({ location: e.target.value })}
                placeholder="Şehir, İlçe veya Tam Adres"
                className="w-full bg-card/40 border border-border/50 rounded-2xl px-6 py-4 text-foreground focus:border-primary/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} className="text-primary" /> İletişim Tercihi
              </label>
              <div className="flex gap-2">
                {['phone', 'email', 'whatsapp'].map(pref => (
                  <button
                    key={pref}
                    onClick={() => updateData({ contactPreference: pref as any })}
                    className={`flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all ${
                      formData.contactPreference === pref 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-card/40 border-border/50 text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-card/40 border border-border/50 rounded-[2rem] space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Seçilen Hizmetler</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedServices.map(sid => (
                      <span key={sid} className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20">
                        {services.find(s => s.id === sid)?.title}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Tahmini Bütçe:</span>
                    <span className="text-xl font-black text-primary">{formatCurrency(formData.budget)}</span>
                  </div>
                </div>

                <div className="p-6 bg-card/40 border border-border/50 rounded-[2rem] space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mekan ve Kullanım</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kullanım:</span>
                      <span className="text-foreground font-bold">{formData.usageType === 'home' ? 'Ev' : 'İş Yeri'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tip:</span>
                      <span className="text-foreground font-bold">{formData.locationType}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-card/40 border border-border/50 rounded-[2rem] space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">İletişim</h4>
                  <div className="space-y-2">
                    <div className="text-sm font-bold">{formData.name}</div>
                    <div className="text-xs text-muted-foreground">{formData.email}</div>
                    <div className="text-xs text-muted-foreground">{formData.phone}</div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => updateData({ kvkkConsent: !formData.kvkkConsent })}
                      className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 ${
                        formData.kvkkConsent ? 'bg-primary border-primary' : 'border-border'
                      }`}
                    >
                      {formData.kvkkConsent && <Check size={14} className="text-primary-foreground" />}
                    </button>
                    <div className="text-[10px] text-muted-foreground leading-relaxed">
                      <span className="text-foreground font-bold">KVKK Aydınlatma Metni'ni</span> okudum ve verilerimin işlenmesini kabul ediyorum. *
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="relative flex flex-col overflow-x-hidden">
      
      {/* Wizard Container */}
      <main className="flex-1 relative z-10 flex items-start justify-center p-4 md:p-12 w-full max-w-7xl mx-auto pt-32 md:pt-40 pb-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
          
          {/* Main Wizard Card */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="wizard-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-card/40 backdrop-blur-3xl border border-border/50 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  {/* Progress Header */}
                  <div className="px-8 md:px-12 pt-12">
                    <StepIndicator currentStep={step} />
                    <div className="mb-12">
                      <motion.div
                        key={`title-${step}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
                          {steps[step-1].title}
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl">
                          {steps[step-1].desc}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="px-8 md:px-12 pb-12 min-h-[450px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`step-content-${step}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {renderStepContent()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                    {/* Footer Controls */}
                    <div className="px-8 md:px-12 py-10 bg-muted/30 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                      <button
                        onClick={handleBack}
                        className={`group flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 border border-transparent ${
                          step === 1 
                            ? 'opacity-0 pointer-events-none' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-card hover:border-border/50 hover:shadow-xl hover:shadow-black/5'
                        }`}
                      >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" /> 
                        Geri
                      </button>

                      <div className="flex flex-col items-center md:items-end gap-4">
                        {!isStepValid() && step < 8 && (
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold text-destructive uppercase tracking-widest"
                          >
                            Lütfen tüm alanları doldurunuz
                          </motion.p>
                        )}
                        <div className="flex items-center gap-4">
                          {step < steps.length ? (
                            <button
                              onClick={handleNext}
                              disabled={!isStepValid()}
                              className="group relative flex items-center gap-4 px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-2xl shadow-primary/20 hover:shadow-primary/40"
                            >
                              <span className="relative z-10">Sonraki Adım</span>
                              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmit}
                              disabled={isSubmitting || !isStepValid()}
                              className="group relative flex items-center gap-4 px-14 py-5 rounded-2xl bg-success text-success-foreground font-black text-xs uppercase tracking-[0.2em] hover:bg-success/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 shadow-2xl shadow-success/30 hover:shadow-success/50"
                            >
                              {isSubmitting ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                              ) : (
                                <>
                                  <span className="relative z-10">Talebi Tamamla</span>
                                  <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                </motion.div>
              ) : (
                /* SUCCESS STATE */
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card/40 backdrop-blur-3xl border border-border/50 rounded-[3rem] p-16 text-center shadow-2xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="w-32 h-32 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-10 relative"
                  >
                    <CheckCircle2 size={64} className="text-success" />
                    <div className="absolute inset-0 rounded-full border border-success/30 animate-ping" />
                  </motion.div>
                  <h2 className="text-5xl font-black tracking-tighter text-foreground mb-6">Harika! Talebiniz Alındı.</h2>
                  <p className="text-muted-foreground text-xl mb-12 max-w-lg mx-auto leading-relaxed">
                    Proje detaylarınız teknik ekibimize ulaştı. <span className="text-success font-bold">24 saat içerisinde</span> size özel hazırladığımız ön çalışma ile dönüş yapacağız.
                  </p>
                  <Link to="/" className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:bg-primary/90 hover:scale-105 transition-all">
                    Ana Sayfaya Dön <ArrowRight size={20} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary (Desktop) */}
          <aside className="hidden lg:block sticky top-12 space-y-6">
            <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-8">
              <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <Layers size={16} className="text-primary" /> Talep Özeti
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kullanım Amacı</span>
                  <div className="text-sm font-bold text-primary">
                    {formData.usageType === 'home' ? 'Ev / Konut' : formData.usageType === 'business' ? 'İş Yeri / Ticari' : 'Henüz Seçilmedi'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mekan Detayı</span>
                  <div className="text-sm text-foreground/80">
                    {formData.locationType || 'Belirtilmedi'}
                  </div>
                </div>

                {formData.selectedServices.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Seçilen Hizmetler</span>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.selectedServices.map(sid => (
                        <span key={sid} className="px-2 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded-md border border-primary/20">
                          {services.find(s => s.id === sid)?.title}
                        </span>
                      ))}
                      {formData.aiCamera && (
                        <span className="px-2 py-1 bg-success/10 text-success text-[9px] font-bold rounded-md border border-success/20 flex items-center gap-1">
                          <Sparkles size={10} /> AI Kamera
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tahmini Bütçe</span>
                  <div className="text-sm font-black text-primary">
                    {formatCurrency(formData.budget)}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Shield size={20} className="text-primary/50" />
                  <p className="text-[10px] leading-relaxed">
                    Verileriniz 256-bit SSL ile korunmaktadır ve KVKK kapsamında gizli tutulur.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles size={20} />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground leading-tight">
                <span className="text-primary font-bold">Yapay Zeka Destekli</span> analiz ile en uygun çözümü sunuyoruz.
              </p>
            </div>
          </aside>

        </div>
      </main>

      {/* Footer Note */}
      <footer className="relative z-10 py-12 px-6 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          © 2024 Emin Bilgi İşlem • Tüm Hakları Saklıdır
        </p>
      </footer>
    </div>
  );
};
