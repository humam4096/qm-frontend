import { useEffect } from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { handleChunkLoadError, isChunkLoadError } from '@/utils/chunkLoadRecovery';

function getErrorMessage(error: unknown, fallback: string): string {
  if (isRouteErrorResponse(error)) {
    return String(error.statusText || error.data || fallback);
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function RouteErrorFallback() {
  const error = useRouteError();
  const { t } = useTranslation();
  const isStaleDeploy = isChunkLoadError(error);

  useEffect(() => {
    if (isStaleDeploy) handleChunkLoadError(error);
  }, [error, isStaleDeploy]);

  const HeroIcon = isStaleDeploy ? RefreshCw : AlertTriangle;

  return (
    <div className="min-h-screen-mobile bg-background flex flex-col">
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                <ShieldCheck className="relative h-8 w-8 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {t('landing.brand')}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />

        <div className="relative max-w-2xl mx-auto text-center space-y-8 py-12">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary rounded-full blur-3xl opacity-30 scale-150" />
            <div className="relative rounded-full bg-linear-to-br from-primary/10 to-secondary/10 p-10 ring-1 ring-border/50">
              <HeroIcon
                className={`h-20 w-20 sm:h-24 sm:w-24 text-primary ${isStaleDeploy ? 'animate-spin' : ''}`}
                style={isStaleDeploy ? { animationDuration: '3s' } : undefined}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {isStaleDeploy ? t('appUpdate.title') : t('appUpdate.genericTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              {isStaleDeploy
                ? t('appUpdate.description')
                : getErrorMessage(error, t('appUpdate.unknownError'))}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground bg-linear-to-r from-primary to-secondary hover:opacity-90 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              {t('appUpdate.reload')}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-foreground bg-card border-2 border-border hover:border-primary/50 hover:bg-muted rounded-xl shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {t('notFound.goBack')}
            </button>
          </div>

          <div className="pt-8 border-t border-border mt-12">
            <p className="text-sm text-muted-foreground mb-4">{t('notFound.helpfulLinks')}</p>
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
}
