import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { comparisonData } from '../../lib/whyData';
import { Check, X, ArrowRightLeft } from 'lucide-react';

export const SwipeComparison = () => {
  const [activeTab, setActiveTab] = useState<'us' | 'typical'>('us');

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Farkımız</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6">
            Neden Standartlarla <br />
            <span className="text-primary">Yetinmiyoruz?</span>
          </h2>
        </div>

        {/* Comparison Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-accent/50 backdrop-blur-sm rounded-2xl border border-border shadow-inner">
            <button
              onClick={() => setActiveTab('us')}
              className={`px-8 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'us' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-105' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Bizde Nasıl?
            </button>
            <button
              onClick={() => setActiveTab('typical')}
              className={`px-8 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'typical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-105' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Standartta Nasıl?
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border rounded-[2.5rem] overflow-hidden border border-border shadow-2xl">
          {/* US Column */}
          <div className={`p-12 bg-card transition-all duration-500 ${activeTab === 'typical' ? 'hidden lg:block opacity-40 grayscale' : 'block'}`}>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Check size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">{comparisonData.leftTitle}</h3>
            </div>
            
            <div className="space-y-12">
              {comparisonData.rows.map((row, idx) => (
                <div key={`comparison-us-${idx}-${row.topic}`} className="group">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">{row.topic}</div>
                  <p className="text-lg font-medium text-foreground leading-relaxed">{row.us}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TYPICAL Column */}
          <div className={`p-12 bg-accent/30 transition-all duration-500 ${activeTab === 'us' ? 'hidden lg:block opacity-40 grayscale' : 'block'}`}>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <X size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">{comparisonData.rightTitle}</h3>
            </div>

            <div className="space-y-12">
              {comparisonData.rows.map((row, idx) => (
                <div key={`comparison-typical-${idx}-${row.topic}`} className="group">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">{row.topic}</div>
                  <p className="text-lg font-medium text-muted-foreground leading-relaxed">{row.typical}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground">
          <ArrowRightLeft size={16} />
          <p className="text-xs font-bold uppercase tracking-widest">Karşılaştırmayı İnceleyin</p>
        </div>
      </div>
    </section>
  );
};
