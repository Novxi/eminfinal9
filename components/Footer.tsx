import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook } from 'lucide-react';

export const Footer = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <footer id="footer" className="bg-background text-foreground py-20 relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2">
              <div className="">
                <img src="/logo.png" alt="Logo" className="h-24 md:h-48 w-auto object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">EMİN BİLGİ İŞLEM</span>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-muted-foreground text-sm leading-relaxed">
              Geleceğin güvenlik ve teknoloji altyapılarını bugünden kuruyoruz. Yüksek standartlarda mühendislik çözümleri.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex gap-4">
              {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                <a key={`social-${i}`} href="#" className="w-10 h-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors border border-border hover:border-primary/50 shadow-sm">
                  <Icon size={18} className="text-muted-foreground" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h4 variants={fadeInUp} className="font-bold text-lg mb-6 text-foreground">Hızlı Erişim</motion.h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-medium">
              <motion.li variants={fadeInUp}><a href="#" className="hover:text-primary transition-colors">Ana Sayfa</a></motion.li>
              <motion.li variants={fadeInUp}><a href="#services" className="hover:text-primary transition-colors">Hizmetler</a></motion.li>
              <motion.li variants={fadeInUp}><a href="#portfolio" className="hover:text-primary transition-colors">Referanslar</a></motion.li>
              <motion.li variants={fadeInUp}><a href="#contact" className="hover:text-primary transition-colors">İletişim</a></motion.li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h4 variants={fadeInUp} className="font-bold text-lg mb-6 text-foreground">Hizmetler</motion.h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-medium">
              <motion.li variants={fadeInUp} className="hover:text-primary transition-colors cursor-pointer">Yangın Alarm Sistemleri</motion.li>
              <motion.li variants={fadeInUp} className="hover:text-primary transition-colors cursor-pointer">Güvenlik Kameraları</motion.li>
              <motion.li variants={fadeInUp} className="hover:text-primary transition-colors cursor-pointer">Network Altyapı</motion.li>
              <motion.li variants={fadeInUp} className="hover:text-primary transition-colors cursor-pointer">Araç Şarj İstasyonları</motion.li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h4 variants={fadeInUp} className="font-bold text-lg mb-6 text-foreground">İletişim</motion.h4>
            <ul className="space-y-6 text-muted-foreground text-sm font-medium">
              <motion.li variants={fadeInUp} className="flex items-start gap-3">
                <MapPin className="shrink-0 text-primary" size={20} />
                <span>Yunus Emre Mah. Hürriyet Cad. No:135, Alucra / Giresun</span>
              </motion.li>
              <motion.li variants={fadeInUp} className="flex items-center gap-3">
                <Phone className="shrink-0 text-primary" size={20} />
                <div className="flex flex-col">
                    <span>0850 302 27 61</span>
                </div>
              </motion.li>
              <motion.li variants={fadeInUp} className="flex items-center gap-3">
                <Mail className="shrink-0 text-primary" size={20} />
                <span>destek@eminbilgiislem.com</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium"
        >
          <p>© {new Date().getFullYear()} Emin Bilgi İşlem. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-foreground transition-colors">KVKK</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};