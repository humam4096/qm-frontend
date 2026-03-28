import { useTranslation } from 'react-i18next';
import { ContractCard } from './ContractCard';
import type { Contract } from '../types';


interface ContractListProps {
  contracts: Contract[];
  isLoading: boolean;
  onView?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contractId: string) => void;
}

export function ContractList({ 
  contracts, 
  isLoading, 
  onView, 
  onEdit, 
  onDelete 
}: ContractListProps) {
  const { t } = useTranslation();

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

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}