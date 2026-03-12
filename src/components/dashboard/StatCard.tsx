import type { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  iconBgColor = 'bg-primary/10', 
  iconColor = 'text-primary',
  className = '' 
}: StatCardProps) {
  return (
    <Card className={`overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="py-1 px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2 text-right rtl:text-right ltr:text-left flex-1">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="text-3xl font-bold text-foreground">{value}</div>
          </div>
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ms-4 ${iconBgColor} ${iconColor}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
