// pages/LiveLogsPage.tsx

import { useLogs } from "../hooks/useLogs";
import { useLiveLogs } from "../hooks/useLiveLogs";
import { LiveLogsList } from "../components/LiveLogsList";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ErrorMsg } from "@/components/dashboard/ErrorMsg";

export const LiveLogsPage = () => {
  const { data: logs = [], isLoading, error } = useLogs();
  useLiveLogs();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Logs"
        description="Real-time activity logs from the system"
      />

      <LiveLogsList logs={logs} isLoading={isLoading} />
      
      {error && (
        <ErrorMsg message={`Failed to load logs. Please try again later. ${error.message}`} />
      )}
    </div>
  );
};
