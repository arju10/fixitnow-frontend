'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Home, Briefcase, Users, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/services', label: 'Services', icon: Briefcase },
    { href: '/technicians', label: 'Technicians', icon: Users },
  ];

  const getDashboardLink = () => {
    if (role === 'CUSTOMER') return '/dashboard/customer';
    if (role === 'TECHNICIAN') return '/dashboard/technician';
    if (role === 'ADMIN') return '/dashboard/admin';
    return '/';
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-primary text-xl font-bold">FixItNow</span>
          <span className="text-muted-foreground hidden text-sm font-medium sm:inline">🔧</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                pathname === href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              href={getDashboardLink()}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                pathname.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="text-muted-foreground text-sm font-medium">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-background space-y-3 border-t p-4 md:hidden">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-primary flex items-center space-x-2 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              href={getDashboardLink()}
              className="hover:text-primary flex items-center space-x-2 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Dashboard</span>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <div className="text-muted-foreground border-t pt-2 text-sm font-medium">
                {user?.name} ({role})
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-destructive hover:text-destructive/80 flex w-full items-center space-x-2 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 border-t pt-2">
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Register</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
