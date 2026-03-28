import { FileTextIcon, ClockIcon, FileIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/components/dashboard/StatCard';
import type { Contract } from '../types';

interface ContractStatsCardsProps {
  allContracts  : Contract[];
}

export function ContractStatsCards({ 
  allContracts  , 
}: ContractStatsCardsProps) {
  const { t } = useTranslation();

  const activeCount = allContracts.filter(c => c.is_active).length;
  const draftCount = allContracts.filter(c => !c.is_active).length;
  const totalMeals = allContracts.reduce((sum, c) => sum + (c.total_meals || 0), 0);
  const totalCount = allContracts.length;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={t('contracts.totalContracts')}
        value={totalCount}
        icon={<FileTextIcon className="w-6 h-6" />}
        iconColor="text-gray-500"
        iconBgColor="bg-gray-100"
      />
      
      <StatCard
        title={t('contracts.activeContracts')}
        value={activeCount}
        icon={<FileTextIcon className="w-6 h-6" />}
        iconColor="text-green-500"
        iconBgColor="bg-green-50"
        className="border-l-4 border-l-green-500"
      />
      
      <StatCard
        title={t('contracts.totalMeals')}
        value={totalMeals}
        icon={<ClockIcon className="w-6 h-6" />}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-50"
      />
      
      <StatCard
        title={t('contracts.drafts')}
        value={draftCount}
        icon={<FileIcon className="w-6 h-6" />}
        iconColor="text-orange-500"
        iconBgColor="bg-orange-50"
        className="border-l-4 border-l-orange-500"
      />
    </div>
  );
}