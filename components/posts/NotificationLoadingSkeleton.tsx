import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoadingSkeleton() {
  return (
    <div className="space-y-3">
      <NotificationLoadingSkeleton />
      <NotificationLoadingSkeleton />
      <NotificationLoadingSkeleton />
    </div>
  );
}

function NotificationLoadingSkeleton() {
  return (
    <div className="flex gap-3 rounded-2xl p-5 shadow-sm bg-card animate-pulse">
      {/* Icon Placeholder */}
      <Skeleton className="size-7 rounded" />

      <div className="space-y-3 w-full">
        {/* User Avatar Placeholder */}
        <Skeleton className="size-9 rounded-full" />

        {/* Notification Text Placeholder */}
        <div>
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-48 rounded mt-1" />
        </div>

        {/* Comment Message Placeholder (if applicable) */}
        <Skeleton className="h-4 w-full rounded" />
      </div>
    </div>
  );
}
