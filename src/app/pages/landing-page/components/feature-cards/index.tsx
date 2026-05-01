import { Activity, Bell, ClipboardCheck, Users, CheckCircle2, BarChart3 } from 'lucide-react';
import { useScrollAnimation, useCountUp } from '../../../../../hooks/useScrollAnimation';

export const FeatureCard1 = ({ features }: { features: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(247, 2000, isVisible);

  return (
    <div ref={ref} className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
      <div className={`relative space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg`}>
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-primary">{count}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {features[0].title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {features[0].description}
          </p>
        </div>
        <div className="flex items-end gap-1 h-12">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t opacity-60 group-hover:opacity-100 transition-all duration-500"
              style={{ 
                height: isVisible ? `${height}%` : '0%',
                transitionDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const FeatureCard2 = ({ features }: { features: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(12, 1500, isVisible);

  return (
    <div ref={ref} className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full" />
      <div className={`relative space-y-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-primary flex items-center justify-center shadow-lg`}>
            <Bell className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-warning">{count}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {features[1].title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {features[1].description}
          </p>
        </div>
        <div className="space-y-2">
          {[90, 75, 60].map((width, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-success to-secondary rounded-full transition-all duration-1000"
                  style={{ 
                    width: isVisible ? `${width}%` : '0%',
                    transitionDelay: `${i * 150}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FeatureCard3 = ({ features }: { features: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const percentage = useCountUp(98, 2000, isVisible);

  return (
    <div ref={ref} className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
      <div className={`relative space-y-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-success flex items-center justify-center shadow-lg`}>
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-success">{percentage}%</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {features[2].title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {features[2].description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - (isVisible ? percentage / 100 : 0))}`}
                className="text-success transition-all duration-2000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-success">{percentage}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-semibold text-foreground">156</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-semibold text-foreground">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeatureCard4 = ({ features }: { features: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(6, 1500, isVisible);

  return (
    <div ref={ref} className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/10 to-transparent rounded-bl-full" />
      <div className={`relative space-y-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-success to-secondary flex items-center justify-center shadow-lg`}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-secondary">{count}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {features[3].title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {features[3].description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Admin', 'Manager', 'Inspector', 'Supervisor'].map((role, i) => (
            <div 
              key={i}
              className={`px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full text-xs font-medium text-foreground transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {role}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FeatureCard5 = ({ features }: { features: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const validated = useCountUp(234, 2000, isVisible);
  const inReview = useCountUp(12, 2000, isVisible);

  return (
    <div ref={ref} className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full" />
      <div className={`relative space-y-4 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-success flex items-center justify-center shadow-lg`}>
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-success">✓</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {features[4].title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {features[4].description}
          </p>
        </div>
        <div className="space-y-2">
          <div className={`flex items-center justify-between p-2 rounded-lg bg-success/10 border border-success/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <span className="text-xs font-medium text-success">Validated</span>
            <span className="text-xs font-bold text-success">{validated}</span>
          </div>
          <div className={`flex items-center justify-between p-2 rounded-lg bg-muted transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <span className="text-xs font-medium text-muted-foreground">In Review</span>
            <span className="text-xs font-bold text-muted-foreground">{inReview}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeatureCard6 = ({ features }: { features: any[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const growth = useCountUp(24, 1500, isVisible);
  const efficiency = useCountUp(92, 2000, isVisible);
  const quality = useCountUp(96, 2000, isVisible);

  return (
    <div ref={ref} className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
      <div className={`relative space-y-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg`}>
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-1 text-success">
            <span className="text-sm">↑</span>
            <span className="text-xl font-bold">{growth}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {features[5].title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {features[5].description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded-lg bg-muted transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className="text-xs text-muted-foreground">Efficiency</div>
            <div className="text-lg font-bold text-foreground">{efficiency}%</div>
          </div>
          <div className={`p-2 rounded-lg bg-muted transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className="text-xs text-muted-foreground">Quality</div>
            <div className="text-lg font-bold text-foreground">{quality}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
