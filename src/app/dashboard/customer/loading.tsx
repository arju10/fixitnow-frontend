import { Skeleton } from '@/components/ui/Skeleton';

export default function CustomerDashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      {/* Bookings Table Skeleton */}
      <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
