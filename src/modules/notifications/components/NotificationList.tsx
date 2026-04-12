import { useDeleteAllNotifications, useMarkAllAsRead } from '../hooks/useNotifications';
import type { Notification } from '../types';
import { NotificationItem } from './NotificationItem';

export const NotificationList = ({ notifications }: { notifications: Notification[] }) => {
  const { mutate: markAll } = useMarkAllAsRead();
  const { mutate: deleteAll } = useDeleteAllNotifications();

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-3 space-y-2">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Notifications</h4>
        <div className="flex gap-2">
          <button onClick={() => markAll()} className="text-xs text-blue-500">
            Mark all read
          </button>
          <button onClick={() => deleteAll()} className="text-xs text-red-500">
            Clear
          </button>
        </div>
      </div>

      {/* List */}
      {notifications.length === 0 && (
        <p className="text-sm text-muted-foreground">No notifications</p>
      )}

      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
};