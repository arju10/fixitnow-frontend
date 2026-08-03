'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-4 text-red-600">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Something went wrong!</h1>
      <p className="mb-8 max-w-md text-gray-500">
        We apologize for the inconvenience. Please try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          Try again
        </button>
        <Link href="/">
          <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition hover:bg-gray-50">
            Go home
          </button>
        </Link>
      </div>
    </div>
  );
}
