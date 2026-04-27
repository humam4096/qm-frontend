import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  User,
  Building,
  Award,
} from 'lucide-react';
import type { TimeSlot } from '../types';

interface ReportDisplayProps {
  data: TimeSlot | null;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ data }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const analytics = useMemo(() => {
    if (!data) return null;

    const reports = data.submissions || [];
    const total = reports.length;

    const scores = reports.map((s) => s.score || 0);

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const highPerforming = reports.filter((s) => s.score >= 80);
    const lowPerforming = reports.filter((s) => s.score < 60);

    const approved = reports.filter((s) =>
      s.status.includes('approved')
    );

    const rejected = reports.filter((s) =>
      s.status.includes('rejected')
    );

    return {
      total,
      avgScore,
      highPerforming,
      lowPerforming,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
    };
  }, [data]);

  if (!data || !analytics) return null;

  const submission = data.submissions[0];

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const riskLevel =
    analytics.avgScore >= 80
      ? t('reports.low')
      : analytics.avgScore >= 60
      ? t('reports.medium')
      : t('reports.high');

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>

    {/* ================= HEADER ================= */}
      {submission && (
        <div className="rounded-xl border bg-card p-5 shadow-sm flex justify-between items-start">

          <div>
            <h2 className="text-xl font-bold">{t('reports.timeSlotReport')} - {data.label}</h2>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge variant="outline">{submission.status}</Badge>
              <Badge variant="secondary">
                <Award className="w-4 h-4 me-1" />
                {submission.branch_approval}
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t('reports.performance')}</p>
            <p className="text-3xl font-bold text-primary">
              {analytics.avgScore}%
            </p>
          </div>
        </div>
      )}

      {/* ================= STICKY EXECUTIVE BAR ================= */}
      <div className="stickyx top-0x z-30 bg-background/95 backdrop-blur border-b">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
          <Metric highlight label={t('reports.avgScore')} value={`${analytics.avgScore}%`} />
          <Metric label={t('reports.submissions')} value={analytics.total} />
          <Metric label={t('reports.approved')} value={analytics.approvedCount} />
          <Metric label={t('reports.riskLevel')} value={riskLevel} />
        </div>
      </div>

  

      {/* ================= META ================= */}
      <div className="grid md:grid-cols-2 gap-3">
        <MetaItem icon={<Building />} label={t('reports.kitchen')} value={submission?.kitchen.name} />
        <MetaItem icon={<Calendar />} label={t('reports.serviceDate')} value={formatDate(data.contract_date.service_date)} />
        <MetaItem icon={<User />} label={t('reports.submittedBy')} value={submission?.submitted_by.name} />
        <MetaItem icon={<Clock />} label={t('reports.timeWindow')} value={`${data.start_time} - ${data.end_time}`} />
      </div>

      <Separator />

      {/* ================= ALERT INSIGHTS ================= */}
      <div className="grid md:grid-cols-2 gap-3">

        {analytics.avgScore < 60 && (
          <Insight type="danger" text={t('reports.criticalQualityAlert')} />
        )}

        {analytics.total <= 1 && (
          <Insight type="warning" text={t('reports.lowParticipationAlert')} />
        )}

        {analytics.lowPerforming.length > 0 && (
          <Insight type="warning" text={t('reports.underperformingAlert')} />
        )}

      </div>

      <Separator />

      {/* ================= SUBMISSIONS ================= */}
      <div className="space-y-4">
        <h4 className="font-semibold">{t('reports.submissionHighlights')}</h4>

        {data.submissions.map((submission) => {
          const lastStatus =
            submission.status_history?.[submission.status_history.length - 1];

          const approvedBy = lastStatus?.changed_by?.name || '-';

          const importantNote =
            lastStatus?.notes ||
            submission.branch_approval_notes ||
            'No notes';

          return (
            <div
              key={submission.id}
              className="rounded-xl border bg-card p-4 space-y-4 shadow-sm hover:shadow-md transition"
            >
              {/* TOP */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{submission.form.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {data.start_time} - {data.end_time}
                  </p>
                </div>

                {/* Score */}
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full bg-muted" />
                  <div
                    className="absolute inset-0 rounded-full bg-primary"
                    style={{ clipPath: `inset(${100 - submission.score}% 0 0 0)` }}
                  />
                  <div className="absolute inset-0 flex items-center text-white justify-center text-xs font-bold">
                    {Math.round(submission.score)}%
                  </div>
                </div>
              </div>

              {/* META */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <Meta label={t('reports.approvedBy')} value={approvedBy} />
                <Meta label={t('common.status')} value={submission.status} />
                <Meta label={t('reports.branch')} value={submission.branch_approval} />
              </div>

              {/* NOTE */}
              {importantNote && (
                <div className="p-3 bg-muted/40 rounded-lg text-sm">
                  {importantNote}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Separator />

      {/* ================= PERFORMANCE ================= */}
      <div className="grid md:grid-cols-2 gap-3">
        <Metric label={t('reports.highPerforming')} value={analytics.highPerforming.length} />
        <Metric label={t('reports.lowPerforming')} value={analytics.lowPerforming.length} />
      </div>

    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Metric = ({ label, value, highlight }: any) => (
  <div
    className={`p-4 rounded-xl border text-center ${
      highlight ? 'bg-primary/5 border-primary/20' : 'bg-card'
    }`}
  >
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const MetaItem = ({ icon, label, value }: any) => (
  <div className="flex gap-3 p-3 border rounded-lg">
    <div className="text-muted-foreground">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  </div>
);

const Meta = ({ label, value }: any) => (
  <div className="p-2 rounded-md bg-muted/40">
    <p className="text-muted-foreground text-[10px]">{label}</p>
    <p className="font-medium text-xs">{value || '-'}</p>
  </div>
);

const Insight = ({ type, text }: any) => {
  const styles: any = {
    danger: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div className={`p-3 rounded-lg border text-sm ${styles[type]}`}>
      {text}
    </div>
  );
};