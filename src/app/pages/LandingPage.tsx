import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Menu, X, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';

export const LandingPage = () => {

  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="mx-2 text-xl font-bold text-foreground tracking-tight">{t('landing.brand')}</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <div className="flex items-center gap-4 px-4">
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t('landing.features')}</a>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t('landing.about')}</a>
              </div>
              
              <div className="flex items-center gap-4 border-l rtl:border-r rtl:border-l-0 border-border pl-8 rtl:pr-8 rtl:pl-0">
                
                {/* Language Switcher */}
                <LanguageSwitcher />

                <ThemeToggle />

                <Link 
                  to="/login" 
                  className="text-primary-foreground bg-primary hover:bg-primary/90 font-semibold px-5 py-2 rounded-lg transition-colors flex items-center"
                >
                  {t('common.login')}
                  <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden gap-4">
              <ThemeToggle />
              
              {/* Language Switcher for Mobile */}
              <LanguageSwitcher />

              <button 
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg transition-colors focus:outline-none"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Sidebar) */}
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-foreground/50 z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar Panel */}
        <div 
          className={`fixed top-0 bottom-0 z-50 w-72 bg-card shadow-xl md:hidden transition-transform duration-300 ease-in-out flex flex-col
            right-0 rtl:left-0 rtl:right-auto
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'}
          `}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-border">
            <span className="text-xl font-bold text-foreground tracking-tight">{t('landing.brand')}</span>
            <button 
              className="p-2 text-muted-foreground hover:text-destructive focus:text-destructive bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
            <a 
              href="#features" 
              className="block px-3 py-3 rounded-xl text-base font-medium text-card-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Activity className="inline-block w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 text-muted-foreground" />
              {t('landing.features')}
            </a>
            <a 
              href="#about" 
              className="block px-3 py-3 rounded-xl text-base font-medium text-card-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShieldCheck className="inline-block w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 text-muted-foreground" />
              {t('landing.about')}
            </a>
          </div>

          <div className="p-4 border-t border-border">
            <Link 
              to="/login" 
              className="w-full text-center text-primary-foreground bg-primary hover:bg-primary/90 font-semibold px-5 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common.login')}
              <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-b from-card to-background">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
          <span className="flex w-2 h-2 bg-primary rounded-full mr-2 rtl:ml-2 rtl:mr-0 animate-pulse"></span>
          {t('landing.systemVersion')}
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
          {t('landing.heroTitle')} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">{t('landing.heroSubtitle')}</span>
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
