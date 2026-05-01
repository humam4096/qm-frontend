import { Link } from 'react-router-dom';
import { ShieldCheck, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../../../../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../../../../components/ui/LanguageSwitcher';
import UserRouter from '../../../router/UserRouter';

interface NavigationBarProps {
  onMenuClick: () => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  isMenuOpen: boolean;
}

export const NavigationBar = ({ onMenuClick, onNavClick, triggerRef, isMenuOpen }: NavigationBarProps) => {
  const { t } = useTranslation();

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
              <ShieldCheck className="relative h-8 w-8 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              {t('landing.brand')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div dir='ltr' className="hidden md:flex items-center gap-8 rtl:flex-row-reverse">
            <div className="flex items-center gap-6">
              <a
                href="#features"
                onClick={(e) => onNavClick(e, '#features')}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t('landing.nav.features')}
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => onNavClick(e, '#how-it-works')}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t('landing.nav.howItWorks')}
              </a>
              <a
                href="#benefits"
                onClick={(e) => onNavClick(e, '#benefits')}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t('landing.nav.benefits')}
              </a>
            </div>

            <div className="flex items-center gap-3 border-s border-border ps-6">
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
              ref={triggerRef}
              onClick={onMenuClick}
              aria-label={t('common.menu')}
              aria-expanded={isMenuOpen}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
