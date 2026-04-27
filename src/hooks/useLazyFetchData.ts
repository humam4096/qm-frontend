import { useEffect, useState } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export interface LazyFilterDataConfig<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  isOpen: boolean;
  keepAlive?: boolean;
}


export function useLazyFetchData<T>({
  queryKey,
  queryFn,
  isOpen,
  keepAlive = true,
}: LazyFilterDataConfig<T>): UseQueryResult<T, Error> {
  const [shouldFetch, setShouldFetch] = useState(false);

  // Once opened, enable fetching (and keep it enabled if keepAlive is true)
  useEffect(() => {
    if (isOpen && !shouldFetch) {
      setShouldFetch(true);
    }
  }, [isOpen, shouldFetch]);

  return useQuery<T, Error>({
    queryKey,
    queryFn,
    enabled: keepAlive ? shouldFetch : isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes - reasonable cache time for filter options
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for reuse
  });
}
