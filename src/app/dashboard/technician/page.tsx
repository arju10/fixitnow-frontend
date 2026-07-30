'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { Calendar, CheckCircle, Clock, Users, ArrowRight, Wrench } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';

export default function TechnicianDashboardPage() {
  const { user } = useAuth();
  const { bookings, loading, fetchBookings } = useBookings();
  const { services, loading: servicesLoading } = useServices();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
  });

  // Filter services to show only the technician's own services
  const myServices = services.filter((service) => {
    return service.technician?.user?.id === user?.id;
  });

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (bookings.length > 0) {
      setStats({
        total: bookings.length,
        pending: bookings.filter((b) => b.status === 'REQUESTED').length,
        accepted: bookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'PAID').length,
        completed: bookings.filter((b) => b.status === 'COMPLETED').length,
      });
    }
  }, [bookings]);

  const pendingBookings = bookings.filter((b) => b.status === 'REQUESTED').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Technician'}!</h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your bookings and services.
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
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
            <p className="text-sm text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pending Requests</h2>
          <Link href="/dashboard/technician/bookings">
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
        ) : pendingBookings.length > 0 ? (
          <div className="space-y-3">
            {pendingBookings.map((booking) => (
              <Link href={`/dashboard/technician/bookings/${booking.id}`} key={booking.id}>
                <div className="cursor-pointer rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.service?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.scheduledAt)} • {formatPrice(booking.totalAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Customer: {booking.customer?.name}
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
            <h3 className="mt-4 text-lg font-medium">No pending requests</h3>
            <p className="mt-1 text-sm text-muted-foreground">Great! All caught up.</p>
          </div>
        )}
      </div>

      {/* Services Summary - Showing only technician's services */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Services</h2>
          <Link href="/dashboard/technician/services">
            <Button variant="ghost" size="sm" className="gap-1">
              Manage <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                <span>{myServices.length} services offered</span>
              </div>
              <Link href="/dashboard/technician/services">
                <Button size="sm" variant="outline">
                  Manage Services
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
