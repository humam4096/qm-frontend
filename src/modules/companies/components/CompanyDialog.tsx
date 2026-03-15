import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import type { Company } from '../types';

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
}

export const CompanyDialog: React.FC<BranchDialogProps> = ({
  open,
  onOpenChange,
  company,
}) => {
  const { t } = useTranslation();

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t('companies.branches')}
      contentClassName="max-w-lg"
    >
      <div className="flex items-center justify-center gap-2">
        {company?.name}
      </div>
    </ActionDialog>

  );
};