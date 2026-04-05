import { useTranslation } from 'react-i18next';
import { ContractCard } from './ContractCard';
import type { Contract } from '../types';
import { useState } from 'react';
import { toast } from 'sonner';
import { useToggleContractStatus } from '../hooks/useContracts';
import { ActionDialog } from '@/components/ui/action-dialog';
import { CompanyCardSkeleton } from '@/modules/companies/components/CompanyCardSkeleton';


interface ContractListProps {
  contracts: Contract[];
  isLoading: boolean;
  onView: (contract: Contract) => void;
  onEdit: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
}

export function ContractList({ 
  contracts, 
  isLoading, 
  onView, 
  onEdit, 
  onDelete 
}: ContractListProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const { mutateAsync: toggleContractStatus, isPending: stateToggleIsPending } = useToggleContractStatus();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
        {t('contracts.noContractsFound')}
      </div>
    );
  }

  const handleStateChange = async () => {
    if (!selectedContract) return;
    try {
      await toggleContractStatus(selectedContract.id);
      setConfirmOpen(false);
      setSelectedContract(null);
      toast.success(t('common.success'));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t('common.unexpectedError');
      toast.error(message);
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={() => {
              setSelectedContract(contract);
              setConfirmOpen(true);
            }}
          />
        ))}
      </div>

      {/* this is for change active/inactive status of the contract */}
      <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('contracts.changeStatus')}
        description={t('contracts.changeStatusConfirm')}
        submitText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t('contracts.statusChangeWarning')}
        </p>
      </ActionDialog>
    </div>
  );
}