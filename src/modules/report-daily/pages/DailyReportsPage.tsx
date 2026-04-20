import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useDialogState } from '@/hooks/useDialogState';
import { useAdvancedFilters } from '@/hooks/filter-systerm/useAdvancedFilters';
import { useGetReportsDaily } from '../hooks/useReportsDialy';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { RowActions } from '@/components/ui/row-actions';
import { Eye, SquareCheckBig } from 'lucide-react';
import { DailyReportDialog } from '../components/DailyReportDialog';
import { DialyReportVisibilityDialog } from '../components/DialyReportVisibilityDialog';
import { RoleGuard } from '@/app/router/RoleGuard';
import type { DailySlot } from '../types';

export const DailyReportsPage: React.FC = () => {
  const { t } = useTranslation();

  const { openView, openEdit: openAdminApproval, close, dialog } = useDialogState<DailySlot>();

  const {
    page,
    setPage,
    apiFilters,
  } = useAdvancedFilters();

  const { data: reportsDailyData, isLoading } = useGetReportsDaily(apiFilters);

  const reports = reportsDailyData?.data ?? [];
  const pagination = reportsDailyData?.pagination;

  const columns = useMemo<ColumnDef<DailySlot>[]>(() => {
    const baseColumns: ColumnDef<DailySlot>[] = [
      {
        header: '#',
        className: 'w-12 text-center text-muted-foreground font-medium',
        cell: (_, index) => index + 1,
      },
      {
        header: t('daily_report.label'),
        accessorKey: 'notes',
        cell: (report) => (
          <div className="font-medium">{report?.notes}</div>
        ),
      },
      {
        header: t('daily_report.kitchen'),
        accessorKey: 'contract.kitchen.name' as keyof DailySlot,
        cell: (report) => (
          <div className="text-muted-foreground">
            {report?.contract?.kitchen?.name}
          </div>
        ),
      },
      {
        header: t('daily_report.service_date'),
        accessorKey: 'service_date',
        cell: (report) => (
          <div className="text-muted-foreground">
            {report?.service_date}
          </div>
        ),
      },
      {
        header: t('daily_report.meals_count'),
        accessorKey: 'meal_time_windows.submissions.length' as keyof DailySlot,
        cell: (report) => (
          <div className="text-muted-foreground">
            {report?.meal_time_windows?.length}
          </div>
        ),
      },
    
      {
        header: t('daily_report.status'),
        accessorKey: 'is_report_visible',
        cell: (report) => (
          <Badge 
            className={'text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-900/20'} 
            variant="outline"
          >
            {report?.is_report_visible ? t('daily_report.visible') : t('daily_report.hidden')}
          </Badge>
        ),
      },
    ];

    // Add actions column
    baseColumns.push({
      header: t('reports.actions'),
      className: 'text-left rtl:text-right',
      cell: (report) => {
        const canApprove = !report?.is_report_visible;
        return (
          <RowActions
            row={report}
            actions={[
              {
                icon: Eye,
                variant: 'view',
                onClick: (row) => openView(row),
              },
              ...( canApprove
                ? [
                  {
                    icon: SquareCheckBig,
                    variant: 'edit',
                    onClick: openAdminApproval,
                    allowedRoles: ['system_manager'], 
                  } as any,
                ] : []
               )
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
        title={t('daily_report.title')}
        description={t('daily_report.subtitle')}
      />
      
      <DataTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={setPage}
        emptyMessage={t('daily_report.noReportsFound')}
      />

      {dialog?.type === 'view' && 
        <DailyReportDialog
          open={dialog?.type === 'view'}
          onOpenChange={(open) => !open && close()}
          report={dialog?.type === 'view' ? dialog.item : null}
        /> 
      }

      <RoleGuard allowedRoles={['system_manager']}>
        {dialog?.type === 'edit' && 
          <DialyReportVisibilityDialog
          open={dialog?.type === 'edit'}
          onOpenChange={(open) => !open && close()}
          report={dialog?.type === 'edit' ? dialog.item : null}
        />}
      </RoleGuard>

    </div>
  );
};
