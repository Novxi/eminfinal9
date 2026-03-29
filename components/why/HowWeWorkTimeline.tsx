import React from 'react';
import { motion } from 'framer-motion';
import { howWeWork } from '../../lib/whyData';
import { Package } from 'lucide-react';

export const HowWeWorkTimeline = () => {
  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Metodoloji</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6">
            {howWeWork.title}
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground font-medium">
            Sürprizlere yer yok. Her adımda ne alacağınızı ve projenin neresinde olduğumuzu net bir şekilde bilirsiniz.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

          <div className="space-y-24">
            {howWeWork.steps.map((step, idx) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className="flex-1 w-full">
                  <div className={`p-10 rounded-[2.5rem] bg-card border border-border hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`flex items-center gap-4 mb-6 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <div className="text-4xl font-black text-primary/20 tracking-tighter">0{idx + 1}</div>
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">{step.name}</h3>
                    </div>
                    <p className="text-muted-foreground font-medium mb-8 leading-relaxed">{step.desc}</p>
                    
                    <div className={`flex flex-wrap gap-2 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      {step.deliverables.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent border border-border text-[10px] font-bold uppercase tracking-widest text-foreground/70">
                          <Package size={12} className="text-primary" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Point */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-2xl hidden md:flex">
                  <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
