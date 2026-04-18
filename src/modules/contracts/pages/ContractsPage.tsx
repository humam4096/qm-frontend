import { useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetContracts } from '../hooks/useContracts';
import { useContractBuilder } from '../components/builder/context/ContractBuilderContext';
import { ContractBuilderModal } from '../components/builder/ContractBuilderModal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { ContractStatsCards } from '../components/ContractStatsCards';
import { ContractList } from '../components/ContractList';
import { ContractDialog } from '../components/ContractDialog';
import { DeleteContractDialog } from '../components/DeleteContractDialog';
import { useDialogState } from '@/hooks/useDialogState';
import type { Contract } from '../types';
import { Pagination } from '@/components/ui/pagination';
import { useAdvancedFilters } from '@/hooks/filter-systerm/useAdvancedFilters';
import { buildActiveFilters } from '@/hooks/filter-systerm/buildActiveFilters';
import { AdvancedFilterSystem } from '@/components/dashboard/AdvancedFilterSystem';
import { useKitchensList } from '@/modules/kitchens/hooks/useKitchens';
import { cn } from '@/lib/utils';
import { RoleGuard } from '@/app/router/RoleGuard';

// A wrapper to inject provider and handle the open state properly
export function ContractsPage() {

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { setIsOpen, setContractId, setHighestStep, setCurrentStep } = useContractBuilder();
  const { data: kitchensData } = useKitchensList();
  
  
  // dialog state
  const { 
    dialog,
    openView,
    openDelete,
    close
  } = useDialogState<Contract>();

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
  // debounce search
  

  // fetch contracts
  const { data: contractsRes, isLoading } = useGetContracts(apiFilters);
  const allContracts = contractsRes?.data || [];
  const pagination = contractsRes?.pagination;
  const totalPages = pagination?.total_pages ?? 0;

  // filter configs
  const filterConfigs: any = useMemo(() => [
    {
      key: 'is_active',
      label: t('kitchens.status'),
      options: [
        { value: 1, label: 'Active' },
        { value: 0, label: 'Inactive' },
      ],
    },
    {
      key: 'meal_type',
      label: 'Meal Type',
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'buffet', label: 'Buffet' },
      ],
    },
    {
      key: 'kitchen_id',
      label: t('kitchens.kitchen'),
      placeholder: t('kitchens.selectKitchen'),
      options: (kitchensData?.data || []).map(kitchen => ({
        value: kitchen.id,
        label: kitchen.name,
      }))
    },
  ], [t, kitchensData]);  

  // active filters
  const activeFilters = useMemo(() => 
    buildActiveFilters(filters, filterConfigs),
    [filters, filterConfigs]
  )
  
  // handlers
  const handleDelete = (contract: Contract) => {
    openDelete(contract);
  };

  // handle edit contract
  const handleEditContract = (contract: Contract) => {
    setIsOpen(true);
    // reset contract builder after update 
    setContractId(contract.id);
    setCurrentStep(1);
    setHighestStep(5);
  };

  // handle page change
  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <PageHeader
        title={t('contracts.title')}
        description={t('contracts.subtitle')}
      />

      {/* Stats Cards */}
      <ContractStatsCards
        allContracts={allContracts}
      />

      {/* Advanced Filter System */}
      <AdvancedFilterSystem
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onFilterRemove={removeFilter}
        onClearAllFilters={clearFilters}
          action={
            <RoleGuard allowedRoles={['system_manager']}>
              <Button className="px-4 md:px-6 hover:bg-primary/80" onClick={() => setIsOpen(true)}>
                <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t('contracts.addContract')}
              </Button>
            </RoleGuard>
        }
      />

      {/* Contract List */}
      <ContractList
        contracts={allContracts}
        isLoading={isLoading}
        onView={openView}
        onEdit={handleEditContract}
        onDelete={handleDelete}
      />
      
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
      
      {/* Contract Builder Modal */}
      <ContractBuilderModal />

      {/* Contract Details Dialog */}
      {dialog?.type === 'view' && 
        <ContractDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        contract={dialog?.type === 'view' ? dialog.item : null}
      />}

      {/* Delete Contract Dialog */}
      {dialog?.type === 'delete' && 
        <DeleteContractDialog
        open={dialog?.type === 'delete'}
        contract={dialog?.type === 'delete' ? dialog.item : null}
        onClose={close}
      />}
      </div>

  );
}
