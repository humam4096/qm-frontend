import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useDeleteInspectionStage } from '../hooks/useInspectionStages';
import { toast } from 'sonner';
import type { InspectionStage } from '../types';

interface DeleteInspectionStageDialogProps {
  open: boolean;
  stage: InspectionStage | null;
  onClose: () => void;
}

export const DeleteInspectionStageDialog: React.FC<DeleteInspectionStageDialogProps> = ({
  open,
  stage,
  onClose,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteStage, isPending } = useDeleteInspectionStage();

  const handleDelete = async () => {
    if (!stage) return;
    try {
      await deleteStage(stage.id);
      toast.success(t('inspectionStages.deleteSuccess'));
      onClose();
    } catch (error: any) {
      toast.error(error?.message || t('common.error'));
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={t('inspectionStages.deleteConfirmTitle')}
      submitText={t('inspectionStages.yesDelete')}
      cancelText={t('common.cancel')}
      onSubmit={handleDelete}
      isLoading={isPending}
      contentClassName="max-w-md"
      footer
    >
      <p className="text-sm text-muted-foreground">
        {t('inspectionStages.deleteConfirmDesc', { name: stage?.name })}
      </p>
    </ActionDialog>
  );
};
