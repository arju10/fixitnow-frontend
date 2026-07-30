'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Calendar, CreditCard, Star, User, LogOut, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/customer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/customer/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/customer/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/customer/profile', label: 'Profile', icon: User },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
    if (!isLoading && isAuthenticated && role !== 'CUSTOMER') {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, role, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || role !== 'CUSTOMER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar */}
          <aside className="flex-shrink-0 md:w-64">
            <div className="sticky top-20 rounded-xl border bg-card p-4 shadow-sm">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard/customer' && pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
