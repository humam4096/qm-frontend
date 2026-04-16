import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, Activity, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { useMobileDrawer } from '../../hooks/useMobileDrawer';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import UserRouter from '../router/UserRouter';
import { useAuthStore } from '../store/useAuthStore';

export const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { isOpen: isMenuOpen, open: openMenu, close: closeMenu, triggerRef } = useMobileDrawer();
  const { logout } = useAuthStore();
  
   const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300">

      {/* ─────────────── Navigation Bar ─────────────── */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Brand */}
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground tracking-tight">
                {t('landing.brand')}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 rtl:flex-row-reverse">
              <div className="flex items-center gap-4">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {t('landing.features')}
                </a>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {t('landing.about')}
                </a>
              </div>

              <div className="flex items-center gap-4 border-s border-border ps-8">
                <LanguageSwitcher />
                <ThemeToggle />
                <UserRouter />
              </div>
            </div>

            {/* Mobile: controls + hamburger */}
            <div className="flex items-center gap-3 md:hidden">
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                ref={triggerRef as React.RefObject<HTMLButtonElement>}
                onClick={openMenu}
                aria-label={t('nav.menu')}
                aria-expanded={isMenuOpen}
                aria-controls="landing-mobile-drawer"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─────────────── Mobile Drawer ─────────────── */}
      {/* Rendered at root level (not inside nav) so backdrop-blur doesn't trap fixed children */}
      
      <MobileDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        side={isRtl ? 'left' : 'right'}
        ariaLabel={t('landing.brand')}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-sidebar-border shrink-0">
          <span className="text-xl font-bold text-sidebar-foreground tracking-tight">
            {t('landing.brand')}
          </span>
          <button
            onClick={closeMenu}
            aria-label={t('common.close')}
            className="p-2 text-sidebar-foreground/70 hover:text-destructive bg-muted hover:bg-muted/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer nav links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <a
            href="#features"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={closeMenu}
          >
            <Activity className="w-5 h-5 text-muted-foreground shrink-0" />
            {t('landing.features')}
          </a>
          <a
            href="#about"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={closeMenu}
          >
            <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0" />
            {t('landing.about')}
          </a>
            <UserRouter/>
          <div className="w-full p-4  space-y-2">
          </div>
        </div>

        {/* Drawer footer — login / dashboard CTA */}
        <div className="w-full p-4 border-t border-sidebar-border shrink-0 space-y-2">
           <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">{t('nav.logout')}</span>
          </button>
        </div>
        
      </MobileDrawer>

      {/* ─────────────── Hero Section ─────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-b from-card to-background">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
          <span className="flex w-2 h-2 bg-primary rounded-full me-2 animate-pulse" />
          {t('landing.systemVersion')}
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
          {t('landing.heroTitle')}{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
            {t('landing.heroSubtitle')}
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('landing.heroDescription')}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-all hover:shadow-md"
          >
            {t('landing.accessPortal')}
          </Link>
          <a
            href="#learn-more"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-card-foreground bg-card border border-border hover:bg-muted rounded-xl shadow-sm transition-all"
          >
            {t('landing.learnMore')}
          </a>
        </div>
      </main>
    </div>
  );
};
