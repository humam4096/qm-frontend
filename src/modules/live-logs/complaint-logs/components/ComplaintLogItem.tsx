// components/LogItem.tsx

import type { Complaint } from "@/modules/complaints/types";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { formatRelativeTime } from "@/modules/notifications/utils";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const isOpen = log.status === "open";
  const isClosed = log.status === "closed";
  
  // Priority-based styling with subtle, professional colors
  const priorityStyles = {
    high: {
      border: "border-[#7A1F1F]/40",
      bg: "bg-[#7A1F1F]/5",
      dot: "bg-[#7A1F1F]",
      shadow: "hover:shadow-md hover:shadow-[#7A1F1F]/10",
      accent: "bg-[#7A1F1F]"
    },
    medium: {
      border: "border-[#E0B352]/40",
      bg: "bg-[#E0B352]/10",
      dot: "bg-[#E0B352]",
      shadow: "hover:shadow-md hover:shadow-[#E0B352]/10",
      accent: "bg-[#E0B352]"
    },
    low: {
      border: "border-[#94A378]/40",
      bg: "bg-[#94A378]/10",
      dot: "bg-[#94A378]",
      shadow: "hover:shadow-md hover:shadow-[#94A378]/10",
      accent: "bg-[#94A378]"
    }
  };

  const currentPriority = priorityStyles[log.priority as keyof typeof priorityStyles] || {
    border: "border-border/60",
    bg: "bg-card",
    dot: "bg-muted-foreground/60",
    shadow: "hover:shadow-md hover:shadow-gray-500/5",
    accent: "bg-muted-foreground"
  };

  // Override with gray styling for closed complaints
  const finalStyles = isClosed ? {
    border: "border-gray-200/60 dark:border-gray-700/60",
    bg: "bg-gray-50/30 dark:bg-gray-900/10",
    dot: "bg-gray-400/60",
    shadow: "hover:shadow-md hover:shadow-gray-500/5",
    accent: "bg-gray-400"
  } : currentPriority;

  return (
    <Card
      className={`
        relative p-4 rounded-xl transition-all duration-300 animate-in fade-in slide-in-from-top-2
        ${finalStyles.border} ${finalStyles.bg} ${finalStyles.shadow}
        ${isClosed ? "opacity-70 grayscale-[0.3]" : ""}
        hover:scale-[1.01] group
      `}
    >
      {/* Subtle priority accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${finalStyles.accent} rounded-l-xl opacity-60`} />
      
      <div className="space-y-3 ml-2">
        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between gap-3">
          {/* LEFT */}
          <div className="min-w-0 space-y-2">
            <div className="flex gap-2 items-center">
              <div className="relative">
                {isOpen && (
                  <div className={`h-2 w-2 rounded-full ${finalStyles.dot} animate-ping absolute`} />
                )}
                <div className={`h-2 w-2 rounded-full ${finalStyles.dot} relative`} />
              </div>
              <h3 className={`font-semibold text-sm truncate ${isClosed ? 'text-muted-foreground' : 'text-foreground'}`}>
                {log.complaint_type.name}
              </h3>
              {isOpen && (
                <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide px-1.5 py-0.5 bg-red-100/60 dark:bg-red-900/30 rounded-md">
                  {t('liveLogs.complaints.new')}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <p className={`text-xs truncate font-medium ${isClosed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                {log.kitchen.name}
              </p>
              <div className="flex items-center gap-2">
                <StatusBadge status={log.status} />
                <PriorityBadge status={log.priority} />
              </div>
            </div>
          </div>

          {/* TIME */}
          <div className={`flex items-center gap-1.5 text-[11px] whitespace-nowrap px-2 py-1 rounded-md ${isClosed ? 'text-muted-foreground/70 bg-gray-100/50 dark:bg-gray-800/30' : 'text-muted-foreground bg-muted/30'}`}>
            <Clock className="h-3 w-3" />
            <span className="font-medium">{formatRelativeTime(log.created_at)}</span>
          </div>
        </div>

        {/* ================= META ================= */}
        <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-border/30">
          {log.raised_by && (
            <div className="space-y-1">
              <p className={`font-medium ${isClosed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>{t('liveLogs.complaints.raisedBy')}</p>
              <p className={`font-semibold truncate ${isClosed ? 'text-muted-foreground' : 'text-foreground'}`}>
                {log.raised_by.name}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <p className={`font-medium ${isClosed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>{t('liveLogs.complaints.type')}</p>
            <p className={`font-semibold truncate ${isClosed ? 'text-muted-foreground' : 'text-foreground'}`}>
              {log.complaint_type.name}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};