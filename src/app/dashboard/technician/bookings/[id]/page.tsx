'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  PlayCircle,
} from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TechnicianBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { updateBookingStatus } = useBookings();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${params.id}`);
        if (response.data.success) {
          setBooking(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [params.id]);

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true);
    try {
      await updateBookingStatus(params.id as string, status);
      // Refresh booking data
      const response = await api.get(`/bookings/${params.id}`);
      if (response.data.success) {
        setBooking(response.data.data);
      }
      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-64 rounded-lg bg-muted" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">Booking not found</p>
        <Link href="/dashboard/technician/bookings">
          <Button className="mt-4">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const isPending = booking.status === 'REQUESTED';
  const isAccepted = booking.status === 'ACCEPTED' || booking.status === 'PAID';
  const isInProgress = booking.status === 'IN_PROGRESS';
  const isCompleted = booking.status === 'COMPLETED';

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/technician/bookings"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bookings
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{booking.service?.title}</h1>
          <div className="mt-1 flex items-center gap-3">
            <BookingStatusBadge status={booking.status} />
            <span className="text-sm text-muted-foreground">{formatDate(booking.scheduledAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isPending && (
            <>
              <Button
                className="gap-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate('ACCEPTED')}
                disabled={updating}
              >
                <CheckCircle className="h-4 w-4" />
                Accept Booking
              </Button>
              <Button
                variant="destructive"
                className="gap-1"
                onClick={() => handleStatusUpdate('DECLINED')}
                disabled={updating}
              >
                <XCircle className="h-4 w-4" />
                Decline
              </Button>
            </>
          )}
          {isAccepted && (
            <Button
              className="gap-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleStatusUpdate('IN_PROGRESS')}
              disabled={updating}
            >
              <PlayCircle className="h-4 w-4" />
              Start Job
            </Button>
          )}
          {isInProgress && (
            <Button
              className="gap-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusUpdate('COMPLETED')}
              disabled={updating}
            >
              <CheckCircle className="h-4 w-4" />
              Complete Job
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{booking.service?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span>{booking.service?.category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>{booking.service?.durationMins} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-primary">{formatPrice(booking.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {booking.customer?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <p className="font-medium">{booking.customer?.name}</p>
                <p className="text-sm text-muted-foreground">{booking.customer?.email}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.customer?.phone || 'No phone'}
                </p>
              </div>
            </div>
            {booking.notes && (
              <div className="mt-3 rounded-lg bg-muted/30 p-3">
                <p className="text-sm font-medium">Customer Notes</p>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {booking.payment && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`font-medium ${
                    booking.payment.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {booking.payment.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>{formatPrice(booking.payment.amount)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
