import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Flame, ShieldAlert, Car, Zap, Network, 
  Key, Phone, Battery, Globe, Smartphone, Lightbulb, 
  Database, ArrowRight, CheckCircle2, ShieldCheck
} from 'lucide-react';

const categories = [
  {
    id: 'guvenlik-kamera',
    title: 'Güvenlik Kamera',
    icon: Camera,
    color: 'from-cyan-500/20 to-blue-600/20',
    accent: 'text-cyan-400',
    bgGlow: 'bg-cyan-500/10',
    borderGlow: 'border-cyan-500/30',
    description: 'Akıllı izleme ve yüksek çözünürlüklü güvenlik sistemleri.',
    visual: 'cctv'
  },
  {
    id: 'yangin-alarm',
    title: 'Yangın Alarm',
    icon: Flame,
    color: 'from-red-500/20 to-orange-600/20',
    accent: 'text-red-400',
    bgGlow: 'bg-red-500/10',
    borderGlow: 'border-red-500/30',
    description: 'Erken uyarı ve anında müdahale sağlayan yangın algılama.',
    visual: 'fire'
  },
  {
    id: 'hirsiz-alarm',
    title: 'Hırsız Alarm',
    icon: ShieldAlert,
    color: 'from-amber-500/20 to-red-600/20',
    accent: 'text-amber-400',
    bgGlow: 'bg-amber-500/10',
    borderGlow: 'border-amber-500/30',
    description: '7/24 aktif koruma ve hareket algılama sistemleri.',
    visual: 'security'
  },
  {
    id: 'plaka-okuma',
    title: 'Plaka Okuma',
    icon: Car,
    color: 'from-blue-400/20 to-indigo-600/20',
    accent: 'text-blue-400',
    bgGlow: 'bg-blue-500/10',
    borderGlow: 'border-blue-500/30',
    description: 'Yapay zeka destekli araç tanıma ve geçiş kontrolü.',
    visual: 'ocr'
  },
  {
    id: 'fiber-optik',
    title: 'Fiber Optik',
    icon: Zap,
    color: 'from-violet-500/20 to-fuchsia-600/20',
    accent: 'text-violet-400',
    bgGlow: 'bg-violet-500/10',
    borderGlow: 'border-violet-500/30',
    description: 'Işık hızında, kesintisiz ve güvenli veri aktarım altyapısı.',
    visual: 'fiber'
  },
  {
    id: 'network-altyapi',
    title: 'Network Altyapı',
    icon: Network,
    color: 'from-teal-500/20 to-emerald-600/20',
    accent: 'text-teal-400',
    bgGlow: 'bg-teal-500/10',
    borderGlow: 'border-teal-500/30',
    description: 'Kurumsal ölçekte kararlı ve yönetilebilir ağ çözümleri.',
    visual: 'network'
  },
  {
    id: 'gecis-kontrol',
    title: 'Geçiş Kontrol',
    icon: Key,
    color: 'from-emerald-400/20 to-cyan-600/20',
    accent: 'text-emerald-400',
    bgGlow: 'bg-emerald-500/10',
    borderGlow: 'border-emerald-500/30',
    description: 'Biyometrik ve kartlı güvenli erişim yönetim sistemleri.',
    visual: 'access'
  },
  {
    id: 'ip-santral',
    title: 'IP Santral',
    icon: Phone,
    color: 'from-purple-500/20 to-indigo-600/20',
    accent: 'text-purple-400',
    bgGlow: 'bg-purple-500/10',
    borderGlow: 'border-purple-500/30',
    description: 'Modern, bulut tabanlı kurumsal iletişim altyapısı.',
    visual: 'telecom'
  },
  {
    id: 'enerji-sistemleri',
    title: 'Enerji Sistemleri',
    icon: Battery,
    color: 'from-green-500/20 to-emerald-600/20',
    accent: 'text-green-400',
    bgGlow: 'bg-green-500/10',
    borderGlow: 'border-green-500/30',
    description: 'Sürdürülebilir, verimli ve kesintisiz enerji çözümleri.',
    visual: 'energy'
  },
  {
    id: 'web-siteleri',
    title: 'Web Siteleri',
    icon: Globe,
    color: 'from-blue-500/20 to-purple-600/20',
    accent: 'text-blue-400',
    bgGlow: 'bg-blue-500/10',
    borderGlow: 'border-blue-500/30',
    description: 'Modern, hızlı ve dönüşüm odaklı kurumsal web projeleri.',
    visual: 'web'
  },
  {
    id: 'mobil-uygulamalar',
    title: 'Mobil Uygulamalar',
    icon: Smartphone,
    color: 'from-fuchsia-500/20 to-pink-600/20',
    accent: 'text-fuchsia-400',
    bgGlow: 'bg-fuchsia-500/10',
    borderGlow: 'border-fuchsia-500/30',
    description: 'iOS ve Android için native performanslı mobil çözümler.',
    visual: 'mobile'
  },
  {
    id: 'elektrik-proje',
    title: 'Elektrik Proje',
    icon: Lightbulb,
    color: 'from-yellow-500/20 to-amber-600/20',
    accent: 'text-yellow-400',
    bgGlow: 'bg-yellow-500/10',
    borderGlow: 'border-yellow-500/30',
    description: 'Mühendislik standartlarında elektrik taahhüt ve projelendirme.',
    visual: 'blueprint'
  },
  {
    id: 'akinsoft',
    title: 'AKINSOFT Yazılım',
    icon: Database,
    color: 'from-indigo-500/20 to-blue-600/20',
    accent: 'text-indigo-400',
    bgGlow: 'bg-indigo-500/10',
    borderGlow: 'border-indigo-500/30',
    description: 'İşletmenizi dijitalleştiren ERP ve ticari yazılım çözümleri.',
    visual: 'erp'
  }
];

