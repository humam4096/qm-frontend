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
  const { i18n } = useTranslation();
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

  // const scoreVariant =
  //   analytics.avgScore >= 80
  //     ? 'success'
  //     : analytics.avgScore >= 60
  //     ? 'warning'
  //     : 'destructive';

  const riskLevel =
    analytics.avgScore >= 80
      ? 'Low'
      : analytics.avgScore >= 60
      ? 'Medium'
      : 'High';

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>

    {/* ================= HEADER ================= */}
      {submission && (
        <div className="rounded-xl border bg-card p-5 shadow-sm flex justify-between items-start">

          <div>
            <h2 className="text-xl font-bold">Time Slog Report - {data.label}</h2>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge variant="outline">{submission.status}</Badge>
              <Badge variant="secondary">
                <Award className="w-4 h-4 me-1" />
                {submission.branch_approval}
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Performance</p>
            <p className="text-3xl font-bold text-primary">
              {analytics.avgScore}%
            </p>
          </div>
        </div>
      )}

      {/* ================= STICKY EXECUTIVE BAR ================= */}
      <div className="stickyx top-0x z-30 bg-background/95 backdrop-blur border-b">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
          <Metric highlight label="Avg Score" value={`${analytics.avgScore}%`} />
          <Metric label="Submissions" value={analytics.total} />
          <Metric label="Approved" value={analytics.approvedCount} />
          <Metric label="Risk Level" value={riskLevel} />
        </div>
      </div>

  

      {/* ================= META ================= */}
      <div className="grid md:grid-cols-2 gap-3">
        <MetaItem icon={<Building />} label="Kitchen" value={submission?.kitchen.name} />
        <MetaItem icon={<Calendar />} label="Service Date" value={formatDate(data.contract_date.service_date)} />
        <MetaItem icon={<User />} label="Submitted By" value={submission?.submitted_by.name} />
        <MetaItem icon={<Clock />} label="Time Window" value={`${data.start_time} - ${data.end_time}`} />
      </div>

      <Separator />

      {/* ================= ALERT INSIGHTS ================= */}
      <div className="grid md:grid-cols-2 gap-3">

        {analytics.avgScore < 60 && (
          <Insight type="danger" text="Critical: Overall quality below threshold" />
        )}

        {analytics.total <= 1 && (
          <Insight type="warning" text="Low participation detected" />
        )}

        {analytics.lowPerforming.length > 0 && (
          <Insight type="warning" text="Underperforming submissions detected" />
        )}

      </div>

      <Separator />

      {/* ================= SUBMISSIONS ================= */}
      <div className="space-y-4">
        <h4 className="font-semibold">Submission Highlights</h4>

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
                    {submission.score}%
                  </div>
                </div>
              </div>

              {/* META */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <Meta label="Approved By" value={approvedBy} />
                <Meta label="Status" value={submission.status} />
                <Meta label="Branch" value={submission.branch_approval} />
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
        <Metric label="High Performing" value={analytics.highPerforming.length} />
        <Metric label="Low Performing" value={analytics.lowPerforming.length} />
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