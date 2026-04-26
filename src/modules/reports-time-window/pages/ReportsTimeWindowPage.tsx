import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useDialogState } from '@/hooks/useDialogState';
import { useAdvancedFilters } from '@/hooks/filter-systerm/useAdvancedFilters';
import { useGetReports } from '../hooks/useReportsTimeWindow';
import type { TimeSlot } from '../types';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { RowActions } from '@/components/ui/row-actions';
import { Download, Eye, SquareCheckBig } from 'lucide-react';
import { ReportDialog } from '../components/ReportDialog';
// import { ReportAdminApprovalDialog } from '../components/ReportAdminApprovalDialog';
import { ReportBranchApprovalDialog } from '../components/ReportBranchApprovalDialog';
import { RoleGuard } from '@/app/router/RoleGuard';
import { ReportAdminApprovalDialog } from '../components/ReportAdminApprovalDialog';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useKitchensList } from '@/modules/kitchens/hooks/useKitchens';
import { buildActiveFilters } from '@/hooks/filter-systerm/buildActiveFilters';
import { AdvancedFilterSystem } from '@/components/dashboard/AdvancedFilterSystem';
import { TimeWindowReportDownloadDialog } from '../components/TimeWindowReportDownloadDialog';

export const ReportsTimeWindowPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { openView,  openDelete: openDownload, openEdit: openApproval, close, dialog } = useDialogState<TimeSlot>();

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    page,
    setPage,
    apiFilters
  } = useAdvancedFilters()
  
  const { data: kitchensData } = useKitchensList();

  const { data: reportsData, isLoading } = useGetReports(apiFilters);

  const reports = reportsData?.data ?? [];
  const pagination = reportsData?.pagination;

  const canApproveReport = (role?: string, report?: TimeSlot) => {
    if (!role || !report) return false;

    const isApprovedByBranch = report?.approved_by_branch;
    const isApprovedByAdmin = !report?.can_change_status;

    if (role === 'system_manager') return !isApprovedByAdmin;
    if (role === 'catering_manager') return !isApprovedByBranch;

    return false;
  };
  
  const filterConfigs: any = useMemo(() => [

    {
      key: 'kitchen_id',
      label: t('nav.kitchens'),
      placeholder: t('complaints.selectKitchen'),
      options: (kitchensData?.data || []).map(kitchen => ({
        value: String(kitchen.id),
        label: kitchen.name,
      }))
    },
  ], [t, kitchensData]);  

  const activeFilters = useMemo(() => 
    buildActiveFilters(filters, filterConfigs),
    [filters, filterConfigs]
  )

  const columns = useMemo<ColumnDef<TimeSlot>[]>(() => {
    const baseColumns: ColumnDef<TimeSlot>[] = [
      {
        header: '#',
        className: 'w-12 text-center text-muted-foreground font-medium',
        cell: (_, index) => index + 1,
      },
      {
        header: t('reports.timeWindow'),
        accessorKey: 'label',
        cell: (report) => (
          <div className="font-medium">{report?.label}</div>
        ),
      },
      {
        header: t('reports.note'),
        accessorKey: 'contract_date.notes' as keyof TimeSlot,
        cell: (report) => (
          <div className="text-muted-foreground">
            {report?.contract_date?.notes}
          </div>
        ),
      },
      
      {
        header: t('reports.kitchen'),
        accessorKey: 'kitchen.name' as keyof TimeSlot,
        cell: (report) => (
          <div className="font-medium">{report?.kitchen?.name}</div>
        ),
      },
      {
        header: t('reports.zone'),
        accessorKey: 'zone.name' as keyof TimeSlot,
        cell: (report) => (
          <div className="font-medium">{report?.zone?.name}</div>
        ),
      },
      {
        header: t('reports.inspectionDate'),
        accessorKey: 'contract_date.service_date' as keyof TimeSlot,
        cell: (report) => (
          <div className="text-muted-foreground">
            {new Date(report?.contract_date?.service_date).toLocaleDateString()}
          </div>
        ),
      },
    
      {
        header: t('reports.submissionsCount'),
        accessorKey: 'submissions_count',
        cell: (report) => (
          <Badge 
            className={'text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-900/20'} 
            variant="outline"
          >
            {report?.submissions_count} / 5
          </Badge>
        ),
      },
    ];

    // Add actions column
    baseColumns.push({
      header: t('reports.actions'),
      className: 'text-left rtl:text-right',
      cell: (report) => {
        const canEdit = canApproveReport(user?.role, report);

        return (
          <RowActions
            row={report}
            actions={[
              {
                icon: Eye,
                variant: 'view',
                onClick: openView,
              },
              {
                icon: Download,
                variant: 'destructive',
                onClick: openDownload,
              },

              ...(canEdit
                ? [
                    {
                      icon: SquareCheckBig,
                      variant: 'edit',
                      onClick: openApproval,
                      allowedRoles: ['system_manager', 'catering_manager'],
                    } as any,
                  ]
                : []),
            ]}
          />
        );
      },
    });

    return baseColumns;
  }, [t, openView, user?.role, openApproval]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Page Header */}
      <PageHeader
        title={t('reports.title')}
        description={t('reports.subtitle')}
      />

      <AdvancedFilterSystem
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onFilterRemove={removeFilter}
        onClearAllFilters={clearFilters}
      />
      
      <DataTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={setPage}
        emptyMessage={t('reports.noReportsFound')}
      />

      {dialog?.type === 'view' && 
        <ReportDialog
          open={dialog?.type === 'view'}
          onOpenChange={(open) => !open && close()}
          report={dialog?.type === 'view' ? dialog.item : null}
        />  
      }

      <RoleGuard allowedRoles={['system_manager']}>
        {dialog?.type === 'edit' && 
          <ReportAdminApprovalDialog
            open={dialog?.type === 'edit'}
            onOpenChange={(open) => !open && close()}
            report={dialog?.type === 'edit' ? dialog.item : null}
          />}
      </RoleGuard>

      <RoleGuard allowedRoles={['catering_manager']}>
        {dialog?.type === 'edit' && 
          <ReportBranchApprovalDialog
            open={dialog?.type === 'edit'}
            onOpenChange={(open) => !open && close()}
            report={dialog?.type === 'edit' ? dialog.item : null}
          />}
      </RoleGuard>

      <RoleGuard allowedRoles={['system_manager', 'catering_manager', 'quality_manager', 'project_manager']}>
      {dialog?.type === 'delete' && 
        <TimeWindowReportDownloadDialog
          open={dialog?.type === 'delete'}
          onOpenChange={(open) => !open && close()}
          report={dialog?.type === 'delete' ? dialog.item : null}
        />}
      </RoleGuard>

  
    </div>
  );
};
