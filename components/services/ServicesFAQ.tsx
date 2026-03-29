import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { services } from '../../lib/servicesData';

export const ServicesFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const allFaqs = services.flatMap(s => s.faq).filter(f => f.q && f.a);

  if (allFaqs.length === 0) {
    // Fallback FAQs if data is empty
    allFaqs.push(
      { q: 'Proje süreci ne kadar sürer?', a: 'Proje kapsamına göre değişmekle birlikte, ortalama bir kurumsal web sitesi 4-6 hafta sürmektedir.' },
      { q: 'Hangi teknolojileri kullanıyorsunuz?', a: 'Modern web standartları olan React, Next.js, TailwindCSS ve Node.js gibi teknolojileri tercih ediyoruz.' },
      { q: 'Ödeme koşulları nasıldır?', a: 'Genellikle %50 peşin, %50 proje tesliminde olacak şekilde çalışıyoruz. Büyük projelerde aşamalı ödeme planları sunabiliyoruz.' }
    );
  }

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <HelpCircle size={32} />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Sıkça Sorulanlar</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6">
              Aklınızdaki <br />
              <span className="text-primary">Soruları</span> Yanıtlıyoruz
            </h2>
          </motion.div>
        </div>

        <div className="space-y-4">
          {allFaqs.map((faq, idx) => (
            <motion.div
              key={`faq-${idx}-${faq.q.substring(0, 20)}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                openIndex === idx ? 'bg-card border-primary/30 shadow-xl shadow-primary/5' : 'bg-card/50 border-border hover:border-primary/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className={`text-lg font-bold transition-colors duration-300 ${openIndex === idx ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === idx ? 'bg-primary text-primary-foreground rotate-180' : 'bg-accent text-muted-foreground'}`}>
                  {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 text-muted-foreground leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
