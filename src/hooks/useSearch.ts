'use client';

import { useState, useCallback, useMemo } from 'react';

export interface SearchFilters {
  query: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchFields: string[],
  filterFields?: { key: keyof T; type: 'string' | 'number' | 'date' | 'status' }[]
) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
  });

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase().trim();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        })
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter((item) => item.category?.name === filters.category);
    }

    // Location filter
    if (filters.location) {
      result = result.filter((item) =>
        item.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Price range filter
    if (filters.minPrice) {
      result = result.filter((item) => (item.price || 0) >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter((item) => (item.price || 0) <= filters.maxPrice!);
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter((item) => (item.avgRating || 0) >= filters.rating!);
    }

    // Status filter
    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter((item) => {
        const date = item.scheduledAt || item.createdAt;
        return date && new Date(date) >= new Date(filters.dateFrom!);
      });
    }
    if (filters.dateTo) {
      result = result.filter((item) => {
        const date = item.scheduledAt || item.createdAt;
        return date && new Date(date) <= new Date(filters.dateTo!);
      });
    }

    return result;
  }, [items, filters, searchFields]);

  // ✅ Fix: Use string parameter to match SearchFilters component
  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ query: '' });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ query: '' });
  }, []);

  return {
    filters,
    filteredItems,
    updateFilter,
    clearFilters,
    resetFilters,
    hasFilters: Object.values(filters).some((v) => v !== '' && v !== undefined && v !== null),
  };
}
