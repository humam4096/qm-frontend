import { useAuthStore } from "@/app/store/useAuthStore";
import { useMealTimeLogs } from "./useMealTimeLogs";
import { useEchoConnection } from "@/hooks/useEchoConnection";
import { useMemo } from "react";
import { useEchoChannel } from "@/hooks/useEchoChannel";
import type { MealTimeLog } from "../types";

export const useMealTimeLogsController = () => {
  const { user } = useAuthStore();
  const { logs, addLog, updateLog, clearLogs, isLoading } = useMealTimeLogs();
  const { state, isConnected, isConnecting, isFailed } = useEchoConnection();

  const channelName = useMemo(() => {
    if (!user) return null;

    if (user.role === "system_manager") return "meal-time-window-tracker.global";
    if (user.role === "catering_manager" && user.scope?.id) {
      return `meal-time-window-tracker.branch.${user.scope.id}`;
    }

    return null;
  }, [user]);

  // Listen for meal.time.window.tracker.updated events
  useEchoChannel<MealTimeLog>(
    channelName || "",
    ".meal.time.window.tracker.updated",
    (updatedMealTime) => {
      // Check if log exists, update it, otherwise add it
      const existingLog = logs.find(log => log.id === updatedMealTime.id);
      if (existingLog) {
        updateLog(updatedMealTime.id, updatedMealTime);
      } else {
        addLog(updatedMealTime);
      }
    }
  );

  return {
    logs,
    isConnected,
    connectionState: state,
    channelName,
    clearLogs,
    isConnecting: isConnecting || isLoading,
    isFailed,
  };
};
