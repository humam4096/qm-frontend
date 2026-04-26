import React from "react";
import type { FilterType } from "../types";
import { Mail, MailOpen } from "lucide-react";
import { useTranslation } from "react-i18next";


export interface NotificationFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const NotificationFiltersComponent = React.memo(({
  activeFilter,
  onFilterChange,
}: NotificationFiltersProps) => {
  const { t } = useTranslation();
  
  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'unread', label: t('notifications.unread'), icon: <Mail className="h-3.5 w-3.5" /> },
    { key: 'read', label: t('notifications.read'), icon: <MailOpen className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="px-3 py-2 border-b border-border/50 bg-background/60 backdrop-blur-sm">
      <div className="flex gap-2">

        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;

          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}
              `}
            >
              {filter.icon}
              {filter.label}
            </button>
          );
        })}

      </div>
    </div>
  );
});

NotificationFiltersComponent.displayName = "NotificationFiltersComponent";
