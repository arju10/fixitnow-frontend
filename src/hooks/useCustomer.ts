'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { mapBooking } from '@/lib/mappers';

export function useCustomer() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/customer/profile');
      if (response.data.success) {
        setProfile(response.data.data);
        return response.data.data;
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.log('Customer profile not found');
      } else {
        setError('Failed to fetch profile');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    try {
      const response = await api.put('/customer/profile', data);
      if (response.data.success) {
        setProfile(response.data.data);
        toast.success('Profile updated successfully');
        return response.data.data;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      if (response.data.success) {
        const mapped = response.data.data.map(mapBooking);
        setBookings(mapped);
        return mapped;
      }
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      console.log('💰 Fetching payments...');
      const response = await api.get('/payments');
      console.log('💰 Payments response:', response.data);
      if (response.data.success) {
        setPayments(response.data.data || []);
        return response.data.data;
      } else {
        console.log('💰 No payments found or error:', response.data.message);
        setPayments([]);
        return [];
      }
    } catch (err: any) {
      console.error('💰 Error fetching payments:', err.response?.data || err.message);
      setError('Failed to fetch payments');
      setPayments([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingById = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      if (response.data.success && response.data.data) {
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
        const response = await api.post('/bookings', data);
        if (response.data.success) {
          await fetchBookings();
          toast.success('Booking created successfully');
          return mapBooking(response.data.data);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to create booking');
        throw err;
      }
    },
    [fetchBookings]
  );

  const cancelBooking = useCallback(
    async (bookingId: string) => {
      try {
        const response = await api.post(`/bookings/${bookingId}/cancel`);
        if (response.data.success) {
          await fetchBookings();
          toast.success('Booking cancelled successfully');
          return mapBooking(response.data.data);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to cancel booking');
        throw err;
      }
    },
    [fetchBookings]
  );

  const leaveReview = useCallback(
    async (data: { bookingId: string; rating: number; comment?: string }) => {
      try {
        const response = await api.post('/reviews', data);
        if (response.data.success) {
          toast.success('Review submitted successfully');
          return response.data.data;
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to submit review');
        throw err;
      }
    },
    []
  );

  const getTechnicianReviews = useCallback(async (technicianId: string) => {
    try {
      const response = await api.get(`/reviews/technician/${technicianId}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!profile && !loading) {
      fetchProfile();
    }
  }, []);

  return {
    profile,
    bookings,
    payments,
    loading,
    error,
    fetchProfile,
    updateProfile,
    fetchBookings,
    fetchPayments,
    getBookingById,
    createBooking,
    cancelBooking,
    leaveReview,
    getTechnicianReviews,
  };
}
