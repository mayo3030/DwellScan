import { cn } from '@/lib/utils';

type StatusType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

const STATUS_STYLES: Record<StatusType, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  pending: 'bg-muted text-muted-foreground border-border',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide',
        STATUS_STYLES[status],
        className
      )}
    >
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        status === 'success' && 'bg-success',
        status === 'warning' && 'bg-warning',
        status === 'error' && 'bg-destructive',
        status === 'info' && 'bg-primary',
        status === 'pending' && 'bg-muted-foreground',
        status === 'neutral' && 'bg-muted-foreground',
      )} />
      {label}
    </span>
  );
}

const BOOKING_STATUS_MAP: Record<string, { status: StatusType; label: string }> = {
  DRAFT: { status: 'neutral', label: 'Draft' },
  PENDING_INSPECTOR: { status: 'pending', label: 'Pending' },
  NEGOTIATING: { status: 'info', label: 'Negotiating' },
  ACCEPTED: { status: 'info', label: 'Accepted' },
  PAYMENT_PENDING: { status: 'warning', label: 'Payment Pending' },
  PAYMENT_AUTHORIZED: { status: 'info', label: 'Authorized' },
  SCHEDULED: { status: 'info', label: 'Scheduled' },
  IN_PROGRESS: { status: 'warning', label: 'In Progress' },
  INSPECTION_COMPLETE: { status: 'success', label: 'Complete' },
  REPORT_UPLOADED: { status: 'success', label: 'Report Ready' },
  COMPLETED: { status: 'success', label: 'Completed' },
  CANCELLED: { status: 'error', label: 'Cancelled' },
  DISPUTED: { status: 'error', label: 'Disputed' },
};

export function BookingStatusBadge({ status, className }: { status: string; className?: string }) {
  const config = BOOKING_STATUS_MAP[status] || { status: 'neutral' as StatusType, label: status };
  return <StatusBadge status={config.status} label={config.label} className={className} />;
}

const VERIFICATION_STATUS_MAP: Record<string, { status: StatusType; label: string }> = {
  PENDING: { status: 'pending', label: 'Pending' },
  UNDER_REVIEW: { status: 'warning', label: 'Under Review' },
  APPROVED: { status: 'success', label: 'Approved' },
  REJECTED: { status: 'error', label: 'Rejected' },
};

export function VerificationBadge({ status, className }: { status: string; className?: string }) {
  const config = VERIFICATION_STATUS_MAP[status] || { status: 'neutral' as StatusType, label: status };
  return <StatusBadge status={config.status} label={config.label} className={className} />;
}
