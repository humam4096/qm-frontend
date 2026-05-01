import type { ReactNode } from 'react';
import { useScrollAnimation } from '../../../../../hooks/useScrollAnimation';
import type { LucideIcon } from 'lucide-react';

interface AnimatedCardProps {
  icon: LucideIcon;
  iconGradient?: string;
  title: string;
  description: string;
  children?: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Shared animated card component to eliminate duplication
 * Used across benefit-cards, feature-cards, step-cards, preview-cards
 */
export const AnimatedCard = ({
  icon: Icon,
  iconGradient = 'from-primary to-secondary',
  title,
  description,
  children,
  delay = 0,
  className = '',
}: AnimatedCardProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full" />

      <div className="relative space-y-4">
        {/* Icon and header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${iconGradient} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        </div>

        {/* Custom content */}
        {children && <div className="pt-2">{children}</div>}
      </div>
    </div>
  );
};
