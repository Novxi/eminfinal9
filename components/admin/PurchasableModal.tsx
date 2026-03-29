import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface PurchasableModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPurchasable: any;
  setEditingPurchasable: (purchasable: any) => void;
  handleSavePurchasable: (e: React.FormEvent) => void;
}

export const PurchasableModal: React.FC<PurchasableModalProps> = ({
  isOpen,
  onClose,
  editingPurchasable,
  setEditingPurchasable,
  handleSavePurchasable,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl"
          >
            <form onSubmit={handleSavePurchasable} className="p-8 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-foreground">
                  {editingPurchasable?.id ? 'Hizmeti Düzenle' : 'Yeni Hizmet Tanımla'}
                </h3>
                <button type="button" onClick={onClose} className="p-2 hover:bg-accent/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hizmet Adı</label>
                  <input 
                    required
                    value={editingPurchasable?.name || ''}
                    onChange={(e) => setEditingPurchasable({ ...editingPurchasable, name: e.target.value })}
                    className="w-full bg-input border border-border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground" 
                    placeholder="Örn: Güvenlik Kamerası Bakımı" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Açıklama</label>
                  <textarea 
                    required
                    rows={3}
                    value={editingPurchasable?.description || ''}
                    onChange={(e) => setEditingPurchasable({ ...editingPurchasable, description: e.target.value })}
                    className="w-full bg-input border border-border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground" 
                    placeholder="Hizmet detaylarını açıklayın..." 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Fiyat (₺)</label>
                    <input 
                      required
                      type="number"
                      value={editingPurchasable?.price || ''}
                      onChange={(e) => setEditingPurchasable({ ...editingPurchasable, price: parseFloat(e.target.value) })}
                      className="w-full bg-input border border-border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">İkon</label>
                    <select 
                      value={editingPurchasable?.icon || 'Briefcase'}
                      onChange={(e) => setEditingPurchasable({ ...editingPurchasable, icon: e.target.value })}
                      className="w-full bg-input border border-border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground"
                    >
                      <option value="Briefcase">Çanta</option>
                      <option value="Shield">Kalkan</option>
                      <option value="Zap">Şimşek</option>
                      <option value="Wrench">Anahtar</option>
                      <option value="Camera">Kamera</option>
                      <option value="Lock">Kilit</option>
                      <option value="Sparkles">Yıldız</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                  {editingPurchasable?.id ? 'Değişiklikleri Kaydet' : 'Markete Ekle'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
