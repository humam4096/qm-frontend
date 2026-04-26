import { BellOff } from "lucide-react";
import type { FilterType } from "../types";
import { useTranslation } from "react-i18next";


export const NotificationEmpty = ({filter}: {filter: FilterType}) => {
  const { t } = useTranslation();
  
  const messages = {
    all: {
      primary: t('notifications.noNotifications'),
      secondary: t('notifications.noNotificationsDesc'),
    },
    unread: {
      primary: t('notifications.noUnreadNotifications'),
      secondary: t('notifications.noNotificationsDesc'),
    },
    read: {
      primary: t('notifications.noReadNotifications'),
      secondary: t('notifications.markAsReadToSee'),
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
