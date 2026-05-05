import { FileTextIcon, ClockIcon, FileIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/components/dashboard/StatCard';
import type { ContractStats } from '../api/contracts.api';

interface ContractStatsCardsProps {
  contractStats?: ContractStats;
}

export function ContractStatsCards({ 
  contractStats
}: ContractStatsCardsProps) {
  const { t } = useTranslation();

  const activeCount = contractStats?.active_contracts_count || 0;
  const draftCount = contractStats?.inactive_contracts_count || 0;
  const totalMeals = (contractStats?.total_meals_in_active_contracts || 0) + (contractStats?.total_meals_in_inactive_contracts || 0);
  const totalCount = contractStats?.total_contracts_count || 0;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={t('contracts.totalContracts')}
        value={totalCount}
        icon={<FileTextIcon className="w-6 h-6" />}
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
      />
      
      <StatCard
        title={t('contracts.activeContracts')}
        value={activeCount}
        icon={<FileTextIcon className="w-6 h-6" />}
        iconColor="text-success"
        iconBgColor="bg-success/10"
        className="border-l-4 border-l-success"
      />
      
      <StatCard
        title={t('contracts.totalMeals')}
        value={totalMeals}
        icon={<ClockIcon className="w-6 h-6" />}
        iconColor="text-secondary"
        iconBgColor="bg-secondary/10"
      />
      
      <StatCard
        title={t('contracts.drafts')}
        value={draftCount}
        icon={<FileIcon className="w-6 h-6" />}
        iconColor="text-warning"
        iconBgColor="bg-warning/10"
        className="border-l-4 border-l-warning"
      />
    </div>
  );
}