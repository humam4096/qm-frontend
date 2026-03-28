import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetContracts, useDeleteContract } from '../hooks/useContracts';
import { useContractBuilder } from '../components/builder/context/ContractBuilderContext';
import { ContractBuilderModal } from '../components/builder/ContractBuilderModal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { Button } from '@/components/ui/button';
import { ContractStatsCards } from '../components/ContractStatsCards';
import { ContractList } from '../components/ContractList';

// A wrapper to inject provider and handle the open state properly
export function ContractsPage() {

  const { t } = useTranslation();
  const { setIsOpen } = useContractBuilder();
  
  const [search, setSearch] = useState("");

  const { data: contractsRes, isLoading } = useGetContracts();
  const allContracts = contractsRes?.data || [];

  const deleteContract = useDeleteContract();
  

  const handleDelete = (id: string) => {
    if (confirm(t('contracts.deleteConfirmDesc'))) {
      deleteContract.mutateAsync(id);
    }
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <PageHeader
          title={t('contracts.title')}
          description={t('contracts.subtitle')}
        />

        {/* Stats Cards */}
        <ContractStatsCards
          allContracts={allContracts}
        />

        {/* Search Toolbar */}
        <SearchToolbar
          value={search}
          placeholder={t('contracts.searchPlaceholder')}
          onChange={setSearch}
          action={
            <Button onClick={() => setIsOpen(true)} className="gap-2 shrink-0">
              <PlusIcon className="w-4 h-4" />
              {t('contracts.addContract')}
            </Button>
          }
        />

        {/* Contract List */}
        <ContractList
          contracts={allContracts}
          isLoading={isLoading}
          onDelete={handleDelete}
        />

        <ContractBuilderModal />
      </div>

    </>
  );
}
