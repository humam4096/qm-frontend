import { PageHeader } from "@/components/dashboard/PageHeader";
import { useState } from "react";
import { useLiveLogsController } from "../hooks/useLiveLogsController";
import { LiveLogsList } from "../components/LiveLogsList";
import ConnectionHeader from "../components/ConnectionHeader";

export const LiveComplaintsPage = () => {
  const {
    logs,
    isConnected,
    connectionState,
    channelName,
    clearLogs,
    isConnecting,
    isFailed,
  } = useLiveLogsController();

  const [paused, setPaused] = useState(false);

  if (!channelName) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Live Logs"
          description="Real-time activity logs from the system"
        />
        <div className="rounded-lg border bg-card p-4">
          <p className="text-muted-foreground text-sm">
            Live logs are not available for your role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Logs"
        description="Real-time system activity stream"
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
        <LiveLogsList logs={logs} isLoading={isConnecting} isFailed={isFailed} />
      </div>
    </div>
  );
};