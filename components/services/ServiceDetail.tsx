import React, { useRef } from 'react';
import { motion, AnimatePresence, Variants, useScroll, useTransform } from 'framer-motion';
import { Service } from '../../lib/servicesData';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Layers, Target, ClipboardList, PackageCheck, HelpCircle } from 'lucide-react';
import { Magnetic } from '../ui/Magnetic';
import { AkinsoftBanner } from '../AkinsoftBanner';

interface ServiceDetailProps {
  service: Service;
  index: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, index }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  return (
    <motion.section 
      ref={sectionRef}
      id={service.id} 
      style={{ opacity, scale, y }}
      className="py-32 first:pt-0 border-b border-border/50 last:border-0 relative overflow-visible group/section"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none group-hover/section:bg-primary/10 transition-colors duration-1000" />
      
      {service.id === 'akinsoft-yazilim' ? (
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4">
              Akinsoft Yazılım Çözümleri
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              Resmi çözüm ortağı olarak işletmenizi geleceğe taşıyoruz.
            </p>
          </div>
          <div className="h-[300px]">
            <AkinsoftBanner />
          </div>
          <div className="mt-12 p-8 rounded-[2.5rem] bg-card border border-border text-center">
            <p className="text-muted-foreground leading-relaxed">
              Emin Bilgi İşlem olarak Akinsoft'un tüm yazılım çözümlerinde kurulum, eğitim ve teknik destek hizmetleri sunmaktayız. 
              İşletmenize en uygun çözümü belirlemek için bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="overflow-visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center gap-4 mb-8"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary px-5 py-2 bg-primary/5 rounded-full border border-primary/10 backdrop-blur-md">
                  {service.category}
                </span>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 60 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-px bg-primary/30" 
                />
              </motion.div>
              
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.85]">
                {service.title.split(' ').map((word, i) => (
                  <motion.span 
                    key={`word-${i}-${word}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>
              <p className="text-2xl text-muted-foreground font-medium max-w-2xl leading-tight">{service.tagline}</p>
            </div>
            
            <div className="flex gap-6">
              {service.metrics?.slice(0, 2).map((metric, i) => (
                <motion.div 
                  key={`metric-${i}-${metric.label}`} 
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="px-10 py-8 rounded-[2.5rem] bg-card border border-border text-center min-w-[160px] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <motion.p 
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    className="text-3xl font-black text-primary leading-none mb-3"
                  >
                    {metric.value}
                  </motion.p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
            {/* Left: Problem/Solution & Features */}
            <motion.div variants={itemVariants} className="space-y-16">
              <div className="space-y-8">
                <div className="flex items-center gap-4 text-primary">
                  <motion.div 
                    whileHover={{ rotate: 180 }}
                    className="p-3 rounded-2xl bg-primary/10"
                  >
                    <Layers size={20} />
                  </motion.div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Mühendislik Yaklaşımı</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  {service.solution}
                </p>
              </div>

              <div className="space-y-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Teknik Özellikler</h3>
                <div className="grid grid-cols-1 gap-5">
                  {service.features.map((feature, i) => (
                    <motion.div 
                      key={`feature-${i}-${feature}`} 
                      variants={itemVariants}
                      whileHover={{ x: 15, backgroundColor: "rgba(var(--primary-rgb), 0.05)" }}
                      className="flex items-center gap-5 p-6 rounded-3xl bg-accent/10 border border-border/50 group transition-all duration-500"
                    >
                      <Magnetic strength={0.2}>
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-12 transition-all duration-500">
                          <CheckCircle2 size={18} />
                        </div>
                      </Magnetic>
                      <span className="text-base font-bold text-foreground/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Process & Deliverables */}
            <motion.div variants={itemVariants} className="space-y-16">
              <div className="space-y-10">
                <div className="flex items-center gap-4 text-primary">
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="p-3 rounded-2xl bg-primary/10"
                  >
                    <ClipboardList size={20} />
                  </motion.div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Uygulama Metodolojisi</h3>
                </div>
                <div className="space-y-5">
                  {service.process_steps.map((step, i) => (
                    <motion.div 
                      key={`process-step-${i}-${step}`} 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="flex items-center gap-6 p-6 rounded-3xl bg-card border border-border group transition-all duration-500 hover:border-primary/30 shadow-sm hover:shadow-lg"
                    >
                      <Magnetic strength={0.3}>
                        <span className="text-sm font-black text-primary w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                          {i + 1}
                        </span>
                      </Magnetic>
                      <span className="text-base font-bold text-foreground/80">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4 text-secondary">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-3 rounded-2xl bg-secondary/10"
                  >
                    <PackageCheck size={20} />
                  </motion.div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Proje Çıktıları</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {service.deliverables.map((item, i) => (
                    <motion.span 
                      key={`deliverable-${i}-${item}`} 
                      variants={itemVariants}
                      whileHover={{ scale: 1.1, rotate: Math.random() * 4 - 2 }}
                      className="px-6 py-3 rounded-2xl bg-secondary/5 border border-secondary/10 text-xs font-black text-secondary-foreground cursor-default hover:bg-secondary/10 transition-all duration-300"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ & Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-border/50 overflow-visible"
          >
            <div className="flex flex-wrap gap-6 p-20 -m-20">
              <Magnetic strength={0.2}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-primary text-primary-foreground rounded-[2.5rem] font-black text-sm shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-500 flex items-center gap-5 group"
                >
                  Hemen Başlayalım 
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-500" />
                </motion.button>
              </Magnetic>
              
              <Magnetic strength={0.1}>
                <motion.button 
                  whileHover={{ backgroundColor: "var(--accent)" }}
                  className="px-12 py-6 bg-card border border-border text-foreground rounded-[2.5rem] font-black text-sm transition-all duration-500"
                >
                  Teknik Katalog
                </motion.button>
              </Magnetic>
            </div>
            
            {service.faq.length > 0 && (
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-all duration-500 cursor-help group"
              >
                <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <HelpCircle size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Sıkça Sorulan Sorular</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
};
