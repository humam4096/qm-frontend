import React, { useState } from 'react';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { FormSubmission } from '../types';
import { useTransitionStatus } from '../hooks/useFormSubmissions';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel } from '@/components/ui/field';

interface UpdateSubmissionDialogProps {
  open: boolean;
  form: FormSubmission | null;
  onOpenChange: (open: boolean) => void;
}

export const UpdateSubmissionDialog: React.FC<UpdateSubmissionDialogProps> = ({
  open,
  form,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending, error } = useTransitionStatus()
  const [notes, setNotes] = useState("")

  const handleOpenChange = (open: boolean) => {
    if(!open) setNotes("")
    onOpenChange(open)
  }

  const handleUpdate = async () => {
    if (!form?.id) return
    
    const payload = {
      id: form?.id, 
      payload: {
        ...(notes.trim() && { notes: notes.trim() }),
      }
    }

    await mutateAsync(payload)
    toast.success(t('users.updateSuccess'));

    setNotes("")
    handleOpenChange(false)
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleUpdate}
      title={t('formSubmissions.approveInspectionForm')}
      submitText={t('formSubmissions.approved')}
      cancelText={t('formSubmissions.cancel')}
      isDestructive
      isLoading={isPending}
      footer
      contentClassName="max-w-lg"
    >
      <form className="w-full space-y-4">
        
        <Field>
          <FieldLabel htmlFor='notes'>
            {t('common.notes')}
          </FieldLabel>
          <Textarea
            value={notes}
            placeholder={t('common.notes')}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="min-h-[80px] bg-muted/30 border-none focus-visible:ring-1"
          />
        </Field>

        {error && (
          <div className="w-full text-destructive text-center">
            {error instanceof Error ? error.message : t("common.unexpectedError")}
          </div>
        )}
      </form>
    </ActionDialog>
  );
};