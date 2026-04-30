import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const AuthLayout = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-svh flex flex-col bg-background transition-colors duration-300 relative overflow-hidden" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Premium Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(94,160,122,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(148,163,120,0.06),transparent_50%)]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* Shared Auth Header */}
      <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
            <ShieldCheck className="relative h-6 w-6 text-primary" />
          </div>
          <span className="font-bold tracking-tight text-foreground">{t('landing.brand')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
