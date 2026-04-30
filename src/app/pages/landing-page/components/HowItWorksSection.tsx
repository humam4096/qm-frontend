import { useTranslation } from 'react-i18next';
import { StepCard1, StepCard2, StepCard3, StepCard4 } from './step-cards';

export const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      title: t('landing.howItWorks.step1.title'),
      description: t('landing.howItWorks.step1.desc')
    },
    {
      number: '02',
      title: t('landing.howItWorks.step2.title'),
      description: t('landing.howItWorks.step2.desc')
    },
    {
      number: '03',
      title: t('landing.howItWorks.step3.title'),
      description: t('landing.howItWorks.step3.desc')
    },
    {
      number: '04',
      title: t('landing.howItWorks.step4.title'),
      description: t('landing.howItWorks.step4.desc')
    }
  ];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 overflow-hidden">
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
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {t('landing.howItWorks.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps - Dashboard Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard1 steps={steps} />
          <StepCard2 steps={steps} />
          <StepCard3 steps={steps} />
          <StepCard4 steps={steps} />
        </div>
      </div>
    </section>
  );
};
