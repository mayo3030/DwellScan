import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Skeleton className="h-8 w-48 bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg bg-muted" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg bg-muted" />
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="h-6 w-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border border-border/50 bg-card/50 p-6 space-y-4">
      <Skeleton className="h-4 w-24 bg-muted" />
      <Skeleton className="h-8 w-32 bg-muted" />
      <Skeleton className="h-3 w-16 bg-muted" />
    </div>
  );
}
