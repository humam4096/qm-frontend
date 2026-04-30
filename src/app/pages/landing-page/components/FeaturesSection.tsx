import { useTranslation } from 'react-i18next';
import { 
  Activity, 
  Bell, 
  ClipboardCheck, 
  Users, 
  CheckCircle2, 
  BarChart3 
} from 'lucide-react';
import { FeatureCard1, FeatureCard2, FeatureCard3, FeatureCard4, FeatureCard5, FeatureCard6 } from './feature-cards';

export const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Activity,
      title: t('landing.features.realtime.title'),
      description: t('landing.features.realtime.desc'),
      gradient: 'from-primary to-secondary'
    },
    {
      icon: Bell,
      title: t('landing.features.notifications.title'),
      description: t('landing.features.notifications.desc'),
      gradient: 'from-secondary to-primary'
    },
    {
      icon: ClipboardCheck,
      title: t('landing.features.forms.title'),
      description: t('landing.features.forms.desc'),
      gradient: 'from-primary to-success'
    },
    {
      icon: Users,
      title: t('landing.features.multirole.title'),
      description: t('landing.features.multirole.desc'),
      gradient: 'from-success to-secondary'
    },
    {
      icon: CheckCircle2,
      title: t('landing.features.validation.title'),
      description: t('landing.features.validation.desc'),
      gradient: 'from-secondary to-success'
    },
    {
      icon: BarChart3,
      title: t('landing.features.tracking.title'),
      description: t('landing.features.tracking.desc'),
      gradient: 'from-primary to-secondary'
    }
  ];

  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Premium Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(94,160,122,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(148,163,120,0.06),transparent_50%)]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {t('landing.features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        {/* Features Grid - Dashboard Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard1 features={features} />
          <FeatureCard2 features={features} />
          <FeatureCard3 features={features} />
          <FeatureCard4 features={features} />
          <FeatureCard5 features={features} />
          <FeatureCard6 features={features} />
        </div>
      </div>
    </section>
  );
};
