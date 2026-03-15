import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Zone } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useZones, useToggleZoneStatus } from '../hooks/useZones';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { StatusBadge } from '@/components/ui/status-badge';
import { ZoneFormDialog } from '../components/ZoneFormDialog';
import { DeleteZoneDialog } from '../components/DeleteZoneDialog';
import { toast } from 'sonner';
import { ZoneDialog } from '../components/ZoneDialog';
import { ActionDialog } from '@/components/ui/action-dialog';


export const ZonesPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // change state comfirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const { mutateAsync, isPending: stateToggleIsPending } = useToggleZoneStatus()

  const { 
    dialog,
    openCreate,
    openEdit,
    openDelete,
    openView,
    close
  } = useDialogState<Zone>();

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: zonesData, isLoading: isZonesLoading } = useZones({ search: debouncedSearch, page: currentPage });

  
  const zones = zonesData?.data ?? []
  const pagination = zonesData?.pagination

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
      await mutateAsync(selectedZone?.id!);
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
  const columns = useMemo<ColumnDef<Zone>[]>(() => [
    {
      header: '#',
      className: 'w-12 text-center text-muted-foreground font-medium',
      cell: (_, index) => index + 1
    },

    {
      header: t('zones.name'),
      accessorKey: 'name',
      cell: (zone) => (
        <div className="font-medium">{zone.name}</div>
      )
    },
    {
      header: t('zones.code'),
      accessorKey: 'code',
      cell: (zone) => (
        <div className="text-muted-foreground">
          {zone.code}
        </div>
      )
    },

    {
      header: t('zones.location'),
      accessorKey: 'location',
      cell: (zone) => (
        <div className="text-muted-foreground">
          {zone.location?.name || 'N/A'}
        </div>
      )
    },

    {
      header: t('zones.status'),
      accessorKey: 'is_active',
      cell: (zone) => {
        return (
          <StatusBadge
            onClick={() => {
              setSelectedZone(zone);
              setConfirmOpen(true);
            }} 
            status={zone.is_active}
            isLoading={stateToggleIsPending}
          />
        )
      }
      
    },

    {
      header: t('zones.actions'),
      className: 'text-left rtl:text-right',
      cell: (zone) => (
        <RowActions
          row={zone}
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
        title={t('zones.title')}
        description={t('zones.subtitle')}
      />

      {/* Toolbar / Search */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t('zones.searchPlaceholder')}
        onChange={handleSearchChange}
        action={
          <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
            <Plus className="me-2 h-4 w-4" />
            {t('zones.addZone')}
          </Button>
        }
      />

      {/* Data Table Wrapper */}
        <DataTable
          columns={columns}
          data={zones}
          isLoading={isZonesLoading}
          currentPage={pagination?.current_page || currentPage}
          totalPages={pagination?.total_pages ?? 0}
          onPageChange={handlePageChange}
          emptyMessage={t('zones.empty')}
        />

      {/* Create/Edit Zone Dialog */}
      <ZoneFormDialog
        open={dialog?.type === 'create' || dialog?.type === 'edit'}
        onOpenChange={(open: boolean) => !open && close()}
        itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteZoneDialog
        open={dialog?.type === 'delete'}
        zone={dialog?.type === 'delete' ? dialog.item : null}
        onClose={close}
      />

      {/* Zones Dialog */}
      <ZoneDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open: boolean) => !open && close()}
        zone={dialog?.type === 'view' ? dialog.item : null}
      />

      {/* State change comfirmation dialog */}
      <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("zones.changeStatus")}
        description={t("zones.changeStatusConfirm")}
        submitText={t("common.confirm")}
        cancelText={t("common.cancel")}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t("zones.statusChangeWarning")}
        </p>
      </ActionDialog>
    </div>
  );
}