import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLiveLogsController } from "../hooks/useLiveLogsController";
import type { Complaint } from "@/modules/complaints/types";

export const LiveLogsPage = () => {
  const {
    logs,
    isConnected,
    connectionState,
    channelName,
    clearLogs,
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
      <PageHeader
        title="Live Logs"
        description="Real-time activity logs from the system"
      />

      {/* Status + Actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Connection Status */}
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
          <div className={`h-2 w-2 rounded-full ${getConnectionColor()}`} />
          <span className="text-sm font-medium">{getConnectionText()}</span>
          {isConnected && (
            <span className="text-muted-foreground text-xs">
              • {channelName}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
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

      {/* Logs */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="rounded-lg border bg-card p-4">
            <p className="text-muted-foreground text-sm">
              {!isConnected
                ? "Connect to see events"
                : "Waiting for events..."}
            </p>
          </div>
        ) : (
          logs.map((log : Complaint) => (
            <div
              key={log.id}
              className="rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium">
                      #{log.id}
                    </span>

                    <p className="text-sm">{log.description}</p>
                  </div>

                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-1 gap-2 border-t pt-3 sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="text-sm font-medium">
                      {log.complaint_type.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Kitchen</p>
                    <p className="text-sm font-medium">
                      {log.kitchen.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Raised By</p>
                    <p className="text-sm font-medium">
                      {log.raised_by.name}
                    </p>
                  </div>
                </div>

                {/* Resolution */}
                {log.status === "closed" && log.resolution_notes && (
                  <div className="border-t pt-3">
                    <p className="text-muted-foreground text-xs">
                      Resolution Notes
                    </p>
                    <p className="text-sm">{log.resolution_notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};