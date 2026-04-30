import { useMealTimeLogs } from "./useMealTimeLogs";
import { useEchoConnection } from "@/hooks/useEchoConnection";
import { useEchoChannel } from "@/hooks/useEchoChannel";
import { useChannelName } from "@/hooks/useChannelName";
import { CHANNEL_CONFIGS } from "@/lib/channel-resolver";
import type { MealTimeLog } from "../types";

export const useMealTimeLogsController = () => {
  const { logs, addLog, updateLog, clearLogs, isLoading, refreshLogs } = useMealTimeLogs();
  const { state, isConnected, isConnecting, isFailed } = useEchoConnection();

  const channelName = useChannelName(CHANNEL_CONFIGS.MEAL_TIME_TRACKER);

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
    refreshLogs,
  };
};
