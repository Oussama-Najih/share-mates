import { Skeleton } from "@/components/ui/skeleton";

export default function PostsLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </div>
  );
}

function PostLoadingSkeleton() {
  return (
    <div className="w-[70%] max-w-[480px] mx-auto p-4 rounded-md border-2 border-primary/40 bg-card shadow-sm animate-pulse">
      {/* Header (Avatar, Name, Date) */}
      <div className="flex items-center space-x-3 pb-3 border-b-2">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>

      {/* Title */}
      <Skeleton className="h-5 w-48 my-2 rounded-md mx-auto" />

      {/* Image or Attachment */}
      <Skeleton className="h-56 w-full rounded-md" />

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-3">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}
