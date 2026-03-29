import { useTranslation } from 'react-i18next';
import { ContractCard } from './ContractCard';
import type { Contract } from '../types';
import { useState } from 'react';
import { toast } from 'sonner';
import { useToggleContractStatus } from '../hooks/useContracts';
import { ActionDialog } from '@/components/ui/action-dialog';


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
  const { t } = useTranslation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const { mutateAsync: toggleContractStatus, isPending: stateToggleIsPending } = useToggleContractStatus();

  if (isLoading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {t('contracts.loading')}
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
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
        title={t('contracts.changeStatus', 'Change Status')}
        description={t('contracts.changeStatusConfirm', 'Are you sure you want to change the status?')}
        submitText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t('contracts.statusChangeWarning', 'This action will change the contract active state.')}
        </p>
      </ActionDialog>
    </>
  );
}