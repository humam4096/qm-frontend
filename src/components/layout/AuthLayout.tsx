import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const AuthLayout = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-svh flex flex-col bg-muted transition-colors duration-300 relative" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Shared Auth Header */}
      <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
          <span className="font-bold tracking-tight">{t('landing.brand')}</span>
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
