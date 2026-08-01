'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { mapBooking } from '@/lib/mappers';

export function useCustomer() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch customer profile
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

  // Update customer profile
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

  // Fetch customer bookings
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

  // Get booking by ID
  const getBookingById = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      if (response.data.success) {
        return mapBooking(response.data.data);
      }
    } catch (err) {
      throw err;
    }
  }, []);

  // Create booking
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

  // Cancel booking
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

  // Leave review
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

  // Get reviews for technician
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

  // Initial load
  useEffect(() => {
    if (!profile && !loading) {
      fetchProfile();
    }
  }, []);

  return {
    profile,
    bookings,
    loading,
    error,
    fetchProfile,
    updateProfile,
    fetchBookings,
    getBookingById,
    createBooking,
    cancelBooking,
    leaveReview,
    getTechnicianReviews,
  };
}
