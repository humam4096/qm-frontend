import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { DailyReportDisplay } from './DailyReportDisplay';
import type { DailySlot } from '../types';
import { CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUpdateReportVisibility } from '../hooks/useReportsDialy';

interface DailyReportDialogProps {
  open: boolean;
  report: DailySlot | null;
  onOpenChange: (open: boolean) => void;
}

export const DailyReportDialog: React.FC<DailyReportDialogProps> = ({
  open,
  report,
  onOpenChange,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { mutate: updateApproval, isPending } = useUpdateReportVisibility();

  const handleSubmit = () => {
    if (!report) return;

    updateApproval(
      {
        id: report.id,
      },
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
      title={t('reports.reportDetails')}
      footer={false}
      contentClassName="max-w-5xl max-h-[95vh] overflow-y-auto"
    >
      <div className="py-2 md:py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b flex items-center justify-between px-4 py-2">
          <h2 className="text-sm font-semibold">{t('reports.reportView')}</h2>
          {!report?.is_report_visible && 
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-teal-700 bg-teal-700/10 p-2 group-hover:text-teal-700/80 hover:bg-teal-700/10"
            >
              <CheckSquare className='w-4 h-4 transition-transform group-hover:scale-110'/>
              { isPending ? t('reports.approving') : t('reports.approve')}
            </Button>
          }
        </div>

        {report && <DailyReportDisplay data={report} />}
      </div>
    </ActionDialog>
  );
};
