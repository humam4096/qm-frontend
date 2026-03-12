import type { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';

export type TeamRoleVariant = 'primary' | 'secondary' | 'warning' | 'info' | 'critical';

interface TeamOverviewCardProps {
  role: string;
  count: number;
  icon: ReactNode;
  variant?: TeamRoleVariant;
  className?: string;
}

const variantStyles: Record<TeamRoleVariant, { bg: string, text: string, iconBg: string }> = {
  primary: { bg: 'bg-primary/5', text: 'text-primary', iconBg: 'bg-primary/20' },
  secondary: { bg: 'bg-secondary/5', text: 'text-secondary', iconBg: 'bg-secondary/20' },
  warning: { bg: 'bg-warning/5', text: 'text-warning', iconBg: 'bg-warning/20' },
  info: { bg: 'bg-info/5', text: 'text-info', iconBg: 'bg-info/20' },
  critical: { bg: 'bg-destructive/5', text: 'text-destructive', iconBg: 'bg-destructive/20' },
};

export function TeamOverviewCard({
  role,
  count,
  icon,
  variant = 'primary',
  className = ''
}: TeamOverviewCardProps) {
  const styles = variantStyles[variant] || variantStyles.primary;

  return (
    <Card className={`overflow-hidden border-none shadow-none ${styles.bg} ${className}`}>
      <CardContent className="py-1 px-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className={`p-2 rounded-full ${styles.iconBg} ${styles.text}`}>
            {icon}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{count}</div>
            <h3 className="text-sm font-medium text-muted-foreground">{role}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
