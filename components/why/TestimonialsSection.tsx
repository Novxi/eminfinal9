import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Geri dönüşler yüklenirken hata oluştu:", error);
      }
    };
    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  const marqueeWidth = testimonials.length * 482; // Approximate width for marquee calculation

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4"
          >
            <Star size={12} className="fill-current" />
            <span>Müşteri Memnuniyeti</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Bizden Hizmet Alanların <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Geri Dönüşleri</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            İş ortaklarımızın başarı hikayeleri, bizim en büyük motivasyon kaynağımızdır.
          </motion.p>
        </div>

        {/* Marquee Container */}
        <div 
          className="relative flex overflow-hidden py-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            animate={{
              x: isPaused ? undefined : [0, -marqueeWidth],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: testimonials.length * 8, // Adjust speed based on count
                ease: "linear",
              },
            }}
            className="flex gap-8"
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id || index}-${index}`}
                className="flex-shrink-0 w-[350px] md:w-[450px] p-8 rounded-[2rem] bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/40 hover:bg-card/60 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Card Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors duration-500" />
                
                <div className="absolute top-6 right-8 text-primary/5 group-hover:text-primary/15 transition-colors duration-500">
                  <Quote size={64} />
                </div>
                
                <div className="flex gap-1 mb-8">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={`star-${testimonial.id || index}-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Star size={18} className="fill-primary text-primary" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-foreground/90 text-lg leading-relaxed mb-10 relative z-10 font-medium italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-5 mt-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/30 relative z-10">
                      <img 
                        src={testimonial.image} 
                        alt="Müşteri"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Side Fades */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
