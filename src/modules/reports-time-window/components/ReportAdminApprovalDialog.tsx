import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useReportAdminApproval } from '../hooks/useReportsTimeWindow';
import { toast } from 'sonner';
import type { TimeSlot } from '../types';
import { ErrorMsg } from '@/components/dashboard/ErrorMsg';

interface ReportApprovalDialogProps {
  open: boolean;
  report: TimeSlot | null;
  onOpenChange: (open: boolean) => void;
}

export const ReportAdminApprovalDialog: React.FC<ReportApprovalDialogProps> = ({
  open,
  report,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  const { mutate: updateApproval, isPending, error } = useReportAdminApproval();

  const handleSubmit = () => {
    if (!report) return;

    setValidationError('');

    updateApproval(
      {
        id: report.id,
        payload: {
          ...(notes.trim() && { notes: notes.trim() }),
        },
      },
      {
        onSuccess: () => {
          toast.success(t('common.success'));
          onOpenChange(false);
          setNotes('');
          setValidationError('');
        },
        onError: (err: any) => {
          toast.error(err?.message || t('common.error'));
        },
      }
    );
  };

  const handleCancel = () => {
    setNotes('');
    setValidationError('');
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t('reports.adminApproval')}
      submitText={t('common.save')}
      cancelText={t('common.cancel')}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isPending}
      contentClassName="max-w-lg"
      footer
    >
      <div className="space-y-4">

        {/* Notes Textarea */}
        <div className="space-y-2">
          <Label>
            {t('common.notes')}
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder={t('common.notes')}
            rows={4}
          />
          {validationError && (
            <p className="text-destructive text-sm">{validationError}</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <ErrorMsg message={(error as any)?.message || t('common.error')} />
        )}
      </div>
    </ActionDialog>
  );
};
