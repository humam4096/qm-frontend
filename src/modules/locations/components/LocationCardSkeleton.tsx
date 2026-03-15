import React from 'react';
import { Skeleton } from '../../../components/ui/skeleton';

export const LocationCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-48 mb-4" />
    </div>
  );
};
