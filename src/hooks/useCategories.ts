'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import type { Category } from '@/types';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (data: { name: string; description?: string }) => {
      try {
        const response = await api.post('/categories', data);
        if (response.data.success) {
          await fetchCategories();
          toast.success('Category created successfully');
          return response.data.data;
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to create category');
        throw err;
      }
    },
    [fetchCategories]
  );

  const updateCategory = useCallback(
    async (id: string, data: { name: string; description?: string }) => {
      try {
        const response = await api.put(`/categories/${id}`, data);
        if (response.data.success) {
          await fetchCategories();
          toast.success('Category updated successfully');
          return response.data.data;
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to update category');
        throw err;
      }
    },
    [fetchCategories]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/categories/${id}`);
        await fetchCategories();
        toast.success('Category deleted successfully');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete category');
        throw err;
      }
    },
    [fetchCategories]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
