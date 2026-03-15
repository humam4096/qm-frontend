import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Location } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useLocations, useToggleLocationStatus } from '../hooks/useLocations';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { LocationFormDialog } from '../components/LocationFormDialog';
import { DeleteLocationDialog } from '../components/DeleteLocationDialog';
import { toast } from 'sonner';
import { LocationDialog } from '../components/LocationDialog';
import { ActionDialog } from '@/components/ui/action-dialog';


export const LocationsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // change state confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // this is here for no reason
  console.log(selectedLocation, setSelectedLocation);

  const { mutateAsync, isPending: stateToggleIsPending } = useToggleLocationStatus()

  const { 
    dialog,
    openCreate,
    openEdit,
    openDelete,
    openView,
    close
  } = useDialogState<Location>();

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: locationsData, isLoading: isLocationsLoading } = useLocations({ search: debouncedSearch, page: currentPage });

  const locations = locationsData?.data ?? []
  const pagination = locationsData?.pagination

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
      await mutateAsync(selectedLocation?.id!);
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
  const columns = useMemo<ColumnDef<Location>[]>(() => [
    {
      header: '#',
      className: 'w-12 text-center text-muted-foreground font-medium',
      cell: (_, index) => index + 1
    },

    {
      header: t('locations.name'),
      accessorKey: 'name',
      cell: (location) => (
        <div className="font-medium">{location.name}</div>
      )
    },

    {
      header: t('locations.actions'),
      className: 'text-left rtl:text-right',
      cell: (location) => (
        <RowActions
          row={location}
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
    },

    // {
    //   header: t('locations.status'),
    //   accessorKey: 'is_active',
    //   cell: (location) => {
    //     return (
    //       <StatusBadge
    //         onClick={() => {
    //           setSelectedLocation(location);
    //           setConfirmOpen(true);
    //         }} 
    //         status={location.is_active}
    //         isLoading={stateToggleIsPending}
    //       />
    //     )
    //   }
    // },


  ], [t, pagination, currentPage, stateToggleIsPending]);


  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">

      {/* Header Area */}
      <PageHeader
        title={t('locations.title')}
        description={t('locations.subtitle')}
      />

      {/* Toolbar / Search */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t('locations.searchPlaceholder')}
        onChange={handleSearchChange}
        action={
          <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
            <Plus className="me-2 h-4 w-4" />
            {t('locations.addLocation')}
          </Button>
        }
      />

      {/* Data Table Wrapper */}
        <DataTable
          columns={columns}
          data={locations}
          isLoading={isLocationsLoading}
          currentPage={pagination?.current_page || currentPage}
          totalPages={pagination?.total_pages || (locations.length > 0 ? 1 : 0)}
          onPageChange={handlePageChange}
          emptyMessage={t('locations.empty')}
        />

      {/* Create/Edit Location Dialog */}
      <LocationFormDialog
        open={dialog?.type === 'create' || dialog?.type === 'edit'}
        onOpenChange={(open) => !open && close()}
        itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteLocationDialog
        open={dialog?.type === 'delete'}
        locationId={dialog?.type === 'delete' ? dialog.id : null}
        onClose={close}
      />

      {/* Location Dialog */}
      <LocationDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        elId={dialog?.type === 'view' ? dialog.id : null}
      />

      {/* State change confirmation dialog */}
      <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("locations.changeStatus")}
        description={t("locations.changeStatusConfirm")}
        submitText={t("common.confirm")}
        cancelText={t("common.cancel")}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t("locations.statusChangeWarning")}
        </p>
      </ActionDialog>
    </div>
  );
}
