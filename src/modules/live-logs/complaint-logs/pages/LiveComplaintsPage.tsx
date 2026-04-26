import { PageHeader } from "@/components/dashboard/PageHeader";
import { useMemo } from "react";
import { useComplaintLiveLogsController } from "../hooks/useComplaintLiveLogsController";
import { ComplaintLiveLogsList } from "../components/ComplaintLiveLogsList";
import ConnectionHeader from "../../../../components/dashboard/ConnectionHeader";
import { useTranslation } from "react-i18next";
import { buildActiveFilters } from "@/hooks/filter-systerm/buildActiveFilters";
import { useAdvancedFilters } from "@/hooks/filter-systerm/useAdvancedFilters";
import { AdvancedFilterSystem } from "@/components/dashboard/AdvancedFilterSystem";

export const LiveComplaintsPage = () => {
  const { t } = useTranslation();
  
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    apiFilters,
  } = useAdvancedFilters();

  const filterConfigs: any = useMemo(() => [
    {
      key: 'status',
      label: t('complaints.status'),
      placeholder: t('complaints.selectStatus'),
      options: [
        { value: 'open', label: t('complaints.statusOpen') },
        { value: 'closed', label: t('complaints.statusClosed') },
      ],
    },
    {
      key: 'priority',
      label: t('complaints.priority'),
      placeholder: t('complaints.selectPriority'),
      options: [
        { value: 'low', label: t('complaints.priorityLow') },
        { value: 'medium', label: t('complaints.priorityMedium') },
        { value: 'high', label: t('complaints.priorityHigh') },
      ],
    },

  ], [t]);


  const activeFilters = useMemo(
    () => buildActiveFilters(filters, filterConfigs),
    [filters, filterConfigs]
  );

  const {
    logs,
    isConnected,
    connectionState,
    channelName,
    clearLogs,
    isConnecting,
    isFailed,
    refreshLogs,
  } = useComplaintLiveLogsController(apiFilters);


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
      <div className="flex flex-col md:flex-row justify-between"> 
        <PageHeader
          description="Real-time system activity stream"
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

      <AdvancedFilterSystem
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onFilterRemove={removeFilter}
        onClearAllFilters={clearFilters}
      />


      <div className="space-y-3">
        <ComplaintLiveLogsList logs={logs} isLoading={isConnecting} isFailed={isFailed}/>
      </div>
    </div>
  );
};