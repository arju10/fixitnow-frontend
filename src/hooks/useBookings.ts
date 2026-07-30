'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import type { Booking } from '@/types';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(
    async (data: any) => {
      try {
        const response = await api.post('/bookings', data);
        if (response.data.success) {
          await fetchBookings();
          return response.data.data;
        }
      } catch (err) {
        toast.error('Failed to create booking');
        throw err;
      }
    },
    [fetchBookings]
  );

  const updateBookingStatus = useCallback(
    async (bookingId: string, status: string) => {
      try {
        const response = await api.patch(`/bookings/${bookingId}/status`, { status });
        if (response.data.success) {
          toast.success(`Booking ${status.toLowerCase()} successfully`);
          await fetchBookings();
          return response.data.data;
        }
      } catch (err) {
        toast.error('Failed to update booking status');
        throw err;
      }
    },
    [fetchBookings]
  );

  const cancelBooking = useCallback(
    async (bookingId: string) => {
      try {
        const response = await api.patch(`/bookings/${bookingId}/cancel`);
        if (response.data.success) {
          toast.success('Booking cancelled successfully');
          await fetchBookings();
          return response.data.data;
        }
      } catch (err) {
        toast.error('Failed to cancel booking');
        throw err;
      }
    },
    [fetchBookings]
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
  };
}
