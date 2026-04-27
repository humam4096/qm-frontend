import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSubmissionLogsController } from "../hooks/useSubmissionLogsController";
import { SubmissionLogsList } from "../components/SubmissionLogsList";
import ConnectionHeader from "../../../../components/dashboard/ConnectionHeader";
import { useTranslation } from "react-i18next";

export const SubmissionLogsPage = () => {
  const { t } = useTranslation();

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
          title={t('liveLogs.submissions.title')}
          description={t('liveLogs.submissions.subtitle')}
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
          description={t('liveLogs.submissions.description')}
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
