import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, ArrowRight } from 'lucide-react';
import { ctaData } from '../../lib/servicesData';

export const ServicesCTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-12 md:p-24 rounded-[3rem] bg-foreground text-background overflow-hidden shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 leading-tight">
              {ctaData.headline}
            </h2>
            <p className="text-lg md:text-xl text-background/70 mb-12 font-medium">
              {ctaData.subtext}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
                {ctaData.buttons[0]} <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-background/10 border border-background/20 text-background rounded-2xl font-bold text-lg hover:bg-background/20 transition-all duration-300 flex items-center justify-center gap-3">
                <MessageSquare size={20} /> {ctaData.buttons[1]}
              </button>
            </div>
          </div>

          {/* Decorative Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
        </motion.div>
      </div>
    </section>
  );
};
