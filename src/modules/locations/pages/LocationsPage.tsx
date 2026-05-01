import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Location } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useLocations } from '../hooks/useLocations';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { LocationFormDialog } from '../components/LocationFormDialog';
import { DeleteLocationDialog } from '../components/DeleteLocationDialog';
import { LocationDialog } from '../components/LocationDialog';
import { RoleGuard } from '@/app/router/RoleGuard';
import { useAdvancedFilters } from '@/hooks/filter-systerm/useAdvancedFilters';
import { AdvancedFilterSystem } from '@/components/dashboard/AdvancedFilterSystem';


export const LocationsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const {
    searchTerm,
    setSearchTerm,
    setFilter,
    removeFilter,
    clearFilters,
    page,
    setPage,
    apiFilters
  } = useAdvancedFilters()

  const { 
    dialog,
    openCreate,
    openEdit,
    openDelete,
    openView,
    close
  } = useDialogState<Location>();

  const { data: locationsData, isLoading: isLocationsLoading } = useLocations(apiFilters);

  // console.log(locationsData)
  const locations = locationsData?.data ?? []
  const pagination = locationsData?.pagination

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, []);
  

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
        header: t('locations.zones'),
        accessorKey: 'zones_count',
        cell: (location) => {
          const baseClasses =
            "w-10 rounded-lg flex items-center justify-center border";
          const activeClasses =
            "text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-900/20";
          const inactiveClasses =
            "text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-900/20";
          return (
            <div
              className={`${baseClasses} ${
                location.zones_count > 0 ? activeClasses : inactiveClasses
              }`}
            >
              <span>{location.zones_count}</span>
            </div>
          )
        }
        
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
              onClick: (row) => openView(row)
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
            }
          ]}
        />
      )
    },

  ], [t, pagination?.current_page, page]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">

      {/* Header Area */}
      <PageHeader
        title={t('locations.title')}
        description={t('locations.subtitle')}
      />

      {/* Toolbar / Search */}
      <AdvancedFilterSystem
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilter}
        onFilterRemove={removeFilter}
        onClearAllFilters={clearFilters}
        action={
          <RoleGuard allowedRoles={['system_manager']}>
            <Button
              className="w-full px-6 hover:bg-primary/80"
              onClick={openCreate}>
                <Plus/>
              {t('locations.addLocation')}
            </Button>
          </RoleGuard>
        }
      />

      {/* Data Table Wrapper */}
      <DataTable
        columns={columns}
        data={locations}
        isLoading={isLocationsLoading}
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages || (locations.length > 0 ? 1 : 0)}
        onPageChange={handlePageChange}
        emptyMessage={t('locations.empty')}
      />

      {/* Location Dialog */}
      {dialog?.type === 'view' && 
        <LocationDialog
          open={dialog?.type === 'view'}
          onOpenChange={(open) => !open && close()}
          location={dialog?.type === 'view' ? dialog?.item : null}
        />}

      <RoleGuard allowedRoles={['system_manager']}>
        {/* Create/Edit Location Dialog */}
        {(dialog?.type === 'create' || dialog?.type === 'edit') && 
          <LocationFormDialog
            open={dialog?.type === 'create' || dialog?.type === 'edit'}
            onOpenChange={(open) => !open && close()}
            itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
          />}

        {/* Delete Confirmation Dialog */}
        {dialog?.type === 'delete' && 
          <DeleteLocationDialog
            open={dialog?.type === 'delete'}
            location={dialog?.type === 'delete' ? dialog.item : null}
            onClose={close}
          />}
      </RoleGuard>
    </div>
  );
}
