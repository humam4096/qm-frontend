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
import { Eye, SquareCheckBig } from 'lucide-react';
import { ReportDialog } from '../components/ReportDialog';
// import { ReportAdminApprovalDialog } from '../components/ReportAdminApprovalDialog';
import { ReportBranchApprovalDialog } from '../components/ReportBranchApprovalDialog';
import { RoleGuard } from '@/app/router/RoleGuard';

export const ReportsTimeWindowPage: React.FC = () => {
  const { t } = useTranslation();

  const { openView, openEdit: openBranchApproval, close, dialog } = useDialogState<TimeSlot>();

  const {
    page,
    setPage,
    apiFilters,
  } = useAdvancedFilters();

  const { data: reportsData, isLoading } = useGetReports(apiFilters);

  const reports = reportsData?.data ?? [];
  const pagination = reportsData?.pagination;

  const columns = useMemo<ColumnDef<TimeSlot>[]>(() => {
    const baseColumns: ColumnDef<TimeSlot>[] = [
      {
        header: '#',
        className: 'w-12 text-center text-muted-foreground font-medium',
        cell: (_, index) => index + 1,
      },
      {
        header: t('reports.label'),
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
        header: t('reports.submissions_count'),
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
        const isApprovedByBranch = report?.approved_by_branch;
        return (
          <RowActions
            row={report}
            actions={[
              {
                icon: Eye,
                variant: 'view',
                onClick: (row) => openView(row),
              },
              {
                icon: SquareCheckBig,
                variant: 'edit',
                onClick: (row) => openBranchApproval(row),
                allowedRoles: ['catering_manager'], 
                disabled: isApprovedByBranch,
              },
            ]}
          />
      )},
    });

    return baseColumns;
  }, [t, openView]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Page Header */}
      <PageHeader
        title={t('reports.title')}
        description={t('reports.subtitle')}
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
        />  }

      <RoleGuard allowedRoles={['catering_manager']}>
        {dialog?.type === 'edit' && 
          <ReportBranchApprovalDialog
            open={dialog?.type === 'edit'}
            onOpenChange={(open) => !open && close()}
            report={dialog?.type === 'edit' ? dialog.item : null}
          />}
      </RoleGuard>
    </div>
  );
};
