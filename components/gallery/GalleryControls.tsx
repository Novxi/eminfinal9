import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryCategories } from '../../lib/galleryData';

interface GalleryControlsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  items: any[]; // Added items to calculate counts
}

export const GalleryControls: React.FC<GalleryControlsProps> = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  items,
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "Tümü": items.length };
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <>
      <motion.div
        className="relative z-40 py-4 bg-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Search Bar - More Solid Design */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Proje veya etiket ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-card border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-bold placeholder:text-muted-foreground/50 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Desktop Categories with Counts */}
            <div className="hidden md:flex items-center flex-1 min-w-0 mx-2 gap-2">
              <button 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-2.5 rounded-xl bg-card border border-border/50 shadow-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all flex-shrink-0 ${
                  canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="relative flex-1 overflow-hidden group/track mx-2">
                <div 
                  ref={scrollContainerRef}
                  onScroll={checkScroll}
                  className="flex items-center gap-3 overflow-x-auto no-scrollbar px-2 py-1 w-full scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {galleryCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap border flex items-center gap-3 ${
                        activeCategory === category
                          ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105'
                          : 'bg-card text-muted-foreground border-border/50 hover:bg-accent hover:text-foreground hover:border-border'
                      }`}
                    >
                      {category}
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                        activeCategory === category ? 'bg-white/20 text-white' : 'bg-accent text-muted-foreground'
                      }`}>
                        {categoryCounts[category] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-2.5 rounded-xl bg-card border border-border/50 shadow-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all flex-shrink-0 ${
                  canScrollRight ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end md:hidden">
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-accent/50 border border-border text-xs font-bold uppercase tracking-wide text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  Filtreler
                </div>
                <ChevronDown size={14} className={`transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Categories Dropdown */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 flex flex-wrap gap-2">
                  {galleryCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setIsMobileFiltersOpen(false);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                        activeCategory === category
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-accent/30 text-muted-foreground border border-border/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
