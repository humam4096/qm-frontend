import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompanyDialog: React.FC<BranchDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t('companies.branches')}
      contentClassName="max-w-lg"
    >
      {t('companies.branches')}
    </ActionDialog>

  );
};