import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Branch } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useBranches, useToggleBranchStatus } from '../hooks/useBranches';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { StatusBadge } from '@/components/ui/status-badge';
import { BranchFormDialog } from '../components/BranchFormDialog';
import { DeleteBranchDialog } from '../components/DeleteBranchDialog';
import { toast } from 'sonner';
import { BranchDialog } from '../components/BranchDialog';
import { ActionDialog } from '@/components/ui/action-dialog';
import { RoleGuard } from '@/app/router/RoleGuard';


export const BranchesPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // change state comfirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { mutateAsync, isPending: stateToggleIsPending } = useToggleBranchStatus()

  const { 
    dialog,
    openCreate,
    openEdit,
    openDelete,
    openView,
    close
  } = useDialogState<Branch>();

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: branchesData, isLoading: isBranchesLoading } = useBranches({ search: debouncedSearch, page: currentPage });

  const branches = branchesData?.data ?? []
  const pagination = branchesData?.pagination

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const handleStateChange = async () => {
    try {
      await mutateAsync(selectedBranch?.id!);
      setConfirmOpen(false);
      toast.success(t("common.success"));
      
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t("common.unexpectedError")
      ;
      toast.error(message);
    }
  }


  // Table Columns
  const columns = useMemo<ColumnDef<Branch>[]>(() => [
    {
      header: '#',
      className: 'w-12 text-center text-muted-foreground font-medium',
      cell: (_, index) => index + 1
    },

    {
      header: t('branches.name'),
      accessorKey: 'name',
      cell: (branch) => (
        <div className="font-medium">{branch.name}</div>
      )
    },
    {
      header: t('branches.email'),
      accessorKey: 'contact_email',
      cell: (branch) => (
        <div className="text-muted-foreground">
          {branch.contact_email}
        </div>
      )
    },

    {
      header: t('branches.phone'),
      accessorKey: 'contact_phone',
      cell: (branch) => (
        <div className="text-muted-foreground">
          {branch.contact_phone}
        </div>
      )
    },

    {
      header: t('branches.status'),
      accessorKey: 'is_active',
      cell: (branch) => {
        return (
          <StatusBadge
            onClick={() => {
              setSelectedBranch(branch);
              setConfirmOpen(true);
            }} 
            status={branch.is_active}
            allowedRoles={['system_manager']}
          />
        )
      }
      
    },

    {
      header: t('branches.actions'),
      className: 'text-left rtl:text-right',
      cell: (branch) => (
        <RowActions
          row={branch}
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
              allowedRoles: ['system_manager']
            }
          ]}
        />
      )
    }

  ], [t, pagination, currentPage, stateToggleIsPending]);


  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">

      {/* Header Area */}
      <PageHeader
        title={t('branches.title')}
        description={t('branches.subtitle')}
      />

      {/* Toolbar / Search */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t('branches.searchPlaceholder')}
        onChange={handleSearchChange}
        action={
          <RoleGuard allowedRoles={['system_manager']}>
            <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
              <Plus className="me-2 h-4 w-4" />
              {t('branches.addBranch')}
            </Button>
          </RoleGuard>
        }
      />

      {/* Data Table Wrapper */}
      <DataTable
        columns={columns}
        data={branches}
        isLoading={isBranchesLoading}
        currentPage={pagination?.current_page || currentPage}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={handlePageChange}
        emptyMessage={t('branches.empty')}
      />

      {/* Branches Dialog */}
      <BranchDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        branch={dialog?.type === 'view' ? dialog.item : null}
      />

      {/* Create/Edit Company Dialog */}
      <RoleGuard allowedRoles={['system_manager']}>
        <BranchFormDialog
          open={dialog?.type === 'create' || dialog?.type === 'edit'}
          onOpenChange={(open) => !open && close()}
          itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteBranchDialog
          open={dialog?.type === 'delete'}
          branch={dialog?.type === 'delete' ? dialog.item : null}
          onClose={close}
        />
   
        {/* State change comfirmation dialog */}
        <ActionDialog
          isOpen={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={t("branches.changeStatus")}
          description={t("branches.changeStatusConfirm")}
          submitText={t("common.confirm")}
          cancelText={t("common.cancel")}
          onSubmit={handleStateChange}
          isLoading={stateToggleIsPending}
          footer
          contentClassName="max-w-md"
        >
          <p className="text-muted-foreground">
            {t("branches.statusChangeWarning")}
          </p>
        </ActionDialog>
      </RoleGuard>

    </div>
  );
}