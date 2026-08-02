'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/hooks/useCustomer';
import { useSearch } from '@/hooks/useSearch';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchFilters } from '@/components/SearchFilters';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export default function CustomerPaymentsPage() {
  const { payments, loading, fetchPayments } = useCustomer();
  const [allPayments, setAllPayments] = useState<any[]>([]);

  const { filters, filteredItems, updateFilter, clearFilters, hasFilters } = useSearch(
    allPayments,
    ['transactionId', 'booking.service.title', 'status'],
    [{ key: 'status', type: 'status' }]
  );

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    if (payments) {
      setAllPayments(payments);
    }
  }, [payments]);

  const handleRefresh = async () => {
    await fetchPayments();
    toast.success('Payments refreshed');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      case 'REFUNDED':
        return <Badge variant="destructive">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'REFUNDED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-sm text-muted-foreground">View all your past payments</p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <CreditCard className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Search Filters */}
      <SearchFilters
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
        statusOptions={statusOptions}
        placeholder="Search by transaction ID, service, or status..."
        showLocation={false}
        showPrice={false}
        showRating={false}
        showDate={true}
      />

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'payment' : 'payments'}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted/50" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <p className="font-medium">{payment.booking?.service?.title || 'Payment'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Transaction: {payment.transactionId}
                      </p>
                      {payment.booking?.technician?.user?.name && (
                        <p className="text-sm text-muted-foreground">
                          Technician: {payment.booking.technician.user.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(payment.amount)}
                    </span>
                    {getStatusBadge(payment.status)}
                    {payment.paidAt && (
                      <span className="text-xs text-muted-foreground">
                        Paid: {formatDate(payment.paidAt)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No payments found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasFilters ? 'Try adjusting your filters' : "You haven't made any payments yet."}
          </p>
          <Link href="/services">
            <button className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Browse Services
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
