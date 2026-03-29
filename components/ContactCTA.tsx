import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Button } from './ui/Button';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import SplitText from './ui/SplitText';

export const ContactCTA = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden bg-transparent">
      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-background to-transparent pointer-events-none z-20" />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
      </div>

      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
        className="max-w-6xl mx-auto relative group"
      >
        {/* Main Content Container - Removed Box Styling */}
        <div className="relative">
          
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/4 w-[100%] h-[100%] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-[100px]"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -left-1/4 w-[100%] h-[100%] bg-gradient-to-tr from-secondary/20 via-transparent to-transparent blur-[100px]"
            />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
                 style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative z-10 px-8 py-24 md:px-24 md:py-32 flex flex-col items-center text-center"
          >
            {/* Top Badge */}
            <motion.div 
              variants={itemVariants}
              className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border backdrop-blur-xl"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Ücretsiz Keşif & Danışmanlık</span>
            </motion.div>

            <div className="mb-8">
              <SplitText
                text="Projenizi Hayata Geçirelim"
                className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tighter leading-[0.9]"
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
                showCallback
              />
            </div>
            
            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
            >
              Güvenlikten yazılıma, ihtiyaç duyduğunuz tüm teknoloji çözümleri için uzman ekibimiz hazır. Geleceğin altyapısını birlikte kurgulayalım.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
            >
              <Button 
                variant="primary" 
                onClick={() => navigate('/teklif-al')}
                className="w-full sm:w-auto px-10 py-5 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_20px_40px_rgba(14,165,233,0.2)] dark:shadow-[0_20px_40px_rgba(14,165,233,0.3)] group/btn"
              >
                Hemen Teklif Al <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="glass" 
                className="w-full sm:w-auto px-10 py-5 text-base border-border text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
              >
                <MessageSquare size={18} /> WhatsApp Destek
              </Button>
            </motion.div>

            {/* Bottom Stats/Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="mt-20 pt-10 border-t border-border flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">7/24 Teknik Destek</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Ücretsiz Saha Keşfi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Garantili Kurulum</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};