'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import type { Service, ServiceFilters } from '@/types';

export function useServices(filters?: ServiceFilters) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(
    async (params?: any) => {
      setLoading(true);
      try {
        const response = await api.get('/services', { params: { ...filters, ...params } });
        if (response.data.success) {
          setServices(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const getService = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/services/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    fetchServices,
    getService,
  };
}
