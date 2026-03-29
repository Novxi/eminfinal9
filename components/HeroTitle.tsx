import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";
import { useTheme } from "./ThemeContext";

export const HeroTitle = () => {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse tracking values (0.5 = center)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };

  // Smooth mouse values
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  // 3D Rotation (Tilt) calculations based on mouse position
  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width;
    const yPct = (clientY - top) / height;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  return (
    <div className="relative w-full z-20 perspective-1000 antialiased">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative flex flex-col items-center justify-center text-center p-6 sm:p-10 md:p-20 pt-28 sm:pt-32 md:pt-40 w-full backface-hidden"
      >
        {/* Decorative Badge */}
        <motion.div 
          variants={itemVariants}
          style={{ transform: "translateZ(50px)" }}
          className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/50 border border-border/50 backdrop-blur-xl mb-8 shadow-sm pointer-events-none select-none"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          <span className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
            Geleceğin Teknolojisi
          </span>
        </motion.div>

        {/* 3D TEXT GROUP */}
        <motion.div 
          variants={itemVariants}
          className="relative mb-10 select-none cursor-default" 
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Background Glow for Text Contrast - More subtle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <h1 
            className="relative z-10 text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] py-2 bg-clip-text text-transparent"
            style={{
              transform: "translateZ(40px)",
              WebkitFontSmoothing: "antialiased",
              backgroundImage: theme === 'dark' 
                ? "linear-gradient(to bottom, #7dd3fc, #0ea5e9, #0369a1)" 
                : "linear-gradient(to bottom, #0ea5e9, #0284c7, #0c4a6e)",
              textShadow: theme === 'dark' ? "0 10px 30px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            GÜVENLİ<br />GELECEK
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={itemVariants}
          className="relative max-w-3xl mx-auto mb-16"
          style={{ transform: "translateZ(20px)" }}
        >
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium pointer-events-none">
            Emin Bilgi İşlem ile yangın, güvenlik, network ve yazılım sistemlerinde 
            <span className="text-primary font-bold"> üst düzey mühendislik</span> deneyimini keşfedin.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-6"
          style={{ transform: "translateZ(60px)" }}
        >
          <Button variant="primary" className="shadow-lg shadow-primary/20 px-8 py-4">
            Hizmetleri İncele
          </Button>
          <Button variant="secondary" className="border-border text-foreground hover:bg-accent px-8 py-4">
            Projelerimiz <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>

      </motion.div>
    </div>
  );
};