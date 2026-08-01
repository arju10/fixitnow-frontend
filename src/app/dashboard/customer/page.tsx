'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCustomer } from '@/hooks/useCustomer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { Calendar, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { bookings, loading, fetchBookings } = useCustomer();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (bookings.length > 0) {
      setStats({
        total: bookings.length,
        completed: bookings.filter((b) => b.status === 'COMPLETED').length,
        pending: bookings.filter((b) =>
          ['REQUESTED', 'ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status)
        ).length,
        cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
      });
    }
  }, [bookings]);

  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Customer'}!</h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your bookings and activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Link href="/dashboard/customer/bookings">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/50 p-4" />
            ))}
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Link href={`/dashboard/customer/bookings/${booking.id}`} key={booking.id}>
                <div className="cursor-pointer rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.service?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.scheduledAt ? formatDate(booking.scheduledAt) : 'N/A'} •{' '}
                        {formatPrice(booking.totalAmount)}
                      </p>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No bookings yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start by booking your first service
            </p>
            <Link href="/services">
              <Button className="mt-4">Browse Services</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
