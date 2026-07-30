'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';

export default function CustomerBookingsPage() {
  const { bookings, loading, fetchBookings } = useBookings();
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
        <Link href="/services">
          <Button size="sm">Book New Service</Button>
        </Link>
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
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="truncate font-medium">{booking.service?.title}</p>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(booking.scheduledAt)} • {formatPrice(booking.totalAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Technician: {booking.technician?.user?.name || 'Unknown'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
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
            {search ? 'Try adjusting your search' : 'Book your first service today'}
          </p>
          {!search && (
            <Link href="/services">
              <Button className="mt-4">Browse Services</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
