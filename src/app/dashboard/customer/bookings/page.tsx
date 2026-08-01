'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/hooks/useCustomer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Calendar } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';

export default function CustomerBookingsPage() {
  const { bookings, loading, fetchBookings } = useCustomer();
  const [search, setSearch] = useState('');
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const query = search.toLowerCase();
      setFilteredBookings(
        bookings.filter(
          (b) =>
            b.service?.title?.toLowerCase().includes(query) ||
            b.status?.toLowerCase().includes(query) ||
            b.technician?.user?.name?.toLowerCase().includes(query)
        )
      );
    }
  }, [search, bookings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">My Bookings</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted/50 p-4" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
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
                        {booking.scheduledAt ? formatDate(booking.scheduledAt) : 'N/A'} •{' '}
                        {formatPrice(booking.totalAmount)}
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
            {search ? 'Try adjusting your search' : 'You have no bookings yet'}
          </p>
          <Link href="/services">
            <Button className="mt-4">Browse Services</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
