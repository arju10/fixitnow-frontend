'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { mapTechnician, mapAvailability } from '@/lib/mappers';

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [technician, setTechnician] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all technicians
  const fetchTechnicians = useCallback(async (filters?: { search?: string; location?: string }) => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.location) params.location = filters.location;

      const response = await api.get('/technicians', { params });
      if (response.data.success) {
        const mapped = response.data.data.map(mapTechnician);
        setTechnicians(mapped);
      }
    } catch (err) {
      setError('Failed to fetch technicians');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single technician by ID
  const fetchTechnicianById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/technicians/${id}`);
      if (response.data.success) {
        const mapped = mapTechnician(response.data.data);
        setTechnician(mapped);
        return mapped;
      }
    } catch (err) {
      setError('Failed to fetch technician');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch my technician profile (for authenticated technician)
  const fetchMyProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/technicians/profile');
      if (response.data.success) {
        const mapped = mapTechnician(response.data.data);
        setTechnician(mapped);
        return mapped;
      }
      return null;
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.log('User is not a technician');
      } else {
        setError('Failed to fetch profile');
        console.error('Profile fetch error:', err.response?.data || err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch availability slots
  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/technicians/availability');
      if (response.data.success) {
        const mapped = response.data.data.map(mapAvailability);
        setAvailability(mapped);
        return mapped;
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError('Failed to fetch availability');
      }
      setAvailability([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add availability slot
  const addAvailability = useCallback(
    async (data: any) => {
      try {
        const response = await api.post('/technicians/availability', data);
        if (response.data.success) {
          const mapped = mapAvailability(response.data.data);
          await fetchAvailability();
          toast.success('Availability slot added');
          return mapped;
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to add availability');
        throw err;
      }
    },
    [fetchAvailability]
  );

  // Delete availability slot
  const deleteAvailability = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/technicians/availability/${id}`);
        await fetchAvailability();
        toast.success('Availability slot deleted');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete availability');
        throw err;
      }
    },
    [fetchAvailability]
  );

  // ✅ Update technician profile
  const updateProfile = useCallback(async (data: any) => {
    try {
      const response = await api.put('/technicians/profile', data);
      if (response.data.success) {
        const mapped = mapTechnician(response.data.data);
        setTechnician(mapped);
        toast.success('Profile updated successfully');
        return mapped;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  }, []);

  // Initial load - only if not already loaded
  useEffect(() => {
    if (technicians.length === 0 && !loading) {
      fetchTechnicians();
    }
  }, []);

  return {
    technicians,
    technician,
    availability,
    loading,
    error,
    fetchTechnicians,
    fetchTechnicianById,
    fetchMyProfile,
    fetchAvailability,
    addAvailability,
    deleteAvailability,
    updateProfile,
  };
}
