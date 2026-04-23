import { PageHeader } from "@/components/dashboard/PageHeader";
import { useState } from "react";
import { useKitchenStageLogsController } from "../hooks/useKitchenStageLogsController";
import { KitchenStageLogsList } from "../components/KitchenStageLogsList";
import ConnectionHeader from "../components/ConnectionHeader";

export const KitchenStageLogsPage = () => {
  const {
    logs,
    isConnected,
    connectionState,
    channelName,
    clearLogs,
    isConnecting,
    isFailed,
  } = useKitchenStageLogsController();

  const [paused, setPaused] = useState(false);

  if (!channelName) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Kitchen Stage Logs"
          description="Real-time kitchen stage progress logs"
        />
        <div className="rounded-lg border bg-card p-4">
          <p className="text-muted-foreground text-sm">
            Kitchen stage logs are not available for your role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kitchen Stage Logs"
        description="Real-time kitchen stage progress stream"
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
        <KitchenStageLogsList logs={logs} isLoading={isConnecting} isFailed={isFailed} />
      </div>
    </div>
  );
};
