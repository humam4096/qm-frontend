import { useComplaintLiveLogs } from "./useComplaintLiveLogs";
import { useEchoConnection } from "@/hooks/useEchoConnection";
import { useEchoChannel } from "@/hooks/useEchoChannel";
import { useChannelName } from "@/hooks/useChannelName";
import { CHANNEL_CONFIGS } from "@/lib/channel-resolver";
import type { Complaint } from "@/modules/complaints/types";
import type { ComplaintLogFilters } from "../types";

export const useComplaintLiveLogsController = (apiFilters: ComplaintLogFilters) => {
  const { logs, addLog, clearLogs, updateLog, isLoading, refreshLogs } = useComplaintLiveLogs(apiFilters);
  const { state, isConnected, isConnecting, isFailed } = useEchoConnection();

  const channelName = useChannelName(CHANNEL_CONFIGS.COMPLAINTS);

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