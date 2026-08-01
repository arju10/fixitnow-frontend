'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCustomer } from '@/hooks/useCustomer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { ArrowLeft, Calendar, User, DollarSign, CreditCard, MessageSquare } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CustomerBookingDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const { getBookingById, cancelBooking } = useCustomer();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(params.id as string);
        setBooking(data);
      } catch (error) {
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [params.id, getBookingById]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setCancelling(true);
    try {
      await cancelBooking(params.id as string);
      const updated = await getBookingById(params.id as string);
      setBooking(updated);
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
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
        <Link href="/dashboard/customer/bookings">
          <Button className="mt-4">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const canCancel = ['REQUESTED', 'ACCEPTED', 'PAID'].includes(booking.status);
  const canPay = booking.status === 'ACCEPTED';
  const canReview = booking.status === 'COMPLETED' && !booking.review;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/customer/bookings"
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
          {canPay && (
            <Link href={`/dashboard/customer/bookings/${booking.id}/pay`}>
              <Button>Pay Now</Button>
            </Link>
          )}
          {canCancel && (
            <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
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
            <CardTitle className="text-lg">Technician</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {booking.technician?.user?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <p className="font-medium">{booking.technician?.user?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.technician?.bio || 'Professional technician'}
                </p>
              </div>
            </div>
            {booking.notes && (
              <div className="mt-3 rounded-lg bg-muted/30 p-3">
                <p className="text-sm font-medium">Notes</p>
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
              {booking.payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid At</span>
                  <span>{formatDate(booking.payment.paidAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {canReview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leave a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/dashboard/customer/reviews/new?bookingId=${booking.id}`}>
              <Button className="w-full">Write a Review</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
