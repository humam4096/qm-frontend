import type { MealTimeLog } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/components/dashboard/formatRelativeTime";
import { useMemo } from "react";
import { getProgressColor } from "@/lib/getStatusConfig";
import { useTranslation } from "react-i18next";

interface MealTimeLogItemProps {
  log: MealTimeLog;
  index: number;
}

export const MealTimeLogItem = ({ log }: MealTimeLogItemProps) => {
  const { t } = useTranslation();
  
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
        return "flex items-center justify-between gap-2 bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "not_started":
        return t('liveLogs.mealTimes.notStarted');
      case "in_progress":
        return t('liveLogs.mealTimes.inProgress');
      case "completed":
        return t('liveLogs.mealTimes.completed');
      default:
        return status.replace(/_/g, " ");
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
      className="relative p-4 animate-in fade-in slide-in-from-top-2 duration-300"
      // style={{ animationDelay: `${index * 50}ms` }}
      >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary/60 to-primary/20" />

      <div className="flex flex-col gap-3">

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">
                  {log.label}
                </h3>
                <Badge variant="outline" className={getStatusColor(status)}>
                  {status === "in_progress" && (
                    <svg
                      className="w-3 h-3 animate-spin inline-block"
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
                  {getStatusText(status)}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatRelativeTime(log.contract_date.service_date)}
              </span>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-1 items-center text-xs">
                <span className="font-bold">{t('liveLogs.mealTimes.kitchen')}:</span>
                <span className="">{log.kitchen.name}</span>
              </div>
              {log.contract_date.notes && (
                <div className="flex gap-1 text-xs bg-muted/50x p-2 rounded">
                  <span className="text-muted-foregroundx font-bold">{t('liveLogs.mealTimes.day')}:</span>
                  <span className="ml-1">{log.contract_date.notes}</span>
                </div>
              )}
            </div>
            
          </div>
     
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('liveLogs.mealTimes.progress')}</span>
            <span className="font-medium">
              {log.stages.filter(s => s.submitted).length} / {log.stages.length} {t('liveLogs.mealTimes.stages').toLowerCase()} ({progress}%)
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
          <span className="text-xs text-muted-foreground font-medium">{t('liveLogs.mealTimes.stages')}:</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
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
          <div className="flex gap-1">
            <span className="text-muted-foreground">{t('liveLogs.mealTimes.serviceDate')}:</span>
            <span className="ml-1 font-medium">{log.date}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-muted-foreground">{t('liveLogs.mealTimes.timeWindow')}:</span>
            <span className="ml-1 font-medium">
              {log.start_time} - {log.end_time}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
