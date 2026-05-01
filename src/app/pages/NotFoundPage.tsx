import { Link } from 'react-router-dom';
import { Home, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen-mobile bg-background flex flex-col">
      {/* Navigation Bar */}
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

            {/* Controls */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-2xl mx-auto text-center space-y-8 py-12">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-[10rem] sm:text-[12rem] md:text-[14rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient leading-none select-none">
              404
            </h1>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {t('notFound.title')}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t('notFound.description')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-5 h-5" />
              {t('notFound.goHome')}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-foreground bg-card border-2 border-border hover:border-primary/50 hover:bg-muted rounded-xl shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {t('notFound.goBack')}
            </button>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t border-border mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              {t('notFound.helpfulLinks')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/#features"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('landing.nav.features')}
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                to="/#how-it-works"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('landing.nav.howItWorks')}
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('common.login')}
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                to="/register"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('auth.signup')}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-card/50 backdrop-blur-sm border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t('landing.footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('landing.footer.privacy')}
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('landing.footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
