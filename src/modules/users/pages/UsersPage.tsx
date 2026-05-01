import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable, type ColumnDef } from '../../../components/ui/data-table';
import { Badge } from '../../../components/ui/badge';
import { useUsers, useToggleUserStatus } from '../hooks/useUsers';
import { UserFormDialog } from '../components/UserFormDialog';
import { UserDetailsDialog } from '../components/UserDetailsDialog';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { RowActions } from '@/components/ui/row-actions';
import type { User } from '../types';
import { useDialogState } from '@/hooks/useDialogState';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { DeleteUserDialog } from '../components/DeleteUserDialog';
import { toast } from 'sonner';
import { ActionDialog } from '@/components/ui/action-dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { AdvancedFilterSystem } from '@/components/dashboard/AdvancedFilterSystem';
import { useAdvancedFilters } from '@/hooks/filter-systerm/useAdvancedFilters';
import { buildActiveFilters } from '@/hooks/filter-systerm/buildActiveFilters';
import { Button } from '@/components/ui/button';
import { BranchAPI } from '@/modules/branches/api/branches.api';
import { ZoneAPI } from '@/modules/zones/api/zones.api';
import { RoleGuard } from '@/app/router/RoleGuard';
import { useLazyFetchData } from '@/hooks/useLazyFetchData';

export const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Dialog state
  const { 
    dialog,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useDialogState<User>();

  // Advanced filters hooks
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

  // Queries & Mutations
  const { data, isLoading } = useUsers(apiFilters);
  
  // Lazy-load filter data only when filter panel is opened
  const { data: branchesData } = useLazyFetchData({
    queryKey: ['branches-list'],
    queryFn: BranchAPI.getBranchesList,
    isOpen: isFilterPanelOpen,
  });
  
  const { data: zonesData } = useLazyFetchData({
    queryKey: ['zones-list'],
    queryFn: ZoneAPI.getZonesList,
    isOpen: isFilterPanelOpen,
  });

  const { mutateAsync: toggleStatus, isPending: isToggling, error: toggleError } = useToggleUserStatus();  

  const users = data?.data ?? []
  const pagination = data?.pagination

    // Define filter configurations
  const filterConfigs: any = useMemo(() => [
    {
      key: 'role',
      label: t('users.role'),
      placeholder: t('users.selectRole'),
      options: [
        { value: 'system_manager', label: t('users.systemManager') },
        { value: 'quality_manager', label: t('users.qualityManager') },
        { value: 'project_manager', label: t('users.projectManager') },
        { value: 'catering_manager', label: t('users.cateringManager') },
        { value: 'quality_supervisor', label: t('users.qualitySupervisor') },
        { value: 'quality_inspector', label: t('users.qualityInspector') },
      ],
    },
    {
      key: 'is_active',
      label: t('users.status'),
      placeholder: t('users.selectStatus'),
      options: [
        { value: '1', label: t('users.active') },
        { value: '0', label: t('users.inactive') },
      ],
    },

    {
      key: 'branch_id',
      label: t('branches.branch'),
      placeholder: t('branches.selectBranch'),
      options: (branchesData?.data || []).map(branch => ({
        value: String(branch.id),
        label: branch.name,
      }))
    },
    {
      key: 'zone_id',
      label: t('zones.zone'),
      placeholder: t('zones.selectZone'),
      options: (zonesData?.data || []).map(zone => ({
        value: zone.id,
        label: zone.name,
      }))
    },
  ], [t, branchesData, zonesData]);  

  const activeFilters = useMemo(() => 
    buildActiveFilters(filters, filterConfigs),
    [filters, filterConfigs]
  )
  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, []);

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
      cell: (_, index) => index + 1,
      
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
            allowedRoles={['system_manager']}
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
              onClick: (row) => openView(row)
            },
            {
              icon: Edit,
              variant: "edit",
              onClick: (row) => openEdit(row),
              allowedRoles: ['system_manager', 'project_manager'],
            },
            {
              icon: Trash2,
              variant: "destructive",
              onClick: (row) => openDelete(row),
              allowedRoles: ['system_manager'],
            }
          ]}
        />
      )
    }
  ], [t, pagination?.current_page, page, isToggling])

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Area */}
      <PageHeader
        title={t('users.title')}
        description={t('users.subtitle')}
      />

      {/* Filtering system */}
        <AdvancedFilterSystem
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterConfigs}
          activeFilters={activeFilters}
          onFilterChange={setFilter}
          onFilterRemove={removeFilter}
          onClearAllFilters={clearFilters}
          onFilterPanelChange={setIsFilterPanelOpen}
          action={
            <RoleGuard allowedRoles={['system_manager', 'project_manager']}>
              <Button
                className="w-full px-6 hover:bg-primary/80"
                onClick={openCreate}>
                  <Plus/>
                {t('users.addUser')}
              </Button>
            </RoleGuard>
          }
        />

      {/* Data Table Wrapper */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={handlePageChange}
        emptyMessage={t('users.empty')}
      />

      {dialog?.type === 'view' && 
        <UserDetailsDialog 
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        user={dialog?.type === 'view' ? dialog.item : null}
      />}

      <RoleGuard allowedRoles={['system_manager', 'project_manager']}>
        {/* Dialogs */}
        {(dialog?.type === 'create' || dialog?.type === 'edit') && 
        <UserFormDialog 
          open={dialog?.type === 'create' || dialog?.type === 'edit'}
          onOpenChange={(open) => !open && close()}
          userToEdit={dialog?.type === 'edit' ? dialog.item : null}
        />}
        

        {/* Delete Confirmation Dialog */}
        {dialog?.type === 'delete' && 
          <DeleteUserDialog
          open={dialog?.type === 'delete'}
          user={dialog?.type === 'delete' ? dialog.item : null}
          onClose={close}
        />}

        {/* State change comfirmation dialog */}
        {confirmOpen && 
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
          {toggleError && (
            <p className=" text-center text-destructive text-sm">{toggleError?.message}</p>
          )}
        </ActionDialog>}
      </RoleGuard>
    </div>
  );
};
