'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, RefreshCw, Calendar, X } from 'lucide-react';
import { adminApi } from '@/lib/admin';
import toast from 'react-hot-toast';
import { formatDate, formatPrice } from '@/lib/utils';

interface Booking {
  id: string;
  service: { title: string };
  customer: { name: string; email: string };
  technician: { user: { name: string } };
  scheduledAt: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (search.trim() !== '') {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.service?.title?.toLowerCase().includes(query) ||
          b.customer?.name?.toLowerCase().includes(query) ||
          b.customer?.email?.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [search, bookings, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'destructive';
      case 'ACCEPTED':
        return 'info';
      case 'PAID':
        return 'purple';
      case 'IN_PROGRESS':
        return 'success';
      default:
        return 'warning';
    }
  };

  const statusOptions = [
    { value: 'REQUESTED', label: 'Requested' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'DECLINED', label: 'Declined' },
    { value: 'PAID', label: 'Paid' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all bookings on the platform
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchBookings} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by service or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {(search || statusFilter) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/50" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Technician
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b transition-colors last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {booking.service?.title || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {booking.customer?.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {booking.technician?.user?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(booking.scheduledAt)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatPrice(booking.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || statusFilter
              ? 'Try adjusting your filters'
              : 'No bookings on the platform yet'}
          </p>
        </div>
      )}
    </div>
  );
}
