import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';
import type { ApprovalStatus, TimeSlot } from '../types';
import { useReportBranchApproval } from '../hooks/useReports';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ErrorMsg } from '@/components/dashboard/ErrorMsg';

interface BranchApprovalDialogProps {
  open: boolean;
  report: TimeSlot | null;
  onOpenChange: (open: boolean) => void;
}

export const ReportBranchApprovalDialog: React.FC<BranchApprovalDialogProps> = ({
  open,
  report,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ApprovalStatus | null>(null);
  const [validationError, setValidationError] = useState('');

  const { mutate: updateApproval, isPending, error, reset } = useReportBranchApproval();


  const handleSubmit = (status: ApprovalStatus) => {
    if (!report) return;

    // Validate that notes are required when rejecting
    if (status === 'rejected' && !notes.trim()) {
      setValidationError(t('reports.rejectionNotesRequired'));
      return;
    }

    setValidationError('');
      console.log( {
        id: report.id,
        payload: {
          status: status,
          notes: notes.trim() || undefined,
        },
      });

      updateApproval(
        {
          id: report.id,
          payload: {
            status,
            ...(notes.trim() && { notes: notes.trim() }),
          },
        },
        {
          onSuccess: () => {
            toast.success(t('common.success'));
            onOpenChange(false);
            // Reset form
            setNotes('');
            setValidationError('');
          },
          onError: (err: any) => {
            toast.error(err?.message || t('common.error'));
          },
        }
      );
  };

  // Reset form when dialog opens with new report
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setNotes('');
      setValidationError('');
      reset();
    }
    onOpenChange(nextOpen);
  };


  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={handleOpenChange}
      title={t('reports.branchApproval')}
      contentClassName="max-w-lg"
    >

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            {t('reports.branchNotes')}
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              // Clear validation error when user types
              if (validationError) setValidationError('');
            }}
            placeholder={t('common.notes')}
            rows={4}
          />
          {validationError && (
            <p className="text-destructive text-sm text-center">{validationError}</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <ErrorMsg message={(error as any)?.message || t('common.error')}/>
        )}

        <div className="w-full flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setStatus("accepted")
              handleSubmit("accepted")
            }} 
            disabled={isPending}
            className="px-10"
          >
            {isPending && status === "accepted" && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {t('reports.branchApproval.approved')}
          </Button>
          <Button 
            onClick={() =>  {
              setStatus("rejected")
              handleSubmit("rejected")
            }}
            disabled={isPending || (notes.trim() === '' && validationError !== '')}
            className="px-10"
            variant={"destructive"}
          >
            {isPending &&  status === "rejected" && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {t('reports.branchApproval.rejected')}
          </Button>
        </div>
      </div>
    </ActionDialog>
  );
};
