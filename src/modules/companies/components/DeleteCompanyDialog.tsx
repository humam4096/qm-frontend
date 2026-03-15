import React from 'react';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useDeleteCompany } from '../hooks/useCompay';

interface DeleteCompanyDialogProps {
  open: boolean;
  companyId: string | null | number;
  onClose: () => void;
}

export const DeleteCompanyDialog: React.FC<DeleteCompanyDialogProps> = ({
  open,
  companyId,
  onClose,
}) => {
  const { t } = useTranslation();
  // delete mutation
  const { mutateAsync, isPending, error } = useDeleteCompany();

  const handleDelete = async () => {
    if (!companyId) return;
    
    await mutateAsync(companyId);
    toast.success(t('companies.deleteSuccess'));
    onClose();
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={(open) => !open && onClose()}
      onSubmit={handleDelete}
      title={t('companies.deleteConfirmTitle')}
      submitText={t('companies.yesDelete')}
      cancelText={t('companies.cancel')}
      isDestructive
      isLoading={isPending}
      contentClassName="max-w-lg"
      footer
    >
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground">
          {t('companies.deleteConfirmDesc')}
        </div>

        {error && (
          <div className="w-full text-destructive text-center">
            {error instanceof Error ? error.message : t("common.unexpectedError")}
          </div>
        )}
      </div>
    </ActionDialog>
  );
};