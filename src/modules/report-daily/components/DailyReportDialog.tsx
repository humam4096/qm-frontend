import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { DailyReportDisplay } from './DailyReportDisplay';
import type { DailySlot } from '../types';
import { CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUpdateReportVisibility } from '../hooks/useReportsDialy';
import { DailyReportPaper } from './DailyReportPaper';
import ShareDownload from '@/components/dashboard/ShareDownload';

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

  const reportRef = useRef<HTMLDivElement>(null);
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
          <h2 className="text-sm font-semibold">Report View</h2>
          <div className="flex gap-2">
          {!report?.is_report_visible && 
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-teal-700 bg-teal-700/10 p-2 group-hover:text-teal-700/80 hover:bg-teal-700/10"
            >
              <CheckSquare className='w-4 h-4 transition-transform group-hover:scale-110'/>
              { isPending ? 'Approving...' : 'Approve'}
            </Button>
          }

          <ShareDownload reportRef={reportRef}/>

          </div>
        </div>

        {report && <DailyReportDisplay data={report} />}

        <div className="fixed left-[-9999px] top-0">
          <div ref={reportRef} className='p-16'>
            <DailyReportPaper data={report} />
          </div>
        </div>
      </div>
    </ActionDialog>
  );
};
