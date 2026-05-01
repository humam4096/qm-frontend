import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  isDarkMode: boolean;
  onLearnMoreClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const HeroSection = ({ isDarkMode, onLearnMoreClick }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={isDarkMode ? '/dashboard-dark.webp' : '/dashboard-light.webp'}
          alt="Background"
          className="w-full h-full object-cover opacity-[0.03]x blur-[2px]x"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/98 to-background" />
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
            <span className="flex w-2 h-2 bg-primary rounded-full me-2 animate-pulse" />
            {t('landing.hero.badge')}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight max-w-5xl mx-auto leading-[1.1]">
            {t('landing.hero.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
              {t('landing.hero.subtitle')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('landing.hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {t('landing.hero.cta.primary')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              onClick={onLearnMoreClick}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-foreground bg-card border-2 border-border hover:border-primary/50 hover:bg-muted rounded-xl shadow-sm transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              {t('landing.hero.cta.secondary')}
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card group">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700" />
              
              {/* Image container with animations */}
              <div className="relative animate-fade-in-up">
                <img 
                  key={isDarkMode ? 'dark' : 'light'}
                  src={isDarkMode ? '/dashboard-dark.webp' : '/dashboard-light.webp'}
                  alt={t('landing.hero.preview')}
                  className="w-full h-auto transform transition-all duration-700 group-hover:scale-[1.02] animate-fade-in"
                  loading="eager"
                />
                
                {/* Shine effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </div>

              {/* Floating badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-success/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg animate-bounce-subtle">
                {t('landing.hero.liveBadge')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
