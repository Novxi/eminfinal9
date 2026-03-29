import React from 'react';
import { Navbar } from './components/Navbar';
import { ServicesSection } from './components/ServicesSection';
import { LogoMarquee } from './components/LogoMarquee';
import { ProcessSection } from './components/ProcessSection';
import { ContactCTA } from './components/ContactCTA';
import { Footer } from './components/Footer';
import { BackgroundBeams } from './components/ui/BackgroundBeams';
import { HeroTitle } from './components/HeroTitle';
import { motion } from 'framer-motion';
import { apiFetch } from './lib/api';
import { ChevronDown } from 'lucide-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './AdminDashboard';
import { ServicesPage } from './components/ServicesPage';
import { WhyUsPage } from './components/WhyUsPage';
import { GalleryPage } from './components/GalleryPage';
import { QuotePage } from './components/QuotePage';
import { PackagesPage } from './components/PackagesPage';
import MaintenancePage from './components/MaintenancePage';

function App() {
  const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await apiFetch('/api/settings');
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const settings = await response.json();
            setIsMaintenanceMode(settings.maintenanceMode);
          } else {
            console.warn("Bakım modu kontrolü: Beklenen JSON yanıtı alınamadı.");
          }
        }
      } catch (error) {
        console.error("Bakım modu kontrolü başarısız:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const adminStatus = user.role === 'admin' || user.email === "106077az@gmail.com";
    setIsAdmin(adminStatus);

    checkMaintenance();
  }, [location.pathname]);

  if (!isLoading && isMaintenanceMode && !isAdmin && 
      !location.pathname.startsWith('/admin') && 
      !location.pathname.startsWith('/dashboard')
  ) {
    return <MaintenancePage />;
  }

  return (
    <Routes>
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/paketler" element={
        <div className="min-h-screen bg-[var(--background)] text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative transition-colors duration-300">
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Plain Background with Subtle Gradient */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-40" />
          </div>
          <div className="relative z-50">
            <Navbar />
          </div>
          <div className="relative z-10">
            <PackagesPage />
          </div>
          <Footer />
        </div>
      } />
      <Route path="/galeri" element={
        <div className="min-h-screen bg-[var(--background)] text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative transition-colors duration-300">
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Plain Background with Subtle Gradient */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-40" />
          </div>
          <div className="relative z-50">
            <Navbar />
          </div>
          <div className="relative z-10">
            <GalleryPage />
          </div>
          <Footer />
        </div>
      } />
      <Route path="/neden-biz" element={
        <div className="min-h-screen bg-[var(--background)] text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative transition-colors duration-300">
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Plain Background with Subtle Gradient */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-40" />
          </div>
          <div className="relative z-50">
            <Navbar />
          </div>
          <div className="relative z-10">
            <WhyUsPage />
          </div>
          <Footer />
        </div>
      } />
      <Route path="/hizmetler" element={
        <div className="min-h-screen bg-[var(--background)] text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative transition-colors duration-300">
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Plain Background with Subtle Gradient */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-40" />
          </div>
          <div className="relative z-50">
            <Navbar />
          </div>
          <div className="relative z-10">
            <ServicesPage />
          </div>
          <Footer />
        </div>
      } />
      <Route path="/teklif-al" element={
        <div className="min-h-screen bg-[var(--background)] text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative transition-colors duration-300">
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Plain Background with Subtle Gradient */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-40" />
          </div>
          <div className="relative z-50">
            <Navbar />
          </div>
          <div className="relative z-10">
            <QuotePage />
          </div>
          <Footer />
        </div>
      } />
      <Route path="*" element={
        <div className="min-h-screen bg-[var(--background)] text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative transition-colors duration-300">
          
          {/* Global Background Layer */}
          <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Deep Dark Base */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-slate-900 opacity-40 dark:opacity-20" />
            
            {/* Radial Vignette */}
            <div className="absolute inset-0 bg-radial-vignette opacity-50" />
            
            {/* Animated Beams */}
            <BackgroundBeams className="opacity-60 dark:opacity-30" />
          </div>

          {/* Navigation */}
          <div className="relative z-50">
            <Navbar />
          </div>

          {/* Hero Section */}
          <header className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            
            {/* Interactive Hero Content */}
            <div className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-center">
              <HeroTitle />
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute -bottom-1 left-0 w-full h-64 pointer-events-none z-20">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
          </header>

          <main className="relative z-10 -mt-px">
            <ServicesSection />
            
            <LogoMarquee />

            {/* Section Divider Glow - Smoother Transition */}
            <div className="relative h-px w-full overflow-visible pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-primary/3 blur-[160px] rounded-full" />
            </div>

            <ProcessSection />

            {/* Section Divider Glow - Smoother Transition */}
            <div className="relative h-px w-full overflow-visible pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-primary/3 blur-[160px] rounded-full" />
            </div>

            <ContactCTA />
          </main>

          <Footer />
        </div>
      } />
    </Routes>
  );
}

export default App;