import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  User,
  Building,
} from 'lucide-react';
import type { TimeSlot } from '../types';

interface ReportPaperProps {
  data: TimeSlot | null;
}

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
      className="max-w-4xl mx-auto bg-backgroundx text-foreground space-y-8 p-6 md:p-10 print:p-0"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ================= HEADER ================= */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {t('reports.operationalPerformanceReport')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('reports.timeWindow')}: {data.label} ({data.start_time} - {data.end_time})
        </p>
        <p className="text-xs text-muted-foreground">
          {t('reports.generatedOn')} {formatDate(new Date().toISOString())}
        </p>
      </div>

      <Separator />

      {/* ================= EXECUTIVE SUMMARY ================= */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t('reports.executiveSummary')}</h2>

        <p className="text-sm leading-relaxed text-muted-foreground">
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

      <Separator />

      {/* ================= OPERATION CONTEXT ================= */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t('reports.operationalContext')}</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Meta icon={<Building />} label={t('reports.kitchen')} value={data.submissions[0]?.kitchen.name} />
          <Meta icon={<Calendar />} label={t('reports.serviceDate')} value={formatDate(data.contract_date.service_date)} />
          <Meta icon={<Clock />} label={t('reports.timeWindow')} value={`${data.start_time} - ${data.end_time}`} />
          <Meta icon={<User />} label={t('reports.inspector')} value={data.submissions[0]?.submitted_by.name} />
        </div>
      </section>

      <Separator />

      {/* ================= PERFORMANCE ANALYSIS ================= */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t('reports.performanceAnalysis')}</h2>

        {data.submissions.map((s) => {
          return (
            <div key={s.id} className="border rounded-lg p-4 space-y-3">
              
              {/* Header */}
              <div className="grid grid-cols-3 gap-6 justify-between items-center">
                <div className='flex items-center gap-2'>
                  <p className="text-muted-foreground text-smx">{t('reports.form')}:</p>

                <h3 className="font-semibold">{s.form.name}</h3>
                </div>
                <div className='flex gap-2'>
                  <p className="text-muted-foreground text-smx">{t('common.status')}:</p>
                  <Badge variant="outline">{s.status}</Badge>
                </div>
                {/* Score Bar */}
                <div className='flex gap-2 items-center'>
                  <p className="text-muted-foreground text-smx">{t('common.score')}:</p>
                  <div className="w-50 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1 text-right">{s.score}%</p>
                </div>
              </div>

            </div>
          );
        })}
      </section>

      <Separator />

      {/* ================= KEY FINDINGS ================= */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t('reports.keyFindings')}</h2>

        <ul className="list-disc ps-5 text-sm space-y-2">
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
      <div className="text-center text-xs text-muted-foreground pt-6 border-t">
        {t('reports.endOfReport')}
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Metric = ({ label, value }: any) => (
  <div className="border rounded-lg p-3 text-center">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

const Meta = ({ icon, label, value }: any) => (
  <div className="flex gap-3 items-center border rounded-lg p-3">
    <div className="text-muted-foreground">{icon}</div>
    <div className='flex gap-2 items-center'>
      <p className="text-xs text-muted-foreground">{label} | </p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  </div>
);
