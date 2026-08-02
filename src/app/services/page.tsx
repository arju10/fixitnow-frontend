'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useServices } from '@/hooks/useServices';
import { useCategories } from '@/hooks/useCategories';
import { useSearch } from '@/hooks/useSearch';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SearchFilters } from '@/components/SearchFilters';
import { ServiceCardSkeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/lib/utils';

export default function ServicesPage() {
  const { services, loading, fetchServices } = useServices();
  const { categories } = useCategories();
  const [allServices, setAllServices] = useState<any[]>([]);

  const { filters, filteredItems, updateFilter, clearFilters, hasFilters } = useSearch(
    allServices,
    ['title', 'description', 'category.name', 'technician.user.name'],
    [
      { key: 'category', type: 'string' },
      { key: 'price', type: 'number' },
      { key: 'avgRating', type: 'number' },
    ]
  );

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (services) {
      setAllServices(services);
    }
  }, [services]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Services</h1>

      {/* Search Filters */}
      <SearchFilters
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
        categories={categories}
        placeholder="Search services by title, description, or technician..."
        showLocation={false}
        showPrice={true}
        showRating={true}
        showStatus={false}
        showDate={false}
        className="mb-6"
      />

      {/* Results Count */}
      {!loading && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'service' : 'services'}
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((service) => (
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
