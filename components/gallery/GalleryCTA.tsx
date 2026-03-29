import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const GalleryCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6 block">
            Sıradaki Adım
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
            Sizin Projenizi <br />
            <span className="text-primary">Hayata Geçirelim</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Gördükleriniz sadece başlangıç. Markanız için özel olarak tasarlanmış çözümlerle dijital dünyada fark yaratın.
          </p>

          <button 
            onClick={() => navigate('/teklif-al')}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-primary-foreground bg-primary rounded-full overflow-hidden transition-transform hover:scale-105 shadow-xl shadow-primary/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              Teklif Alın <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-brand-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
