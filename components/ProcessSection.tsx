import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, Variants } from 'framer-motion';
import { Search, PenTool, Wrench, PlayCircle, CheckCircle2, Headphones, ArrowRight } from 'lucide-react';
import RotatingText from './RotatingText';

const steps = [
  { id: 1, title: 'Keşif', icon: Search, desc: 'Mevcut durum analizi ve saha keşfi ile ihtiyaçlarınızın tam haritasını çıkarıyoruz.' },
  { id: 2, title: 'Plan & Proje', icon: PenTool, desc: 'Mühendislik standartlarında, verimli ve ölçeklenebilir sistem mimarileri tasarlıyoruz.' },
  { id: 3, title: 'Kurulum', icon: Wrench, desc: 'Uzman teknik ekiplerimizle, sertifikalı ekipmanlar kullanarak titiz montaj süreci yürütüyoruz.' },
  { id: 4, title: 'Devreye Alma', icon: PlayCircle, desc: 'Sistem konfigürasyonlarını tamamlayıp, tüm birimleri senkronize ederek aktif hale getiriyoruz.' },
  { id: 5, title: 'Test', icon: CheckCircle2, desc: 'Fonksiyonel testler ve stres testleri ile sistemin kusursuz çalıştığını onaylıyoruz.' },
  { id: 6, title: 'Destek', icon: Headphones, desc: '7/24 teknik izleme ve periyodik bakım servisleri ile sistem ömrünü maksimize ediyoruz.' },
];

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="process" ref={sectionRef} className="py-24 md:py-40 relative overflow-hidden bg-transparent">
      {/* Top Gradient Fade - Smoother Transition */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-20" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-32 text-center"
        >
          <motion.div 
            variants={fadeInUp}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border backdrop-blur-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Yönetim Standartları</span>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tighter flex flex-wrap justify-center items-center gap-x-4"
          >
            <span>Kusursuz</span>
            <RotatingText
              texts={['Planlama', 'Kurulum', 'Destek', 'Yönetim']}
              mainClassName="text-primary overflow-hidden justify-center"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
            <span>İş Akışımız</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium leading-relaxed"
          >
            Süreçlerimizi şeffaf, ölçülebilir ve profesyonel mühendislik adımlarıyla yönetiyoruz.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-8 flex items-center justify-center gap-3 text-primary/20"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Keşfetmek için adımlara tıklayın</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/20" />
          </motion.div>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[32px] left-[5%] right-[5%] h-[2px] bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-secondary origin-left"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: (activeStep + 1) / steps.length } : { scaleX: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 relative z-10">
            {steps.map((step, idx) => {
              const isActive = idx <= activeStep;
              const isCurrent = idx === activeStep;
              const isHovered = hoveredStep === idx;

              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="relative flex flex-col items-center group cursor-pointer"
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onClick={() => setActiveStep(idx)}
                >
                  <div className="relative mb-8">
                    <motion.div 
                      className="absolute -inset-4 rounded-full border border-primary/10"
                      animate={{ 
                        scale: isCurrent || isHovered ? [1, 1.2, 1] : 1,
                        opacity: isCurrent || isHovered ? 1 : 0
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 backdrop-blur-xl relative z-20
                        ${isActive 
                          ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/5' 
                          : 'bg-card border-border text-muted-foreground group-hover:border-accent'
                        }`}
                      animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    >
                      <step.icon size={28} strokeWidth={isActive ? 2 : 1.5} />
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <h3 className={`text-sm font-black tracking-tight uppercase transition-colors duration-500 
                      ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-24 max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerContainer}
                className="relative p-10 md:p-12 rounded-[2.5rem] bg-card/30 border border-border shadow-xl shadow-black/[0.02] backdrop-blur-3xl overflow-hidden"
              >
                <div className="absolute -right-8 -bottom-12 text-[15rem] font-black text-muted/10 pointer-events-none select-none">
                  {steps[activeStep].id}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                  <motion.div 
                    variants={fadeInUp}
                    className="w-24 h-24 shrink-0 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/5"
                  >
                    {React.createElement(steps[activeStep].icon, { size: 48, strokeWidth: 1.5 })}
                  </motion.div>

                  <div className="flex-1 text-center md:text-left">
                    <motion.div 
                      variants={fadeInUp}
                      className="flex items-center justify-center md:justify-start gap-4 mb-4"
                    >
                      <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider">ADIM {steps[activeStep].id}</span>
                      <h4 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{steps[activeStep].title}</h4>
                    </motion.div>
                    
                    <motion.p 
                      variants={fadeInUp}
                      className="text-lg text-muted-foreground font-medium leading-relaxed"
                    >
                      {steps[activeStep].desc}
                    </motion.p>
                    
                    <motion.div 
                      variants={fadeInUp}
                      className="mt-8 flex items-center justify-center md:justify-start gap-6"
                    >
                      <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-2 group/link">
                        Detaylı İncele <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </button>
                      <div className="h-4 w-px bg-border" />
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Profesyonel Süreç Yönetimi</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade - Smoother Transition */}
      <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-20" />
    </section>
  );
};