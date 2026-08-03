import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 text-center">
      <div className="mb-6 text-8xl font-bold text-blue-600">404</div>
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mb-8 max-w-md text-gray-500">
        Oops! The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Go back home
      </Link>
    </div>
  );
}
