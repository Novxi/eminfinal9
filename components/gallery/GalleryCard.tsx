import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GalleryItem } from '../../lib/galleryData';
import { Maximize2, MapPin, Building2, ClipboardCheck, Calendar } from 'lucide-react';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-[2.5rem] bg-card/30 border border-border/50 cursor-pointer w-full shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 perspective-1000 isolate"
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="flex flex-col lg:flex-row items-stretch min-h-[400px]">
        {/* Left: Image Container */}
        <div className="lg:w-1/2 relative overflow-hidden h-[300px] lg:h-auto">
          <motion.img
            src={item.src}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
          
          {/* Category Tag */}
          <div className="absolute top-6 left-6 z-20">
            <span className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white shadow-xl">
              {item.category}
            </span>
          </div>

          {/* Maximize Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-16 h-16 rounded-full bg-primary/80 text-white flex items-center justify-center backdrop-blur-md scale-0 group-hover:scale-100 transition-transform duration-500">
              <Maximize2 size={32} />
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter leading-none mb-4 group-hover:text-primary transition-colors duration-500">
                {item.title}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
              {item.company && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Müşteri</span>
                    <span className="text-sm font-bold text-foreground">{item.company}</span>
                  </div>
                </div>
              )}

              {item.location && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Konum</span>
                    <span className="text-sm font-bold text-foreground">{item.location}</span>
                  </div>
                </div>
              )}

              {item.scope && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ClipboardCheck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Kapsam</span>
                    <span className="text-sm font-bold text-foreground">{item.scope}</span>
                  </div>
                </div>
              )}

              {item.date && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Tarih</span>
                    <span className="text-sm font-bold text-foreground">{new Date(item.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {item.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-accent/50 border border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
