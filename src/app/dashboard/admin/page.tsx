'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, ArrowRight, Users, Wrench, CreditCard, ShoppingBag } from 'lucide-react';
import { adminApi, AdminStats } from '@/lib/admin';
import { formatDate, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTechnicians: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
    { label: 'Technicians', value: stats.totalTechnicians, icon: Wrench, color: 'purple' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: ShoppingBag, color: 'green' },
    {
      label: 'Revenue',
      value: `$${stats.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: CreditCard,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Admin'}!</h1>
        <p className="mt-1 text-muted-foreground">Here's an overview of the platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 text-center">
                  <div className="mx-auto h-8 w-16 animate-pulse rounded bg-muted/50" />
                  <div className="mx-auto mt-2 h-4 w-20 animate-pulse rounded bg-muted/50" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Link href="/dashboard/admin/bookings">
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
        ) : stats.recentBookings?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentBookings.map((booking: any) => (
              <div key={booking.id} className="rounded-lg border bg-card p-4">
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
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      booking.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : booking.status === 'ACCEPTED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No bookings yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Bookings will appear here once customers start booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
