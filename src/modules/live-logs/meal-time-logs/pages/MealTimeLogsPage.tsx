import { PageHeader } from "@/components/dashboard/PageHeader";
import { useState } from "react";
import { useMealTimeLogsController } from "../hooks/useMealTimeLogsController";
import { MealTimeLogsList } from "../components/MealTimeLogsList";
import ConnectionHeader from "../../../../components/dashboard/ConnectionHeader";

export const MealTimeLogsPage = () => {
  const {
    logs,
    isConnected,
    connectionState,
    channelName,
    clearLogs,
    isConnecting,
    isFailed,
    refreshLogs,
  } = useMealTimeLogsController();

  const [paused, setPaused] = useState(false);

  if (!channelName) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meal Time Logs"
          description="Real-time meal time window tracker logs"
        />
        <div className="rounded-lg border bg-card p-4">
          <p className="text-muted-foreground text-sm">
            Meal time logs are not available for your role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between"> 
        <PageHeader
          description="Real-time meal time window tracking stream"
        />

        <ConnectionHeader
          connectionState={connectionState}
          channelName={channelName}
          clearLogs={clearLogs}
          paused={paused}
          setPaused={setPaused}
          isConnected={isConnected}
          refreshLogs={refreshLogs}
          isRefreshing={isConnecting}
        />
      </div>

      <div className="space-y-3">
        <MealTimeLogsList logs={logs} isLoading={isConnecting} isFailed={isFailed}  />
      </div>
    </div>
  );
};
