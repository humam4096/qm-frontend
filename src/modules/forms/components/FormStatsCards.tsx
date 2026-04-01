import { FileTextIcon, ClockIcon, FileIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/components/dashboard/StatCard';
import type { Form } from '../types';

interface FormStatsCardsProps {
  allForms  : Form[];
}

export function FormStatsCards({ 
  allForms  , 
}: FormStatsCardsProps) {
  const { t } = useTranslation();

  const activeCount = allForms.filter(c => c.is_active).length;
  const totalCount = allForms.length;
  const readinessAssessmentCount = allForms.filter(c => c.form_type === 'readiness_assessment').length;
  const reportCount = allForms.filter(c => c.form_type === 'report').length;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={t('forms.totalforms')}
        value={totalCount}
        icon={<FileTextIcon className="w-6 h-6" />}
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
      />
      
      <StatCard
        title={t('forms.activeforms')}
        value={activeCount}
        icon={<FileTextIcon className="w-6 h-6" />}
        iconColor="text-success"
        iconBgColor="bg-success/10"
        className="border-l-4 border-l-success"
      />
      
      <StatCard
        title={t('forms.readinessAssessment')}
        value={readinessAssessmentCount}
        icon={<ClockIcon className="w-6 h-6" />}
        iconColor="text-secondary"
        iconBgColor="bg-secondary/10"
      />
      
      <StatCard
        title={t('forms.report')}
        value={reportCount}
        icon={<FileIcon className="w-6 h-6" />}
        iconColor="text-warning"
        iconBgColor="bg-warning/10"
        className="border-l-4 border-l-warning"
      />
    </div>
  );
}