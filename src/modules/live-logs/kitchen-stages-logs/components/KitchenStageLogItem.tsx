import type { KitchenStageLog } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/components/dashboard/formatRelativeTime";

interface KitchenStageLogItemProps {
  log: KitchenStageLog;
  index: number;
}

export const KitchenStageLogItem = ({ log, index }: KitchenStageLogItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      case "in_progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "paused":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card
      className="p-4 animate-in fade-in slide-in-from-top-2 duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate">
                {log.stage_name}
              </h3>
              <Badge variant="outline" className={getStatusColor(log.status)}>
                {log.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kitchen: {log.kitchen_name}
            </p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(log.updated_at)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{log.progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(log.progress)}`}
              style={{ width: `${log.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Started:</span>
            <span className="ml-1 font-medium">
              {new Date(log.started_at).toLocaleString()}
            </span>
          </div>
          {log.completed_at && (
            <div>
              <span className="text-muted-foreground">Completed:</span>
              <span className="ml-1 font-medium">
                {new Date(log.completed_at).toLocaleString()}
              </span>
            </div>
          )}
          {log.updated_by && (
            <div>
              <span className="text-muted-foreground">Updated by:</span>
              <span className="ml-1 font-medium">{log.updated_by.name}</span>
            </div>
          )}
        </div>

        {log.notes && (
          <div className="text-xs bg-muted/50 p-2 rounded">
            <span className="text-muted-foreground">Notes:</span>
            <span className="ml-1">{log.notes}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
