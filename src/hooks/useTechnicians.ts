'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import type { TechnicianProfile } from '@/types';
import toast from 'react-hot-toast';

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnicians = useCallback(async (filters?: { search?: string; location?: string }) => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.location) params.location = filters.location;

      const response = await api.get('/technicians', { params });
      if (response.data.success) {
        setTechnicians(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch technicians');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/technicians/availability');
      if (response.data.success) {
        setAvailability(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch availability');
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAvailability = useCallback(
    async (data: any) => {
      try {
        const response = await api.post('/technicians/availability', data);
        if (response.data.success) {
          await fetchAvailability();
          toast.success('Availability slot added');
          return response.data.data;
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to add availability');
        throw err;
      }
    },
    [fetchAvailability]
  );

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

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  return {
    technicians,
    availability,
    loading,
    error,
    fetchTechnicians,
    fetchAvailability,
    addAvailability,
    deleteAvailability,
  };
}
