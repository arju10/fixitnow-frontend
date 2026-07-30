'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import type { Service, ServiceFilters } from '@/types';
import toast from 'react-hot-toast';

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

  const createService = useCallback(
    async (data: any) => {
      try {
        const response = await api.post('/services', data);
        if (response.data.success) {
          await fetchServices();
          toast.success('Service created successfully');
          return response.data.data;
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to create service');
        throw err;
      }
    },
    [fetchServices]
  );

  const updateService = useCallback(
    async (id: string, data: any) => {
      try {
        const response = await api.put(`/services/${id}`, data);
        if (response.data.success) {
          await fetchServices();
          toast.success('Service updated successfully');
          return response.data.data;
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to update service');
        throw err;
      }
    },
    [fetchServices]
  );

  const deleteService = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/services/${id}`);
        await fetchServices();
        toast.success('Service deleted successfully');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete service');
        throw err;
      }
    },
    [fetchServices]
  );

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    fetchServices,
    getService,
    createService,
    updateService,
    deleteService,
  };
}
