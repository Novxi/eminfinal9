import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Service } from '../../lib/servicesData';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingService: Partial<Service> | null;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  setEditingService: React.Dispatch<React.SetStateAction<Partial<Service> | null>>;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  editingService,
  onSave,
  setEditingService
}) => {
  if (!isOpen) return null;

  return (
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
        className="relative w-full max-w-2xl bg-card rounded-[2rem] border border-border overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={onSave} className="flex flex-col h-full max-h-[90vh]">
          <div className="p-6 border-b border-border flex items-center justify-between shrink-0 sticky top-0 bg-card z-10">
            <h3 className="text-xl font-black text-foreground">
              {editingService?.id ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
            </h3>
            <button type="button" onClick={onClose} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            {/* Temel Bilgiler Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase size={16} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider">Temel Bilgiler</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hizmet Başlığı</label>
                  <input 
                    name="title" 
                    required 
                    value={editingService?.title}
                    onChange={(e) => setEditingService(prev => ({ ...prev!, title: e.target.value }))}
                    className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategori</label>
                  <select 
                    name="category" 
                    required 
                    value={editingService?.category}
                    onChange={(e) => setEditingService(prev => ({ ...prev!, category: e.target.value as any }))}
                    className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Güvenlik">Güvenlik</option>
                    <option value="Yazılım">Yazılım</option>
                    <option value="Danışmanlık">Danışmanlık</option>
                    <option value="Altyapı">Altyapı</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kısa Açıklama (Tagline)</label>
                <input 
                  name="tagline" 
                  required 
                  value={editingService?.tagline}
                  onChange={(e) => setEditingService(prev => ({ ...prev!, tagline: e.target.value }))}
                  className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">İkon Adı (Lucide)</label>
                  <input 
                    name="icon" 
                    required 
                    value={editingService?.icon}
                    onChange={(e) => setEditingService(prev => ({ ...prev!, icon: e.target.value }))}
                    className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Renk (Hex)</label>
                  <div className="flex gap-2">
                    <input 
                      name="color" 
                      type="color"
                      required 
                      value={editingService?.color}
                      onChange={(e) => setEditingService(prev => ({ ...prev!, color: e.target.value }))}
                      className="w-12 h-11 bg-input/50 border border-input rounded-xl p-1 focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={editingService?.color}
                      onChange={(e) => setEditingService(prev => ({ ...prev!, color: e.target.value }))}
                      className="flex-1 bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Detaylar Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 size={16} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider">Hizmet Detayları</h4>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Çözüm Açıklaması</label>
                <textarea 
                  name="solution" 
                  required 
                  value={editingService?.solution}
                  onChange={(e) => setEditingService(prev => ({ ...prev!, solution: e.target.value }))}
                  className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-[100px] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Özellikler <span className="text-[10px] font-normal normal-case text-muted-foreground/60">(Virgülle ayırın)</span>
                </label>
                <textarea 
                  value={editingService?.features?.join(', ')}
                  onChange={(e) => setEditingService(prev => ({ ...prev!, features: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                  className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-[80px] transition-colors"
                  placeholder="Örn: 7/24 İzleme, Anlık Bildirim, Cloud Yedekleme"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingService?.features?.map((f, i) => (
                    <span key={`${f}-${i}`} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  İşlem Adımları <span className="text-[10px] font-normal normal-case text-muted-foreground/60">(Virgülle ayırın)</span>
                </label>
                <textarea 
                  value={editingService?.process_steps?.join(', ')}
                  onChange={(e) => setEditingService(prev => ({ ...prev!, process_steps: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                  className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-[80px] transition-colors"
                  placeholder="Örn: Keşif, Planlama, Kurulum, Test"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingService?.process_steps?.map((s, i) => (
                    <span key={`${s}-${i}`} className="px-2 py-1 bg-accent/20 rounded-md text-xs flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">{i + 1}</span> {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Proje Çıktıları / Teslimatlar <span className="text-[10px] font-normal normal-case text-muted-foreground/60">(Virgülle ayırın)</span>
                </label>
                <textarea 
                  value={editingService?.deliverables?.join(', ')}
                  onChange={(e) => setEditingService(prev => ({ ...prev!, deliverables: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                  className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-[80px] transition-colors"
                  placeholder="Örn: 2 Yıl Sistem Garantisi, Kullanıcı Eğitimi, Bakım Anlaşması Opsiyonu"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingService?.deliverables?.map((d, i) => (
                    <span key={`${d}-${i}`} className="px-2 py-1 bg-accent/20 rounded-md text-xs flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" /> {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border flex gap-3 shrink-0 bg-card sticky bottom-0 z-10">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              İptal
            </Button>
            <Button type="submit" variant="primary" className="flex-1 gap-2">
              <Save size={18} /> Kaydet
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
