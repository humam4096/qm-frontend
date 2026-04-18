import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { toast } from 'sonner';
import { useUpdateReportVisibility } from '../hooks/useReportsDialy';
import type { DailySlot } from '../types';
import ContentText from '@/components/dashboard/ContentText';
import { ErrorMsg } from '@/components/dashboard/ErrorMsg';

interface DialyReportVisibilityDialogProps {
  open: boolean;
  report: DailySlot | null;
  onOpenChange: (open: boolean) => void;
}

export const DialyReportVisibilityDialog: React.FC<DialyReportVisibilityDialogProps> = ({
  open,
  report,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  const { mutate: updateApproval, isPending, error } = useUpdateReportVisibility();

  const handleSubmit = () => {
    if (!report) return;


    updateApproval(
      {id: report.id},
      {
        onSuccess: () => {
          toast.success(t('common.success'));
          onOpenChange(false);
        },
        onError: (err: any) => {
          toast.error(err?.message || t('common.error'));
        },
      }
    );
  };


  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t('daily_report.branchApproval')}
      submitText={t('common.save')}
      cancelText={t('common.cancel')}
      onSubmit={handleSubmit}
      isLoading={isPending}
      contentClassName="max-w-lg"
      footer
    >
      <div className="space-y-4">
        <ContentText title="Confirm Approval" content="Once approved, this report will be submitted to the company account and marked as finalized. This action may not be reversible."/>

        {error && (
          <ErrorMsg message={(error as any)?.message || t('common.error')}/>
        )}
      </div>
    </ActionDialog>
  );
};
