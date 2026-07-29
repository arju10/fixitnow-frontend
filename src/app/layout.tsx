import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/providers/SessionProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FixItNow - Your Trusted Home Service Platform',
  description: 'Book trusted technicians for plumbing, electrical, cleaning, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
