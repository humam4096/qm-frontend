import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  description?: string;
}

export function ChartCard({ title, children, className = '', description }: ChartCardProps) {
  return (
    <Card className={`border-border/50 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
