import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldCheck, User, LogOut, LayoutDashboard, Sun, Moon, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { AuthModal } from './AuthModal';
import { Magnetic } from './ui/Magnetic';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    // Check for existing token/user
    const token = localStorage.getItem("token");
    if (token) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navLinks = [
    { label: 'Hizmetler', to: '/hizmetler' },
    { label: 'Paketler', to: '/paketler' },
    { label: 'Galeri', to: '/galeri' },
    { label: 'Neden Biz?', to: '/neden-biz' },
    { label: 'Teklif Al', to: '/teklif-al' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'h-[72px] bg-background/80 backdrop-blur-xl border-border/40 shadow-sm' 
            : 'h-[100px] bg-transparent border-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="relative flex items-center justify-between h-full">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink relative z-10 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative group-hover:scale-105 transition-transform duration-300">
                  <img src="/logo.png" alt="Logo" className="h-16 sm:h-24 w-auto object-contain" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="flex flex-col leading-none truncate">
                <span className="font-black text-sm sm:text-base tracking-tight text-foreground">EMİN</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-muted-foreground tracking-[0.2em] group-hover:text-primary transition-colors truncate">BİLGİ İŞLEM</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary/10 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 relative z-10">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
                title={theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              <div className="h-6 w-px bg-border/50" />

              {user ? (
                <div className="flex items-center gap-2 pl-2">
                  <div className="flex items-center gap-2 pr-4 border-r border-border/50">
                    <div className="text-right hidden lg:block">
                      <div className="text-xs font-bold text-foreground">{user.name}</div>
                      <div className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Premium</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-brand-400 p-[2px] shadow-lg shadow-primary/20">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <span className="text-xs font-black text-primary">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {(user.email === "106077az@gmail.com" || user.role === 'admin') && (
                      <Link 
                        to="/admin"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-warning hover:bg-warning/10 transition-all"
                        title="Yönetici Paneli"
                      >
                        <ShieldCheck size={18} />
                      </Link>
                    )}
                    <Link 
                      to="/dashboard"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      title="Panelim"
                    >
                      <LayoutDashboard size={18} />
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="Çıkış Yap"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Magnetic strength={0.2}>
                    <button 
                      onClick={() => {
                        setAuthMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Giriş Yap
                    </button>
                  </Magnetic>
                  <Button 
                    variant="primary"
                    className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Kayıt Ol
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground bg-accent/50"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center text-foreground bg-accent/50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-xl md:hidden"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10 mt-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Menü</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              {user && (
                <div className="mb-8 p-5 rounded-3xl bg-accent/30 border border-border/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-brand-600 flex items-center justify-center text-lg font-black text-primary-foreground shadow-lg shadow-primary/20">
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-lg">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(user.role === 'admin' || user.email === '106077az@gmail.com') && (
                      <Link 
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
                      >
                        <ShieldCheck size={16} /> Yönetici Paneli
                      </Link>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-background border border-border/50 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary/50 transition-colors"
                      >
                        <LayoutDashboard size={16} /> Panel
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/10 text-xs font-bold uppercase tracking-wider text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut size={16} /> Çıkış
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <nav className="space-y-2 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.1) }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-accent/50 transition-colors group"
                    >
                      <span className="text-lg font-bold text-foreground">{link.label}</span>
                      <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto space-y-4">
                {!user && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="glass"
                      className="py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-border/50"
                      onClick={() => {
                        setAuthMode('login');
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Giriş Yap
                    </Button>
                    <Button 
                      variant="primary"
                      className="py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                      onClick={() => {
                        setAuthMode('register');
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Kayıt Ol
                    </Button>
                  </div>
                )}
                <p className="text-[10px] text-center text-muted-foreground font-medium">
                  &copy; 2024 Emin Bilgi İşlem
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </>
  );
};
