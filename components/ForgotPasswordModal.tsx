import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError("");
    setRegistered(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.registered === false) {
          setRegistered(false);
          setError("Bu e-posta adresi kayıtlı değil.");
        } else {
          setRegistered(true);
          setIsSuccess(true);
        }
      } else if (response.status === 429) {
        setError("Çok fazla deneme, lütfen biraz sonra tekrar dene.");
      } else {
        setError(data.message || "Bir hata oluştu.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            className="relative w-full max-w-sm bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-[40px] p-8 pt-10"
          >
            <div className="border-beam dark:opacity-100 opacity-30" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all z-30"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="relative inline-flex mb-6">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-[1.2rem] bg-muted/50 border border-border shadow-sm">
                  <Mail size={32} className="text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                Şifremi Unuttum
              </h2>
              <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                Şifrenizi sıfırlamak için e-posta adresinizi girin.
              </p>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="E-posta Adresi"
                    required
                    disabled={isLoading}
                    className="w-full bg-input/50 border border-input rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-accent/50 transition-all text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-3 rounded-xl border ${
                      registered === false ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'
                    }`}
                  >
                    <AlertCircle size={14} className={registered === false ? 'text-amber-500' : 'text-red-500'} />
                    <p className={`text-[10px] font-semibold leading-tight ${
                      registered === false ? 'text-amber-500/90' : 'text-red-500/90'
                    }`}>
                      {error}
                    </p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden group py-4 rounded-2xl bg-primary text-primary-foreground font-black text-xs tracking-widest transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  <div className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Gönderiliyor…</span>
                      </>
                    ) : (
                      <>
                        <span>BAĞLANTI GÖNDER</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </div>
                </motion.button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-success/30">
                    <CheckCircle2 size={32} className="text-success" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm font-medium mb-8">
                  Şifre sıfırlama bağlantısı e-posta adresine gönderildi.
                </p>
                <button
                  onClick={onClose}
                  className="text-primary text-xs font-bold uppercase tracking-widest hover:text-primary/80 transition-colors"
                >
                  Geri Dön
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
