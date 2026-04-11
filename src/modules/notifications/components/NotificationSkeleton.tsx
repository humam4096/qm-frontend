import { Skeleton } from "@/components/ui/skeleton";

export const NotificationSkeleton = () => {
  return (
    <div className="p-3 rounded-md bg-white">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-2 w-20" />
    </div>
  );
};
