import { ActionDialog } from '@/components/ui/action-dialog';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { FormSubmission } from '../types';
import { useDeleteSubmission } from '../hooks/useFormSubmissions';
import { ErrorMsg } from '@/components/dashboard/ErrorMsg';

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
  const { mutateAsync, isPending, error } = useDeleteSubmission()
  
  const handleDelete = async () => {
    if (!submission?.id) return;

    try {
      await mutateAsync(submission.id)
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
      isLoading={isPending}
      footer
    >
      <div className="space-y-2"> 
        <div className="font-medium">
        {t('formSubmissions.form')}: {submission?.form.name}
        </div>
        <div className="text-muted-foreground">
          {t('formSubmissions.kitchen')}: {submission?.kitchen.name}
        </div>
        <div className="text-muted-foreground">
          {t('formSubmissions.time')}: {submission?.time?.label ? `${new Date(submission.inspection_date).toLocaleDateString()} - ${submission?.time?.label}` : t(`forms.${submission?.form_type}`)}
        </div>
        <div className="py-4 text-muted-foreground">
          {t('formSubmissions.deleteConfirmDesc')}
        </div>
      </div>

        {error && (
          <ErrorMsg message={error instanceof Error ? error.message : t("common.unexpectedError")}/>
        )}
    </ActionDialog>
  );
}
