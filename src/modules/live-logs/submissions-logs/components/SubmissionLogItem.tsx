import type { SubmissionLog } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/components/dashboard/formatRelativeTime";
import { cn } from "@/lib/utils";
import { getApprovalConfig, getReviewStatusConfig, getScoreColor } from "@/lib/getStatusConfig";

interface SubmissionLogItemProps {
  log: SubmissionLog;
  index: number;
}

export const SubmissionLogItem = ({ log }: SubmissionLogItemProps) => {
  
  const statusConfig = getReviewStatusConfig(log.status);
  const approvalConfig = getApprovalConfig(log.branch_approval);

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20 animate-in fade-in slide-in-from-top-2"
      // style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Accent Border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary/60 to-primary/20" />
      
      <div className="p-4 pl-5">
        <div className="flex gap-4">

          {/* Status Indicator */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-primary/70 ring-4 ring-primary/10" />
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-primary/70 animate-ping" />
            </div>
            <div className="h-full w-px bg-linear-to-b from-border to-transparent" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Header Section */}
            <div className="flex items-start justify-between gap-3">
              
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title with Icon */}
                <div className="w-full flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-sm font-semibold truncate" title={log.form?.name || log.form_type}>
                      {log.form?.name || log.form_type}
                    </h3>
                  </div>
                   {/* Timestamp */}
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(log.created_at)}
                    </span>
                  </div>
                </div>
                

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  <Badge variant="outline" className={cn("text-xs font-medium", statusConfig.color)}>
                    <span className="mr-1">{statusConfig.icon}</span>
                    {statusConfig.label}
                  </Badge>

                  <Badge variant="outline" className={cn("text-xs font-medium", approvalConfig.color)}>
                    <span className="mr-1">{approvalConfig.icon}</span>
                    {approvalConfig.label}
                  </Badge>

                  {/* Score Badge */}
                  <Badge variant="outline" className={cn("text-xs font-bold", getScoreColor(log.score))}>
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {log.score}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <MetaItem 
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                label="Kitchen" 
                value={log.kitchen?.name} 
                />
              <MetaItem 
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Time Slot" 
                value={log.time?.label} 
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/* ================= SUB COMPONENT ================= */

const MetaItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="flex items-start gap-2 min-w-0">
    <div className="text-muted-foreground mt-0.5 shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium truncate" title={value}>
        {value || "-"}
      </p>
    </div>
  </div>
);