import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  User,
  Building,
} from 'lucide-react';
import type { TimeSlot } from '../types';
import '../../../styles/print.css';

interface ReportPaperProps {
  data: TimeSlot | null;
}

/**
 * Print-optimized color fixes for export
 * Ensures consistent rendering across screen and print
 */
const TIME_WINDOW_REPORT_EXPORT_COLOR_FIXES = `
  .time-window-report-export .bg-muted\\/30 { background-color: rgba(238, 236, 224, 0.3) !important; }
  .time-window-report-export .bg-muted\\/20 { background-color: rgba(238, 236, 224, 0.2) !important; }
  .time-window-report-export .bg-muted\\/10 { background-color: rgba(238, 236, 224, 0.1) !important; }
  .time-window-report-export .bg-muted { background-color: rgba(238, 236, 224, 0.5) !important; }
  
  /* Print-safe borders */
  .time-window-report-export .border { border-color: #e5e5e5 !important; }
  
  /* Ensure proper spacing in print */
  .time-window-report-export .print-section { margin-bottom: 1.5rem; }
  
  /* Prevent orphaned headers */
  .time-window-report-export .section-title { 
    page-break-after: avoid;
    break-after: avoid;
  }
`;

export const ReportPaper: React.FC<ReportPaperProps> = ({ data }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const analytics = useMemo(() => {
    if (!data) return null;

    const submissions = data.submissions || [];
    const total = submissions.length;

    const scores = submissions.map((s) => s.score || 0);

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const high = submissions.filter((s) => s.score >= 80);
    const low = submissions.filter((s) => s.score < 60);

    const approved = submissions.filter((s) =>
      s.status.includes('approved')
    );

    const rejected = submissions.filter((s) =>
      s.status.includes('rejected')
    );

    return {
      total,
      avgScore,
      high,
      low,
      approved,
      rejected,
    };
  }, [data]);

  if (!data || !analytics) return null;

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString(
      isRTL ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const performanceLabel =
    analytics.avgScore >= 80
      ? t('reports.highPerformanceLabel')
      : analytics.avgScore >= 60
      ? t('reports.moderatePerformanceLabel')
      : t('reports.lowPerformanceLabel');

  return (
    <div
      className="time-window-report-export print-container"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{TIME_WINDOW_REPORT_EXPORT_COLOR_FIXES}</style>
      
      {/* Single Page Layout */}
      <div className="print-page space-y-6" style={{ maxWidth: '794px', margin: '0 auto', padding: '20px' }}>
        {/* ================= HEADER ================= */}
        <div className="print-section page-break-avoid">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t('reports.operationalPerformanceReport')}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('reports.timeWindow')}: {data.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {data.start_time} - {data.end_time}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {t('reports.generatedOn')}
              </p>
              <p className="text-xs font-medium">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>

        {/* ================= EXECUTIVE SUMMARY ================= */}
        <section className="print-section page-break-avoid space-y-3">
          <h2 className="text-lg font-semibold section-title">{t('reports.executiveSummary')}</h2>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {t('reports.executiveSummaryText', { 
              total: analytics.total, 
              avgScore: analytics.avgScore, 
              performance: performanceLabel 
            })}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric label={t('reports.totalSubmissions')} value={analytics.total} />
            <Metric label={t('reports.avgScore')} value={`${analytics.avgScore}%`} />
            <Metric label={t('reports.approved')} value={analytics.approved.length} />
            <Metric label={t('reports.branchApproval.rejected')} value={analytics.rejected.length} />
          </div>
        </section>

        {/* ================= OPERATION CONTEXT ================= */}
        <section className="print-section page-break-avoid space-y-3">
          <h2 className="text-lg font-semibold section-title">{t('reports.operationalContext')}</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <Meta icon={<Building />} label={t('reports.kitchen')} value={data.submissions[0]?.kitchen.name} />
            <Meta icon={<Calendar />} label={t('reports.serviceDate')} value={formatDate(data.contract_date.service_date)} />
            <Meta icon={<Clock />} label={t('reports.timeWindow')} value={`${data.start_time} - ${data.end_time}`} />
            <Meta icon={<User />} label={t('reports.inspector')} value={data.submissions[0]?.submitted_by.name} />
          </div>
        </section>

        {/* ================= PERFORMANCE ANALYSIS ================= */}
        <section className="print-section space-y-4">
          <h2 className="text-lg font-semibold section-title">{t('reports.performanceAnalysis')}</h2>

          {data.submissions.map((s) => {
            return (
              <div key={s.id} className="page-break-avoid border rounded-lg p-3 space-y-2">
                
                {/* Header */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className='flex items-center gap-2'>
                    <p className="text-muted-foreground text-xs">{t('reports.form')}:</p>
                    <h3 className="font-semibold text-sm">{s.form.name}</h3>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <p className="text-muted-foreground text-xs">{t('common.status')}:</p>
                    <Badge variant="outline" className="text-xs">{s.status}</Badge>
                  </div>
                  {/* Score Bar */}
                  <div className='flex gap-2 items-center'>
                    <p className="text-muted-foreground text-xs">{t('common.score')}:</p>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <p className="text-xs font-medium">{s.score}%</p>
                  </div>
                </div>

              </div>
            );
          })}
        </section>

        {/* ================= KEY FINDINGS ================= */}
        <section className="print-section page-break-avoid space-y-3">
          <h2 className="text-lg font-semibold section-title">{t('reports.keyFindings')}</h2>

          <ul className="list-disc ps-5 text-xs space-y-1 text-muted-foreground">
            {analytics.avgScore < 60 && (
              <li>{t('reports.findingBelowThreshold')}</li>
            )}
            {analytics.low.length > 0 && (
              <li>{t('reports.findingLowPerformers')}</li>
            )}
            {analytics.approved.length > 0 && analytics.avgScore < 60 && (
              <li>{t('reports.findingWeakApprovals')}</li>
            )}
            {analytics.total <= 1 && (
              <li>{t('reports.findingLimitedData')}</li>
            )}
          </ul>
        </section>

        {/* ================= FOOTER ================= */}
        <div className="print-only mt-8 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            {t('daily_report.generatedBy')} • {new Date().toLocaleString()} • {t('daily_report.confidential')}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Metric = ({ label, value }: any) => (
  <div className="metric-card border rounded-lg p-3 text-center bg-muted/20">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-base font-bold">{value}</p>
  </div>
);

const Meta = ({ icon, label, value }: any) => (
  <div className="flex gap-2 items-center border rounded-lg p-2 bg-background">
    <div className="text-muted-foreground">{icon}</div>
    <div className='flex gap-1 items-center'>
      <p className="text-xs text-muted-foreground">{label}:</p>
      <p className="text-xs font-medium">{value || '-'}</p>
    </div>
  </div>
);
