import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '../../lib/galleryData';
import { X, ChevronLeft, ChevronRight, Share2, Download, MapPin, Building2, ClipboardCheck, Calendar } from 'lucide-react';

interface GalleryLightboxProps {
  selectedItem: GalleryItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ selectedItem, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, onClose, onNext, onPrev]);

  if (!selectedItem) return null;

  return (
    <AnimatePresence>
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:rotate-90"
          >
            <X size={28} />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:-translate-x-2 hidden md:flex"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:translate-x-2 hidden md:flex"
          >
            <ChevronRight size={28} />
          </button>

          {/* Main Content */}
          <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center py-20" onClick={onClose}>
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              className="relative max-h-[60vh] w-auto max-w-full rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 isolate shrink-0"
              style={{ 
                clipPath: "inset(0% round 2rem)",
                WebkitClipPath: "inset(0% round 2rem)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </motion.div>

            {/* Caption / Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-10 text-center max-w-4xl p-8 md:p-12 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-primary/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  {selectedItem.category}
                </span>
                <div className="w-8 h-px bg-primary/50" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-none">
                {selectedItem.title}
              </h2>
              <p className="text-white/60 text-base md:text-lg leading-relaxed font-medium mb-10">
                {selectedItem.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left border-t border-white/10 pt-10">
                {selectedItem.company && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-primary flex items-center justify-center shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">Müşteri</span>
                      <span className="text-sm font-bold text-white">{selectedItem.company}</span>
                    </div>
                  </div>
                )}

                {selectedItem.location && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-primary flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">Konum</span>
                      <span className="text-sm font-bold text-white">{selectedItem.location}</span>
                    </div>
                  </div>
                )}

                {selectedItem.scope && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-primary flex items-center justify-center shrink-0">
                      <ClipboardCheck size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">Kapsam</span>
                      <span className="text-sm font-bold text-white">{selectedItem.scope}</span>
                    </div>
                  </div>
                )}

                {selectedItem.date && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-primary flex items-center justify-center shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">Tarih</span>
                      <span className="text-sm font-bold text-white">{new Date(selectedItem.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-12">
                <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-1">
                  <Share2 size={16} className="text-primary" /> Paylaş
                </button>
                <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-primary/20">
                  <Download size={16} /> İndir
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
