'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCustomer } from '@/hooks/useCustomer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { ArrowLeft, CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentApi } from '@/lib/payment';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { getBookingById } = useCustomer();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>(
    'idle'
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(params.id as string);

        // ✅ Check if data exists before accessing properties
        if (!data) {
          toast.error('Booking not found');
          setLoading(false);
          return;
        }

        setBooking(data);

        // Check if already paid
        if (
          data.status === 'PAID' ||
          data.status === 'IN_PROGRESS' ||
          data.status === 'COMPLETED'
        ) {
          setPaymentStatus('success');
        }
      } catch (error) {
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [params.id, getBookingById]);

  const handlePayment = async () => {
    if (!booking) {
      toast.error('Booking data not available');
      return;
    }

    setProcessing(true);
    setPaymentStatus('processing');

    try {
      // 1. Create payment intent
      const payment = await paymentApi.createPayment({
        bookingId: params.id as string,
        amount: booking.totalAmount,
      });

      setTransactionId(payment.transactionId);

      // 2. Confirm payment
      const confirmed = await paymentApi.confirmPayment(payment.transactionId);

      if (confirmed.status === 'COMPLETED') {
        setPaymentStatus('success');
        toast.success('Payment successful!');

        // Refresh booking data
        const updated = await getBookingById(params.id as string);
        if (updated) {
          setBooking(updated);
        }

        // Redirect to booking details after a moment
        setTimeout(() => {
          router.push(`/dashboard/customer/bookings/${params.id}`);
        }, 2000);
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (error: any) {
      setPaymentStatus('error');
      toast.error(
        error.response?.data?.message || error.message || 'Payment failed. Please try again.'
      );
    } finally {
      setProcessing(false);
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

  // Check if payment is already completed
  if (
    booking.status === 'PAID' ||
    booking.status === 'IN_PROGRESS' ||
    booking.status === 'COMPLETED'
  ) {
    return (
      <div className="space-y-6">
        <Link
          href={`/dashboard/customer/bookings/${params.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Booking
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Payment Already Completed</h2>
            <p className="mt-2 text-muted-foreground">This booking has already been paid for.</p>
            <Link href={`/dashboard/customer/bookings/${params.id}`}>
              <Button className="mt-6">View Booking</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if booking is in correct state for payment
  if (booking.status !== 'ACCEPTED') {
    return (
      <div className="space-y-6">
        <Link
          href={`/dashboard/customer/bookings/${params.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Booking
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-16 w-16 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-yellow-600">Payment Not Available</h2>
            <p className="mt-2 text-muted-foreground">
              This booking is currently <strong>{booking.status}</strong>. Payment is only available
              for <strong>ACCEPTED</strong> bookings.
            </p>
            <Link href={`/dashboard/customer/bookings/${params.id}`}>
              <Button className="mt-6">View Booking</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/customer/bookings/${params.id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Booking
      </Link>

      <h1 className="text-2xl font-bold">Complete Payment</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Status */}
              {paymentStatus === 'success' && (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Payment Successful!</p>
                    <p className="text-sm">Redirecting to booking details...</p>
                  </div>
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Payment Failed</p>
                    <p className="text-sm">Please try again or use a different payment method.</p>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{booking.service?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technician</span>
                  <span>{booking.technician?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{formatDate(booking.scheduledAt)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <div className="space-y-3">
                {paymentStatus === 'idle' && (
                  <Button
                    onClick={handlePayment}
                    className="h-12 w-full gap-2 text-base font-medium"
                    disabled={processing}
                  >
                    <CreditCard className="h-5 w-5" />
                    Pay {formatPrice(booking.totalAmount)}
                  </Button>
                )}

                {paymentStatus === 'processing' && (
                  <div className="py-4 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Processing your payment...</p>
                  </div>
                )}

                {paymentStatus === 'error' && (
                  <Button
                    onClick={handlePayment}
                    className="h-12 w-full text-base font-medium"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Secure payment processed by Stripe</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono text-xs">{booking.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(booking.createdAt)}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Amount Due</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
