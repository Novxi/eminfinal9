import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPurchase: any;
  setEditingPurchase: (purchase: any) => void;
  handleSavePurchase: (e: React.FormEvent) => void;
  combinedServices: any[];
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  editingPurchase,
  setEditingPurchase,
  handleSavePurchase,
  combinedServices,
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
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-foreground tracking-tight">
                  {editingPurchase?.id ? 'Satış Düzenle' : 'Yeni Satış Ekle'}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePurchase} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Müşteri Adı</label>
                    <input 
                      required
                      value={editingPurchase?.customerName}
                      onChange={(e) => setEditingPurchase({ ...editingPurchase, customerName: e.target.value })}
                      className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all" 
                      placeholder="Müşteri Ad Soyad"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Müşteri E-Posta</label>
                    <input 
                      required
                      type="email"
                      value={editingPurchase?.customerEmail}
                      onChange={(e) => setEditingPurchase({ ...editingPurchase, customerEmail: e.target.value })}
                      className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all" 
                      placeholder="ornek@mail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hizmet Adı</label>
                      <select 
                        required
                        value={editingPurchase?.serviceId}
                        onChange={(e) => {
                          const service = combinedServices.find(s => s.id === e.target.value);
                          setEditingPurchase({ 
                            ...editingPurchase, 
                            serviceId: e.target.value,
                            serviceName: service?.name || service?.title || '',
                            price: service?.price || 0
                          });
                        }}
                        className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                      >
                        <option value="">Hizmet Seçin</option>
                        {combinedServices.map((s, idx) => (
                          <option key={`${s.type}-${s.id}-${idx}`} value={s.id}>{s.name || s.title} (₺{s.price})</option>
                        ))}
                      </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tutar (₺)</label>
                      <input 
                        required
                        type="number"
                        value={editingPurchase?.price}
                        onChange={(e) => setEditingPurchase({ ...editingPurchase, price: Number(e.target.value) })}
                        className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tarih</label>
                      <input 
                        required
                        type="date"
                        value={editingPurchase?.purchaseDate}
                        onChange={(e) => setEditingPurchase({ ...editingPurchase, purchaseDate: e.target.value })}
                        className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Durum</label>
                    <select 
                      value={editingPurchase?.status}
                      onChange={(e) => setEditingPurchase({ ...editingPurchase, status: e.target.value })}
                      className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="Ödeme Alındı">Ödeme Alındı</option>
                      <option value="İş Tamamlandı">İş Tamamlandı</option>
                      <option value="Beklemede">Beklemede</option>
                      <option value="İptal Edildi">İptal Edildi</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest">
                  {editingPurchase?.id ? 'Güncelle' : 'Kaydet'}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
