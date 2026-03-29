import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryItems, galleryCategories } from '../../lib/galleryData';

export const GalleryHero = () => {
  const featuredItems = galleryItems.filter(item => item.featured);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = featuredItems[currentIndex];
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Glare Effect Logic
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.3, 0, 0.3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden border-b border-border/50">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-indigo-500/5 blur-[100px] rounded-full -translate-x-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.15]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary uppercase mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Portfolyo Kataloğu
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9] lg:max-w-[1.2em]">
              Geleceği <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                İnşa Eden
              </span> <br/>
              Çözümlerimiz
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg leading-relaxed mb-10">
              Mühendislik hassasiyeti ve estetik vizyonla hayata geçirdiğimiz dijital ve fiziksel altyapı projelerimizi keşfedin.
            </p>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-foreground tracking-tighter">
                  {galleryItems.length}<span className="text-primary">+</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  TAMAMLANAN PROJE
                </span>
              </div>
              <div className="w-px h-10 bg-border/50 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-4xl font-black text-foreground tracking-tighter">
                  {galleryCategories.length - 1}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  UZMANLIK ALANI
                </span>
              </div>
              <div className="w-px h-10 bg-border/50 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={`avatar-${i}`} className="w-10 h-10 rounded-full border-2 border-background bg-accent overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-foreground">500+ Müşteri</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Güvenle Tercih Edilen</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Visual Featured Project Slider with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative group perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={containerRef}
          >
            <motion.div 
              className="relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden border border-border/50 shadow-2xl transition-shadow duration-500 group-hover:shadow-primary/20 isolate"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                clipPath: "inset(0% round 3rem)", // Modern clipping
                WebkitClipPath: "inset(0% round 3rem)",
              }}
            >
              {/* Glare Effect Layer */}
              <motion.div
                style={{
                  background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 80%)`,
                  opacity: glareOpacity,
                  transform: "translateZ(120px)",
                }}
                className="absolute inset-0 z-40 pointer-events-none"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img 
                    src={currentItem.src} 
                    alt={currentItem.title} 
                    className="w-full h-full object-cover rounded-[3rem]"
                    referrerPolicy="no-referrer"
                    style={{
                      transform: "translateZ(50px)",
                    }}
                  />
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              
              {/* Navigation Arrows */}
              <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none z-30">
                <button 
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-background/40 transition-all pointer-events-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                  style={{ transform: "translateZ(70px)" }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-background/40 transition-all pointer-events-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                  style={{ transform: "translateZ(70px)" }}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Floating Info Card */}
              <div 
                className="absolute bottom-8 left-8 right-8 bg-background/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl z-20"
                style={{ transform: "translateZ(100px)" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-primary/20 text-[9px] font-black text-primary uppercase tracking-wider">
                        {currentItem.category}
                      </span>
                      <div className="h-px flex-1 bg-border/30" />
                      <span className="text-[10px] font-bold text-muted-foreground">
                        0{currentIndex + 1} / 0{featuredItems.length}
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-foreground tracking-tight">
                      {currentItem.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {currentItem.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Decorative Elements around image */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
