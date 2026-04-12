import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MailOpen } from "lucide-react";
import { useMarkAsRead } from "../hooks/useNotifications";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import type { Notification } from "../types";

export const NotificationItem = React.memo(
  ({ notification }: { notification: Notification }) => {
    const navigate = useNavigate();
    const { mutate: markRead } = useMarkAsRead();

    const handleClick = () => {
      if (!notification.is_read) {
        markRead(notification.id);
      }
      navigate(notification.url);
    };

    return (
      <div
        onClick={handleClick}
        className={`
          group relative p-3 rounded-xl cursor-pointer transition-all duration-200
          border border-transparent
          ${notification.is_read
            ? 'bg-card hover:bg-muted/40'
            : 'bg-primary/5 border-primary/20 hover:bg-primary/10'}
        `}
      >
        <div className="flex gap-3">

          {/* Indicator Dot */}
          {!notification.is_read && (
            <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
          )}

          {/* Icon */}
          <div className="mt-0.5 text-muted-foreground">
            {notification.is_read ? (
              <MailOpen className="h-4 w-4" />
            ) : (
              <Mail className="h-4 w-4 text-primary" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">

            <div className="flex items-center justify-between gap-2">

              <p className="text-sm font-medium truncate">
                {notification.title}
              </p>

              <span className="text-[10px] text-muted-foreground shrink-0">
                {formatRelativeTime(notification.created_at)}
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">
              {notification.message}
            </p>

          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-muted/20 transition" />
      </div>
    );
  }
);