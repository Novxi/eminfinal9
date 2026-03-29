import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '../../lib/galleryData';
import { GalleryCard } from './GalleryCard';

interface GalleryGridProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onItemClick }) => {
  return (
    <motion.div 
      layout
      className="flex flex-col gap-12 md:gap-24 relative"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, idx) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.8, 
              delay: idx * 0.05,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="w-full"
          >
            <GalleryCard 
              item={item} 
              onClick={() => onItemClick(item)} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
