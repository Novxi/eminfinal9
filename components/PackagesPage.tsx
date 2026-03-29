import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Zap, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { apiFetch } from '../lib/api';
import { AuthModal } from './AuthModal';

export const PackagesPage = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiFetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.packages) {
            setPackages(data.packages);
          }
        }
      } catch (error) {
        console.error("Paketler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getIcon = (id: string) => {
    switch (id) {
      case 'silver': return <Shield className="text-slate-400" size={32} />;
      case 'gold': return <Zap className="text-amber-400" size={32} />;
      case 'platinum': return <Sparkles className="text-primary" size={32} />;
      default: return <Package className="text-primary" size={32} />;
    }
  };

  const getGradient = (id: string) => {
    switch (id) {
      case 'silver': return 'from-slate-400/20 to-slate-600/5 dark:from-slate-400/10 dark:to-slate-900/50';
      case 'gold': return 'from-amber-400/30 to-amber-600/5 dark:from-amber-500/20 dark:to-amber-950/50';
      case 'platinum': return 'from-primary/40 to-primary/5 dark:from-primary/30 dark:to-primary/5';
      default: return 'from-primary/10 to-transparent';
    }
  };

  const getBorder = (id: string) => {
    switch (id) {
      case 'silver': return 'border-slate-200 dark:border-slate-800 group-hover:border-slate-400/50';
      case 'gold': return 'border-amber-200 dark:border-amber-800/50 group-hover:border-amber-400/50';
      case 'platinum': return 'border-primary/30 dark:border-primary/20 group-hover:border-primary/60';
      default: return 'border-border';
    }
  };

  const handlePackageClick = (pkg: any) => {
    if (user) {
      // Logged in, go to dashboard with package selection
      navigate(`/dashboard?tab=packages&packageId=${pkg.id}`);
    } else {
      // Not logged in, open auth modal
      setSelectedPackageId(pkg.id);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setIsAuthModalOpen(false);
    // Redirect to dashboard packages tab with the last clicked package if possible
    if (selectedPackageId) {
      navigate(`/dashboard?tab=packages&packageId=${selectedPackageId}`);
    } else {
      navigate('/dashboard?tab=packages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
      </div>
    );
  }

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -z-10" />

      <div className="text-center mb-20 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm"
        >
          Üyelik Planları
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6 leading-none"
        >
          Geleceği <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Yönetin</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Teknoloji altyapınızı profesyonel ellere teslim edin. Size en uygun paketi seçerek dijital dönüşümünüzü hızlandırın.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: index * 0.15,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            whileHover={{ y: -10 }}
            className={`relative group rounded-[3rem] border ${getBorder(pkg.id)} bg-card/40 backdrop-blur-xl p-10 shadow-2xl transition-all duration-500 flex flex-col overflow-hidden`}
          >
            {/* Card Inner Glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${getGradient(pkg.id)} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            {pkg.id === 'platinum' && (
              <div className="absolute top-6 right-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary blur-md opacity-50 animate-pulse" />
                  <div className="relative bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Premium
                  </div>
                </div>
              </div>
            )}

            <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${getGradient(pkg.id)} flex items-center justify-center mb-8 shadow-2xl border border-white/20 dark:border-white/5 group-hover:scale-110 transition-transform duration-500`}>
              {getIcon(pkg.id)}
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{pkg.name}</h3>
              <div className="flex items-baseline gap-2">
                {user ? (
                  <span className="text-5xl font-black text-foreground tracking-tighter">₺{pkg.price}</span>
                ) : (
                  <span className="text-sm text-muted-foreground font-semibold">Fiyatı görmek için giriş yapın</span>
                )}
                <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60">/ yıl</span>
              </div>
            </div>

            <div className="space-y-5 mb-10 flex-1 relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent opacity-50" />
              {pkg.features.map((feature: string, i: number) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  className="flex items-center gap-4 group/item"
                >
                  <div className={`w-6 h-6 rounded-full ${pkg.id === 'platinum' ? 'bg-primary/20' : 'bg-muted'} flex items-center justify-center shrink-0 group-hover/item:scale-125 transition-transform`}>
                    <Check size={14} className={pkg.id === 'platinum' ? 'text-primary' : 'text-muted-foreground'} />
                  </div>
                  <span className="text-sm text-muted-foreground font-semibold group-hover/item:text-foreground transition-colors">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Button 
              onClick={() => handlePackageClick(pkg)}
              variant={pkg.id === 'platinum' ? 'primary' : 'glass'} 
              className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] group/btn relative overflow-hidden ${
                pkg.id === 'platinum' ? 'shadow-xl shadow-primary/30' : 'border-border'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Hemen Başla
              </span>
              {pkg.id === 'platinum' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
