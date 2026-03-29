import React from 'react';
import { motion } from 'framer-motion';
import { ctaContent } from '../../lib/whyData';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const WhyCTA = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 md:p-24 rounded-[4rem] bg-card border border-border shadow-2xl text-center relative overflow-hidden group"
        >
          {/* Animated Background Glow */}
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-8">
            {ctaContent.headline}
          </h2>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            {ctaContent.subtext}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              {ctaContent.buttons[0].label}
              <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 rounded-2xl bg-accent text-foreground font-bold text-lg border border-border hover:border-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              <MessageCircle size={20} className="text-primary" />
              {ctaContent.buttons[1].label}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
