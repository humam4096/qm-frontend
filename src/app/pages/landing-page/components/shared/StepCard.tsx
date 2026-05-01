import type { ReactNode } from 'react';
import { useScrollAnimation } from '../../../../../hooks/useScrollAnimation';
import type { LucideIcon } from 'lucide-react';

interface StepCardProps {
  stepNumber: string;
  icon: LucideIcon;
  iconGradient?: string;
  iconBgColor?: string;
  title: string;
  description: string;
  children?: ReactNode;
  delay?: number;
  showConnector?: boolean;
}

/**
 * Shared step card component for "How It Works" section
 */
export const StepCard = ({
  stepNumber,
  icon: Icon,
  iconGradient = 'from-primary to-secondary',
  iconBgColor = 'bg-primary/10',
  title,
  description,
  children,
  delay = 0,
  showConnector = true,
}: StepCardProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="relative group">
      {/* Connector line */}
      {showConnector && (
        <div className="hidden lg:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent z-0" />
      )}

      <div
        className={`relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${iconGradient} rounded-full blur-md opacity-50`} />
              <div className={`relative w-14 h-14 rounded-full bg-gradient-to-r ${iconGradient} flex items-center justify-center shadow-lg`}>
                <span className="text-xl font-bold text-white">{stepNumber}</span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>

          {children && <div className="pt-2">{children}</div>}
        </div>
      </div>
    </div>
  );
};
