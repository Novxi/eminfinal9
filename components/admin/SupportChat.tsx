import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  Plus,
  Shield,
  Mail,
  Search,
  Filter,
  MoreVertical,
  Inbox,
  SendHorizontal,
  History,
  ChevronRight
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  text: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

interface SupportChatProps {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    customerId?: string | number;
  };
  isAdminView?: boolean;
}

export const SupportChat: React.FC<SupportChatProps> = ({ user, isAdminView = false }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    try {
      const effectiveCustomerId = user.role === 'Çalışan' ? String(user.customerId) : String(user.id);
      const response = await apiFetch(`/api/support/tickets?customerId=${effectiveCustomerId}&isAdmin=${isAdminView}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        setError("Biletler yüklenirken bir hata oluştu.");
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const response = await apiFetch(`/api/support/tickets/${ticketId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        
        // Scroll to bottom
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    
    // Polling for updates every 10 seconds
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, [user.id, isAdminView]);

  useEffect(() => {
    if (!selectedTicket) {
      setMessages([]);
      return;
    }

    fetchMessages(selectedTicket.id);
    
    // Polling for new messages every 5 seconds
    const interval = setInterval(() => fetchMessages(selectedTicket.id), 5000);
    return () => clearInterval(interval);
  }, [selectedTicket]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

    try {
      const effectiveCustomerId = user.role === 'Çalışan' ? String(user.customerId) : String(user.id);
      
      const response = await apiFetch('/api/support/tickets', {
        method: 'POST',
        body: JSON.stringify({
          customerId: effectiveCustomerId,
          customerName: user.name,
          customerEmail: user.email,
          subject: newTicketSubject,
          initialMessage: newTicketMessage,
          senderRole: isAdminView ? 'admin' : 'user'
        })
      });

      if (response.ok) {
        const newTicket = await response.json();
        setTickets(prev => [newTicket, ...prev]);
        setSelectedTicket(newTicket);
        setNewTicketSubject('');
        setNewTicketMessage('');
        setIsCreatingTicket(false);
      } else {
        alert("Bilet oluşturulurken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const messageText = newMessage;
      setNewMessage('');

      const response = await apiFetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          senderId: user.id,
          senderName: isAdminView ? 'Yönetici' : user.name,
          senderRole: isAdminView ? 'admin' : 'user',
          text: messageText
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        
        // Update ticket in list
        setTickets(prev => prev.map(t => 
          t.id === selectedTicket.id 
            ? { ...t, updatedAt: new Date().toISOString(), status: isAdminView ? 'pending' : 'open' } 
            : t
        ));
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateTicketStatus = async (status: 'open' | 'pending' | 'closed') => {
    if (!selectedTicket) return;
    try {
      const response = await apiFetch(`/api/support/tickets/${selectedTicket.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const updatedTicket = await response.json();
        setSelectedTicket(updatedTicket);
        setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-card rounded-[2.5rem] border border-border shadow-xl p-12 text-center space-y-8">
        <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-[2rem] flex items-center justify-center shadow-inner">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-foreground tracking-tight">Bağlantı Hatası</h3>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed font-medium">
            {error}
          </p>
        </div>
        <Button onClick={() => { setIsLoading(true); setError(null); fetchTickets(); }}>Tekrar Dene</Button>
      </div>
    );
  }

  return (
    <div className="h-[750px] flex flex-col bg-card rounded-[3rem] border border-border overflow-hidden shadow-2xl relative">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Ticket List */}
        <div className={`w-full md:w-[400px] border-r border-border flex flex-col bg-muted/5 ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-8 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Biletlerim</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Destek Merkezi</p>
              </div>
              {!isAdminView && (
                <button 
                  onClick={() => setIsCreatingTicket(true)}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  <Plus size={24} />
                </button>
              )}
            </div>

            <div className="flex gap-2 p-1 bg-muted/50 rounded-2xl">
              {['all', 'open', 'pending', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    filterStatus === status 
                      ? 'bg-card text-primary shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : status === 'open' ? 'Açık' : status === 'pending' ? 'Bekleyen' : 'Kapalı'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-20 opacity-40">
                <Inbox className="w-16 h-16 mx-auto mb-4" />
                <p className="text-sm font-bold">Henüz talep bulunmuyor.</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full p-6 rounded-[2rem] border text-left transition-all group relative ${
                    selectedTicket?.id === ticket.id 
                      ? 'bg-card border-primary shadow-xl ring-1 ring-primary/10' 
                      : 'bg-card/50 border-border hover:border-primary/30 hover:bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      ticket.status === 'open' ? 'bg-success/10 text-success' :
                      ticket.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {ticket.status === 'open' ? 'Açık' : ticket.status === 'pending' ? 'Yanıt Bekliyor' : 'Çözüldü'}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground/60">
                      {new Date(ticket.updatedAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">{ticket.subject}</h4>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <User size={12} className="text-muted-foreground" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[120px]">
                        {isAdminView ? ticket.customerName : 'Siz'}
                      </span>
                    </div>
                    <ChevronRight size={14} className={`transition-transform ${selectedTicket?.id === ticket.id ? 'translate-x-1 text-primary' : 'text-muted-foreground/30'}`} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main: Ticket Detail Area */}
        <div className={`flex-1 flex flex-col bg-card relative ${!selectedTicket ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="p-8 border-b border-border bg-muted/5 flex items-center justify-between backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="md:hidden p-3 hover:bg-accent/10 rounded-2xl transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-2xl font-black text-foreground tracking-tight">{selectedTicket.subject}</h4>
                      <div className={`w-2 h-2 rounded-full ${selectedTicket.status === 'open' ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <History size={14} className="text-primary" />
                        ID: {selectedTicket.id.slice(0, 8)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>
                </div>
                
                {isAdminView && (
                  <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-muted/50 rounded-2xl border border-border">
                      {[
                        { id: 'open', label: 'Açık', color: 'text-success', bg: 'bg-success/10' },
                        { id: 'pending', label: 'Bekleyen', color: 'text-warning', bg: 'bg-warning/10' },
                        { id: 'closed', label: 'Kapalı', color: 'text-muted-foreground', bg: 'bg-muted' }
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => updateTicketStatus(s.id as any)}
                          className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                            selectedTicket.status === s.id 
                              ? `${s.bg} ${s.color} shadow-sm ring-1 ring-border/50` 
                              : 'text-muted-foreground/50 hover:text-foreground'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Replies Thread */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-10 space-y-10 bg-muted/5 scroll-smooth"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex flex-col ${
                        (isAdminView && msg.senderRole === 'admin') || (!isAdminView && msg.senderRole === 'user')
                          ? 'items-end' 
                          : 'items-start'
                      }`}
                    >
                      <div className={`max-w-[80%] w-full flex flex-col ${
                        (isAdminView && msg.senderRole === 'admin') || (!isAdminView && msg.senderRole === 'user')
                          ? 'items-end' 
                          : 'items-start'
                      }`}>
                        <div className="flex items-center gap-3 mb-3 px-2">
                          {((isAdminView && msg.senderRole !== 'admin') || (!isAdminView && msg.senderRole !== 'user')) && (
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                              <User size={20} />
                            </div>
                          )}
                          <div className={`flex flex-col ${
                            (isAdminView && msg.senderRole === 'admin') || (!isAdminView && msg.senderRole === 'user')
                              ? 'items-end' 
                              : 'items-start'
                          }`}>
                            <span className="text-[11px] font-black text-foreground uppercase tracking-widest">
                              {((isAdminView && msg.senderRole === 'admin') || (!isAdminView && msg.senderRole === 'user'))
                                ? 'Siz' 
                                : (msg.senderRole === 'admin' ? 'Destek Ekibi' : msg.senderName)}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-bold">
                              {new Date(msg.createdAt).toLocaleString('tr-TR')}
                            </span>
                          </div>
                          {((isAdminView && msg.senderRole === 'admin') || (!isAdminView && msg.senderRole === 'user')) && (
                            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground shadow-sm">
                              <User size={20} />
                            </div>
                          )}
                        </div>
                        <div className={`p-8 rounded-[2.5rem] text-sm leading-relaxed shadow-xl border transition-all hover:shadow-2xl ${
                          (isAdminView && msg.senderRole === 'admin') || (!isAdminView && msg.senderRole === 'user')
                            ? 'bg-primary text-primary-foreground border-primary rounded-tr-none' 
                            : 'bg-card text-foreground border-border rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Reply Area */}
              {selectedTicket.status !== 'closed' ? (
                <div className="p-10 bg-card border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                  <form onSubmit={handleSendMessage} className="relative group">
                    <textarea 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Yanıtınızı detaylıca buraya yazın..."
                      rows={4}
                      className="w-full bg-muted/30 border-2 border-border rounded-[2rem] px-8 py-6 text-sm focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-foreground resize-none pr-32"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="absolute bottom-6 right-6 bg-primary text-primary-foreground h-14 px-8 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <SendHorizontal size={18} />
                      Yanıtla
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-10 bg-muted/10 border-t border-border text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted rounded-2xl text-[11px] font-black text-muted-foreground uppercase tracking-widest border border-border/50">
                    <CheckCircle2 size={18} className="text-success" />
                    Bu destek talebi başarıyla çözümlenmiş ve kapatılmıştır.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-8 max-w-md mx-auto p-12">
              <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center mx-auto text-primary rotate-6 shadow-inner">
                <Inbox size={64} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-foreground tracking-tight">Destek Merkezi</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Tüm teknik destek ihtiyaçlarınız ve sorularınız için uzman ekibimiz burada. Bir talep seçin veya yeni bir bilet oluşturun.
                </p>
              </div>
              {!isAdminView && (
                <Button 
                  onClick={() => setIsCreatingTicket(true)}
                  className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/20 text-sm font-black uppercase tracking-widest"
                >
                  Yeni Destek Talebi Başlat
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal Overlay */}
      <AnimatePresence>
        {isCreatingTicket && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingTicket(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl bg-card rounded-[3.5rem] border border-border p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              
              <div className="mb-10">
                <h3 className="text-3xl font-black text-foreground mb-2 tracking-tight">Yeni Destek Talebi</h3>
                <p className="text-sm text-muted-foreground font-medium">Sorununuzu bize iletin, en kısa sürede çözüm üretelim.</p>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Konu Başlığı</label>
                  <input 
                    autoFocus
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    placeholder="Örn: Sunucu kurulumu hakkında yardım..."
                    className="w-full bg-muted/30 border-2 border-border rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-primary transition-all text-foreground"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Detaylı Açıklama</label>
                  <textarea 
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    placeholder="Lütfen sorununuzu veya talebinizi detaylıca açıklayın..."
                    rows={5}
                    className="w-full bg-muted/30 border-2 border-border rounded-3xl px-8 py-6 text-sm focus:outline-none focus:border-primary transition-all text-foreground resize-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="glass" 
                    onClick={() => setIsCreatingTicket(false)}
                    className="flex-1 h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                  >
                    Vazgeç
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!newTicketSubject.trim() || !newTicketMessage.trim()}
                    className="flex-1 h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    Talebi Oluştur
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
