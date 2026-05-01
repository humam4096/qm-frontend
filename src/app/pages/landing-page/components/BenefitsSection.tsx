import { useTranslation } from 'react-i18next';
import { BenefitCard1, BenefitCard2, BenefitCard3, BenefitCard4 } from './benefit-cards';

export const BenefitsSection = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      title: t('landing.benefits.efficiency.title'),
      description: t('landing.benefits.efficiency.desc')
    },
    {
      title: t('landing.benefits.errors.title'),
      description: t('landing.benefits.errors.desc')
    },
    {
      title: t('landing.benefits.visibility.title'),
      description: t('landing.benefits.visibility.desc')
    },
    {
      title: t('landing.benefits.standardized.title'),
      description: t('landing.benefits.standardized.desc')
    }
  ];

  return (
    <section id="benefits" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Premium Background with Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
      }} />
      
      {/* Radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,80,58,0.1),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(148,163,120,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(62,80,58,0.03)_70%)]" />
      
      {/* Diagonal light beam effect */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-primary/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-secondary/5 via-transparent to-transparent" />
      
      {/* Floating gradient shapes */}
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '3s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {t('landing.benefits.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.benefits.subtitle')}
          </p>
        </div>

        {/* Benefits Grid - Dashboard Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <BenefitCard1 benefits={benefits} />
          <BenefitCard2 benefits={benefits} />
          <BenefitCard3 benefits={benefits} />
          <BenefitCard4 benefits={benefits} />
        </div>
      </div>
    </section>
  );
};
