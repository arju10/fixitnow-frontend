'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useServices } from '@/hooks/useServices';
import { useTechnicians } from '@/hooks/useTechnicians';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ServiceCardSkeleton } from '@/components/ui/Skeleton';
import { Search, Users, Wrench, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Service } from '@/types';

export default function HomePage() {
  const { services, loading: servicesLoading } = useServices();
  const { technicians, loading: techniciansLoading } = useTechnicians();
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);

  useEffect(() => {
    if (services && services.length > 0) {
      setFeaturedServices(services.slice(0, 6));
    }
  }, [services]);

  const stats = [
    { label: 'Services Available', value: services.length || 0, icon: Wrench },
    { label: 'Trusted Technicians', value: technicians.length || 0, icon: Users },
    { label: 'Happy Customers', value: '500+', icon: Star },
  ];

  const features = [
    {
      title: 'Browse Services',
      description: 'Explore a wide range of home services from trusted professionals.',
      icon: Search,
    },
    {
      title: 'Book Instantly',
      description: 'Choose your preferred time slot and book with just a few clicks.',
      icon: CheckCircle,
    },
    {
      title: 'Secure Payments',
      description: 'Pay securely through Stripe with complete peace of mind.',
      icon: Star,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              🔧 Your Trusted Home Service Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Professional Home Services
              <br />
              <span className="text-primary">At Your Fingertips</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Book qualified professionals for plumbing, electrical, cleaning, painting, and more.
              Reliable service, guaranteed satisfaction.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/services">
                <Button size="lg" className="gap-2">
                  <Search className="h-4 w-4" />
                  Find Services
                </Button>
              </Link>
              <Link href="/technicians">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Browse Technicians
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="mx-auto h-8 w-8 text-primary" />
                  <div className="mt-2 text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Why Choose FixItNow?</h2>
            <p className="mt-2 text-muted-foreground">
              We make it easy to find and book trusted home service professionals
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 p-3">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="mt-2 text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Featured Services</h2>
              <p className="text-sm text-muted-foreground">Handpicked services for you</p>
            </div>
            <Link href="/services">
              <Button variant="ghost" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service: Service) => (
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
            <div className="py-12 text-center text-muted-foreground">
              <p>No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-primary-foreground/80">
            Join thousands of satisfied customers who trust FixItNow for their home service needs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
