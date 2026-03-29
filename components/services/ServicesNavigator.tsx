import React from 'react';
import { motion } from 'framer-motion';
import { useServices } from '../../lib/useServices';

interface ServicesNavigatorProps {
  selectedCategory: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export const ServicesNavigator = ({ selectedCategory }: ServicesNavigatorProps) => {
  const { services, loading } = useServices();
  
  const filteredServices = selectedCategory 
    ? services.filter(s => s.category === selectedCategory)
    : services;

  const scrollToService = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-12 space-y-8 hidden lg:block">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">
          Hizmet Navigasyonu
        </h3>
        {!loading && (
          <div className="space-y-2">
            {filteredServices.map((service, index) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => scrollToService(service.id)}
                className="w-full text-left group flex items-center gap-4 py-2"
                whileHover={{ x: 4 }}
              >
                <div className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors" />
                <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                  {service.title}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 rounded-2xl bg-accent/50 border border-border">
        <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Yardıma mı ihtiyacınız var?</p>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Projeniz için en uygun çözümü bulmakta zorlanıyorsanız uzman ekibimizle iletişime geçin.
        </p>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
          Bize Ulaşın →
        </button>
      </div>
    </div>
  );
};
