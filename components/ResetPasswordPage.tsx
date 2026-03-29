import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Geçersiz veya eksik bağlantı.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.message || "Şifre sıfırlama başarısız.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.05] bg-[size:40px_40px] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-[40px] p-8 pt-10 z-10"
      >
        <div className="border-beam" />
        
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-6">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-[1.2rem] bg-muted/50 border border-border shadow-2xl">
              <ShieldCheck size={32} className="text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            Şifre Sıfırlama
          </h2>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest text-[10px]">
            Yeni şifrenizi belirleyin
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Yeni Şifre"
                required
                className="w-full bg-input/50 border border-input rounded-2xl py-4 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-accent/50 transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Yeni Şifre (Tekrar)"
                required
                className="w-full bg-input/50 border border-input rounded-2xl py-4 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-accent/50 transition-all text-sm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle size={14} className="text-amber-500 shrink-0" />
                <p className="text-amber-500/90 text-[10px] font-semibold leading-tight">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !token}
              className="w-full relative overflow-hidden group py-4 rounded-2xl bg-primary text-primary-foreground font-black text-xs tracking-widest transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Güncelleniyor…</span>
                  </>
                ) : (
                  <>
                    <span>ŞİFREYİ GÜNCELLE</span>
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
              Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 rounded-2xl bg-secondary border border-border text-foreground font-bold text-xs tracking-widest hover:bg-secondary/80 transition-all uppercase"
            >
              Giriş Ekranına Git
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
