'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, type ReviewInput } from '@/lib/validations';
import api from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Star, User, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function NewReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      bookingId: bookingId || '',
      rating: 0,
      comment: '',
    },
  });

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        if (response.data.success) {
          setBooking(response.data.data);
          setValue('bookingId', bookingId);
        }
      } catch (error) {
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, setValue]);

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const onSubmit = async (data: ReviewInput) => {
    setSubmitting(true);
    try {
      await api.post('/reviews', data);
      toast.success('Review submitted successfully!');
      router.push(`/dashboard/customer/bookings/${bookingId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
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

  if (!bookingId || !booking) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">No booking selected</p>
        <Link href="/dashboard/customer/bookings">
          <Button className="mt-4">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  // Check if booking is completed
  if (booking.status !== 'COMPLETED') {
    return (
      <div className="space-y-6">
        <Link
          href={`/dashboard/customer/bookings/${bookingId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Booking
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <span className="text-6xl">⏳</span>
            </div>
            <h2 className="text-2xl font-bold text-yellow-600">Booking Not Completed</h2>
            <p className="mt-2 text-muted-foreground">
              You can only leave a review for completed bookings.
            </p>
            <Link href={`/dashboard/customer/bookings/${bookingId}`}>
              <Button className="mt-6">View Booking</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if review already exists
  if (booking.review) {
    return (
      <div className="space-y-6">
        <Link
          href={`/dashboard/customer/bookings/${bookingId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Booking
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <span className="text-6xl">⭐</span>
            </div>
            <h2 className="text-2xl font-bold text-green-600">Review Already Submitted</h2>
            <p className="mt-2 text-muted-foreground">You have already reviewed this booking.</p>
            <Link href={`/dashboard/customer/bookings/${bookingId}`}>
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
        href={`/dashboard/customer/bookings/${bookingId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Booking
      </Link>

      <h1 className="text-2xl font-bold">Write a Review</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Review Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingSelect(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-3xl transition-colors focus:outline-none"
                      >
                        <span
                          className={
                            star <= (hoveredRating || selectedRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Your Review <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <Textarea
                    placeholder="Share your experience with this technician..."
                    {...register('comment')}
                    error={!!errors.comment}
                    disabled={submitting}
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" isLoading={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">
                  🛠️
                </div>
                <div>
                  <p className="font-medium">{booking.service?.title}</p>
                  <p className="text-sm text-muted-foreground">{booking.service?.category?.name}</p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.technician?.user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(booking.scheduledAt)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                <p>⭐ Your review helps other customers make better decisions.</p>
                <p className="mt-1">Reviews are public and cannot be deleted.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
