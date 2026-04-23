import { PageHeader } from "@/components/dashboard/PageHeader";
import { useState } from "react";
import { useSubmissionLogsController } from "../hooks/useSubmissionLogsController";
import { SubmissionLogsList } from "../components/SubmissionLogsList";
import ConnectionHeader from "../components/ConnectionHeader";

export const SubmissionLogsPage = () => {
  const {
    logs,
    isConnected,
    connectionState,
    channelName,
    clearLogs,
    isConnecting,
    isFailed,
  } = useSubmissionLogsController();

  const [paused, setPaused] = useState(false);

  if (!channelName) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Submission Logs"
          description="Real-time submission activity logs"
        />
        <div className="rounded-lg border bg-card p-4">
          <p className="text-muted-foreground text-sm">
            Submission logs are not available for your role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submission Logs"
        description="Real-time submission activity stream"
      />

      <ConnectionHeader
        connectionState={connectionState}
        channelName={channelName}
        clearLogs={clearLogs}
        paused={paused}
        setPaused={setPaused}
        isConnected={isConnected}
      />

      <div className="space-y-3">
        <SubmissionLogsList logs={logs} isLoading={isConnecting} isFailed={isFailed} />
      </div>
    </div>
  );
};
