import { useState, useCallback } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsHeader } from "./NotificationsHeader";
import { NotificationsList } from "./NotificationsList";
import { DeleteAllDialog } from "./DeleteAllDialog";
import { NotificationDialog } from "./NotificationDialog";
import {
  useMarkAllAsRead,
  useDeleteAllNotifications,
  useNotificationsCount,
  useNotificationsInfinite,
} from "../hooks/useNotifications";
import { NotificationFiltersComponent } from "./NotificationFilters";
import { extractFormSubmissionId } from "../utils/extractFormSubmissionId";
import type { FilterType, Notification } from "../types";


export const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Dialog state for form submission
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedFormSubmissionId, setSelectedFormSubmissionId] = useState<string | null>(null);

  const {
    data: notificationsInfiniteData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading: isNotificationsInfiniteLoading, 
    isError: isNotificationsInfiniteError, 
    error: notificationsInfiniteError,
    refetch: refetchNotifications
  } = useNotificationsInfinite({ filter: activeFilter }, { enabled: isOpen });

  const notificationsData =
    notificationsInfiniteData?.pages.flatMap((page) => page.data) || [];

  const { data: notificationsCountData } = useNotificationsCount();
  const unreadCount = notificationsCountData?.data?.unread_count || null;

  // Mutations
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteAllMutation = useDeleteAllNotifications();

  // Handlers
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleClearAll = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteAllMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRetry = () => {
    refetchNotifications();
  };

  const handleNotificationClick = useCallback((notification: Notification) => {
    const formSubmissionId = extractFormSubmissionId(notification.url);
    
    if (formSubmissionId) {
      setIsOpen(false);
      setSelectedFormSubmissionId(String(formSubmissionId));
      setShowFormDialog(true);
    }
  }, []);

  const handleDialogClose = useCallback((open: boolean) => {
    setShowFormDialog(open);
    if (!open) {
      // Cleanup state when dialog closes
      setSelectedFormSubmissionId(null);
    }
  }, []);

  const isEmpty =
    isOpen &&
    !isNotificationsInfiniteLoading &&
    !isNotificationsInfiniteError &&
    notificationsData.length === 0;

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger>
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount && unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[400px] max-w-[calc(100vw-2rem)] p-0"
        >
          <NotificationsHeader
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
            isMarkingAllAsRead={markAllAsReadMutation.isPending}
            isClearingAll={deleteAllMutation.isPending}
          />

          <NotificationFiltersComponent
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />

          <NotificationsList
            notifications={notificationsData}
            isLoading={isNotificationsInfiniteLoading}
            isError={isNotificationsInfiniteError}
            error={notificationsInfiniteError}
            isEmpty={isEmpty}
            activeFilter={activeFilter}
            onLoadMore={handleLoadMore}
            onRetry={handleRetry}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            onNotificationClick={handleNotificationClick}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAllDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteAllMutation.isPending}
        error={deleteAllMutation.error}
      />

      <NotificationDialog
        open={showFormDialog}
        onOpenChange={handleDialogClose}
        formSubmissionId={selectedFormSubmissionId}
      />
    </>
  );
};
