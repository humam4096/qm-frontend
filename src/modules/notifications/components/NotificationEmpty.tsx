import { BellOff } from "lucide-react";
import type { FilterType } from "../types";


export const NotificationEmpty = ({filter}: {filter: FilterType}) => {
  const messages = {
    all: {
      primary: "No notifications yet",
      secondary: "You're all caught up!",
    },
    unread: {
      primary: "No unread notifications",
      secondary: "You're all caught up!",
    },
    read: {
      primary: "No read notifications",
      secondary: "Mark notifications as read to see them here",
    },
  };

  const { primary, secondary } = messages[filter];

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <BellOff className="h-12 w-12 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{primary}</p>
        <p className="text-xs text-muted-foreground">{secondary}</p>
      </div>
    </div>
  );
};
