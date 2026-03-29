import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, BarChart3, Layers } from 'lucide-react';

export const WhyWelcome = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6 block">Neden Biz?</span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter mb-6">
                Sadece Bir Firma Değil, <span className="text-primary">Stratejik Mühendislik Ortağınızız.</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10 max-w-xl">
                Emin Bilgi İşlem olarak, projelerinizi sadece kurmuyoruz; onları geleceğin teknolojileriyle, en yüksek güvenlik standartlarında ve mühendislik hassasiyetiyle inşa ediyoruz. Karmaşık sistemleri basitleştiriyor, güvenliği bir standart haline getiriyoruz.
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  "15 yıllık sektörel tecrübe ve yüzlerce başarılı proje.",
                  "Global standartlarda (ISO/EN/TSE) uygulama garantisi.",
                  "7/24 kesintisiz teknik destek ve periyodik bakım.",
                  "Maliyet etkin ve yüksek performanslı çözümler."
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <ShieldCheck size={12} className="text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-[2.5rem] bg-card border border-border flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Verimlilik</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">Sistemlerinizi en yüksek performansla optimize ediyoruz.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-[2.5rem] bg-card border border-border flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-500 mt-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Entegrasyon</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">Tüm altyapınızı tek bir akıllı platformda birleştiriyoruz.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
