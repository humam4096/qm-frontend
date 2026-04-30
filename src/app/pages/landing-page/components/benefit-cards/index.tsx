import { Zap, CheckCircle2, Activity, ClipboardCheck } from 'lucide-react';
import { useScrollAnimation, useCountUp } from '../../../../../hooks/useScrollAnimation';

export const BenefitCard1 = ({ benefits }: { benefits: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-700 hover:-translate-y-1 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full" />
      
      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {benefits[0].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefits[0].description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Before</span>
            <span className="font-semibold text-foreground">100 min</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/20 rounded-full transition-all duration-1000"
              style={{ width: isVisible ? '100%' : '0%' }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">After</span>
            <span className="font-semibold text-success">40 min</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 delay-300"
              style={{ width: isVisible ? '40%' : '0%' }}
            />
          </div>

          <div className={`flex items-center justify-center gap-2 pt-2 transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className="px-4 py-2 rounded-full bg-success/10 border border-success/20">
              <span className="text-sm font-bold text-success">↓ 60% Faster</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BenefitCard2 = ({ benefits }: { benefits: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-700 delay-100 hover:-translate-y-1 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/10 to-transparent rounded-bl-full" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-primary/5 to-transparent rounded-full" />
      
      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-success to-secondary flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {benefits[1].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefits[1].description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground text-center">Manual Process</div>
              <div className="flex items-end justify-center h-24 gap-1">
                {[85, 78, 82, 80, 83].map((height, i) => (
                  <div 
                    key={i}
                    className="flex-1 bg-gradient-to-t from-destructive/60 to-destructive/40 rounded-t transition-all duration-700"
                    style={{ 
                      height: isVisible ? `${height}%` : '0%',
                      transitionDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-destructive">18%</span>
                <span className="text-xs text-muted-foreground ml-1">errors</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground text-center">Automated</div>
              <div className="flex items-end justify-center h-24 gap-1">
                {[15, 12, 18, 14, 16].map((height, i) => (
                  <div 
                    key={i}
                    className="flex-1 bg-gradient-to-t from-success to-success/70 rounded-t transition-all duration-700"
                    style={{ 
                      height: isVisible ? `${height}%` : '0%',
                      transitionDelay: `${(i + 5) * 100}ms`
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-success">2%</span>
                <span className="text-xs text-muted-foreground ml-1">errors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BenefitCard3 = ({ benefits }: { benefits: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const active = useCountUp(24, 1500, isVisible);
  const complete = useCountUp(156, 2000, isVisible);
  const pending = useCountUp(8, 1500, isVisible);

  return (
    <div ref={ref} className={`group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-700 delay-200 hover:-translate-y-1 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-primary/5 to-transparent rounded-full" />
      
      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-primary flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {benefits[2].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefits[2].description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="text-xs text-muted-foreground mb-1">Active</div>
              <div className="text-2xl font-bold text-primary">{active}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] text-primary">Live</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="text-xs text-muted-foreground mb-1">Complete</div>
              <div className="text-2xl font-bold text-success">{complete}</div>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3 text-success" />
                <span className="text-[10px] text-success">Today</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="text-xs text-muted-foreground mb-1">Pending</div>
              <div className="text-2xl font-bold text-warning">{pending}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full border-2 border-warning border-t-transparent animate-spin" />
                <span className="text-[10px] text-warning">Review</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {[
              { text: 'Kitchen A inspection completed', delay: 300 },
              { text: 'New report submitted', delay: 400 }
            ].map((item, i) => (
              <div 
                key={i}
                className={`flex items-center gap-2 text-xs transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-muted-foreground">{item.text}</span>
                <span className="ml-auto text-muted-foreground/60">{i === 0 ? '2m' : '5m'} ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BenefitCard4 = ({ benefits }: { benefits: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const compliance = useCountUp(96, 2000, isVisible);

  return (
    <div ref={ref} className={`group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-700 delay-300 hover:-translate-y-1 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-success/5 to-transparent rounded-full" />
      
      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-success flex items-center justify-center shadow-lg">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {benefits[3].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefits[3].description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - (isVisible ? compliance / 100 : 0))}`}
                  className="text-success transition-all duration-2000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-success">{compliance}%</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Standards Met</span>
                <span className="text-sm font-semibold text-foreground">247/257</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Locations</span>
                <span className="text-sm font-semibold text-foreground">12/12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Consistency</span>
                <span className="text-sm font-semibold text-success">Excellent</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {['ISO Compliant', 'HACCP Certified'].map((badge, i) => (
              <div 
                key={i}
                className={`px-3 py-1.5 rounded-full bg-success/10 border border-success/20 flex items-center gap-1.5 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <CheckCircle2 className="w-3 h-3 text-success" />
                <span className="text-xs font-medium text-success">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
