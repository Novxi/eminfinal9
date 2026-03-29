import React from 'react';
import { motion } from 'framer-motion';
import { trustMetrics } from '../../lib/whyData';

export const TrustSignals = () => {
  return (
    <section className="py-24 border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {trustMetrics.map((metric, idx) => (
            <motion.div
              key={`trust-metric-${idx}-${metric.label}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-primary tracking-tighter mb-2">
                {metric.value}
              </div>
              <div className="text-sm font-bold text-foreground mb-1 uppercase tracking-wider">
                {metric.label}
              </div>
              <div className="text-xs text-muted-foreground font-medium italic">
                {metric.note}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
