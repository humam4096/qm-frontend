import type { MealTimeLog } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/components/dashboard/formatRelativeTime";
import { useMemo } from "react";
import { getProgressColor } from "@/lib/getStatusConfig";

interface MealTimeLogItemProps {
  log: MealTimeLog;
  index: number;
}

export const MealTimeLogItem = ({ log }: MealTimeLogItemProps) => {
  // Calculate progress based on submitted stages
  const progress = useMemo(() => {
    if (log.stages.length === 0) return 0;
    const submittedCount = log.stages.filter(stage => stage.submitted).length;
    return Math.round((submittedCount / log.stages.length) * 100);
  }, [log.stages]);

  // Find the current active stage (first non-submitted stage)
  const activeStage = useMemo(() => {
    return log.stages
      .sort((a, b) => a.sequence_order - b.sequence_order)
      .find(stage => !stage.submitted);
  }, [log.stages]);

  // Determine overall status based on stages
  const status = useMemo(() => {
    if (log.stages.length === 0) return "not_started";
    if (log.stages.every(stage => stage.submitted)) return "completed";
    if (log.stages.some(stage => stage.submitted)) return "in_progress";
    return "not_started";
  }, [log.stages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      case "in_progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };


  const getStageColor = (stage: { submitted: boolean }, isActive: boolean) => {
    if (stage.submitted) {
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    }
    if (isActive) {
      return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/50 animate-pulse";
    }
    return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
  };

  return (
    <Card
      className="p-4 animate-in fade-in slide-in-from-top-2 duration-300"
      // style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate">
                {log.label}
              </h3>
              <Badge variant="outline" className={getStatusColor(status)}>
                {status === "in_progress" && (
                  <svg
                    className="w-3 h-3 mr-1.5 animate-spin inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {status.replace(/_/g, " ")}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-auto">
                {formatRelativeTime(log.contract_date.service_date)}
              </span>
              {/* {activeStage && (
                <Badge variant="secondary" className="text-xs bg-linear-to-r from-blue-500 to-cyan-500 text-white border-blue-500 shadow-md animate-pulse">
                  <span className="flex items-center gap-1">
                    Active: {activeStage.name}
                  </span>
                </Badge>
              )} */}
            </div>
            <div className="flex gap-2 items-center justify-between">
              <div className="text-xs">
                <span className="mt-1 font-bold">Kitchen:</span>
                <span className="ml-1">{log.kitchen.name}</span>
              </div>
              {log.contract_date.notes && (
                <div className="text-xs bg-muted/50x p-2 rounded">
                  <span className="text-muted-foregroundx font-bold">Day:</span>
                  <span className="ml-1">{log.contract_date.notes}</span>
                </div>
              )}
            </div>
            
          </div>
     
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {log.stages.filter(s => s.submitted).length} / {log.stages.length} stages ({progress}%)
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stages Display */}
        <div className="space-y-2s">
          <span className="text-xs text-muted-foreground font-medium">Stages:</span>
          <div className="grid grid-cols-2 gap-2">
            {log.stages
              .sort((a, b) => a.sequence_order - b.sequence_order)
              .map((stage) => {
                const isActive = activeStage?.id === stage.id;
                return (
                  <Badge
                    key={stage.id}
                    variant="outline"
                    className={`text-xs transition-all ${getStageColor(stage, isActive)}`}
                  >
                    <span className="flex items-center gap-1.5">
                      {stage.submitted ? (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : isActive ? (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                      ) : (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="8" strokeWidth={2} />
                        </svg>
                      )}
                      {stage.name}
                    </span>
                  </Badge>
                );
              })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Service Date:</span>
            <span className="ml-1 font-medium">{log.date}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Time Window:</span>
            <span className="ml-1 font-medium">
              {log.start_time} - {log.end_time}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
