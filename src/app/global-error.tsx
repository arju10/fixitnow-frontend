'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // Next.js 16 requires these tags here for global errors!
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Critical Error</h1>
          <p className="mb-8 text-gray-600">
            Something went terribly wrong. Please refresh the page.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
