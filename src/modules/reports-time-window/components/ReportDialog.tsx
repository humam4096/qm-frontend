import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { ReportDisplay } from './ReportDisplay';
import type { TimeSlot } from '../types';
import { CheckSquare } from 'lucide-react';
import { useReportAdminApproval } from '../hooks/useReportsTimeWindow';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/app/router/RoleGuard';


interface ReportDialogProps {
  open: boolean;
  report: TimeSlot | null;
  onOpenChange: (open: boolean) => void;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  report,
  onOpenChange,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [notes, setNotes] = useState('');

  const { mutate: updateApproval, isPending } = useReportAdminApproval();

  const handleSubmit = () => {
    if (!report) return;

    updateApproval(
      {
        id: report.id,
        payload: {
          notes: notes.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('common.success'));
          onOpenChange(false);
          setNotes('');
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
      title={t('reports.reportDetails')}
      footer={false}
      contentClassName="max-w-5xl max-h-[95vh] overflow-y-auto"
    >
      <div className="py-2 md:py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b flex items-center justify-between px-4 py-2">
          <h2 className="text-sm font-semibold">{t('reports.reportView')}</h2>
          <div className="flex gap-2">
            {report?.can_change_status && 
              <RoleGuard allowedRoles={['system_manager']}>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-teal-700 bg-teal-700/10 p-2 group-hover:text-teal-700/80 hover:bg-teal-700/10"
                >
                  <CheckSquare className='w-4 h-4 transition-transform group-hover:scale-110'/>
                  { isPending ? t('reports.approving') : t('reports.approve')}
                </Button>
              </RoleGuard>
            }
          </div>
        </div>

        {report && <ReportDisplay data={report} />}
      </div>
    </ActionDialog>
  );
};
