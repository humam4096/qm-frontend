import { Activity, ClipboardCheck, CheckCircle2, BarChart3 } from 'lucide-react';
import { useScrollAnimation, useCountUp } from '../../../../../hooks/useScrollAnimation';

export const StepCard1 = ({ steps }: { steps: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="relative group">
      <div className="hidden lg:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent z-0" />
      
      <div className={`relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
        
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-50" />
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">01</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {steps[0].title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {steps[0].description}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className={`flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-medium text-foreground">Kitchen A - Zone 1</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg bg-muted/50 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <span className="text-xs text-muted-foreground">Kitchen B - Zone 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StepCard2 = ({ steps }: { steps: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="relative group">
      <div className="hidden lg:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent z-0" />
      
      <div className={`relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 delay-100 hover:-translate-y-1 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full" />
        
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-full blur-md opacity-50" />
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">02</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {steps[1].title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {steps[1].description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {['08:00\nBreakfast', '12:00\nLunch', '18:00\nDinner'].map((time, i) => {
              const [hour, meal] = time.split('\n');
              const isActive = i === 0;
              return (
                <div 
                  key={i}
                  className={`p-2 rounded-lg text-center transition-all duration-500 ${isActive ? 'bg-secondary/10 border border-secondary/20' : 'bg-muted/50'} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`text-xs font-semibold ${isActive ? 'text-secondary' : 'text-muted-foreground'}`}>{hour}</div>
                  <div className="text-[10px] text-muted-foreground">{meal}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StepCard3 = ({ steps }: { steps: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const progress1 = useCountUp(100, 1500, isVisible);
  const progress2 = useCountUp(75, 1500, isVisible);

  return (
    <div ref={ref} className="relative group">
      <div className="hidden lg:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent z-0" />
      
      <div className={`relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 delay-200 hover:-translate-y-1 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-success/10 to-transparent rounded-bl-full" />
        
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-success rounded-full blur-md opacity-50" />
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary to-success flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">03</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {steps[2].title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {steps[2].description}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 h-1.5 bg-success/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-1000"
                  style={{ width: isVisible ? `${progress1}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-medium text-success">{progress1}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 h-1.5 bg-success/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-1000 delay-200"
                  style={{ width: isVisible ? `${progress2}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-medium text-success">{progress2}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StepCard4 = ({ steps }: { steps: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="relative group">
      <div className={`relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 delay-300 hover:-translate-y-1 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
        
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-success rounded-full blur-md opacity-50" />
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-secondary to-success flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">04</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-success" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {steps[3].title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {steps[3].description}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className={`flex items-center justify-between p-2 rounded-lg bg-success/10 border border-success/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              <span className="text-xs font-medium text-success">Approved</span>
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
            <div className={`flex items-center justify-between p-2 rounded-lg bg-warning/10 border border-warning/20 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              <span className="text-xs font-medium text-warning">In Review</span>
              <div className="w-4 h-4 rounded-full border-2 border-warning border-t-transparent animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
