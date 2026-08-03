import { Skeleton } from '@/components/ui/Skeleton';

export default function TechnicianDashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Technician Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      {/* Service List & Availability Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="space-y-3 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
