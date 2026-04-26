import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSubmissionLogsController } from "../hooks/useSubmissionLogsController";
import { SubmissionLogsList } from "../components/SubmissionLogsList";
import ConnectionHeader from "../../../../components/dashboard/ConnectionHeader";

export const SubmissionLogsPage = () => {

  const {
    logs,
    isConnected,
    connectionState,
    channelName,
    clearLogs,
    isConnecting,
    isFailed,
    refreshLogs
  } = useSubmissionLogsController();
  
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
      <div className="flex flex-col md:flex-row justify-between"> 
        <PageHeader
          description="Real-time submission activity stream"
        />

        <ConnectionHeader
          connectionState={connectionState}
          channelName={channelName}
          clearLogs={clearLogs}
          isConnected={isConnected}
          refreshLogs={refreshLogs}
          isRefreshing={isConnecting}
        />
      </div>

      <SubmissionLogsList logs={logs} isLoading={isConnecting} isFailed={isFailed} />
    </div>
  );
};
