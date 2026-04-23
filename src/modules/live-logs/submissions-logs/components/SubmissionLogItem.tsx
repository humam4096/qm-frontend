import type { SubmissionLog } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/components/dashboard/formatRelativeTime";

interface SubmissionLogItemProps {
  log: SubmissionLog;
  index: number;
}

export const SubmissionLogItem = ({ log, index }: SubmissionLogItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "under_supervisor_review":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "under_quality_manager_review":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "approved_by_quality_manager":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getApprovalColor = (approval: string) => {
    switch (approval) {
      case "accepted":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
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
                {log.form?.name || log.form_type}
              </h3>
              <Badge variant="outline" className={getStatusColor(log.status)}>
                {log.status.replace(/_/g, " ")}
              </Badge>
              <Badge variant="outline" className={getApprovalColor(log.branch_approval)}>
                {log.branch_approval}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kitchen: {log.kitchen?.name || "N/A"}
            </p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(log.created_at)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Score:</span>
            <span className="ml-1 font-medium">{log.score}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Submitted by:</span>
            <span className="ml-1 font-medium">{log.submitted_by?.name || "N/A"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Time Slot:</span>
            <span className="ml-1 font-medium">{log.time?.label || "N/A"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Inspection Date:</span>
            <span className="ml-1 font-medium">{log.inspection_date}</span>
          </div>
        </div>

        {log.branch_approval_notes && (
          <div className="text-xs bg-muted/50 p-2 rounded">
            <span className="text-muted-foreground">Notes:</span>
            <span className="ml-1">{log.branch_approval_notes}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
