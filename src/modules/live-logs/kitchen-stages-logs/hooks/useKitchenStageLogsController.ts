import { useAuthStore } from "@/app/store/useAuthStore";
import { useKitchenStageLogs } from "./useKitchenStageLogs";
import { useEchoConnection } from "@/hooks/useEchoConnection";
import { useMemo } from "react";
import { useEchoChannel } from "@/hooks/useEchoChannel";
import type { KitchenStageLog } from "../types";

export const useKitchenStageLogsController = () => {
  const { user } = useAuthStore();
  const { logs, addLog, updateLog, clearLogs } = useKitchenStageLogs();
  const { state, isConnected, isConnecting, isFailed } = useEchoConnection();

  const channelName = useMemo(() => {
    if (!user) return null;

    if (user.role === "system_manager") return "kitchen-stage-progress.global";
    if (user.role === "catering_manager" && user.scope?.id) {
      return `kitchen-stage-progress.branch.${user.scope.id}`;
    }

    return null;
  }, [user]);

  // Listen for kitchen.stage.progress.updated events
  useEchoChannel<KitchenStageLog>(
    channelName || "",
    ".kitchen.stage.progress.updated",
    (updatedStage) => {
      // Check if log exists, update it, otherwise add it
      const existingLog = logs.find(log => log.id === updatedStage.id);
      if (existingLog) {
        updateLog(updatedStage.id, updatedStage);
      } else {
        addLog(updatedStage);
      }
    }
  );

  return {
    logs,
    isConnected,
    connectionState: state,
    channelName,
    clearLogs,
    isConnecting,
    isFailed,
  };
};
