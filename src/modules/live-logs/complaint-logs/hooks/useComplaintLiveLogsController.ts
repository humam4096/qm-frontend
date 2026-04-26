import { useAuthStore } from "@/app/store/useAuthStore";
import { useComplaintLiveLogs } from "./useComplaintLiveLogs";
import { useEchoConnection } from "@/hooks/useEchoConnection";
import { useMemo } from "react";
import { useEchoChannel } from "@/hooks/useEchoChannel";
import type { Complaint } from "@/modules/complaints/types";
import type { ComplaintLogFilters } from "../types";

export const useComplaintLiveLogsController = (apiFilters: ComplaintLogFilters) => {
  const { user } = useAuthStore();
  const { logs, addLog, clearLogs, updateLog, isLoading, refreshLogs } = useComplaintLiveLogs(apiFilters);
  const { state, isConnected, isConnecting, isFailed } = useEchoConnection();

  const channelName = useMemo(() => {
    if (!user) return null;

    if (user.role === "system_manager") return "complaints.global";
    if (user.role === "catering_manager" && user.scope?.id) {
      return `complaints.branch.${user.scope.id}`;
    }

    return null;
  }, [user]);

  useEchoChannel<Complaint>(
    channelName || "",
    ".complaint.created",
    addLog
  );
  
 // Listen for submission.status.updated events
  useEchoChannel<Complaint>(
    channelName || "",
    ".complaint.status.updated",
    (updatedComplaint) => {
      updateLog(updatedComplaint.id, updatedComplaint);
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
    refreshLogs
  };
};