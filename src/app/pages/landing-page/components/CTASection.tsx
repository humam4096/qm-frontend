import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-success/5 via-transparent to-primary/5" />
      
      {/* Radial spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,120,0.15),transparent_60%)]" />
      
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `
          radial-gradient(at 20% 30%, rgba(62, 80, 58, 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 70%, rgba(148, 163, 120, 0.15) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(62, 80, 58, 0.1) 0px, transparent 50%)
        `
      }} />
      
      {/* Glowing orbs with different animation speeds */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          {t('landing.cta.title')}
        </h2>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('landing.cta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            to="/login"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {t('landing.cta.button')}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
