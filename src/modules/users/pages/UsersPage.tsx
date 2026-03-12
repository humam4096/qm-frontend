import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import { DataTable, type ColumnDef } from '../../../components/ui/data-table';
import { Badge } from '../../../components/ui/badge';
import { useUsers, useToggleUserStatus, useDeleteUser } from '../hooks/useUsers';
import { UserFormDialog } from '../components/UserFormDialog';
import { UserDetailsDialog } from '../components/UserDetailsDialog';
import type { User } from '../types';
import { ActionDialog } from '../../../components/ui/action-dialog';
import { useDebounce } from '@/hooks/useDebounce';
import { UserRowActions } from '../components/UserRowActions';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
type ID = string | number

export const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit] = useState(10);
  
  // Dialog Overlays
  const [dialog, setDialog] = useState<
    | { type: 'create' }
    | { type: 'edit'; user: User }
    | { type: 'view'; id: ID }
    | { type: 'delete'; id: ID }
    | null
  >(null)

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Queries & Mutations
  const { data, isLoading } = useUsers(currentPage, limit, debouncedSearch);
  const { mutate: toggleStatus, isPending: isToggling, variables } = useToggleUserStatus();  
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();


  const users = data?.data ?? []
  const pagination = data?.pagination

  // console.log(users)
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

  const handleToggleStatus = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStatus(user.id);
  };

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
         const isRowToggling = isToggling && variables === user.id;
         return (

            <Badge 
              variant={user.is_active ? 'default' : 'secondary'}
              className={isRowToggling ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
              onClick={(e) => {
                // Prevent clicking again while toggling:
                if (isRowToggling) return;
                handleToggleStatus(user, e);
              }}
            >
              {user.is_active ? t('users.active') : t('users.inactive')}
            </Badge>
         )
      }
    },
    {
      header: t('users.actions'),
      className: 'text-left rtl:text-right',
      cell: (user) => (
        <UserRowActions
          user={user}
          onView={(id) => setDialog({ type: 'view', id })}
          onEdit={(user) => setDialog({ type: 'edit', user })}
          onDelete={(id) => setDialog({ type: 'delete', id })}
        />
      )
    }
], [t, pagination?.current_page, currentPage, limit, isToggling])

  // const columns = useMemo(
  //   () =>
  //     getUsersColumns({
  //       t,
  //       onView: (id) => setDialog({ type: "view", id }),
  //       onEdit: (user) => setDialog({ type: "edit", user }),
  //       onDelete: (id) => setDialog({ type: "delete", id }),
  //       onToggleStatus: handleToggleStatus,
  //       isToggling: (id) => variables === id,
  //       page: currentPage,
  //       limit
  //     }),
  //   [t, currentPage, limit, variables]
  // )

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-primary">{t('users.title')}</h2>
          <p className="text-muted-foreground">{t('nav.users')}</p>
        </div>
        
        <Button 
          onClick={() => {
            setDialog({ type: 'create' })
          }}
        >
          {t('users.addUser')}
        </Button>
      </div>

      {/* Toolbar / Search */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t("users.searchPlaceholder")}
        onChange={handleSearchChange}
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
        onOpenChange={(open) => !open && setDialog(null)}
        userToEdit={dialog?.type === 'edit' ? dialog.user : null}
      />
      
      <UserDetailsDialog 
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && setDialog(null)}
        userId={dialog?.type === 'view' ? dialog.id : null}
      />

      {/* Delete Confirmation Dialog */}
      <ActionDialog
        isOpen={dialog?.type === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        onSubmit={() => {
          if (dialog?.type   === 'delete') {
            deleteUser(dialog.id)
          }
        }}
        title={t('users.deleteConfirmTitle')}
        submitText={t('users.yesDelete')}
        cancelText={t('users.cancel')}
        isLoading={isDeleting}
        isDestructive={true}
      >
        <div className="py-4 text-muted-foreground max-w-sm">
          {t('users.deleteConfirmDesc')}
        </div>
      </ActionDialog>

    </div>
  );
};
