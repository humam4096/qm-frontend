import React from 'react';
import { ActionDialog } from '@/components/ui/action-dialog';
import type { Complaint } from '../types';
import { useDeleteComplaint } from '../hooks/useComplaints';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface DeleteComplaintDialogProps {
  open: boolean;
  complaint: Complaint | null;
  onClose: () => void;
}

export const DeleteComplaintDialog: React.FC<DeleteComplaintDialogProps> = ({
  open,
  complaint,
  onClose,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteComplaint, isPending, error } = useDeleteComplaint();

  const handleDelete = async () => {
    if (!complaint) return;

    try {
      await deleteComplaint(complaint.id);
      toast.success(t('complaints.deleteSuccess'));
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t('common.unexpectedError');
      toast.error(message);
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onClose}
      title={t('complaints.deleteConfirmTitle')}
      description={t('complaints.deleteConfirmDesc')}
      submitText={t('complaints.yesDelete')}
      cancelText={t('common.cancel')}
      onSubmit={handleDelete}
      isLoading={isPending}
      footer
      contentClassName="max-w-md"
      // variant="destructive"
    >
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground">
          {t("complaints.deleteConfirmDesc")}
        </div>

        {error && (
          <div className="w-full text-destructive text-center">
            {error instanceof Error
              ? error.message
              : t("common.unexpectedError")}
          </div>
        )}
      </div>
    </ActionDialog>
  );
};
