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
    <div className="w-full animate-pulse space-y-3 bg-card shadow-sm">
      <Skeleton className="size-12 rounded-full" />
      <Skeleton className="h-[350px] w-[300px] rounded-sm" />
    </div>
  );
}
