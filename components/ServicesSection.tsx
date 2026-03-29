import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, useReducedMotion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LightWavesBackground } from './ui/LightWavesBackground';
import { useServices } from '../lib/useServices';
import { getIcon } from '../lib/iconMap';
import { Service } from '../lib/servicesData';
import { CheckCircle2, Cpu } from 'lucide-react';
import { AkinsoftBanner } from './AkinsoftBanner';

const ServiceCard: React.FC<{ service: Service; isWide: boolean; index: number }> = ({ 
  service, 
  isWide, 
  index 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-2000); 
  const mouseY = useMotionValue(-2000);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-2000);
    mouseY.set(-2000);
  };

  const glowBackground = useMotionTemplate`radial-gradient(
    450px circle at ${mouseX}px ${mouseY}px,
    ${service.color}25,
    transparent 80%
  )`;

  const lightPassMask = useMotionTemplate`radial-gradient(
    220px circle at ${mouseX}px ${mouseY}px,
    white 10%,
    transparent 100%
  )`;

  const textVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, filter: 'blur(8px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        delay: 0.1 + (i * 0.1), 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as const
      }
    })
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40, scale: 0.95, rotateX: -5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        ease: [0.22, 1, 0.36, 1] as const
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${isWide ? 'md:col-span-2 lg:col-span-3 xl:col-span-4' : 'col-span-1'} group relative`}
      style={{ perspective: "1000px" }}
    >
      <Link to={`/hizmetler#${service.id}`} className="block h-full">
        <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-b from-foreground/5 to-transparent opacity-20 group-hover:opacity-60 transition-opacity duration-500 z-0" />
        
        <div 
          className={`relative h-[320px] rounded-[28px] bg-card border border-border overflow-hidden flex flex-col p-8 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-primary/30 shadow-sm backdrop-blur-sm`}
        >
          {/* Background Icon */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.15 + 0.3 }}
            className="absolute -bottom-6 -right-6 text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-all duration-700 pointer-events-none z-0 group-hover:scale-[1.03] group-hover:rotate-2"
          >
            {React.createElement(getIcon(service.icon), { size: 190, strokeWidth: 1.75 })}
          </motion.div>

          {/* Cursor Glow */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: glowBackground }}
          />

          {/* --- CONTENT LAYERS --- */}
          <div className="relative z-20 flex-1 flex flex-col">
            <div className="relative">
              {/* Base Layer */}
              <div className="pointer-events-none">
                <motion.h3 
                  variants={textVariants}
                  custom={0}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`font-bold text-foreground tracking-tight mb-3 transition-colors duration-500 ${isWide ? 'text-4xl' : 'text-xl'}`}
                >
                  {service.title}
                </motion.h3>
                
                <motion.p 
                  variants={textVariants}
                  custom={1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 font-medium"
                >
                  {service.tagline}
                </motion.p>
                
                <div className={`grid gap-2.5 ${isWide ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
                  {service.features.slice(0, 4).map((detail, i) => (
                    <motion.div 
                      key={`feature-base-${i}-${detail}`} 
                      variants={textVariants}
                      custom={2 + i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-center gap-2.5"
                    >
                      <CheckCircle2 size={13} className="text-primary" />
                      <span className="text-[11px] font-semibold text-muted-foreground">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Highlight Layer (Masked by Cursor) */}
              <motion.div 
                className="absolute inset-0 pointer-events-none select-none overflow-hidden"
                style={{ WebkitMaskImage: lightPassMask, maskImage: lightPassMask }}
              >
                <h3 className={`font-bold text-primary tracking-tight mb-3 ${isWide ? 'text-4xl' : 'text-xl'}`}>
                  {service.title}
                </h3>
                <p className="text-foreground text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                  {service.tagline}
                </p>
                <div className={`grid gap-2.5 ${isWide ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
                  {service.features.slice(0, 4).map((detail, i) => (
                    <div key={`feature-highlight-${i}-${detail}`} className="flex items-center gap-2.5">
                      <CheckCircle2 size={13} className="text-primary" />
                      <span className="text-[11px] font-semibold text-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="relative z-30 mt-auto pt-6 border-t border-border flex items-center justify-between opacity-60 group-hover:opacity-100 transition-all duration-500"
          >
            <span className="text-[9px] font-black tracking-[0.4em] text-muted-foreground uppercase group-hover:text-primary">
              Hizmet Detayları
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-muted group-hover:bg-primary transition-colors" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export const ServicesSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { services, loading } = useServices();
  
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="services" className="relative py-24 md:py-32 overflow-hidden bg-transparent">
      <LightWavesBackground />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="flex flex-col items-center mb-24 text-center"
        >
          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } } as Variants}
            className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-12 opacity-30 shadow-[0_0_20px_var(--color-primary)]"
          />
          
          <motion.div 
            variants={headerVariants}
            className="mb-8 inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-card border border-border shadow-sm backdrop-blur-xl"
          >
            <Cpu size={14} className="text-primary animate-pulse" />
            <span className="text-primary font-black tracking-[0.4em] uppercase text-[9px]">
              TEKNOLOJİ KATALOĞU
            </span>
          </motion.div>

          <motion.h2 
            variants={headerVariants}
            className="text-4xl md:text-8xl font-black text-foreground tracking-tighter mb-8 leading-[0.85]"
          >
            Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-indigo-400">Güvenlik</span> Hattı
          </motion.h2>
          
          <motion.p 
            variants={headerVariants}
            className="text-lg text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Karmaşık teknoloji altyapılarını <span className="text-foreground">yaşayan bir organizma</span> gibi kurgulayan, uçtan uca entegre mühendislik çözümleri.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-start">
            {services.map((service, idx) => (
              service.id === 'akinsoft-yazilim' ? (
                <motion.div 
                  key={service.id} 
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="md:col-span-2 lg:col-span-3 xl:col-span-4"
                >
                  <AkinsoftBanner />
                </motion.div>
              ) : (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  index={idx} 
                  isWide={false} 
                />
              )
            ))}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-10 p-12 rounded-[2.5rem] bg-card/30 border border-border shadow-sm backdrop-blur-3xl"
        >
          {[
            { label: 'YILLIK PROJE', val: '120+', unit: 'TESLİM' },
            { label: 'MEMNUNİYET', val: '%100', unit: 'SKOR' },
            { label: 'AKTİF DESTEK', val: '7/24', unit: 'SAAT' },
            { label: 'TEKNİK EKİP', val: '15', unit: 'UZMAN' },
          ].map((stat, i) => (
            <motion.div 
              key={`stat-${i}-${stat.label}`} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className="flex flex-col"
            >
              <span className="text-primary text-[8px] font-black tracking-[0.3em] uppercase mb-2">{stat.label}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-foreground tracking-tighter">{stat.val}</span>
                <span className="text-muted-foreground text-[9px] font-bold">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade - Smoother Transition */}
      <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-20" />
    </section>
  );
};