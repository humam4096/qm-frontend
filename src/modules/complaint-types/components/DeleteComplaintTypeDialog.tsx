import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { toast } from 'sonner';
import { useDeleteComplaintType } from '../hooks/useComplaintTypes';

interface DeleteComplaintTypeDialogProps {
  open: boolean;
  complaintTypeId: number | null;
  onClose: () => void;
}

export const DeleteComplaintTypeDialog: React.FC<DeleteComplaintTypeDialogProps> = ({
  open,
  complaintTypeId,
  onClose,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteComplaintType, isPending, error } = useDeleteComplaintType();

  const handleDelete = async () => {
    if (!complaintTypeId) return;

    await deleteComplaintType(complaintTypeId);
    toast.success(t('complaintTypes.deleteSuccess'));
    onClose();
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={(open) => !open && onClose()}
      title={t('complaintTypes.deleteConfirmTitle')}
      submitText={t('complaintTypes.yesDelete')}
      cancelText={t('complaintTypes.cancel')}
      onSubmit={handleDelete}
      isDestructive
      isLoading={isPending}
      contentClassName="max-w-lg"
      footer
    >
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground">
          {t('complaintTypes.deleteConfirmDesc')}
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
