'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTechnicians } from '@/hooks/useTechnicians';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, MapPin, Star, User } from 'lucide-react';

export default function TechniciansPage() {
  const { technicians, loading, fetchTechnicians } = useTechnicians();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const params: any = {};
    if (search) params.search = search;
    if (location) params.location = location;
    fetchTechnicians(params);
  }, [search, location, fetchTechnicians]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Technicians</h1>

      {/* Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <Input
          type="text"
          placeholder="Search technicians..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:flex-1"
        />
        <Input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="sm:w-48"
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-card p-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="mt-2 h-6 w-32 rounded bg-muted" />
              <div className="mt-2 h-4 w-full rounded bg-muted" />
              <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : technicians.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.map((tech) => (
            <Link href={`/technicians/${tech.id}`} key={tech.id}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {tech.user?.name?.charAt(0) || 'T'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-lg">{tech.user?.name}</CardTitle>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {tech.bio || 'Professional technician'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tech.avgRating || 0}</span>
                    <span className="text-sm text-muted-foreground">
                      ({tech.totalReviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {tech.location || 'Location not specified'}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {tech.experienceYrs || 0} years experience
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-lg">No technicians found</p>
        </div>
      )}
    </div>
  );
}
