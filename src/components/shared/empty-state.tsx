import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="h-14 w-14 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-5">
        <Icon className="h-6 w-6 text-primary/60" />
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
