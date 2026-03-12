import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export type StatusVariant = 'success' | 'warning' | 'info' | 'critical' | 'secondary' | 'primary';

export interface StatusItem {
  id: string | number;
  label: string;
  count: number;
  icon: ReactNode;
  variant: StatusVariant;
}

interface StatusDistributionCardProps {
  title: string;
  items: StatusItem[];
  className?: string;
}

const variantStyles: Record<StatusVariant, { text: string, bg: string, badgeText: string, badgeBg: string }> = {
  success: { text: 'text-success', bg: 'bg-success/10', badgeText: 'text-success-foreground', badgeBg: 'bg-success' },
  warning: { text: 'text-warning', bg: 'bg-warning/10', badgeText: 'text-warning-foreground', badgeBg: 'bg-warning' },
  info: { text: 'text-info', bg: 'bg-info/10', badgeText: 'text-info-foreground', badgeBg: 'bg-info' },
  critical: { text: 'text-destructive', bg: 'bg-destructive/10', badgeText: 'text-destructive-foreground', badgeBg: 'bg-destructive' },
  secondary: { text: 'text-secondary', bg: 'bg-secondary/10', badgeText: 'text-secondary-foreground', badgeBg: 'bg-secondary' },
  primary: { text: 'text-primary', bg: 'bg-primary/10', badgeText: 'text-primary-foreground', badgeBg: 'bg-primary' },
};

export function StatusDistributionCard({ title, items, className = '' }: StatusDistributionCardProps) {
  return (
    <Card className={`border-border/50 shadow-sm ${className}`}>
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {items.map((item) => {
          const styles = variantStyles[item.variant];
          
          return (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${styles.bg}`}
            >
              <div className="flex items-center gap-3">
                <span className={`${styles.text}`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-sm text-foreground">{item.label}</span>
              </div>
              <div 
                className={`px-3 py-1 rounded-full text-xs font-bold ${styles.badgeBg} ${styles.badgeText}`}
              >
                {item.count}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
