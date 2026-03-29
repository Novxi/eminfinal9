import React from 'react';
import { motion } from 'framer-motion';
import { qualityChecks } from '../../lib/whyData';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const QualitySystem = () => {
  return (
    <section className="py-32 bg-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Güvence</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-8">
              Sıfır Hata <br />
              <span className="text-primary">Kalite</span> Sistemi
            </h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10">
              Yayın öncesi uyguladığımız 120+ maddelik kontrol listesiyle, ürününüzün her cihazda ve her koşulda mükemmel çalışmasını garanti ediyoruz.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {qualityChecks.map((check, idx) => (
                <motion.div
                  key={`quality-check-${idx}-${check.substring(0, 20)}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="text-primary">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm font-bold text-foreground/80">{check}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative Rings */}
              <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-10 border border-primary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 rounded-[3rem] bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-2xl shadow-primary/30"
                >
                  <ShieldCheck size={64} className="mb-4" />
                  <span className="text-xl font-black tracking-tighter uppercase">QA PASS</span>
                </motion.div>
              </div>

              {/* Floating Tech Badges */}
              <div className="absolute top-0 right-0 p-4 rounded-2xl bg-card border border-border shadow-xl animate-bounce">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Performance</div>
                <div className="text-xl font-black">100/100</div>
              </div>
              <div className="absolute bottom-10 left-0 p-4 rounded-2xl bg-card border border-border shadow-xl animate-pulse">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Accessibility</div>
                <div className="text-xl font-black">AA+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
