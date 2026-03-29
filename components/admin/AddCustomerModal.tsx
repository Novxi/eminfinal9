import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div key="add-customer-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-foreground tracking-tight">Yeni Müşteri Ekle</h3>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Ad Soyad</label>
                  <input name="name" required className="w-full bg-input/50 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground" placeholder="Müşteri adını girin..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-posta Adresi</label>
                  <input name="email" type="email" required className="w-full bg-input/50 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Şifre</label>
                  <input name="password" type="password" required minLength={6} className="w-full bg-input/50 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground" placeholder="Müşteri şifresini girin..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Button variant="secondary" type="button" onClick={onClose} className="py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-border w-full">Vazgeç</Button>
                  <Button type="submit" className="py-4 rounded-2xl text-xs font-black uppercase tracking-widest w-full">Müşteriyi Kaydet</Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
