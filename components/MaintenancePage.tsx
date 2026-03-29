import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer, Clock, Mail, Phone, ShieldCheck, LogIn } from 'lucide-react';
import { AuthModal } from './AuthModal';

const MaintenancePage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-3xl w-full relative z-10 text-center space-y-12">
        <div className="flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 text-primary mb-4"
          >
            <Hammer size={48} className="animate-bounce" />
          </motion.div>
          
          {/* Hidden Admin Entry */}
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="absolute -top-4 -right-4 p-2 text-white/10 hover:text-primary transition-colors"
            title="Yönetici Girişi"
          >
            <LogIn size={16} />
          </button>
        </div>

        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          >
            BAKIM <span className="text-primary">MODUNDAYIZ</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-muted-foreground font-medium max-w-xl mx-auto"
          >
            Size daha iyi bir deneyim sunabilmek için sistemlerimizi güncelliyoruz. 
            Kısa süre içinde tekrar yayında olacağız.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <Clock className="text-primary mx-auto mb-3" size={24} />
            <div className="text-sm font-black uppercase tracking-widest mb-1">Tahmini Süre</div>
            <div className="text-muted-foreground text-xs">Yaklaşık 2 Saat</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <ShieldCheck className="text-primary mx-auto mb-3" size={24} />
            <div className="text-sm font-black uppercase tracking-widest mb-1">Güvenlik</div>
            <div className="text-muted-foreground text-xs">Verileriniz Güvende</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <Mail className="text-primary mx-auto mb-3" size={24} />
            <div className="text-sm font-black uppercase tracking-widest mb-1">İletişim</div>
            <div className="text-muted-foreground text-xs">destek@eminbilgi.com</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="pt-8"
        >
          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <a href="tel:+905550000000" className="hover:text-primary transition-colors flex items-center gap-2 text-sm font-bold">
              <Phone size={16} /> +90 (555) 000 00 00
            </a>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-sm font-bold">© 2024 Emin Bilgi İşlem</span>
          </div>
        </motion.div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => window.location.reload()}
        isMaintenanceMode={true}
      />
    </div>
  );
};

export default MaintenancePage;
