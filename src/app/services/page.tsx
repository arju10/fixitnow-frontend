'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useServices } from '@/hooks/useServices';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, Filter, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ServiceCardSkeleton } from '@/components/ui/Skeleton';

export default function ServicesPage() {
  const { services, loading, fetchServices } = useServices();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    let filtered = services;

    if (search.trim() !== '') {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query) ||
          s.category?.name?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((s) => s.categoryId === selectedCategory);
    }

    if (minPrice) {
      filtered = filtered.filter((s) => s.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((s) => s.price <= parseFloat(maxPrice));
    }

    setFilteredServices(filtered);
  }, [search, selectedCategory, minPrice, maxPrice, services]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Services</h1>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-48"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="sm:w-32"
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="sm:w-32"
          />
        </div>
        {(search || selectedCategory || minPrice || maxPrice) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Link href={`/services/${service.id}`} key={service.id}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1 text-lg">{service.title}</CardTitle>
                    <span className="rounded bg-muted px-2 py-1 text-sm text-muted-foreground">
                      {service.category?.name}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {service.description || 'No description available'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {service.durationMins} min
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    By: {service.technician?.user?.name || 'Unknown'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <p className="text-lg text-muted-foreground">No services found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
