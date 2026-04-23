// components/LogItem.tsx

import type { Complaint } from "@/modules/complaints/types";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { formatRelativeTime } from "@/modules/notifications/utils";

interface LogItemProps {
  log: Complaint;
  index: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    open: "bg-yellow-500/10 text-yellow-600",
    in_progress: "bg-green-500/10 text-green-600",
    resolved: "bg-blue-500/10 text-blue-600",
    closed: "bg-red-500/10 text-red-600",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${map[status] || "bg-muted"}`}>
      {status}
    </span>
  );
};

const KitchenBadge = ({ kitchen }: { kitchen: string }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Kitchen:</span>
      <span className="flex items-center text-[10px] px-4 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
        {kitchen}
      </span>
      <span className="text-xs text-muted-foreground">•</span>
    </div>
  );
};

export const LogItem = ({ log, index }: LogItemProps) => {
  
  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex flex-col gap-4">
        <div className="w-full flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">#</span>
            <span className="text-xs text-muted-foreground">{index + 1}</span>
            <span className="text-xs text-muted-foreground">•</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Type:</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{log.complaint_type.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Status:
            </span>
            <StatusBadge status={log.status} />
            <span className="text-xs text-muted-foreground">•</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Priority:
            </span>
            <PriorityBadge status={log.priority} />
            <span className="text-xs text-muted-foreground">•</span>
          </div>
          {log.raised_by && (
            <div className="flex items-center text-xs text-muted-foreground">
              by {log.raised_by.name} {log.raised_by.role}
            </div>
          )}
          <span className="text-xs text-muted-foreground">•</span>
          <KitchenBadge kitchen={log.kitchen.name} />
          <div className="text-xs text-muted-foreground min-w-26x ml-auto">
            {formatRelativeTime(log.created_at)}
          </div>
        </div>
        <div className="text-xs text-muted-foreground min-w-0 whitespace-nowrap truncate">
          <span className="text-xs text-muted-foreground">Description: </span>
          {log.description}
        </div>
 
      </div>
    </Card>
  );
};
