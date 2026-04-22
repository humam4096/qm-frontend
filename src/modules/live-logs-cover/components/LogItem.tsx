// components/LogItem.tsx

import type { Log } from "../types";
import { Card } from "@/components/ui/card";

interface LogItemProps {
  log: Log;
}

export const LogItem = ({ log }: LogItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{log.action}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{log.model}</span>
            {log.model_id && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">ID: {log.model_id}</span>
              </>
            )}
          </div>
          {log.user && (
            <div className="text-xs text-muted-foreground">
              by {log.user.name} ({log.user.email})
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            {log.ip_address}
          </div>
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(log.created_at)}
        </div>
      </div>
    </Card>
  );
};
