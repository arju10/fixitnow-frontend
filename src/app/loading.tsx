import { Skeleton } from '@/components/ui/Skeleton';

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-20">
      <div className="w-full max-w-4xl space-y-6">
        {/* Hero Section Skeleton */}
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-64 rounded-full" />
          <Skeleton className="mx-auto h-6 w-96" />
        </div>

        {/* Services Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
