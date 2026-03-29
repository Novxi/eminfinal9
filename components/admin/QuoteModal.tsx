import React from 'react';
import { motion } from 'framer-motion';
import { X, MessageSquare, User, Building2, Mail, Phone, Briefcase, CreditCard, Calendar, Shield, MapPin, Layers, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuote: any;
  quotePrice: string;
  setQuotePrice: (price: string) => void;
  onPrepareQuote: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  selectedQuote,
  quotePrice,
  setQuotePrice,
  onPrepareQuote
}) => {
  if (!isOpen || !selectedQuote) return null;

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
        className="relative w-full max-w-2xl bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <div className="p-8 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">Teklif Talebi Detayı</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{selectedQuote.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted/30 rounded-2xl border border-border space-y-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Müşteri Bilgileri</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <User size={14} className="text-primary" /> {selectedQuote.customer}
                </div>
                {selectedQuote.company && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 size={14} /> {selectedQuote.company}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail size={14} /> {selectedQuote.email || 'Belirtilmedi'}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone size={14} /> {selectedQuote.phone || 'Belirtilmedi'}
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-2xl border border-border space-y-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Talep Bilgileri</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Briefcase size={14} className="text-primary" /> {selectedQuote.service}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CreditCard size={14} /> Bütçe: {selectedQuote.budget}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={14} /> Tarih: {selectedQuote.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield size={14} /> Durum: {selectedQuote.status}
                </div>
              </div>
            </div>
          </div>

          {/* Form Details if available */}
          {selectedQuote.details && (
            <div className="space-y-8">
              <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest">Proje Özeti</h4>
                  <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                    {selectedQuote.details.usageType === 'home' ? 'Bireysel' : 'Kurumsal'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Kullanım Tipi</p>
                    <p className="text-sm font-black text-foreground">{selectedQuote.details.usageType === 'home' ? 'Ev' : 'İş Yeri'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Mekan Tipi</p>
                    <p className="text-sm font-black text-foreground">{selectedQuote.details.locationType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ek Garanti</p>
                    <p className="text-sm font-black text-foreground">{selectedQuote.details.extraWarranty > 0 ? `+${selectedQuote.details.extraWarranty} Yıl` : 'Standart'}</p>
                  </div>
                  {selectedQuote.details.location && (
                    <div className="md:col-span-3 space-y-1 pt-2 border-t border-primary/10">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Uygulama Adresi / Lokasyon</p>
                      <p className="text-sm font-bold text-foreground flex items-center gap-2">
                        <MapPin size={14} className="text-primary" /> {selectedQuote.details.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Service Breakdown */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                  <Layers size={16} className="text-primary" /> Seçilen Hizmetler ve Detaylar
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedQuote.details.selectedServices?.map((sid: string, idx: number) => (
                    <div key={`${sid}-${idx}`} className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-sm hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Zap size={20} />
                          </div>
                          <h5 className="font-black text-foreground uppercase tracking-tight">{sid.toUpperCase()} Çözümü</h5>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Reason */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">İhtiyaç Sebebi</p>
                          <div className="p-3 bg-muted/30 rounded-xl text-xs font-bold text-foreground border border-border/50">
                            {selectedQuote.details.reasons?.[sid] || 'Belirtilmedi'}
                          </div>
                        </div>

                        {/* Scope Questions */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Teknik Kapsam</p>
                          <div className="space-y-2">
                            {selectedQuote.details.projectScope?.[sid] ? (
                              Object.entries(selectedQuote.details.projectScope[sid]).map(([key, val]: [string, any]) => (
                                <div key={key} className="flex items-center justify-between p-2 bg-primary/5 rounded-lg border border-primary/10">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                  <span className="text-[10px] font-black text-primary uppercase">{val}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-muted-foreground italic">Detay belirtilmedi</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-muted/30 rounded-2xl border border-border space-y-4">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">İletişim Tercihi</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`px-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 text-center flex items-center justify-center ${
                      selectedQuote.details.contactPreference === 'phone' ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground'
                    }`}>Telefon</div>
                    <div className={`px-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 text-center flex items-center justify-center ${
                      selectedQuote.details.contactPreference === 'email' ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground'
                    }`}>E-Posta</div>
                    <div className={`px-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 text-center flex items-center justify-center ${
                      selectedQuote.details.contactPreference === 'whatsapp' ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground'
                    }`}>WhatsApp</div>
                  </div>
                  <div className="pt-2">
                    <div className={`flex items-center gap-2 text-[10px] font-bold ${selectedQuote.details.kvkkConsent ? 'text-success' : 'text-destructive'}`}>
                      <Shield size={12} /> KVKK Onayı: {selectedQuote.details.kvkkConsent ? 'VERİLDİ' : 'VERİLMEDİ'}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-2xl border border-border space-y-4">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ek Notlar</h4>
                  <div className="p-4 bg-card rounded-xl border border-border min-h-[80px]">
                    <p className="text-xs text-foreground font-medium leading-relaxed">
                      {selectedQuote.details.notes || 'Müşteri ek bir not bırakmadı.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price Input Section */}
          <div className="mt-6 p-6 bg-primary/5 rounded-3xl border border-primary/20 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Teklif Tutarı Belirle</h4>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Müşteri Bütçesi: {selectedQuote?.budget}</span>
            </div>
            <div className="relative">
              <input 
                type="text"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
                placeholder="Örn: ₺45,000"
                className="w-full bg-card border border-primary/20 rounded-2xl px-6 py-4 text-sm font-black text-primary focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/50">
                <CreditCard size={20} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest gap-2">
              <Mail size={18} /> İletişime Geç
            </Button>
            <Button 
              onClick={onPrepareQuote}
              variant="secondary" 
              className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest gap-2"
            >
              <CheckCircle2 size={18} /> Teklif Hazırla
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
