'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBookings } from '@/hooks/useBookings';
import { useSearch } from '@/hooks/useSearch';
import { Button } from '@/components/ui/Button';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { Card, CardContent } from '@/components/ui/Card';
import { SearchFilters } from '@/components/SearchFilters';
import { Calendar, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'PAID', label: 'Paid' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function TechnicianBookingsPage() {
  const { bookings, loading, fetchBookings, updateBookingStatus } = useBookings();
  const [allBookings, setAllBookings] = useState<any[]>([]);

  const { filters, filteredItems, updateFilter, clearFilters, hasFilters } = useSearch(
    allBookings,
    ['service.title', 'customer.name', 'status'],
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

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await updateBookingStatus(bookingId, status);
      await fetchBookings();
    } catch (error) {
      // Error is already handled in the hook
    }
  };

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
        placeholder="Search by service, customer, or status..."
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
          {filteredItems.map((booking) => {
            const isPending = booking.status === 'REQUESTED';
            const isAccepted = booking.status === 'ACCEPTED' || booking.status === 'PAID';
            const isInProgress = booking.status === 'IN_PROGRESS';
            const isCompleted = booking.status === 'COMPLETED';

            return (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
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
                          Customer: {booking.customer?.name}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isPending && (
                          <>
                            <Button
                              size="sm"
                              className="gap-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
                            >
                              <CheckCircle className="h-3 w-3" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-1"
                              onClick={() => handleStatusUpdate(booking.id, 'DECLINED')}
                            >
                              <XCircle className="h-3 w-3" />
                              Decline
                            </Button>
                          </>
                        )}
                        {isAccepted && (
                          <Button
                            size="sm"
                            className="gap-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleStatusUpdate(booking.id, 'IN_PROGRESS')}
                          >
                            <PlayCircle className="h-3 w-3" />
                            Start Job
                          </Button>
                        )}
                        {isInProgress && (
                          <Button
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                          >
                            <CheckCircle className="h-3 w-3" />
                            Complete Job
                          </Button>
                        )}
                        <Link href={`/dashboard/technician/bookings/${booking.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasFilters ? 'Try adjusting your filters' : 'You have no bookings yet'}
          </p>
        </div>
      )}
    </div>
  );
}
