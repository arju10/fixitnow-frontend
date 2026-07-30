'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServices } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Clock, User, DollarSign, Calendar, Star } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getService } = useServices();
  const { isAuthenticated, user } = useAuth();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await getService(params.id as string);
        setService(data);
      } catch (err) {
        setError('Service not found');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.id, getService]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-48 rounded bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-500">{error || 'Service not found'}</p>
        <Link href="/services">
          <Button className="mt-4">Back to Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Services
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <Badge className="mt-2">{service.category?.name}</Badge>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(service.price)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{service.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{service.durationMins} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{service.technician?.user?.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technician Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Technician</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {service.technician?.user?.name?.charAt(0) || 'T'}
                </div>
                <div>
                  <p className="font-medium">{service.technician?.user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.technician?.bio || 'Experienced professional'}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {service.technician?.avgRating || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({service.technician?.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Link href={`/technicians/${service.technician?.id}`}>
                <Button variant="outline" className="mt-4 w-full">
                  View Full Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Book This Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-4 text-center">
                <p className="text-2xl font-bold text-primary">{formatPrice(service.price)}</p>
                <p className="text-sm text-muted-foreground">Total price</p>
              </div>

              {isAuthenticated ? (
                <Link href={`/dashboard/customer/bookings/new?serviceId=${service.id}`}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <p className="text-center text-sm text-muted-foreground">
                    Please login to book this service
                  </p>
                  <Link href={`/auth/login?redirect=/services/${service.id}`}>
                    <Button className="w-full" variant="outline">
                      Login to Book
                    </Button>
                  </Link>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Free cancellation up to 24 hours before service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
