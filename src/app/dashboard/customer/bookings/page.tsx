'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/hooks/useCustomer';
import { useSearch } from '@/hooks/useSearch';
import { Button } from '@/components/ui/Button';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { Card, CardContent } from '@/components/ui/Card';
import { SearchFilters } from '@/components/SearchFilters';
import { Calendar } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';

const statusOptions = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'PAID', label: 'Paid' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function CustomerBookingsPage() {
  const { bookings, loading, fetchBookings } = useCustomer();
  const [allBookings, setAllBookings] = useState<any[]>([]);

  const { filters, filteredItems, updateFilter, clearFilters, hasFilters } = useSearch(
    allBookings,
    ['service.title', 'technician.user.name', 'status'],
    [{ key: 'status', type: 'status' }]
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (bookings) {
      setAllBookings(bookings);
    }
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">My Bookings</h1>
      </div>

      {/* Search Filters */}
      <SearchFilters
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
        statusOptions={statusOptions}
        placeholder="Search by service, technician, or status..."
        showLocation={false}
        showPrice={false}
        showRating={false}
        showDate={true}
      />

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'booking' : 'bookings'}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted/50 p-4" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((booking) => (
            <Link href={`/dashboard/customer/bookings/${booking.id}`} key={booking.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{booking.service?.title}</p>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.scheduledAt)} • {formatPrice(booking.totalAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Technician: {booking.technician?.user?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'COMPLETED' && !booking.review && (
                        <Link href={`/dashboard/customer/reviews/new?bookingId=${booking.id}`}>
                          <Button size="sm" variant="outline">
                            Write Review
                          </Button>
                        </Link>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasFilters ? 'Try adjusting your filters' : 'You have no bookings yet'}
          </p>
          <Link href="/services">
            <Button className="mt-4">Browse Services</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
