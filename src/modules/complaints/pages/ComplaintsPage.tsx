import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Complaint } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useComplaints } from '../hooks/useComplaints';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { ComplaintFormDialog } from '../components/ComplaintFormDialog';
import { DeleteComplaintDialog } from '../components/DeleteComplaintDialog';
import { ComplaintDialog } from '../components/ComplaintDialog';
import { RoleGuard } from '@/app/router/RoleGuard';

export const ComplaintsPage: React.FC = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    dialog,
    openCreate,
    openEdit,
    openDelete,
    openView,
    close,
  } = useDialogState<Complaint>();

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: complaintsData, isLoading: isComplaintsLoading } = useComplaints({ search: debouncedSearch, page: currentPage });

  const complaints = complaintsData?.data ?? [];
  const pagination = complaintsData?.pagination;

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // const handleStateChange = async () => {
  //   try {
  //     await mutateAsync(selectedComplaint?.id!);
  //     setConfirmOpen(false);
  //     toast.success(t("common.success"));
  //   } catch (err: any) {
  //     const message =
  //       err?.response?.data?.message ||
  //       err?.message ||
  //       t("common.unexpectedError");
  //     toast.error(message);
  //   }
  // };

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
            {complaint.priority}
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
            {complaint.status}
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
            },
            {
              icon: Trash2,
              variant: "destructive",
              onClick: (row) => openDelete(row),
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
      <SearchToolbar
        value={searchTerm}
        placeholder={t('complaints.searchPlaceholder')}
        onChange={handleSearchChange}
        action={
          <RoleGuard allowedRoles={['quality_inspector', 'system_manager']}>
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

      {/* Create/Edit Complaint Dialog */}
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

      {/* Complaint Dialog */}
      <ComplaintDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        complaint={dialog?.type === 'view' ? dialog.item : null}
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
    </div>
  );
};
