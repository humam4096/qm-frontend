import { Button } from "@/components/ui/button";
import { MailOpen, Trash2 } from "lucide-react";

export interface NotificationsHeaderProps {
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  isMarkingAllAsRead: boolean;
  isClearingAll: boolean;
}

export const NotificationsHeader = ({
  onMarkAllAsRead,
  onClearAll,
  isMarkingAllAsRead,
  isClearingAll,
}: NotificationsHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">

        {/* Title */}
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <p className="text-xs text-muted-foreground">
            Stay updated with your activity
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">

          <Button
            size="icon"
            variant="ghost"
            onClick={onMarkAllAsRead}
            disabled={isMarkingAllAsRead}
            className="h-8 w-8"
          >
            <MailOpen className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={onClearAll}
            disabled={isClearingAll}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

        </div>
      </div>
    </div>
  );
};