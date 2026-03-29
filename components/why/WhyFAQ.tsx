import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from '../../lib/whyData';
import { ChevronDown } from 'lucide-react';

export const WhyFAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Merak Edilenler</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6">
            Soruları <span className="text-primary">Yanıtlıyoruz</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={`why-faq-${idx}-${faq.q.substring(0, 20)}`}
              className={`rounded-[2rem] border transition-all duration-500 ${
                openIdx === idx ? 'bg-card border-primary/30 shadow-xl shadow-primary/5' : 'bg-card/50 border-border hover:border-primary/20'
              }`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-8 py-8 flex items-center justify-between text-left"
              >
                <span className="text-lg font-bold text-foreground tracking-tight">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIdx === idx ? 180 : 0 }}
                  className="text-primary"
                >
                  <ChevronDown size={24} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-muted-foreground font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
