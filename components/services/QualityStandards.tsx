import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, CheckCircle2, FileText, Zap, Clock } from 'lucide-react';

const standards = [
  {
    title: 'Uluslararası Sertifikasyon',
    desc: 'LPCB, TSE ve CE onaylı ekipmanlarla Avrupa standartlarında kurulum yapıyoruz.',
    icon: Award
  },
  {
    title: 'Mühendislik Denetimi',
    desc: 'Tüm projelerimiz sertifikalı mühendislerimiz tarafından onaylanarak devreye alınır.',
    icon: ShieldCheck
  },
  {
    title: '7/24 Teknik Destek',
    desc: 'Kritik sistemleriniz için kesintisiz uzaktan ve yerinde teknik müdahale garantisi.',
    icon: Clock
  },
  {
    title: 'Resmi Raporlama',
    desc: 'OTDR, Topraklama ve Sistem Test raporlarını dijital olarak teslim ediyoruz.',
    icon: FileText
  }
];

export const QualityStandards = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Kalite Taahhüdümüz</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6">
              En Yüksek <span className="text-primary">Teknik</span> Standartlar
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground font-medium">
              Emin Bilgi İşlem olarak, sadece ürün değil, güvenilirlik ve sürdürülebilirlik sunuyoruz.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {standards.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-6 p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <item.icon size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-[2rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Sıfır Hata Politikası</h4>
              <p className="text-sm text-muted-foreground">Tüm sistemlerimiz 48 saatlik stres testinden sonra teslim edilir.</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-black text-primary">15+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Yıllık Tecrübe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Başarılı Proje</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
