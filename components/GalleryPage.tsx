import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryHero } from './gallery/GalleryHero';
import { GalleryControls } from './gallery/GalleryControls';
import { GalleryGrid } from './gallery/GalleryGrid';
import { GalleryLightbox } from './gallery/GalleryLightbox';
import { GalleryCTA } from './gallery/GalleryCTA';
import { galleryItems, GalleryItem } from '../lib/galleryData';

export const GalleryPage = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Initialize data from backend
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Galeri yüklenirken hata oluştu:", error);
      }
    };
    fetchGallery();
  }, []);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'Tümü' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Lightbox Navigation
  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 blur-[130px] rounded-full" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)] opacity-50" />
      </div>

      <div className="relative z-10">
        <GalleryHero />
        
        <div className="sticky top-20 z-40 backdrop-blur-xl bg-background/60 border-b border-border/50">
          <GalleryControls
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            items={items}
          />
        </div>

        <section className="py-20 md:py-32 min-h-[50vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredItems.length > 0 ? (
              <GalleryGrid items={filteredItems} onItemClick={setSelectedItem} />
            ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Sonuç Bulunamadı</h3>
              <p className="text-muted-foreground">
                Arama kriterlerinize uygun proje bulunamadı. Lütfen farklı bir kategori veya anahtar kelime deneyin.
              </p>
              <button
                onClick={() => { setActiveCategory('Tümü'); setSearchQuery(''); }}
                className="mt-6 px-6 py-2 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <GalleryCTA />

      <GalleryLightbox
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
      </div>
    </div>
  );
};
