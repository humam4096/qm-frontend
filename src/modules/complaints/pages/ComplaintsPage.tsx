import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Complaint } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { AdvancedFilterSystem, type ActiveFilter } from '@/components/dashboard/AdvancedFilterSystem';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useComplaints } from '../hooks/useComplaints';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { ComplaintFormDialog } from '../components/ComplaintFormDialog';
import { DeleteComplaintDialog } from '../components/DeleteComplaintDialog';
import { ComplaintDialog } from '../components/ComplaintDialog';
import { RoleGuard } from '@/app/router/RoleGuard';
import { useGetComplaintTypesList } from '@/modules/complaint-types/hooks/useComplaintTypes';

export const ComplaintsPage: React.FC = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const {
    dialog,
    openCreate,
    openEdit,
    openDelete,
    openView,
    close,
  } = useDialogState<Complaint>();

  // Get complaint types for filter options
  const { data: complaintTypesData } = useGetComplaintTypesList();

  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // Build filter object for API call
  const apiFilters = useMemo(() => ({
    search: debouncedSearch,
    page: currentPage,
    ...filters,
  }), [debouncedSearch, currentPage, filters]);

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
        { value: 'in_progress', label: t('complaints.statusInProgress') },
        { value: 'resolved', label: t('complaints.statusResolved') },
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

  // Convert filters to active filter format for display
  const activeFilters: ActiveFilter[] = useMemo(() => {
    return Object.entries(filters).map(([key, value]) => {
      const config = filterConfigs.find((f :any) => f.key === key);
      const option = config?.options.find((o :any) => o.value === value);
      return {
        key,
        value,
        label: `${config?.label}: ${option?.label || value}`,
      };
    });
  }, [filters, filterConfigs]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string| null) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleFilterRemove = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
            complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
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
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            complaint.status === 'resolved' || complaint.status === 'closed' ? 'bg-green-100 text-green-800' :
            complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
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
      cell: (complaint) => (
        <RowActions
          row={complaint}
          actions={[
            {
              icon: Eye,
              variant: "view",
              onClick: (row) => openView(row),
            },
            {
              icon: Edit,
              variant: "edit",
              onClick: (row) => openEdit(row),
              allowedRoles: ['system_manager'],
            },
            {
              icon: Trash2,
              variant: "destructive",
              onClick: (row) => openDelete(row),
              allowedRoles: ['system_manager'],

            },
          ]}
        />
      ),
    },
  ], [t, pagination, currentPage]);

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
        onSearchChange={handleSearchChange}
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onFilterRemove={handleFilterRemove}
        onClearAllFilters={handleClearAllFilters}
        action={
          <RoleGuard allowedRoles={['system_manager']}>
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
        currentPage={pagination?.current_page || currentPage}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={handlePageChange}
        emptyMessage={t('complaints.empty')}
      />

      {/* Complaint Dialog */}
      <ComplaintDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        complaint={dialog?.type === 'view' ? dialog.item : null}
      />

      {/* Create/Edit Complaint Dialog */}
      <RoleGuard allowedRoles={['system_manager']}>
        <ComplaintFormDialog
          open={dialog?.type === 'create' || dialog?.type === 'edit'}
          onOpenChange={(open) => !open && close()}
          itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
        />

      {/* Delete Confirmation Dialog */}
      <DeleteComplaintDialog
        open={dialog?.type === 'delete'}
        complaint={dialog?.type === 'delete' ? dialog.item : null}
        onClose={close}
      />

      {/* State change confirmation dialog */}
      {/* <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("complaints.changeStatus")}
        description={t("complaints.changeStatusConfirm")}
        submitText={t("common.confirm")}
        cancelText={t("common.cancel")}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t("complaints.statusChangeWarning")}
        </p>
      </ActionDialog> */}
      </RoleGuard>

    </div>
  );
};
