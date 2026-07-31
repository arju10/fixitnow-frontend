'use client';

import type { Booking } from '@/types';

interface BookingStatusBadgeProps {
  status: Booking['status'];
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'REQUESTED':
        return { backgroundColor: '#eab308', color: '#ffffff' }; // Yellow
      case 'ACCEPTED':
        return { backgroundColor: '#3b82f6', color: '#ffffff' }; // Blue
      case 'DECLINED':
        return { backgroundColor: '#ef4444', color: '#ffffff' }; // Red
      case 'PAID':
        return { backgroundColor: '#a855f7', color: '#ffffff' }; // Purple
      case 'IN_PROGRESS':
        return { backgroundColor: '#22c55e', color: '#ffffff' }; // Green
      case 'COMPLETED':
        return { backgroundColor: '#6b7280', color: '#ffffff' }; // Gray
      case 'CANCELLED':
        return { backgroundColor: '#991b1b', color: '#ffffff' }; // Dark Red
      default:
        return { backgroundColor: '#6b7280', color: '#ffffff' };
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'REQUESTED':
        return 'Requested';
      case 'ACCEPTED':
        return 'Accepted';
      case 'DECLINED':
        return 'Declined';
      case 'PAID':
        return 'Paid';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const styles = getStatusStyles();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '9999px',
        padding: '0.125rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        lineHeight: '1.5rem',
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        whiteSpace: 'nowrap',
      }}
      className={className}
    >
      {getLabel()}
    </span>
  );
}
