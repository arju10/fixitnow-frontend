'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🔧</span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold text-transparent">
                FixItNow
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your trusted home service platform. Book qualified professionals for plumbing,
              electrical, cleaning, and more.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.048 1.407-.06 4.123-.06h.08zm-7.802 8.96a5.013 5.013 0 006.689 4.998 5.013 5.013 0 003.562-3.56 5.013 5.013 0 00-4.998-6.689 5.013 5.013 0 00-5.253 5.251z"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services?category=Plumbing"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Plumbing
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=Electrical"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Electrical
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=Cleaning"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Cleaning
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=Painting"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Painting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@fixitnow.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +880 1711-111111
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} FixItNow. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
