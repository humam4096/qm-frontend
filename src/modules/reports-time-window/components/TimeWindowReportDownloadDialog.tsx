import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { DownloadIcon, Share2Icon, FileText, Loader2, PrinterIcon } from 'lucide-react';
import { toast } from 'sonner';
import { usePrintReport } from '@/hooks/usePrintReport';
import type { TimeSlot } from '@/modules/reports-time-window/types';
import { ReportPaper } from './ReportPaper';

interface DailyReportDialogProps {
  open: boolean;
  report: TimeSlot | null;
  onOpenChange: (open: boolean) => void;
}

export const TimeWindowReportDownloadDialog: React.FC<DailyReportDialogProps> = ({
  open,
  report,
  onOpenChange,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Use the professional print hook
  const { reportRef, isGenerating, downloadPDF, print, share } = usePrintReport({
    filename: `time-window-report`,
    orientation: 'portrait',
    format: 'a4',
    quality: 2,
  });

  const onDownload = async () => {
    try {
      await downloadPDF();
      toast.success(t('daily_report.downloadSuccess'));
    } catch (error) {
      console.error('Download error:', error);
      toast.error(t('daily_report.downloadError'));
    }
  };

  const onPrint = async () => {
    try {
      await print();
      toast.success(t('daily_report.printSuccess'));
    } catch (error) {
      console.error('Print error:', error);
      toast.error(t('daily_report.printError'));
    }
  };

  const onShare = async () => {
    try {
      await share();
      toast.success(t('daily_report.shareSuccess'));
    } catch (error: any) {
      console.error('Share error:', error);
      toast.error(error?.message || t('daily_report.shareError'));
    }
  };

  const reportInfo = report
    ? {
        contract: report.label || '—',
        kitchen: report.kitchen.name || '—',
        zone: report.zone.name || '—',
        date: report.start_time || '—',
      }
    : null;
      
  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t('daily_report.reportDetails')}
      footer={true}
      contentClassName="max-w-2xl max-h-[95vh] overflow-hidden"
    >
      <div className="flex flex-col h-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Hidden report for export - positioned off-screen */}
        <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px' }}>
          <div ref={reportRef}>
            <ReportPaper data={report} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Report Info Card */}
          {reportInfo && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-base">
                    {t('daily_report.dailyOperationsReport')}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className='flex gap-1'>
                      <span className="text-muted-foreground">{t('daily_report.contract')}:</span>
                      <span className="ml-2 font-medium">{reportInfo.contract}</span>
                    </div>
                    <div className='flex gap-1'>
                      <span className="text-muted-foreground">{t('daily_report.kitchen')}:</span>
                      <span className="ml-2 font-medium">{reportInfo.kitchen}</span>
                    </div>
                    <div className='flex gap-1'>
                      <span className="text-muted-foreground">{t('daily_report.zone')}:</span>
                      <span className="ml-2 font-medium">{reportInfo.zone}</span>
                    </div>
                    <div className='flex gap-1'>
                      <span className="text-muted-foreground">{t('daily_report.date')}:</span>
                      <span className="ml-2 font-medium">{reportInfo.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export Instructions */}
          <div className="rounded-lg border bg-background p-4 space-y-3">
            <h4 className="font-medium text-sm">{t('daily_report.exportOptions')}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('daily_report.exportDescription')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Download Button */}
            <button
              onClick={onDownload}
              disabled={isGenerating}
              className="group relative flex items-center gap-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:bg-primary/10 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/20 disabled:hover:bg-primary/5 disabled:hover:shadow-none"
            >
              <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <DownloadIcon className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{t('common.download')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('daily_report.downloadAsPDF')}
                </p>
              </div>
            </button>

            {/* Print Button */}
            <button
              onClick={onPrint}
              disabled={isGenerating}
              className="group relative flex items-center gap-3 rounded-lg border-2 border-border bg-background p-4 transition-all hover:border-primary/40 hover:bg-muted hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-background disabled:hover:shadow-none"
            >
              <div className="rounded-lg bg-muted p-2.5 transition-colors group-hover:bg-muted/80">
                  <PrinterIcon className="w-5 h-5 text-foreground transition-transform group-hover:scale-110" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{t('common.print')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('daily_report.printReport')}
                </p>
              </div>
            </button>

            {/* Share Button */}
            <button
              onClick={onShare}
              disabled={isGenerating}
              className="group relative flex items-center gap-3 rounded-lg border-2 border-border bg-background p-4 transition-all hover:border-primary/40 hover:bg-muted hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-background disabled:hover:shadow-none"
            >
              <div className="rounded-lg bg-muted p-2.5 transition-colors group-hover:bg-muted/80">
              <Share2Icon className="w-5 h-5 text-foreground transition-transform group-hover:scale-110" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{t('common.share')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('daily_report.shareWithOthers')}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </ActionDialog>
  );
};
