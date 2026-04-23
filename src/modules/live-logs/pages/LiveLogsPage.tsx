import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLiveLogsController } from "../hooks/useLiveLogsController";
import { LiveLogsList } from "../components/LiveLogsList";

export const LiveLogsPage = () => {
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

  const getConnectionColor = () => {
    switch (connectionState) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getConnectionText = () => {
    switch (connectionState) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "failed":
        return "Connection Failed";
      default:
        return "Disconnected";
    }
  };


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

    {/* ================= HEADER ================= */}
    <PageHeader
      title="Live Logs"
      description="Real-time system activity stream"
    />

    {/* ================= STICKY CONTROL BAR ================= */}
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

      {/* Connection Status */}
      <div className="flex items-center gap-3">

        <div className="relative flex items-center">
          <span className={`h-2.5 w-2.5 rounded-full ${getConnectionColor()}`} />

          {isConnected && (
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full animate-ping opacity-50 bg-green-500" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {getConnectionText()}
          </span>

          {isConnected && (
            <span className="text-xs text-muted-foreground">
              Channel: {channelName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={paused ? "default" : "outline"}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "Resume" : "Pause"}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={clearLogs}
        >
          Clear
        </Button>
      </div>
    </div>

    <div className="space-y-3">
      <LiveLogsList logs={logs} isLoading={isConnecting} isFailed={isFailed} />
    </div>
  </div>
);
};