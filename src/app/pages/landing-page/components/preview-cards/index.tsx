import { Activity, Bell, CheckCircle2 } from 'lucide-react';
import { useScrollAnimation, useCountUp } from '../../../../../hooks/useScrollAnimation';

export const PreviewCard1 = ({ t }: { t: any }) => {
  const { ref, isVisible } = useScrollAnimation();
  const inspections = useCountUp(247, 2000, isVisible);
  const compliance = useCountUp(98, 2000, isVisible);

  return (
    <div ref={ref} className={`bg-card border border-border rounded-2xl p-6 space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{t('landing.preview.card1.title')}</h3>
        <Activity className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('landing.preview.card1.metric1')}</span>
          <span className="text-2xl font-bold text-foreground">{inspections}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('landing.preview.card1.metric2')}</span>
          <span className="text-2xl font-bold text-success">{compliance}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-2000"
            style={{ width: isVisible ? `${compliance}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );
};

export const PreviewCard2 = ({ t }: { t: any }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`bg-card border border-border rounded-2xl p-6 space-y-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{t('landing.preview.card2.title')}</h3>
        <Bell className="w-5 h-5 text-warning" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`flex items-start gap-3 p-2 rounded-lg bg-muted/50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground font-medium truncate">
                {t(`landing.preview.card2.log${i}`)}
              </p>
              <p className="text-xs text-muted-foreground">{t('landing.preview.card2.time')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PreviewCard3 = ({ t }: { t: any }) => {
  const { ref, isVisible } = useScrollAnimation();
  const approved = useCountUp(24, 1500, isVisible);
  const pending = useCountUp(3, 1500, isVisible);
  const inProgress = useCountUp(12, 1500, isVisible);

  return (
    <div ref={ref} className={`bg-card border border-border rounded-2xl p-6 space-y-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{t('landing.preview.card3.title')}</h3>
        <CheckCircle2 className="w-5 h-5 text-success" />
      </div>
      <div className="space-y-3">
        <div className={`flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <span className="text-sm font-medium text-success">{t('landing.preview.card3.status1')}</span>
          <span className="text-xs font-semibold text-success">{approved}</span>
        </div>
        <div className={`flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <span className="text-sm font-medium text-warning">{t('landing.preview.card3.status2')}</span>
          <span className="text-xs font-semibold text-warning">{pending}</span>
        </div>
        <div className={`flex items-center justify-between p-3 rounded-lg bg-muted transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <span className="text-sm font-medium text-muted-foreground">{t('landing.preview.card3.status3')}</span>
          <span className="text-xs font-semibold text-muted-foreground">{inProgress}</span>
        </div>
      </div>
    </div>
  );
};
