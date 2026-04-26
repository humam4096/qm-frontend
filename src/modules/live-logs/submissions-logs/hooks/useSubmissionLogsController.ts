import { useAuthStore } from "@/app/store/useAuthStore";
import { useSubmissionLogs } from "./useSubmissionLogs";
import { useEchoConnection } from "@/hooks/useEchoConnection";
import { useMemo } from "react";
import { useEchoChannel } from "@/hooks/useEchoChannel";
import type { SubmissionLog, SubmissionLogFilters } from "../types";

export const useSubmissionLogsController = (apiFilters?: SubmissionLogFilters) => {
  const { user } = useAuthStore();
  const { logs, addLog, updateLog, clearLogs, isLoading, refreshLogs } = useSubmissionLogs(apiFilters || {});
  const { state, isConnected, isConnecting, isFailed } = useEchoConnection();

  const channelName = useMemo(() => {
    if (!user) return null;

    if (user.role === "system_manager") return "submissions.global";
    if (user.role === "catering_manager" && user.scope?.id) {
      return `submissions.branch.${user.scope.id}`;
    }

    return null;
  }, [user]);

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
