'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import type { Booking } from '@/types';
import { mapBooking } from '@/lib/mappers';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      if (response.data.success) {
        const mapped = response.data.data.map(mapBooking);
        setBookings(mapped);
      }
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingById = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      if (response.data.success) {
        return mapBooking(response.data.data);
      }
      return null;
    } catch (err) {
      throw err;
    }
  }, []);

  const createBooking = useCallback(
    async (data: any) => {
      try {
        console.log('📝 Creating booking with data:', data);
        const response = await api.post('/bookings', data);
        console.log('📝 Booking response:', response.data);
        if (response.data.success) {
          await fetchBookings();
          toast.success('Booking created successfully');
          return mapBooking(response.data.data);
        }
        throw new Error(response.data.message || 'Failed to create booking');
      } catch (err: any) {
        console.error('❌ Booking error:', err.response?.data || err.message);
        toast.error(err.response?.data?.message || 'Failed to create booking');
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
          return mapBooking(response.data.data);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to update booking status');
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
          return mapBooking(response.data.data);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to cancel booking');
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
    getBookingById,
    createBooking,
    updateBookingStatus,
    cancelBooking,
  };
}
