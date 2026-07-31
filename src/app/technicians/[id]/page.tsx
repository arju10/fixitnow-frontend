'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Star, MapPin, Briefcase, Clock, User, Calendar } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TechnicianProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { technicians, loading, fetchTechnicians } = useTechnicians();
  const { isAuthenticated } = useAuth();
  const [technician, setTechnician] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadTechnician = async () => {
      try {
        setPageLoading(true);
        // Fetch technicians if not loaded
        if (technicians.length === 0) {
          await fetchTechnicians();
        }

        // Find the technician by ID
        const tech = technicians.find((t: any) => t.id === params.id);
        if (tech) {
          setTechnician(tech);
        } else {
          // If not found in list, fetch directly
          const response = await fetch(`/api/technicians/${params.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setTechnician(data.data);
            }
          }
        }
      } catch (error) {
        toast.error('Failed to load technician profile');
      } finally {
        setPageLoading(false);
      }
    };
    loadTechnician();
  }, [params.id, technicians, fetchTechnicians]);

  if (pageLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Technician Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The technician you're looking for doesn't exist.
        </p>
        <Link href="/technicians">
          <Button className="mt-4">Back to Technicians</Button>
        </Link>
      </div>
    );
  }

  const user = technician.user;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/technicians"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Technicians
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Profile */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                  {user?.name?.charAt(0) || 'T'}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="mt-3 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{technician.avgRating || 0}</span>
                      <span className="text-sm text-muted-foreground">
                        ({technician.totalReviews || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {technician.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {technician.experienceYrs || 0} years experience
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{technician.bio || 'No bio provided'}</p>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              {technician.services && technician.services.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {technician.services.map((service: any) => (
                    <Link href={`/services/${service.id}`} key={service.id}>
                      <div className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{service.title}</h4>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {service.description || 'No description'}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {service.durationMins} min
                            </div>
                          </div>
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No services offered yet</p>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {technician.reviews && technician.reviews.length > 0 ? (
                <div className="space-y-4">
                  {technician.reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.customer?.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Booking CTA */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Book This Technician</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-2xl font-bold text-primary">
                  {technician.services && technician.services.length > 0
                    ? formatPrice(Math.min(...technician.services.map((s: any) => s.price)))
                    : 'N/A'}
                </p>
              </div>

              {isAuthenticated ? (
                <Link href={`/services?technician=${technician.id}`}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <p className="text-center text-sm text-muted-foreground">
                    Please login to book this technician
                  </p>
                  <Link href={`/auth/login?redirect=/technicians/${technician.id}`}>
                    <Button className="w-full" variant="outline">
                      Login to Book
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Free cancellation up to 24 hours before</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
