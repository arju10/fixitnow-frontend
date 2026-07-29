'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-primary text-lg font-bold">FixItNow</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Your trusted home service platform. Book qualified professionals for plumbing,
              electrical, cleaning, and more.
            </p>
          </div>

          <div>
            <h4 className="font-medium">Services</h4>
            <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
              <li>
                <Link href="/services?category=Plumbing" className="hover:text-primary">
                  Plumbing
                </Link>
              </li>
              <li>
                <Link href="/services?category=Electrical" className="hover:text-primary">
                  Electrical
                </Link>
              </li>
              <li>
                <Link href="/services?category=Cleaning" className="hover:text-primary">
                  Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services?category=Painting" className="hover:text-primary">
                  Painting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Company</h4>
            <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Quick Links</h4>
            <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
              <li>
                <Link href="/auth/login" className="hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-primary">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 border-t pt-4 text-center text-sm">
          &copy; {currentYear} FixItNow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
