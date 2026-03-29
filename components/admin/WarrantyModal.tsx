import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  services: any[];
  onUpdateService: (serviceId: string, updates: any) => void;
  onAddService: () => void;
  calculateRemainingWarranty: (date: string) => string;
}

export const WarrantyModal: React.FC<WarrantyModalProps> = ({ 
  isOpen, 
  onClose, 
  customer, 
  services, 
  onUpdateService, 
  onAddService,
  calculateRemainingWarranty
}) => {
  return (
    <AnimatePresence>
      {isOpen && customer && (
        <div key="warranty-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
            className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Garanti Yönetimi</h3>
                  <p className="text-muted-foreground text-sm font-medium mt-1">{customer.name}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {services.map((service: any, idx: number) => (
                  <div key={`warranty-service-${service.id}-${idx}`} className="p-4 sm:p-6 bg-card/50 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{service.name}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                          Bitiş: {service.warrantyDate || service.end} • <span className={new Date(service.warrantyDate || service.end) > new Date() ? 'text-primary' : 'text-destructive'}>{calculateRemainingWarranty(service.warrantyDate || service.end)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input 
                        type="date" 
                        value={service.warrantyDate || service.end} 
                        onChange={(e) => onUpdateService(service.id, { warrantyDate: e.target.value })}
                        className="flex-1 sm:flex-none bg-input/50 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary" 
                      />
                      <Button variant="secondary" className="p-2 rounded-lg border-border shrink-0">
                        <CheckCircle2 size={14} className="text-success" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={onAddService}
                  className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Yeni Hizmet Tanımla
                </button>
              </div>

              <div className="pt-4">
                <Button onClick={onClose} className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest">Değişiklikleri Kaydet</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
