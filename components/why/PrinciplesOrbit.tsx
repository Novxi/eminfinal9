import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { principles } from '../../lib/whyData';
import { Plus, Minus } from 'lucide-react';

export const PrinciplesOrbit = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  return (
    <section className="py-32 bg-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          <div className="lg:w-1/3 sticky top-32">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Prensiplerimiz</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-8">
              Disiplinli <br />
              <span className="text-primary">Üretim</span> Kültürü
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Her projemizde taviz vermediğimiz temel değerlerimiz, bizi sadece bir tedarikçi değil, stratejik bir iş ortağı yapar.
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 gap-4 w-full relative">
            {principles.map((principle, idx) => (
              <motion.div
                key={`principle-${idx}-${principle.title}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 cursor-pointer ${
                  selectedIdx === idx 
                    ? 'bg-card border-primary shadow-2xl shadow-primary/5' 
                    : 'bg-card/50 border-border hover:border-primary/30'
                }`}
                onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                        selectedIdx === idx ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                      }`}>
                        <principle.icon size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">{principle.title}</h3>
                    </div>
                    <div className="text-primary">
                      {selectedIdx === idx ? <Minus size={24} /> : <Plus size={24} />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedIdx === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-lg text-muted-foreground mb-8 pt-4 leading-relaxed">
                          {principle.desc}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {principle.details.map((detail, dIdx) => (
                            <div key={`principle-detail-${idx}-${dIdx}`} className="p-4 rounded-xl bg-accent/50 border border-border">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">0{dIdx + 1}</div>
                              <div className="text-sm font-bold text-foreground">{detail}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
