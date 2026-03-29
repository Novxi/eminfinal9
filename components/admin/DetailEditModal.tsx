import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface DetailEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDetail: any;
  combinedServices: any[];
  onAddService: (data: any) => void;
  onUpdateService: (id: string, data: any) => void;
  onAddTransaction: (data: any) => void;
  onUpdateTransaction: (id: string, data: any) => void;
  onAddPayment: (data: any) => void;
  onUpdatePayment: (id: string, data: any) => void;
  onUploadDocument: (data: any) => void;
  onAddEmployee?: (data: any) => void;
  onUpdateEmployee?: (id: string, data: any) => void;
}

export const DetailEditModal: React.FC<DetailEditModalProps> = ({
  isOpen,
  onClose,
  editingDetail,
  combinedServices,
  onAddService,
  onUpdateService,
  onAddTransaction,
  onUpdateTransaction,
  onAddPayment,
  onUpdatePayment,
  onUploadDocument,
  onAddEmployee,
  onUpdateEmployee
}) => {
  if (!isOpen || !editingDetail) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (editingDetail.type === 'service') {
      const selectedService = combinedServices.find(s => (s.name || s.title) === data.name);
      const serviceData = {
        ...data,
        icon: selectedService?.icon || 'Shield',
        color: selectedService?.color || 'text-primary',
        warrantyEnd: data.warrantyDate
      };
      if (editingDetail.id) onUpdateService(editingDetail.id, serviceData);
      else onAddService(serviceData);
    } else if (editingDetail.type === 'transaction') {
      if (editingDetail.id) onUpdateTransaction(editingDetail.id, data);
      else onAddTransaction(data);
    } else if (editingDetail.type === 'payment') {
      if (editingDetail.id) onUpdatePayment(editingDetail.id, data);
      else onAddPayment(data);
    } else if (editingDetail.type === 'document') {
      onUploadDocument({ ...data, date: new Date().toISOString().split('T')[0] });
    } else if (editingDetail.type === 'employee') {
      if (editingDetail.id) onUpdateEmployee?.(editingDetail.id, data);
      else onAddEmployee?.(data);
    }
  };

  return (
    <div key="edit-detail-modal" className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-scroll"
      >
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-foreground tracking-tight">
              {editingDetail.id ? 'Düzenle' : 'Yeni Ekle'} - {
                editingDetail.type === 'service' ? 'Hizmet' : 
                editingDetail.type === 'transaction' ? 'İşlem' : 
                editingDetail.type === 'payment' ? 'Ödeme' : 
                editingDetail.type === 'employee' ? 'Çalışan' : 'Belge'
              }
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="rotate-45" size={20} />
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {editingDetail.type === 'service' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hizmet Adı</label>
                  <select 
                    name="name" 
                    defaultValue={editingDetail.name || ''} 
                    required 
                    className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground"
                    onChange={(e) => {
                      const service = combinedServices.find(s => (s.name || s.title) === e.target.value);
                      if (service) {
                        const priceInput = e.currentTarget.form?.querySelector('input[name="price"]') as HTMLInputElement;
                        if (priceInput) priceInput.value = String(service.price);
                      }
                    }}
                  >
                    <option value="" disabled>Hizmet Seçin</option>
                    {combinedServices.map((service: any, idx: number) => (
                      <option key={`${service.type}-${service.id}-${idx}`} value={service.name || service.title}>
                        {service.name || service.title} (₺{service.price || 0})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tutar (₺)</label>
                  <input name="price" type="number" defaultValue={editingDetail.price || 0} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Garanti Bitiş Tarihi</label>
                  <input name="warrantyDate" type="date" defaultValue={editingDetail.warrantyDate} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Son Bakım Tarihi</label>
                  <input name="lastMaintenance" type="date" defaultValue={editingDetail.lastMaintenance || new Date().toISOString().split('T')[0]} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Durum</label>
                  <select name="status" defaultValue={editingDetail.status || 'Aktif'} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground">
                    <option value="Aktif">Aktif</option>
                    <option value="Pasif">Pasif</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                  </select>
                </div>
              </>
            )}

            {editingDetail.type === 'transaction' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">İşlem Açıklaması</label>
                  <input name="description" defaultValue={editingDetail.description} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tarih</label>
                  <input name="date" type="date" defaultValue={editingDetail.date || new Date().toISOString().split('T')[0]} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Durum</label>
                  <input name="status" defaultValue={editingDetail.status || 'Tamamlandı'} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
              </>
            )}

            {editingDetail.type === 'payment' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Miktar (₺)</label>
                  <input name="amount" type="number" step="0.01" defaultValue={editingDetail.amount} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tarih</label>
                  <input name="date" type="date" defaultValue={editingDetail.date || new Date().toISOString().split('T')[0]} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Yöntem</label>
                  <select name="method" defaultValue={editingDetail.method || 'Kredi Kartı'} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground">
                    <option value="Kredi Kartı">Kredi Kartı</option>
                    <option value="Havale/EFT">Havale/EFT</option>
                    <option value="Nakit">Nakit</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Durum</label>
                  <select name="status" defaultValue={editingDetail.status || 'Tamamlandı'} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground">
                    <option value="Tamamlandı">Tamamlandı</option>
                    <option value="Bekliyor">Bekliyor</option>
                    <option value="İptal">İptal</option>
                  </select>
                </div>
              </>
            )}

            {editingDetail.type === 'document' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Belge Adı</label>
                  <input name="name" required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Belge Türü</label>
                  <select name="type" className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground">
                    <option value="Fatura">Fatura</option>
                    <option value="Sözleşme">Sözleşme</option>
                    <option value="Teknik Rapor">Teknik Rapor</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Belge URL (Simüle)</label>
                  <input name="url" placeholder="https://..." required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
              </>
            )}

            {editingDetail.type === 'employee' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Ad Soyad</label>
                  <input name="name" defaultValue={editingDetail.name} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-posta</label>
                  <input name="email" type="email" defaultValue={editingDetail.email} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Pozisyon / Rol</label>
                  <input name="role" defaultValue={editingDetail.role || 'Çalışan'} required className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                </div>
                {!editingDetail.id && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Şifre</label>
                    <input name="password" type="password" placeholder="Varsayılan: 123456" className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-foreground" />
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="secondary" type="button" onClick={onClose} className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-border">Vazgeç</Button>
              <Button type="submit" className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Kaydet</Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
