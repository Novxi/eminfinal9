import React from 'react';
import { motion, Variants } from 'framer-motion';

const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: (i: number) => ({
    y: [0, -20, 0],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut"
    }
  })
};

export const ServicesHero = () => {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden bg-transparent">
      {/* --- SIMPLE BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-6 py-2 mb-8 text-[10px] font-black tracking-[0.4em] uppercase text-primary bg-primary/5 rounded-full border border-primary/10 backdrop-blur-sm"
            >
              Uzmanlık Alanlarımız
            </motion.span>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-10 leading-[0.85]">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="block"
              >
                Dijital Güvenlik
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-500 to-primary/80"
              >
                Hattınızı Kuruyoruz
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium"
            >
              Karmaşık teknoloji altyapılarını yaşayan bir organizma gibi kurgulayan, 
              uçtan uca entegre mühendislik çözümleri sunuyoruz.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
