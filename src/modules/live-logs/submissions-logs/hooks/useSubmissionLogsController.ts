import { useSubmissionLogs } from "./useSubmissionLogs";
import { useEchoConnection } from "@/hooks/useEchoConnection";
import { useEchoChannel } from "@/hooks/useEchoChannel";
import { useChannelName } from "@/hooks/useChannelName";
import { CHANNEL_CONFIGS } from "@/lib/channel-resolver";
import type { SubmissionLog, SubmissionLogFilters } from "../types";

export const useSubmissionLogsController = (apiFilters?: SubmissionLogFilters) => {
  const { logs, addLog, updateLog, clearLogs, isLoading, refreshLogs } = useSubmissionLogs(apiFilters || {});
  const { state, isConnected, isConnecting, isFailed } = useEchoConnection();

  const channelName = useChannelName(CHANNEL_CONFIGS.SUBMISSIONS);

  // Listen for submission.created events
  useEchoChannel<SubmissionLog>(
    channelName || "",
    ".submission.created",
    addLog
  );

  // Listen for submission.status.updated events
  useEchoChannel<SubmissionLog>(
    channelName || "",
    ".submission.status.updated",
    (updatedSubmission) => {
      updateLog(updatedSubmission.id, updatedSubmission);
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
