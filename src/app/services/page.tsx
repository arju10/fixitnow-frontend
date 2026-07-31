'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useServices } from '@/hooks/useServices';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, Filter, X, User } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ServiceCardSkeleton } from '@/components/ui/Skeleton';

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const technicianId = searchParams.get('technicianId') || '';

  const { services, loading, fetchServices } = useServices();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params: any = {};
    if (search) params.search = search;
    if (selectedCategory) params.categoryId = selectedCategory;
    if (technicianId) params.technicianId = technicianId;
    fetchServices(params);
  }, [search, selectedCategory, technicianId, fetchServices]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    router.push('/services');
  };

  const getTechnicianName = () => {
    if (services.length > 0 && services[0]?.technician?.user?.name) {
      return services[0].technician.user.name;
    }
    return null;
  };

  const technicianName = getTechnicianName();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          {technicianId && technicianName && (
            <p className="text-sm text-muted-foreground">
              Showing services by <span className="font-medium">{technicianName}</span>
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      <div className={`${showFilters ? 'block' : 'hidden md:block'} mb-6`}>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Search</label>
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {technicianId && (
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push('/services');
                      clearFilters();
                    }}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear Technician Filter
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
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
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {service.technician?.user?.name || 'Unknown'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <p className="text-lg text-muted-foreground">No services found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {technicianId ? 'This technician has no services yet' : 'Try adjusting your filters'}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
