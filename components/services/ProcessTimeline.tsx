import React from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Wrench, PlayCircle, CheckCircle2, Headphones } from 'lucide-react';

const steps = [
  { id: 1, title: 'Keşif', icon: Search, desc: 'Mevcut durum analizi ve ihtiyaç belirleme.' },
  { id: 2, title: 'Plan & Proje', icon: PenTool, desc: 'Mühendislik hesaplamaları ve proje çizimi.' },
  { id: 3, title: 'Kurulum', icon: Wrench, desc: 'Uzman ekiplerce titiz montaj süreci.' },
  { id: 4, title: 'Devreye Alma', icon: PlayCircle, desc: 'Sistem aktivasyonu ve konfigürasyon.' },
  { id: 5, title: 'Test', icon: CheckCircle2, desc: 'Fonksiyonel testler ve kalite kontrol.' },
  { id: 6, title: 'Destek', icon: Headphones, desc: '7/24 bakım ve teknik servis garantisi.' },
];

export const ProcessTimeline = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">İş Akışımız</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6">
            Süreçlerimizi Şeffaf ve <br />
            <span className="text-primary">Profesyonel</span> Adımlarla Yönetiyoruz
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground font-medium">
            Her projeyi titizlikle planlıyor, en yüksek kalite standartlarında hayata geçiriyoruz.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-xl flex items-center justify-center text-muted-foreground mb-6 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 group-hover:shadow-primary/10 transition-all duration-500 relative z-10">
                    <step.icon size={28} />
                    <div className="absolute -inset-1 rounded-2xl border border-primary/20 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-snug group-hover:text-foreground transition-colors duration-300">{step.desc}</p>
                  
                  {/* Step Number Background */}
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-9xl font-bold text-foreground/[0.03] -z-10 select-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {step.id}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
