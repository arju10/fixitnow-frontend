'use client';

import { Badge } from '@/components/ui/Badge';
import type { Booking } from '@/types';

interface BookingStatusBadgeProps {
  status: Booking['status'];
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const statusConfig = {
    REQUESTED: {
      label: 'Requested',
      variant: 'warning' as const,
    },
    ACCEPTED: {
      label: 'Accepted',
      variant: 'info' as const,
    },
    DECLINED: {
      label: 'Declined',
      variant: 'destructive' as const,
    },
    PAID: {
      label: 'Paid',
      variant: 'purple' as const,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      variant: 'success' as const,
    },
    COMPLETED: {
      label: 'Completed',
      variant: 'default' as const,
    },
    CANCELLED: {
      label: 'Cancelled',
      variant: 'destructive' as const,
    },
  };

  const config = statusConfig[status] || statusConfig.REQUESTED;

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
