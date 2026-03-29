import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Plus, Shield, Receipt, History, FileText, Edit3, Calendar, Trash2, Download, Upload, Users, Settings } from 'lucide-react';
import { Button } from '../ui/Button';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCustomer: any;
  detailsTab: string;
  setDetailsTab: (tab: string) => void;
  customerDetails: any;
  setIsEditingDetail: (detail: any) => void;
  calculateRemainingWarranty: (date: string) => string;
  refundRequests: any[];
  handleUpdatePayment: (id: string, data: any) => void;
  handleDeleteCustomerPayment: (id: string) => void;
  handleDeleteDocument: (id: string) => void;
  handleDeleteEmployee?: (id: string) => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedCustomer,
  detailsTab,
  setDetailsTab,
  customerDetails,
  setIsEditingDetail,
  calculateRemainingWarranty,
  refundRequests,
  handleUpdatePayment,
  handleDeleteCustomerPayment,
  handleDeleteDocument,
  handleDeleteEmployee,
}) => {
  return (
    <AnimatePresence>
      {isOpen && selectedCustomer && (
        <div key="customer-details-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
            className="relative w-full max-w-4xl max-h-[85vh] bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 sm:p-8 border-b border-border flex justify-between items-center bg-card/50 shrink-0">
              <div className="min-w-0 flex-1 mr-4">
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">Müşteri Detayları</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium truncate">{selectedCustomer.name} ({selectedCustomer.id})</p>
                  <div className="flex items-center gap-3 sm:border-l sm:border-border sm:pl-4 overflow-x-auto scrollbar-hide">
                    {selectedCustomer.email && (
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground font-medium whitespace-nowrap">
                        <Mail size={12} className="text-primary shrink-0" />
                        {selectedCustomer.email}
                      </div>
                    )}
                    {selectedCustomer.phone && (
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground font-medium whitespace-nowrap">
                        <Phone size={12} className="text-primary shrink-0" />
                        {selectedCustomer.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>

            <div className="flex border-b border-border bg-muted/20 overflow-x-auto scrollbar-hide shrink-0 custom-scrollbar">
              {[
                { id: 'services', label: 'Hizmetler', icon: Shield },
                { id: 'payments', label: 'Ödemeler', icon: Receipt },
                { id: 'transactions', label: 'İşlemler', icon: History },
                { id: 'documents', label: 'Belgeler', icon: FileText },
                { id: 'team', label: 'Ekibim', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailsTab(tab.id)}
                  className={`flex items-center gap-2 px-6 sm:px-8 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                    detailsTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon size={16} className="shrink-0" />
                  {tab.label}
                  {detailsTab === tab.id && (
                    <motion.div layoutId="detailsTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              {detailsTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black text-foreground">Hizmetler ve Garanti Süreleri</h4>
                    <Button onClick={() => setIsEditingDetail({ type: 'service' })} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Plus size={14} /> Hizmet Ekle
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customerDetails.services.map((service: any, idx: number) => (
                      <div key={`detail-service-${service.id}-${idx}`} className="p-6 bg-card/50 rounded-2xl border border-border flex flex-col gap-4 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <Shield size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{service.name}</p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${
                                service.status === 'Aktif' ? 'text-success' : 'text-muted-foreground'
                              }`}>{service.status}</p>
                            </div>
                          </div>
                          <button onClick={() => setIsEditingDetail({ type: 'service', ...service })} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <Edit3 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Garanti Bitiş: {service.warrantyDate}</span>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${new Date(service.warrantyDate) > new Date() ? 'text-primary' : 'text-destructive'}`}>
                            {calculateRemainingWarranty(service.warrantyDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailsTab === 'payments' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black text-foreground">Ödeme Geçmişi</h4>
                    <Button onClick={() => setIsEditingDetail({ type: 'payment' })} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Plus size={14} /> Yeni Ödeme
                    </Button>
                  </div>
                  <div className="bg-card/40 border border-border rounded-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-card/50">
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Miktar</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tarih</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Yöntem</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerDetails.payments.map((payment: any, idx: number) => {
                          const refund = refundRequests.find(r => r.itemId === payment.serviceId && r.status === 'Onaylandı');
                          const isRefunded = payment.status === 'hizmet iade edildi' || payment.status === 'İade Edildi' || !!refund;
                          
                          return (
                            <tr key={`customer-payment-${payment.id}-${idx}`} className="border-b border-border hover:bg-muted/50 transition-colors group">
                              <td className="px-6 py-4 text-sm font-black text-foreground">₺{Number(payment.amount).toLocaleString('tr-TR')}</td>
                              <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{payment.date}</td>
                              <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{payment.method}</td>
                              <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                <select 
                                  value={payment.status}
                                  onChange={(e) => handleUpdatePayment(payment.id, { status: e.target.value })}
                                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer ${
                                    isRefunded ? 'bg-destructive/10 text-destructive' :
                                    payment.status === 'Tamamlandı' ? 'bg-success/10 text-success' : 
                                    payment.status === 'Beklemede' || payment.status === 'Bekliyor' ? 'bg-warning/10 text-warning' : 
                                    payment.status === 'İşlemde' ? 'bg-primary/10 text-primary' :
                                    'bg-destructive/10 text-destructive'
                                  }`}
                                >
                                  <option value="Bekliyor" className="bg-background text-foreground">Bekliyor</option>
                                  <option value="İşlemde" className="bg-background text-foreground">İşlemde</option>
                                  <option value="Tamamlandı" className="bg-background text-foreground">Tamamlandı</option>
                                  <option value="İptal Edildi" className="bg-background text-foreground">İptal Edildi</option>
                                  <option value="İade Edildi" className="bg-background text-foreground">İade Edildi</option>
                                </select>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setIsEditingDetail({ type: 'payment', ...payment })} className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                                    <Edit3 size={14} />
                                  </button>
                                  <button onClick={() => handleDeleteCustomerPayment(payment.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailsTab === 'transactions' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black text-foreground">İşlem Kayıtları</h4>
                    <Button onClick={() => setIsEditingDetail({ type: 'transaction' })} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Plus size={14} /> İşlem Ekle
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {customerDetails.transactions.map((transaction: any, idx: number) => (
                      <div key={`customer-transaction-${transaction.id}-${idx}`} className="p-6 bg-card/50 rounded-2xl border border-border flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                            <History size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{transaction.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{transaction.date}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-[10px] text-primary font-black uppercase tracking-widest">{transaction.status}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setIsEditingDetail({ type: 'transaction', ...transaction })} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                          <Edit3 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailsTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black text-foreground">Belgeler ve Faturalar</h4>
                    <Button onClick={() => setIsEditingDetail({ type: 'document' })} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Upload size={14} /> Belge Yükle
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customerDetails.documents.map((doc: any, idx: number) => (
                      <div key={`customer-doc-${doc.id}-${idx}`} className="p-6 bg-card/50 rounded-2xl border border-border flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{doc.type} • {doc.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <Download size={16} />
                          </a>
                          <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailsTab === 'team' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black text-foreground">Müşteri Ekibi</h4>
                    <Button onClick={() => setIsEditingDetail({ type: 'employee' })} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Plus size={14} /> Çalışan Ekle
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(customerDetails.employees || []).map((employee: any, idx: number) => (
                      <div key={`customer-employee-${employee.id}-${idx}`} className="p-6 bg-card/50 rounded-2xl border border-border flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                            {employee.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{employee.name}</p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{employee.role} • {employee.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setIsEditingDetail({ type: 'employee', ...employee })} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <Settings size={16} />
                          </button>
                          <button onClick={() => handleDeleteEmployee?.(employee.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
