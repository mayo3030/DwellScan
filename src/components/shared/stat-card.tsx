import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('card-luxury bg-card/50 backdrop-blur-sm', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">{title}</p>
            <p className="font-display text-3xl font-semibold tabular-nums">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className={cn(
                'inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
                trend.positive
                  ? 'text-success bg-success/10'
                  : 'text-destructive bg-destructive/10'
              )}>
                <span>{trend.positive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
