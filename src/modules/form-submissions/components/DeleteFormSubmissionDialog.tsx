import { ActionDialog } from '@/components/ui/action-dialog';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { FormSubmission } from '../types';

interface DeleteFormSubmissionDialogProps {
  open: boolean;
  submission: FormSubmission | null;
  onClose: () => void;
}

export function DeleteFormSubmissionDialog({
  open,
  submission,
  onClose,
}: DeleteFormSubmissionDialogProps) {
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (!submission?.id) return;

    try {
      toast.success(t('formSubmissions.deleteSuccess'));
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          t('common.unexpectedError')
      );
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={(open) => !open && onClose()}
      onSubmit={handleDelete}
      title={t('formSubmissions.deleteConfirmTitle')}
      isDestructive
      contentClassName="max-w-lg"
      footer
    >
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground">
          {t('formSubmissions.deleteConfirmDesc')}
        </div>
      </div>
    </ActionDialog>
  );
}
