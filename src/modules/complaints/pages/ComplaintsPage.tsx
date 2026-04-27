import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Complaint } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AdvancedFilterSystem } from '@/components/dashboard/AdvancedFilterSystem';
import { Edit, Eye, Plus } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useComplaints } from '../hooks/useComplaints';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { ComplaintFormDialog } from '../components/ComplaintFormDialog';
import { DeleteComplaintDialog } from '../components/DeleteComplaintDialog';
import { ComplaintDialog } from '../components/ComplaintDialog';
import { RoleGuard } from '@/app/router/RoleGuard';
import { buildActiveFilters } from '@/hooks/filter-systerm/buildActiveFilters';
import { useAdvancedFilters } from '@/hooks/filter-systerm/useAdvancedFilters';
import { ComplaintTypeAPI } from '@/modules/complaint-types/api/complaint-types.api';
import { useLazyFetchData } from '@/hooks/useLazyFetchData';

export const ComplaintsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    apiFilters,
    page,
    setPage,
  } = useAdvancedFilters();

  const {
    dialog,
    openCreate,
    openEdit,
    // openDelete,
    openView,
    close,
  } = useDialogState<Complaint>();

  // Get complaint types for filter options
  const { data: complaintTypesData } = useLazyFetchData({
      queryKey: ["complaintTypesList"],
      queryFn: ComplaintTypeAPI.getComplaintTypesList,
      isOpen: isFilterPanelOpen,
    });


  const { data: complaintsData, isLoading: isComplaintsLoading } = useComplaints(apiFilters);

  const complaints = complaintsData?.data ?? [];
  const pagination = complaintsData?.pagination;

  // Define filter configurations
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
    {
      key: 'complaint_type_id',
      label: t('complaints.complaintType'),
      placeholder: t('complaints.selectComplaintType'),
      options: (complaintTypesData?.data || []).map(type => ({
        value: type.id,
        label: type.name,
      })),
    },
  ], [t, complaintTypesData]);


  const activeFilters = useMemo(
    () => buildActiveFilters(filters, filterConfigs),
    [filters, filterConfigs]
  );


  // Table Columns
  const columns = useMemo<ColumnDef<Complaint>[]>(() => [
    {
      header: '#',
      className: 'w-12 text-center text-muted-foreground font-medium',
      cell: (_, index) => index + 1,
    },

    {
      header: t('complaints.kitchen'),
      accessorKey: 'kitchen',
      cell: (complaint) => (
        <div className="font-medium">{complaint.kitchen?.name}</div>
      ),
    },
    {
      header: t('complaints.complaintType'),
      accessorKey: 'complaint_type',
      cell: (complaint) => (
        <div className="text-muted-foreground">
          {complaint.complaint_type?.name}
        </div>
      ),
    },

    {
      header: t('complaints.priority'),
      accessorKey: 'priority',
      cell: (complaint) => (
        <div className="capitalize">
          <span className={`px-2 py-1 border rounded-lg text-xs font-medium ${
            complaint.priority === 'high' ? 'text-rose-700 border-rose-300 bg-rose-50 dark:text-rose-400 dark:border-rose-700 dark:bg-rose-900/20' :
            complaint.priority === 'medium' ? 'text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-700 dark:bg-yellow-900/20' :
            'text-blue-700 border-blue-300 bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:bg-blue-900/20'
          }`}>
            {t(`complaints.priority${complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}`)}
          </span>
        </div>
      ),
    },

    {
      header: t('complaints.status'),
      accessorKey: 'status',
      cell: (complaint) => (
        <div className="capitalize">
          <span className={`px-2 py-1 border rounded-md text-xs font-medium ${
            complaint.status === 'resolved' || complaint.status === 'closed' ? 'text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-900/20' :
            complaint.status === 'in_progress' ? 'text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-700 dark:bg-yellow-900/20' :
            'text-blue-700 border-blue-300 bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:bg-blue-900/20'
          }`}>
            {t(`complaints.status${complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', '')}`)}
          </span>
        </div>
      ),
    },

    {
      header: t('complaints.raisedBy'),
      accessorKey: 'raised_by',
      cell: (complaint) => (
        <div className="text-muted-foreground">
          {complaint.raised_by?.name}
        </div>
      ),
    },

    {
      header: t('complaints.actions'),
      className: 'text-left rtl:text-right',
      cell: (complaint) => {
        const canBeSolved = complaint.status !== 'closed';
        return (
          <RowActions
            row={complaint}
            actions={[
              {
                icon: Eye,
                variant: "view",
                onClick: (row) => openView(row),
              },
              ...( canBeSolved
                ? [
                  {
                    icon: Edit,
                    variant: "edit",
                    onClick: (row: any) => openEdit(row),
                    allowedRoles: ['system_manager'],
                    disabled: complaint.status === 'closed'
                  } as any,
                ] : []
              ),
              // {
              //   icon: Trash2,
              //   variant: "destructive",
              //   onClick: (row) => openDelete(row),
              //   allowedRoles: ['system_manager'],
              //   disabled: true
              // },
            ]}
          />
        )
      },
    },
  ], [t, pagination]);


  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Area */}
      <PageHeader
        title={t('complaints.title')}
        description={t('complaints.subtitle')}
      />

      {/* Toolbar / Search */}
      <AdvancedFilterSystem
        searchValue={searchTerm}
        searchPlaceholder={t('complaints.searchPlaceholder')}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onFilterRemove={removeFilter}
        onClearAllFilters={clearFilters}
        onFilterPanelChange={setIsFilterPanelOpen}
        action={
          <RoleGuard allowedRoles={['quality_inspector']}>
            <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
              <Plus className="me-2 h-4 w-4" />
              {t('complaints.addComplaint')}
            </Button>
          </RoleGuard>
        }
      />

      {/* Data Table Wrapper */}
      <DataTable
        columns={columns}
        data={complaints}
        isLoading={isComplaintsLoading}
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={handlePageChange}
        emptyMessage={t('complaints.empty')}
      />

      {dialog?.type === "view" && (
        <ComplaintDialog
          open={dialog?.type === 'view'}
          onOpenChange={(open) => !open && close()}
          complaint={dialog?.type === 'view' ? dialog.item : null}
        />
      )}

      {/* Create/Edit Complaint Dialog */}
      <RoleGuard allowedRoles={['system_manager', 'quality_inspector']}>
        { (dialog?.type === "create" || dialog?.type === "edit") && (
          <ComplaintFormDialog
            open={dialog?.type === 'create' || dialog?.type === 'edit'}
            onOpenChange={(open) => !open && close()}
            itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
          />
        )}
        
       {dialog?.type === "delete" && (
        <DeleteComplaintDialog
          open={dialog?.type === 'delete'}
          complaint={dialog?.type === 'delete' ? dialog.item : null}
          onClose={close}
        />
      )}

      </RoleGuard>
    </div>
  );
};
