'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import type { TechnicianProfile } from '@/types';

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
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

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  return {
    technicians,
    loading,
    error,
    fetchTechnicians,
  };
}
