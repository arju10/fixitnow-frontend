'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingInput } from '@/lib/validations';
import { useServices } from '@/hooks/useServices';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Calendar, Clock, User, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  const { getService } = useServices();
  const { createBooking } = useBookings();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: serviceId || '',
      scheduledAt: '',
      notes: '',
    },
  });

  const scheduledAt = watch('scheduledAt');

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getService(serviceId);
        setService(data);
        setValue('serviceId', serviceId);
      } catch (error) {
        toast.error('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId, getService, setValue]);

  const validateDate = (value: string) => {
    if (!value) {
      setDateError('Please select a date and time');
      return false;
    }
    const selectedDate = new Date(value);
    const now = new Date();
    if (selectedDate < now) {
      setDateError('Please select a future date and time');
      return false;
    }
    setDateError('');
    return true;
  };

  const onSubmit = async (data: BookingInput) => {
    if (!validateDate(data.scheduledAt)) {
      return;
    }

    setSubmitting(true);
    try {
      const formattedData = {
        ...data,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
      };

      console.log('📝 Submitting booking:', formattedData);
      const booking = await createBooking(formattedData);
      toast.success('Booking created successfully!');
      router.push(`/dashboard/customer/bookings/${booking.id}`);
    } catch (error: any) {
      console.error('❌ Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-64 rounded-lg bg-muted" />
      </div>
    );
  }

  if (!serviceId || !service) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">No service selected</p>
        <Link href="/services">
          <Button className="mt-4">Browse Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/services/${serviceId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Service
      </Link>

      <h1 className="text-2xl font-bold">Book This Service</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service</label>
                  <p className="text-muted-foreground">{service.title}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date & Time</label>
                  <Input
                    type="datetime-local"
                    min={`${today}T08:00`}
                    {...register('scheduledAt')}
                    onChange={(e) => {
                      setValue('scheduledAt', e.target.value);
                      validateDate(e.target.value);
                    }}
                    error={!!errors.scheduledAt || !!dateError}
                    disabled={submitting}
                  />
                  {(errors.scheduledAt || dateError) && (
                    <p className="text-sm text-red-500">
                      {errors.scheduledAt?.message || dateError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <Textarea
                    placeholder="Any special requests or instructions..."
                    {...register('notes')}
                    error={!!errors.notes}
                    disabled={submitting}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" isLoading={submitting}>
                  {submitting ? 'Creating Booking...' : 'Confirm Booking'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Service Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">
                  🛠️
                </div>
                <div>
                  <p className="font-medium">{service.title}</p>
                  <p className="text-sm text-muted-foreground">{service.category?.name}</p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{formatPrice(service.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{service.durationMins} minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Technician</span>
                  <span>{service.technician?.user?.name}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>

              <div className="space-y-1 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                <p>⚠️ Your booking will be confirmed once the technician accepts it.</p>
                <p>Free cancellation up to 24 hours before the scheduled time.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
