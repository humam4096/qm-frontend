import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import { DataTable, type ColumnDef } from '../../../components/ui/data-table';
import { Badge } from '../../../components/ui/badge';
import { useUsers, useToggleUserStatus } from '../hooks/useUsers';
import { UserFormDialog } from '../components/UserFormDialog';
import { UserDetailsDialog } from '../components/UserDetailsDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { RowActions } from '@/components/ui/row-actions';
import type { User } from '../types';
import { useDialogState } from '@/hooks/useDialogState';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { DeleteUserDialog } from '../components/DeleteUserDialog';
import { toast } from 'sonner';
import { ActionDialog } from '@/components/ui/action-dialog';
import { StatusBadge } from '@/components/ui/status-badge';

export const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit] = useState(10);

  // change state comfirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { 
    dialog,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useDialogState<User>();

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Queries & Mutations
  const { data, isLoading } = useUsers(currentPage, limit, debouncedSearch);
  const { mutateAsync: toggleStatus, isPending: isToggling } = useToggleUserStatus();  

  const users = data?.data ?? []
  const pagination = data?.pagination

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = (value: string | number) => {
    // Prevent resetting page if search hasn't actually changed (e.g. on mount)
    if (String(value) === searchTerm) return;
    
    setSearchTerm(String(value));
    setCurrentPage(1); // Reset to first page on search
  };


  const handleStateChange = async () => {
    try {
      await toggleStatus(selectedUser?.id!);
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
  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      header: '#',
      className: 'w-12 text-center text-muted-foreground font-medium',
      cell: (_, index) => {
         const page = pagination?.current_page || currentPage;
         return (page - 1) * limit + index + 1;
      }
    },
    {
      header: t('users.name'),
      accessorKey: 'name',
      cell: (user) => <div className="font-medium">{user.name}</div>
    },
    {
      header: t('users.email'),
      accessorKey: 'email',
      cell: (user) => <div className="text-muted-foreground">{user.email}</div>
    },
    {
      header: t('users.role'),
      accessorKey: 'role',
      cell: (user) => (
        <Badge variant="outline" className="capitalize">
          {user.role.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      header: t('users.status'),
      accessorKey: 'is_active',
      cell: (user) => {
        return (
          <StatusBadge
            onClick={() => {
              setSelectedUser(user);
              setConfirmOpen(true);
            }} 
            status={user.is_active}
            isLoading={isToggling}
          />
        )
      }
    },
    {
      header: t('users.actions'),
      className: 'text-left rtl:text-right',
      cell: (user) => (
        <RowActions
          row={user}
          actions={[
            {
              icon: Eye,
              variant: "view",
              onClick: (row) => openView(row.id)
            },
            {
              icon: Edit,
              variant: "edit",
              onClick: (row) => openEdit(row)
            },
            {
              icon: Trash2,
              variant: "destructive",
              onClick: (row) => openDelete(row.id)
            }
          ]}
        />
      )
    }
  ], [t, pagination?.current_page, currentPage, limit, isToggling])


  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Area */}
      <PageHeader
        title={t('users.title')}
        description={t('nav.users')}
      />

      {/* Toolbar / Search */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t("users.searchPlaceholder")}
        onChange={handleSearchChange}
        action={
          <Button 
            className="px-6 hover:bg-primary/80"
            onClick={openCreate}>
              <Plus/>
            {t('users.addUser')}
          </Button>
        }
      />

      {/* Data Table Wrapper */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        currentPage={pagination?.current_page || currentPage}
        totalPages={pagination?.total_pages || (users.length > 0 ? 1 : 0)}
        onPageChange={handlePageChange}
        emptyMessage={t('users.empty')}
      />

      {/* Dialogs */}
      <UserFormDialog 
        open={dialog?.type === 'create' || dialog?.type === 'edit'}
        onOpenChange={(open) => !open && close()}
        userToEdit={dialog?.type === 'edit' ? dialog.item : null}
      />
      
      <UserDetailsDialog 
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        userId={dialog?.type === 'view' ? dialog.id : null}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={dialog?.type === 'delete'}
        userId={dialog?.type === 'delete' ? dialog.id : null}
        onClose={close}
      />

      {/* State change comfirmation dialog */}
      <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("users.changeStatus")}
        description={t("users.changeStatusConfirm")}
        submitText={t("common.confirm")}
        cancelText={t("common.cancel")}
        onSubmit={handleStateChange}
        isLoading={isToggling}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t("users.statusChangeWarning")}
        </p>
      </ActionDialog>

    </div>
  );
};
