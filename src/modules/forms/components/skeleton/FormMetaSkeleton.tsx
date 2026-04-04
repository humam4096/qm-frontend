import { Skeleton } from "@/components/ui/skeleton";

export const FormMetaSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Selects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Switch */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </div>
  );
};