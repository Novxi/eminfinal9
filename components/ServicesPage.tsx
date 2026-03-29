import React, { useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ServicesHero } from './services/ServicesHero';
import { ServicesNavigator } from './services/ServicesNavigator';
import { ServiceDetail } from './services/ServiceDetail';
import { useServices } from '../lib/useServices';

import { ArrowUp, MessageCircle } from 'lucide-react';

export const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const { services, loading } = useServices();
  
  const categories = Array.from(new Set(services.map(s => s.category)));
  
  const filteredServices = selectedCategory 
    ? services.filter(s => s.category === selectedCategory)
    : services;

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 1000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <ServicesHero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative">
        {/* Category Filter Bar - Static on Mobile/Desktop */}
        <div className="z-[60] py-4 mb-16 bg-[var(--background)]/80 backdrop-blur-md -mx-4 px-4 sm:mx-0 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 border ${
                selectedCategory === null 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                  : 'bg-card text-muted-foreground border-border hover:border-primary/30'
              }`}
            >
              Tüm Hizmetler
            </button>
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 border ${
                  selectedCategory === cat 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                    : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left Sidebar Navigator */}
          <aside className="lg:w-1/3">
            <ServicesNavigator selectedCategory={selectedCategory} />
          </aside>

          {/* Right Content Area */}
          <div className="lg:w-2/3 space-y-0 relative overflow-visible">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service, index) => (
                  <ServiceDetail key={service.id} service={service} index={index} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 z-[70] flex flex-col gap-4">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 bg-card border border-border text-foreground rounded-2xl shadow-2xl flex items-center justify-center hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
        
        <motion.a
          href="https://wa.me/905000000000"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-12 h-12 bg-[#25D366] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:-translate-y-1 transition-all duration-300"
        >
          <MessageCircle size={24} />
        </motion.a>
      </div>
    </div>
  );
};
