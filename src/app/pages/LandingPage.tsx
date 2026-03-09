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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
              <span className="mx-2 text-xl font-bold text-gray-900 dark:text-white tracking-tight">{t('landing.brand')}</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <div className="flex items-center gap-4 px-4">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">{t('landing.features')}</a>
                <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">{t('landing.about')}</a>
              </div>
              
              <div className="flex items-center gap-4 border-l rtl:border-r rtl:border-l-0 border-gray-200 dark:border-gray-800 pl-8 rtl:pr-8 rtl:pl-0">
                
                {/* Language Switcher */}
                <LanguageSwitcher />

                <ThemeToggle />

                <Link 
                  to="/login" 
                  className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 font-semibold px-5 py-2 rounded-lg transition-colors flex items-center"
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
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors focus:outline-none"
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
          className={`fixed inset-0 bg-gray-900/50 dark:bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar Panel */}
        <div 
          className={`fixed top-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-xl md:hidden transition-transform duration-300 ease-in-out flex flex-col
            right-0 rtl:left-0 rtl:right-auto
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'}
          `}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{t('landing.brand')}</span>
            <button 
              className="p-2 text-gray-500 hover:text-red-500 focus:text-red-500 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
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
              className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Activity className="inline-block w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-400 dark:text-gray-500" />
              {t('landing.features')}
            </a>
            <a 
              href="#about" 
              className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShieldCheck className="inline-block w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-400 dark:text-gray-500" />
              {t('landing.about')}
            </a>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <Link 
              to="/login" 
              className="w-full text-center text-white bg-emerald-600 hover:bg-emerald-700 font-semibold px-5 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common.login')}
              <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-white dark:from-gray-950 to-gray-50 dark:to-gray-900">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          <span className="flex w-2 h-2 bg-emerald-500 rounded-full mr-2 rtl:ml-2 rtl:mr-0 animate-pulse"></span>
          {t('landing.systemVersion')}
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          {t('landing.heroTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{t('landing.heroSubtitle')}</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t('landing.heroDescription')}
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all hover:shadow-md"
          >
            {t('landing.accessPortal')}
          </Link>
          <a
            href="#learn-more"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 rounded-xl shadow-sm transition-all"
          >
            {t('landing.learnMore')}
          </a>
        </div>
      </main>
    </div>
  );
};
