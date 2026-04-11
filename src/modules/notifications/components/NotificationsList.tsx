import { useRef, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { NotificationEmpty } from "./NotificationEmpty";
import { NotificationItem } from "./NotificationItem";
import type { FilterType, Notification } from "../types";
import { useInfiniteScroll } from "../hooks/useInfinateScroll";

interface NotificationsListProps {
  notifications: Notification[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isEmpty: boolean;
  activeFilter: FilterType;
  onRetry: () => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const NotificationsList = ({
  notifications,
  isLoading,
  isError,
  error,
  isEmpty,
  activeFilter,
  onRetry,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: NotificationsListProps) => {
  const scrollRootRef = useRef<HTMLDivElement | null>(null);

  const scrollObserverEnabled =
    hasNextPage &&
    !isFetchingNextPage &&
    !isLoading &&
    !isError &&
    !isEmpty;

  const handleIntersect = useCallback(() => {
    onLoadMore();
  }, [onLoadMore]);

  const loadMoreRef = useInfiniteScroll(
    handleIntersect,
    scrollObserverEnabled,
    scrollRootRef
  );

  return (
    <div
      ref={scrollRootRef}
      className="max-h-[400px] overflow-y-auto space-y-2 p-2"
    >
      {isLoading && (
        <>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Failed to load notifications</p>
            <p className="text-xs text-muted-foreground">
              {error?.message || "Please try again"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && isEmpty && (
        <NotificationEmpty filter={activeFilter} />
      )}

      {!isLoading && !isError && !isEmpty && (
        <>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
          {hasNextPage && (
            <div ref={loadMoreRef} className="">
              {isFetchingNextPage && (
                <div className="">
                  <NotificationSkeleton />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