const VisualPreview = ({ activeCategory }: { activeCategory: typeof categories[0] }) => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Dynamic Background Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${activeCategory.color} opacity-30 blur-3xl`} />
          
          {/* Abstract Visual Representation based on category */}
          <motion.div 
            className="relative w-full h-full flex items-center justify-center opacity-20"
            initial={{ z: -100 }}
            animate={{ z: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            {activeCategory.visual === 'cctv' && (
              <div className="w-64 h-64 border border-cyan-500/30 rounded-full flex items-center justify-center relative">
                <div className="w-48 h-48 border border-cyan-500/50 rounded-full" />
                <div className="w-32 h-32 border-2 border-cyan-400 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-cyan-400 rounded-full"
                />
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[length:100%_4px]" />
              </div>
            )}
            
            {activeCategory.visual === 'fire' && (
              <div className="relative w-full h-full flex items-end justify-center pb-20">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-red-500 rounded-full blur-[2px]"
                    initial={{ y: 0, x: Math.random() * 200 - 100, opacity: 0, scale: 0 }}
                    animate={{ 
                      y: -300 - Math.random() * 200, 
                      x: Math.random() * 200 - 100,
                      opacity: [0, 1, 0],
                      scale: [0, Math.random() * 2 + 1, 0]
                    }}
                    transition={{ 
                      duration: Math.random() * 2 + 2, 
                      repeat: Infinity, 
                      delay: Math.random() * 2 
                    }}
                  />
                ))}
                <div className="w-64 h-64 bg-red-500/20 blur-[60px] rounded-full" />
              </div>
            )}

            {activeCategory.visual === 'security' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 2, 3], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute w-32 h-32 border border-amber-500 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 2, 3], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                  className="absolute w-32 h-32 border border-amber-500 rounded-full"
                />
                <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,1)]" />
              </div>
            )}

            {activeCategory.visual === 'ocr' && (
              <div className="relative w-64 h-32 border-2 border-blue-500/50 rounded-lg flex items-center justify-center overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]"
                />
                <div className="text-4xl font-mono font-bold tracking-widest text-blue-400/50">34 ABC 123</div>
              </div>
            )}

            {activeCategory.visual === 'fiber' && (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full"
                    style={{ top: `${(i + 1) * 10}%`, left: 0 }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: Math.random() * 1 + 0.5, repeat: Infinity, ease: "linear", delay: Math.random() }}
                  />
                ))}
              </div>
            )}

            {activeCategory.visual === 'network' && (
              <div className="relative w-64 h-64">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <motion.path 
                    d="M20,20 L80,20 L80,80 L20,80 Z M20,20 L80,80 M80,20 L20,80" 
                    stroke="rgba(20, 184, 166, 0.3)" 
                    strokeWidth="0.5" 
                    fill="none" 
                  />
                  {[
                    {x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}, {x: 20, y: 80}, {x: 50, y: 50}
                  ].map((point, i) => (
                    <motion.circle 
                      key={i}
                      cx={point.x} 
                      cy={point.y} 
                      r="2" 
                      fill="rgba(20, 184, 166, 0.8)"
                      animate={{ r: [2, 4, 2], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </svg>
              </div>
            )}

            {activeCategory.visual === 'access' && (
              <div className="relative w-48 h-64 border-2 border-emerald-500/30 rounded-xl flex items-center justify-center overflow-hidden">
                <motion.div 
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
                />
                <Key className="w-16 h-16 text-emerald-500/50" />
              </div>
            )}

            {activeCategory.visual === 'telecom' && (
              <div className="relative w-full h-32 flex items-center justify-center gap-2">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-purple-500/50 rounded-full"
                    animate={{ height: [10, Math.random() * 80 + 20, 10] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
            )}

            {activeCategory.visual === 'energy' && (
              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 rounded-full border border-dashed border-green-500/40"
                />
                <div className="absolute w-32 h-32 bg-green-500/20 blur-2xl rounded-full" />
                <Zap className="w-16 h-16 text-green-500/60" />
              </div>
            )}

            {activeCategory.visual === 'web' && (
              <div className="relative w-64 h-48 border border-blue-500/30 rounded-lg overflow-hidden flex flex-col">
                <div className="h-6 border-b border-blue-500/30 flex items-center px-2 gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500/30" />
                  <div className="w-2 h-2 rounded-full bg-blue-500/30" />
                  <div className="w-2 h-2 rounded-full bg-blue-500/30" />
                </div>
                <div className="flex-1 p-4 flex flex-col gap-2">
                  <motion.div className="w-3/4 h-4 bg-blue-500/20 rounded" animate={{ width: ['75%', '85%', '75%'] }} transition={{ duration: 4, repeat: Infinity }} />
                  <motion.div className="w-1/2 h-4 bg-blue-500/10 rounded" animate={{ width: ['50%', '40%', '50%'] }} transition={{ duration: 3, repeat: Infinity }} />
                  <motion.div className="w-full h-16 bg-blue-500/5 rounded mt-auto" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                </div>
              </div>
            )}

            {activeCategory.visual === 'mobile' && (
              <div className="relative w-32 h-64 border-2 border-fuchsia-500/30 rounded-[2rem] overflow-hidden flex flex-col items-center py-4">
                <div className="w-12 h-1 bg-fuchsia-500/30 rounded-full mb-4" />
                <div className="w-full flex-1 flex flex-col gap-2 px-4">
                  <motion.div className="w-full h-12 bg-fuchsia-500/20 rounded-xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                  <motion.div className="w-full h-12 bg-fuchsia-500/10 rounded-xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-full h-12 bg-fuchsia-500/5 rounded-xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            )}

            {activeCategory.visual === 'blueprint' && (
              <div className="relative w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <motion.path 
                    d="M10,50 L30,50 L40,20 L60,80 L70,50 L90,50" 
                    stroke="rgba(245, 158, 11, 0.5)" 
                    strokeWidth="1" 
                    fill="none" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </svg>
              </div>
            )}

            {activeCategory.visual === 'erp' && (
              <div className="relative w-64 h-64 grid grid-cols-2 gap-2 p-4">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-500/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const PremiumQuoteSection = () => {
  const [activeId, setActiveId] = useState(categories[0].id);
  const activeCategory = categories.find(c => c.id === activeId) || categories[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section className="relative py-32 bg-[#050505] overflow-hidden text-white font-sans selection:bg-white/20">
      {/* Global Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-900/10 blur-[120px] rounded-[100%]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-8 opacity-80">
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <ShieldCheck size={24} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl tracking-tight text-white">EMİN</span>
                <span className="text-[10px] font-bold text-white/60 tracking-[0.2em]">BİLGİ İŞLEM</span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-medium tracking-widest uppercase text-white/70">Kurumsal Çözümler</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4"
            >
              Projenizi Hayata Geçirelim
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg max-w-xl font-light"
            >
              İhtiyacınız olan teknoloji altyapısını seçin, uzman mühendislerimiz size en uygun çözümü projelendirsin.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Category Selector */}
          <div className="lg:col-span-4 flex flex-col gap-2 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5" />
            
            <div className="flex flex-col gap-1 pr-4 max-h-[600px] overflow-y-auto scrollbar-hide py-4 relative">
              {categories.map((category) => {
                const isActive = activeId === category.id;
                const Icon = category.icon;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveId(category.id)}
                    className={`relative flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-500 group text-left ${
                      isActive ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-white rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                      isActive ? category.bgGlow : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon className={`w-5 h-5 transition-colors duration-500 ${
                        isActive ? category.accent : 'text-white/40 group-hover:text-white/70'
                      }`} />
                    </div>
                    
                    <div>
                      <h3 className={`text-sm font-medium transition-colors duration-500 ${
                        isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                      }`}>
                        {category.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Form Area */}
          <div className="lg:col-span-8 relative">
            <motion.div 
              className={`relative w-full rounded-[2rem] border bg-[#0a0a0a]/80 backdrop-blur-2xl overflow-hidden transition-colors duration-700 ${activeCategory.borderGlow}`}
              initial={false}
              animate={{ borderColor: 'rgba(255,255,255,0.1)' }}
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              {/* Visual Background */}
              <VisualPreview activeCategory={activeCategory} />

              <div className="relative z-10 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Dynamic Content Side */}
                <div className="flex flex-col justify-between h-full min-h-[400px]">
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCategory.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${activeCategory.bgGlow}`}>
                          <activeCategory.icon className={`w-6 h-6 ${activeCategory.accent}`} />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                          {activeCategory.title}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                          {activeCategory.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-12">
                    <div className="flex items-center gap-3 text-sm text-white/40 mb-2">
                      <CheckCircle2 className="w-4 h-4" /> <span>Ücretsiz Keşif</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/40 mb-2">
                      <CheckCircle2 className="w-4 h-4" /> <span>Projelendirme</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/40">
                      <CheckCircle2 className="w-4 h-4" /> <span>Anahtar Teslim Kurulum</span>
                    </div>
                  </div>
                </div>

                {/* Form Side */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-wider text-white/50">Ad Soyad</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-wider text-white/50">Firma Adı</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                        placeholder="Şirket A.Ş."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium uppercase tracking-wider text-white/50">Telefon</label>
                        <input 
                          type="tel" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                          placeholder="0532 000 0000"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium uppercase tracking-wider text-white/50">E-posta</label>
                        <input 
                          type="email" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                          placeholder="mail@sirket.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-wider text-white/50">Hizmet Seçimi</label>
                      <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 flex items-center gap-2">
                        <activeCategory.icon className="w-4 h-4" />
                        {activeCategory.title}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-wider text-white/50">Proje Detayı</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none h-24"
                        placeholder="Projenizden kısaca bahsedin..."
                      />
                    </div>
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white text-black font-medium text-sm py-4 rounded-xl mt-2 hover:bg-white/90 transition-colors flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Teklif Al
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
