import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { WhyHero } from './why/WhyHero';
import { WhyWelcome } from './why/WhyWelcome';
import { TrustSignals } from './why/TrustSignals';
import { SwipeComparison } from './why/SwipeComparison';
import { PrinciplesOrbit } from './why/PrinciplesOrbit';
import { QualitySystem } from './why/QualitySystem';
import { TestimonialsSection } from './why/TestimonialsSection';
import { WhyGuarantees } from './why/WhyGuarantees';
import { WhyFAQ } from './why/WhyFAQ';
import { WhyCTA } from './why/WhyCTA';
import { ArrowUp } from 'lucide-react';

export const WhyUsPage = () => {
  const { scrollYProgress } = useScroll();
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 1000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      <WhyHero />
      
      {/* Blur Divider */}
      <div className="h-24 w-full -mt-12 relative z-20 bg-gradient-to-b from-transparent via-background/80 to-background backdrop-blur-xl" />
      
      <WhyWelcome />
      
      {/* Blur Divider */}
      <div className="h-24 w-full -my-12 relative z-20 bg-gradient-to-b from-transparent via-background/50 to-transparent backdrop-blur-xl" />

      <TrustSignals />
      
      {/* Blur Divider */}
      <div className="h-32 w-full -my-16 relative z-20 bg-gradient-to-b from-transparent via-background/80 to-background backdrop-blur-xl" />

      <SwipeComparison />
      
      {/* Blur Divider */}
      <div className="h-24 w-full -my-12 relative z-20 bg-gradient-to-b from-transparent via-accent/5 to-accent/5 backdrop-blur-xl" />

      <PrinciplesOrbit />
      
      {/* Blur Divider */}
      <div className="h-24 w-full -my-12 relative z-20 bg-gradient-to-b from-accent/5 via-accent/5 to-transparent backdrop-blur-xl" />

      <QualitySystem />

      {/* Blur Divider */}
      <div className="h-24 w-full -my-12 relative z-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent backdrop-blur-xl" />

      <TestimonialsSection />

      {/* Blur Divider */}
      <div className="h-24 w-full -my-12 relative z-20 bg-gradient-to-b from-transparent via-secondary/5 to-transparent backdrop-blur-xl" />

      <WhyGuarantees />

      {/* Blur Divider */}
      <div className="h-24 w-full -my-12 relative z-20 bg-gradient-to-b from-transparent via-background/80 to-background backdrop-blur-xl" />

      {/* Blur Divider */}
      <div className="h-24 w-full -my-12 relative z-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent backdrop-blur-xl" />

      <WhyFAQ />

      {/* Blur Divider */}
      <div className="h-32 w-full -my-16 relative z-20 bg-gradient-to-b from-transparent via-background/80 to-background backdrop-blur-xl" />

      <WhyCTA />

      {/* Back to Top */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-card border border-border text-foreground rounded-2xl shadow-2xl flex items-center justify-center hover:-translate-y-1 transition-all z-50"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </div>
  );
};
