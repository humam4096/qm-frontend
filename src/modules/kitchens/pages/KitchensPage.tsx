import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Kitchen } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useKitchens, useToggleKitchenStatus } from '../hooks/useKitchens';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { StatusBadge } from '@/components/ui/status-badge';
import { KitchenFormDialog } from '../components/KitchenFormDialog';
import { DeleteKitchenDialog } from '../components/DeleteKitchenDialog';
import { toast } from 'sonner';
import { KitchenDialog } from '../components/KitchenDialog';
import { ActionDialog } from '@/components/ui/action-dialog';
import { Badge } from '@/components/ui/badge';


export const KitchensPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // change state confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);

  const { mutateAsync, isPending: stateToggleIsPending } = useToggleKitchenStatus()

  const { 
    dialog,
    openCreate,
    openEdit,
    openDelete,
    openView,
    close
  } = useDialogState<Kitchen>();

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: kitchensData, isLoading: isKitchensLoading } = useKitchens({ search: debouncedSearch, page: currentPage });

  const kitchens = kitchensData?.data ?? []
  const pagination = kitchensData?.pagination

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
      await mutateAsync(selectedKitchen?.id!);
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
  const columns = useMemo<ColumnDef<Kitchen>[]>(() => [
    {
      header: '#',
      className: 'w-12 text-center text-muted-foreground font-medium',
      cell: (_, index) => index + 1
    },

    {
      header: t('kitchens.name'),
      accessorKey: 'name',
      cell: (kitchen) => (
        <div className="font-medium">{kitchen.name}</div>
      )
    },
    {
      header: t('kitchens.ownerName'),
      accessorKey: 'owner_name',
      cell: (kitchen) => (
        <div className="text-muted-foreground">
          {kitchen.owner_name}
        </div>
      )
    },

    {
      header: t('kitchens.branch'),
      accessorKey: 'branch.name',
      cell: (kitchen) => (
        <div className="text-muted-foreground">
          {kitchen.branch?.name || 'N/A'}
        </div>
      )
    },

    {
      header: t('kitchens.zone'),
      accessorKey: 'zone.name',
      cell: (kitchen) => (
        <div className="text-muted-foreground">
          {kitchen.zone?.name || 'N/A'}
        </div>
      )
    },

    {
      header: t('kitchens.type'),
      accessorKey: 'is_hajj',
      cell: (kitchen) => (
        <Badge variant={kitchen.is_hajj ? 'default' : 'secondary'}>
          {kitchen.is_hajj ? t('kitchens.hajj') : t('kitchens.regular')}
        </Badge>
      )
    },

    {
      header: t('kitchens.status'),
      accessorKey: 'is_active',
      cell: (kitchen) => {
        return (
          <StatusBadge
            onClick={() => {
              setSelectedKitchen(kitchen);
              setConfirmOpen(true);
            }} 
            status={kitchen.is_active}
            isLoading={stateToggleIsPending}
          />
        )
      }
      
    },

    {
      header: t('kitchens.actions'),
      className: 'text-left rtl:text-right',
      cell: (kitchen) => (
        <RowActions
          row={kitchen}
          actions={[
            {
              icon: Eye,
              variant: "view",
              onClick: (row) => openView(row)
            },
            {
              icon: Edit,
              variant: "edit",
              onClick: (row) => openEdit(row)
            },
            {
              icon: Trash2,
              variant: "destructive",
              onClick: (row) => openDelete(row)
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
        title={t('kitchens.title')}
        description={t('kitchens.subtitle')}
      />

      {/* Toolbar / Search */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t('kitchens.searchPlaceholder')}
        onChange={handleSearchChange}
        action={
          <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
            <Plus className="me-2 h-4 w-4" />
            {t('kitchens.addKitchen')}
          </Button>
        }
      />

      {/* Data Table Wrapper */}
        <DataTable
          columns={columns}
          data={kitchens}
          isLoading={isKitchensLoading}
          currentPage={pagination?.current_page || currentPage}
          totalPages={pagination?.total_pages || (kitchens.length > 0 ? 1 : 0)}
          onPageChange={handlePageChange}
          emptyMessage={t('kitchens.empty')}
        />

      {/* Create/Edit Kitchen Dialog */}
      <KitchenFormDialog
        open={dialog?.type === 'create' || dialog?.type === 'edit'}
        onOpenChange={(open: boolean) => !open && close()}
        itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteKitchenDialog
        open={dialog?.type === 'delete'}
        kitchen={dialog?.type === 'delete' ? dialog.item : null}
        onClose={close}
      />

      {/* Kitchen Dialog */}
      <KitchenDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open: boolean) => !open && close()}
        kitchen={dialog?.type === 'view' ? dialog.item : null}
      />

      {/* State change confirmation dialog */}
      <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("kitchens.changeStatus")}
        description={t("kitchens.changeStatusConfirm")}
        submitText={t("common.confirm")}
        cancelText={t("common.cancel")}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t("kitchens.statusChangeWarning")}
        </p>
      </ActionDialog>
    </div>
  );
}
