import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, Zap } from "lucide-react";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import MagicRings from "./MagicRings";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  isMaintenanceMode?: boolean;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, isMaintenanceMode, initialMode = 'login' }) => {
  const [isFlipped, setIsFlipped] = useState(initialMode === 'register');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setError("");
        setIsSuccess(false);
        setIsLoading(false);
        setIsFlipped(initialMode === 'register');
        setShowPassword(false);
        setShowPasswordConfirm(false);
      }, 300);
    } else {
      setIsFlipped(initialMode === 'register');
    }
  }, [isOpen, initialMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFlipped) {
        setIsFlipped(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation for register
    if (!isFlipped) {
      // Login logic
      const endpoint = "/api/auth/login";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await response.json();
        if (response.ok) {
          const isAdmin = data.user.role === 'admin' || data.user.email === "106077az@gmail.com";
          
          if (isMaintenanceMode && !isAdmin) {
            setError("Şu anda bakımdayız, lütfen daha sonra deneyiniz.");
            setIsLoading(false);
            return;
          }
          
          handleAuthSuccess(data);
        } else {
          setError(data.message || "Giriş başarısız.");
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Register logic
      if (formData.password !== formData.passwordConfirm) {
        setError("Şifreler eşleşmiyor.");
        setIsLoading(false);
        return;
      }

      const endpoint = "/api/auth/register";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: formData.fullName, 
            email: formData.email, 
            password: formData.password 
          }),
        });
        const data = await response.json();
        if (response.ok) {
          const isAdmin = data.user.role === 'admin' || data.user.email === "106077az@gmail.com";
          
          if (isMaintenanceMode && !isAdmin) {
            setError("Hesabınız oluşturuldu ancak şu anda bakımdayız. Lütfen daha sonra giriş yapınız.");
            setIsLoading(false);
            return;
          }
          
          handleAuthSuccess(data);
        } else {
          setError(data.message || "Kayıt başarısız.");
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAuthSuccess = (data: any) => {
    setIsSuccess(true);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user)); // Kullanıcı bilgisini kaydet
    setTimeout(() => {
      onSuccess(data.user);
      onClose();
    }, 1500);
  };

  // --- Animation Controls (Knobs) ---
  const FLIP_DURATION = 0.65;
  const PERSPECTIVE = "1200px";
  const SPRING_CONFIG = { stiffness: 140, damping: 18, mass: 0.9 };
  
  const cardVariants = {
    front: { 
      rotateY: 0,
      scale: 1,
      transition: { type: "spring" as const, ...SPRING_CONFIG }
    },
    back: { 
      rotateY: 180,
      scale: 1,
      transition: { type: "spring" as const, ...SPRING_CONFIG }
    },
    flipping: {
      scale: 0.985,
      transition: { duration: FLIP_DURATION / 2 }
    }
  };

  const shakeAnimation = {
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.4 }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 dark:bg-background/80 backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-30 dark:opacity-100" />
          </motion.div>
          
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <MagicRings
              color="#fc42ff"
              colorTwo="#42fcff"
              ringCount={6}
              speed={1}
              attenuation={10}
              lineThickness={2}
              baseRadius={0.35}
              radiusStep={0.1}
              scaleRate={0.1}
              opacity={1}
              blur={0}
              noiseAmount={0}
              rotation={0}
              ringGap={1.5}
              fadeIn={0.7}
              fadeOut={0.5}
              followMouse={false}
              mouseInfluence={0.2}
              hoverScale={1.2}
              parallax={0.05}
              clickBurst={false}
            />
            <div className="absolute inset-0 bg-grid-foreground/[0.02] bg-[size:40px_40px] opacity-20" />
          </div>

          {/* 3D Flip Card Wrapper */}
          <div 
            className="relative w-full max-w-sm z-10"
            style={{ perspective: PERSPECTIVE }}
          >
            <motion.div
              animate={isFlipped ? "back" : "front"}
              variants={cardVariants}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full"
            >
              {/* FRONT FACE (Login) */}
              <motion.div
                style={{ backfaceVisibility: "hidden" }}
                animate={error && !isFlipped ? shakeAnimation : {}}
                className={`w-full bg-card/90 border border-border rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-[40px] p-8 pt-10 ${error && !isFlipped ? 'border-destructive/30' : ''}`}
              >
                <div className="border-beam opacity-20" />
                <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]" />
                
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all z-30"
                >
                  <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="relative inline-flex mb-6">
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-[1.2rem] bg-card border border-border shadow-sm">
                      <ShieldCheck size={32} className="text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                    Tekrar Hoş Geldiniz
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest text-[10px]">
                    Sisteme güvenli giriş
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="E-posta Adresi"
                      required
                      aria-label="E-posta Adresi"
                      className="w-full bg-input/10 border border-input rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-card transition-all text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifre"
                      required
                      aria-label="Şifre"
                      className="w-full bg-input/10 border border-input rounded-2xl py-4 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-card transition-all text-sm"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative w-4 h-4 rounded bg-input/10 border border-input group-hover:border-accent transition-colors">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                          <div className="w-2 h-2 rounded-sm bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">Beni Hatırla</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      Şifremi Unuttum
                    </button>
                  </div>

                  {error && !isFlipped && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                      <AlertCircle size={14} className="text-destructive shrink-0" />
                      <p className="text-destructive/90 text-[10px] font-semibold leading-tight">{error}</p>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ y: -1, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className={`w-full relative overflow-hidden group py-4 rounded-2xl font-black text-xs tracking-widest transition-all duration-300 shadow-lg ${
                      isSuccess ? 'bg-success text-success-foreground shadow-success/20' : 'bg-primary text-primary-foreground shadow-primary/20'
                    } disabled:opacity-50`}
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <><Loader2 className="animate-spin" size={16} /><span>Giriş yapılıyor…</span></>
                      ) : isSuccess ? (
                        <><CheckCircle2 size={16} /><span>BAŞARILI!</span></>
                      ) : (
                        <><span>GİRİŞ YAP</span><ArrowRight size={14} /></>
                      )}
                    </div>
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => { setIsFlipped(true); setError(""); }}
                    className="text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors relative inline-block group"
                  >
                    <span>Hesabın yok mu? </span>
                    <span className="text-primary font-bold uppercase tracking-wider group-hover:text-primary/80">Kayıt Ol</span>
                  </button>
                </div>
              </motion.div>

              {/* BACK FACE (Register) */}
              <motion.div
                style={{ 
                  backfaceVisibility: "hidden",
                  rotateY: 180,
                  position: "absolute",
                  top: 0,
                  left: 0
                }}
                animate={error && isFlipped ? shakeAnimation : {}}
                className={`w-full bg-card/90 border border-border rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-[40px] p-8 pt-10 ${error && isFlipped ? 'border-destructive/30' : ''}`}
              >
                <div className="border-beam opacity-20" />
                <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]" />
                
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all z-30"
                >
                  <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="relative inline-flex mb-6">
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-[1.2rem] bg-card border border-border shadow-sm">
                      <Zap size={32} className="text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                    Hesap Oluştur
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest text-[10px]">
                    Hızlıca kayıt ol ve devam et
                  </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="Ad Soyad"
                      required
                      aria-label="Ad Soyad"
                      className="w-full bg-input/10 border border-input rounded-2xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-card transition-all text-sm"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="E-posta Adresi"
                      required
                      aria-label="E-posta Adresi"
                      className="w-full bg-input/10 border border-input rounded-2xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-card transition-all text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifre"
                      required
                      aria-label="Şifre"
                      className="w-full bg-input/10 border border-input rounded-2xl py-3.5 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-card transition-all text-sm"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                      type={showPasswordConfirm ? "text" : "password"}
                      placeholder="Şifre (Tekrar)"
                      required
                      aria-label="Şifre Tekrar"
                      className="w-full bg-input/10 border border-input rounded-2xl py-3.5 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-card transition-all text-sm"
                      value={formData.passwordConfirm}
                      onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {error && isFlipped && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                      <AlertCircle size={14} className="text-destructive shrink-0" />
                      <p className="text-destructive/90 text-[10px] font-semibold leading-tight">{error}</p>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ y: -1, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className={`w-full relative overflow-hidden group py-4 rounded-2xl font-black text-xs tracking-widest transition-all duration-300 shadow-lg ${
                      isSuccess ? 'bg-success text-success-foreground shadow-success/20' : 'bg-primary text-primary-foreground shadow-primary/20'
                    } disabled:opacity-50`}
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <><Loader2 className="animate-spin" size={16} /><span>Kayıt olunuyor…</span></>
                      ) : isSuccess ? (
                        <><CheckCircle2 size={16} /><span>BAŞARILI!</span></>
                      ) : (
                        <><span>KAYIT OL</span><ArrowRight size={14} /></>
                      )}
                    </div>
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => { setIsFlipped(false); setError(""); }}
                    className="text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors relative inline-block group"
                  >
                    <span>Zaten hesabın var mı? </span>
                    <span className="text-primary font-bold uppercase tracking-wider group-hover:text-primary/80">Giriş Yap</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <ForgotPasswordModal 
            isOpen={showForgotModal} 
            onClose={() => setShowForgotModal(false)} 
          />
        </div>
      )}
    </AnimatePresence>
  );
};
