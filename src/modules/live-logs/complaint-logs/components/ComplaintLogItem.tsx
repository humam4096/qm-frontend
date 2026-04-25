// components/LogItem.tsx

import type { Complaint } from "@/modules/complaints/types";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { formatRelativeTime } from "@/modules/notifications/utils";
import { Clock } from "lucide-react";

interface ComplaintLogItemProps {
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


export const ComplaintLogItem = ({ log }: ComplaintLogItemProps) => {
  const isOpen = log.status === "open";
  const isClosed = log.status === "closed";
  
  // Priority-based styling with more distinct colors
  const priorityStyles = {
    high: {
      border: "border-red-600/10",
      bg: "bg-red-50 dark:bg-red-950/20",
      dot: "bg-red-600/70",
      shadow: "hover:shadow-md hover:shadow-gray-500/20",
      glow: "shadow-red-500/10"
    },
    medium: {
      border: "border-yellow-500/10",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      dot: "bg-yellow-500/70",
      shadow: "hover:shadow-md hover:shadow-gray-500/20",
      glow: "shadow-yellow-500/10"
    },
    low: {
      border: "border-emerald-500/10",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      dot: "bg-emerald-500/70",
      shadow: "hover:shadow-md hover:shadow-gray-500/20",
      glow: "shadow-emerald-500/10"
    }
  };

  const currentPriority = priorityStyles[log.priority as keyof typeof priorityStyles] || {
    border: "border-border/60",
    bg: "",
    dot: "bg-muted-foreground",
    shadow: "",
    glow: ""
  };

  return (
    <Card
      className={`
        relative p-4 rounded-xl transition-all animate-in fade-in slide-in-from-top-2 duration-300
        ${currentPriority.border}
        ${currentPriority.bg}
        ${currentPriority.shadow}
        ${isClosed ? "opacity-60 grayscale" : ""}
      `}
      // style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="space-y-3">
        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between gap-3">

          {/* LEFT */}
          <div className="min-w-0 space-y-1">
            <div className="flex gap-2 items-center">
            <div className="relative mt-1">
              {isOpen && (
                <div className={`h-2.5 w-2.5 rounded-full ${currentPriority.dot} animate-ping absolute`} />
              )}
              <div className={`h-2.5 w-2.5 rounded-full ${currentPriority.dot} relative ${isOpen ? "shadow-lg" : ""}`} />
            </div>
            <h3 className="font-semibold text-sm truncate">
              {log.complaint_type.name}
            </h3>
            {isOpen && (
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide animate-pulse">
                NEW
              </span>
            )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground truncate">
                 {log.kitchen.name}
              </p>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={log.status} />
              <PriorityBadge status={log.priority} />
            </div>
            </div>

          </div>

          {/* TIME */}
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
            <Clock className="h-3.5 w-3.5" />
            {formatRelativeTime(log.created_at)}
          </div>
        </div>

        {/* ================= META ================= */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 text-xs">
          {log.raised_by && (
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Raised by</p>
              <p className="font-medium truncate">
                {log.raised_by.name}
              </p>
            </div>
          )}

          <div className="space-y-0.5">
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium truncate">
              {log.complaint_type.name}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};