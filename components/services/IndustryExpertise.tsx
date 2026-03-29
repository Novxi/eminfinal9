import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Factory, Hotel, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

const industries = [
  { 
    id: 1, 
    title: 'Endüstriyel Tesisler', 
    desc: 'Fabrika ve depo alanları için yüksek güvenlikli çevre koruma ve otomasyon çözümleri.',
    icon: Factory,
    features: ['Çevre Güvenlik', 'Yangın Algılama', 'Fiber Altyapı']
  },
  { 
    id: 2, 
    title: 'Akıllı Ofis & Plaza', 
    desc: 'Modern çalışma alanları için IP santral, network ve biyometrik geçiş kontrol sistemleri.',
    icon: Building2,
    features: ['IP Santral', 'Geçiş Kontrol', 'Yapısal Kablolama']
  },
  { 
    id: 3, 
    title: 'Turizm & Konaklama', 
    desc: 'Otel ve tatil köyleri için kesintisiz Wi-Fi, güvenlik ve enerji yönetim sistemleri.',
    icon: Hotel,
    features: ['Yüksek Hız Wi-Fi', 'Kamera Sistemleri', 'Enerji Yönetimi']
  },
  { 
    id: 4, 
    title: 'Perakende & Mağazacılık', 
    desc: 'Mağaza güvenliği ve müşteri analitiği için akıllı kamera ve alarm çözümleri.',
    icon: ShoppingBag,
    features: ['Hırsız Alarm', 'Kişi Sayma', 'Merkezi Yönetim']
  }
];

export const IndustryExpertise = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Sektörel Uzmanlık</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground leading-tight">
              Her Sektör İçin <br />
              <span className="text-primary">Özelleştirilmiş</span> Çözümler
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-md text-muted-foreground font-medium mb-2"
          >
            Teknoloji altyapınızı sektörünüzün dinamiklerine ve özel güvenlik ihtiyaçlarına göre tasarlıyoruz.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group p-8 rounded-[2rem] bg-card border border-border hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                <item.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{item.desc}</p>
              
              <div className="flex flex-wrap gap-2">
                {item.features.map(f => (
                  <span key={f} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-accent rounded-full text-foreground/70">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
