import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { NotificationAPI } from "../api/notifications.api";
import type { NotificationFilters } from "../types";

export const useNotifications = (filters: NotificationFilters) => {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => NotificationAPI.getNotifications(filters),
    refetchInterval: 30000, // auto refresh every 30s
    staleTime: 10000, // consider data stale after 10s
  });
};

type UseNotificationsInfiniteOptions = {
  enabled?: boolean;
};

export const useNotificationsInfinite = (
  filters: NotificationFilters,
  options?: UseNotificationsInfiniteOptions
) => {
  const enabled = options?.enabled ?? true;

  return useInfiniteQuery({
    queryKey: ["notifications", filters],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await NotificationAPI.getNotifications({
        ...filters,
        page: pageParam,
      });
      return res;
    },

    getNextPageParam: (lastPage) => {
      return lastPage.pagination.has_more
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled,
  });
};

export const useNotificationsCount = () => {
  return useQuery({
    queryKey: ["notifications-count"],
    queryFn: () => NotificationAPI.getNotificationsCount(),
    refetchInterval: 30000, // auto refresh every 30s
    staleTime: 10000, // consider data stale after 10s
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: NotificationAPI.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((n: any) => ({
                ...n,
                is_read: true,
              })),
            })),
          };
        }
      );
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: NotificationAPI.deleteAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => NotificationAPI.markAsRead(id),

    // OPTIMISTIC UPDATE
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["notifications"] });

      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((n: any) =>
                n.id === id ? { ...n, is_read: true } : n
              ),
            })),
          };
        }
      );

      return { previousData };
    },

    // ROLLBACK IF ERROR
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    // FINAL SYNC (OPTIONAL but recommended)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });
};

// export const useMarkAsRead = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: number | string) => NotificationAPI.markAsRead(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//       queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
//     },
//   });
// };
