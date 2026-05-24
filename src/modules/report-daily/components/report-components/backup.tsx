import React from 'react';
import { useTranslation } from 'react-i18next';
import { EXPECTED_SUBMISSIONS_PER_WINDOW, type useDailyReportData } from '../../hooks/useDailyReportData';

function pct(n: number, d: number): string {
  if (!d) return '0%';
  return `${Math.round((n / d) * 100)}%`;
}

function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}


// function performanceColor(c: PerformanceClass): string {
//   switch (c) {
//     case 'Excellent': return 'text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-700 dark:bg-emerald-900/20';
//     case 'Good':      return 'text-teal-700 border-teal-300 bg-teal-50 dark:text-teal-400 dark:border-teal-700 dark:bg-teal-900/20';
//     case 'Moderate':  return 'text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:bg-amber-900/20';
//     case 'Poor':
//     default:          return 'text-rose-700 border-rose-300 bg-rose-50 dark:text-rose-400 dark:border-rose-700 dark:bg-rose-900/20';
//   }
// }

// ─── Primitive UI components ──────────────────────────────────────────────────

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'screen' | 'print';
}
const Section: React.FC<SectionProps> = ({ children, className = '', variant = 'screen' }) => {
  const printClasses = variant === 'print' ? 'print-section page-break-avoid' : '';
  const borderClass = variant === 'print' ? '' : 'border';
  return (
    <div className={`rounded-lg ${borderClass} p-4 space-y-3 ${printClasses} ${className}`}>
      {children}
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode; variant?: 'screen' | 'print' }> = ({ children, variant = 'screen' }) => {
  const printClasses = variant === 'print' ? 'section-title' : '';
  return (
    <p className={`text-sm font-semibold ${printClasses}`}>{children}</p>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  variant?: 'screen' | 'print';
}
const MetricCard: React.FC<MetricCardProps> = ({ label, value, variant = 'screen' }) => {
  const printClasses = variant === 'print' ? 'metric-card' : '';
  const textSize = variant === 'print' ? 'text-base' : 'text-lg';
  const borderClass = variant === 'print' ? '' : 'border';
  return (
    <div className={`rounded-lg ${borderClass} bg-muted/20 p-3 ${printClasses}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`${textSize} font-semibold`}>{value}</p>
    </div>
  );
};

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
  variant?: 'screen' | 'print';
}
const SubSection: React.FC<SubSectionProps> = ({ title, children, variant = 'screen' }) => {
  const borderClass = variant === 'print' ? '' : 'border';
  return (
    <div className={`rounded-lg ${borderClass} bg-muted/10 p-3 space-y-2`}>
      <p className="text-sm font-medium">{title}</p>
      {children}
    </div>
  );
};

interface KeyValueRowProps {
  label: string;
  value: string | number;
}
const KeyValueRow: React.FC<KeyValueRowProps> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

interface BulletListProps {
  items: React.ReactNode[];
  variant?: 'screen' | 'print';
}
const BulletList: React.FC<BulletListProps> = ({ items, variant = 'screen' }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const textSize = variant === 'print' ? 'text-xs' : 'text-sm';
  const paddingClass = isRTL ? 'pr-5' : 'pl-5';
  
  return (
    <ul className={`list-disc ${paddingClass} ${textSize} text-muted-foreground space-y-1`}>
      {items.map((item, idx) => <li key={idx}>{item}</li>)}
    </ul>
  );
};

// ─── Domain components ────────────────────────────────────────────────────────

type ReportData = ReturnType<typeof useDailyReportData>;

interface HeaderCardProps {
  data: ReportData;
  variant?: 'screen' | 'print';
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ data, variant = 'screen' }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { contractName, kitchenName, zoneName, serviceDate, performanceClass } = data;

  // Translate performance class
  const performanceClassLabel = 
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good' ? t('daily_report.good') :
    performanceClass === 'Moderate' ? t('daily_report.moderate') :
    t('daily_report.poor');

  const keyTakeaways = [
    t('daily_report.keyTakeaway1', {
      performanceClass: performanceClassLabel,
      avgScore: data.avgScore.toFixed(1),
      scoredCount: data.scores.length,
      totalSubmissions: data.totalSubmissions
    }),
    t('daily_report.keyTakeaway2', {
      successRate: pct(data.accepted.length, data.totalSubmissions),
      acceptedCount: data.accepted.length,
      rejectedCount: data.rejected.length
    }),
    data.totalWindows
      ? t('daily_report.keyTakeaway3', {
          completeness: pct(data.totalSubmissions, data.expectedSubmissions),
          actual: data.totalSubmissions,
          expected: data.expectedSubmissions,
          expectedPerWindow: EXPECTED_SUBMISSIONS_PER_WINDOW,
          missing: data.missingSubmissions
        })
      : t('daily_report.keyTakeaway3NoWindows'),
  ];

  const criticalRisks = [
    data.pendingApproval.length
      ? t('daily_report.criticalRisk1', { count: data.pendingApproval.length })
      : '',
    data.rejectedWithoutNotes.length
      ? t('daily_report.criticalRisk2', { count: data.rejectedWithoutNotes.length })
      : '',
    data.missingSubmissions
      ? t('daily_report.criticalRisk3', {
          missing: data.missingSubmissions,
          actual: data.totalSubmissions,
          expected: data.expectedSubmissions
        })
      : '',
  ].filter(Boolean);

  // Print variant shows more compact header
  if (variant === 'print') {
    return (
      <div className="print-section page-break-avoid">
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6 pb-4 border-b-2`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-foreground">{t('daily_report.dailyOperationsReport')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('daily_report.generatedOn')}: {new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
            </p>
          </div>
          {/* <div className={isRTL ? 'text-left' : 'text-right'}>
            <div className={`inline-flex items-center rounded-full border-2 px-4 py-2 text-sm font-bold ${performanceColor(performanceClass)}`}>
              {performanceClassLabel}
            </div>
          </div> */}
        </div>

        <div className="rounded-lg bg-muted/30 p-4 space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('daily_report.contractInformation')}</p>
              <p className="text-sm font-semibold mt-1">
                {contractName} • {kitchenName} • {zoneName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('daily_report.serviceDate')}: {serviceDate}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold section-title">{t('daily_report.keyTakeaways')}</p>
            <BulletList items={keyTakeaways} variant="print" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold section-title">
              {t('daily_report.criticalRisks')} {criticalRisks.length ? '' : `- ${t('daily_report.noneDetected')}`}
            </p>
            {criticalRisks.length ? (
              <BulletList items={criticalRisks} variant="print" />
            ) : (
              <p className="text-xs text-muted-foreground">{t('daily_report.noHighSeverityRisks')}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Screen variant (original)
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t('daily_report.dailyOperationsReport')}</p>
          <p className="text-base font-semibold">
            {contractName} • {kitchenName} • {zoneName} • {serviceDate}
          </p>
        </div>
        {/* <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${performanceColor(performanceClass)}`}>
          {performanceClassLabel}
        </div> */}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t('daily_report.keyTakeaways')} (3)</p>
        <BulletList items={keyTakeaways} variant={variant} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          {t('daily_report.criticalRisks')} (3) {criticalRisks.length ? '' : t('daily_report.noneDetected')}
        </p>
        {criticalRisks.length ? (
          <BulletList items={criticalRisks} variant={variant} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('daily_report.noHighSeverityRisks')}
          </p>
        )}
      </div>
    </div>
  );
};

export const ExecutiveSummarySection: React.FC<{
  data: ReportData;
  variant?: 'screen' | 'print';
}> = ({ data, variant = 'screen' }) => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === 'ar';

  const {
    totalSubmissions,
    totalWindows,
    avgScore,
    accepted,
    rejected,
    pendingApproval,
    expectedSubmissions,
    missingSubmissions,
    windowsWithNoSubmissions,
    lowPerformers,
  } = data;

  // ─────────────────────────────────────────────────────────────
  // Performance Intelligence
  // ─────────────────────────────────────────────────────────────

  const operationalHealth =
    avgScore >= 85
      ? 'excellent'
      : avgScore >= 70
      ? 'stable'
      : avgScore >= 50
      ? 'at_risk'
      : 'critical';

  const healthConfig = {
    excellent: {
      label: t('daily_report.excellent'),
      badge:
        'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700',
      dot: 'bg-emerald-500',
    },
    stable: {
      label: t('daily_report.good'),
      badge:
        'bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-700',
      dot: 'bg-teal-500',
    },
    at_risk: {
      label: t('daily_report.moderate'),
      badge:
        'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700',
      dot: 'bg-amber-500',
    },
    critical: {
      label: t('daily_report.poor'),
      badge:
        'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-700',
      dot: 'bg-rose-500',
    },
  };

  const currentHealth = healthConfig[operationalHealth];

  // ─────────────────────────────────────────────────────────────
  // KPI Calculations
  // ─────────────────────────────────────────────────────────────

  const completionRate = pct(totalSubmissions, expectedSubmissions);

  const successRate = pct(accepted.length, totalSubmissions);

  const criticalIssuesCount =
    missingSubmissions +
    pendingApproval.length +
    windowsWithNoSubmissions.length;

  const highRiskForms = lowPerformers.filter((x) => x.score < 50);

  // ─────────────────────────────────────────────────────────────
  // Executive Alerts
  // ─────────────────────────────────────────────────────────────

  const alerts: {
    severity: 'critical' | 'warning';
    message: string;
  }[] = [];

  if (avgScore < 50) {
    alerts.push({
      severity: 'critical',
      message: t('daily_report.alertLowPerformance', {
        score: avgScore.toFixed(1),
      }),
    });
  }

  if (missingSubmissions > 0) {
    alerts.push({
      severity: 'critical',
      message: t('daily_report.alertMissingSubmissions', {
        count: missingSubmissions,
      }),
    });
  }

  if (pendingApproval.length > 0) {
    alerts.push({
      severity: 'warning',
      message: t('daily_report.alertPendingApprovals', {
        count: pendingApproval.length,
      }),
    });
  }

  if (windowsWithNoSubmissions.length > 0) {
    alerts.push({
      severity: 'warning',
      message: t('daily_report.alertEmptyWindows', {
        count: windowsWithNoSubmissions.length,
      }),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Strategic Summary
  // ─────────────────────────────────────────────────────────────

  const summaryText = t('daily_report.executiveSummaryNew', {
    submissions: totalSubmissions,
    windows: totalWindows,
    avgScore: avgScore.toFixed(1),
    successRate,
    completionRate,
    pending: pendingApproval.length,
  });

  const textSize = variant === 'print' ? 'text-xs' : 'text-sm';

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>
        1. {t('daily_report.executiveSummary')}
      </SectionTitle>

      {/* ───────────────────────────────────────────────────── */}
      {/* Executive Command Center */}
      {/* ───────────────────────────────────────────────────── */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Operational Health */}
        <div className="rounded-xl border bg-background p-4 space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {t('daily_report.operationalHealth')}
            </p>

            <div
              className={`h-2.5 w-2.5 rounded-full ${currentHealth.dot}`}
            />
          </div>

          <div>
            <p className="text-3xl font-bold">
              {Math.round(avgScore)}
            </p>

            <div
              className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${currentHealth.badge}`}
            >
              {currentHealth.label}
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('daily_report.operationalHealthDescription')}
          </p>
        </div>

        {/* KPI Overview */}
        <div className="rounded-xl border bg-background p-4 lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label={t('daily_report.totalSubmissions')}
              value={totalSubmissions}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.successRate')}
              value={successRate}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.completionRate')}
              value={completionRate}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.pendingApprovals')}
              value={pendingApproval.length}
              variant={variant}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label={t('daily_report.rejected')}
              value={rejected.length}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.missingSubmissions')}
              value={missingSubmissions}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.highRiskSubmissions')}
              value={highRiskForms.length}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.criticalAlerts')}
              value={criticalIssuesCount}
              variant={variant}
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────── */}
      {/* Executive Narrative */}
      {/* ───────────────────────────────────────────────────── */}

      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-primary" />

          <p className="text-sm font-semibold">
            {t('daily_report.operationalSummary')}
          </p>
        </div>

        <p
          className={`${textSize} text-muted-foreground leading-7`}
        >
          {summaryText}
        </p>
      </div>

      {/* ───────────────────────────────────────────────────── */}
      {/* Critical Alerts */}
      {/* ───────────────────────────────────────────────────── */}

      <div className="rounded-xl border bg-background p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">
            {t('daily_report.criticalAlerts')}
          </p>

          <div className="text-xs text-muted-foreground">
            {alerts.length}{' '}
            {t('daily_report.activeAlerts')}
          </div>
        </div>

        {alerts.length ? (
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  alert.severity === 'critical'
                    ? 'border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/20'
                    : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20'
                }`}
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    alert.severity === 'critical'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                />

                <p
                  className={`text-sm leading-6 ${
                    alert.severity === 'critical'
                      ? 'text-rose-700 dark:text-rose-300'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 p-3">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {t('daily_report.noCriticalAlerts')}
            </p>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────── */}
      {/* Operational Risks */}
      {/* ───────────────────────────────────────────────────── */}

      {highRiskForms.length > 0 && (
        <div className="rounded-xl border bg-background p-4 space-y-3">
          <p className="text-sm font-semibold">
            {t('daily_report.highRiskOperations')}
          </p>

          <div className="space-y-3">
            {highRiskForms.slice(0, 5).map(({ submission, score, window }) => (
              <div
                key={submission.id}
                className="rounded-lg border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/20 p-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-foreground">
                      {submission.form?.name ?? submission.form_type}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {window.label}
                    </p>

                    <p className="text-xs text-rose-700 dark:text-rose-300 mt-2 leading-6">
                      {t('daily_report.highRiskDescription')}
                    </p>
                  </div>

                  <div className="text-center min-w-[70px]">
                    <p className="text-2xl font-bold text-rose-600">
                      {Math.round(score)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {t('daily_report.score')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
};

export const KeyMetricsSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { totalSubmissions, expectedSubmissions, missingSubmissions, avgScore, accepted, rejected, pendingApproval, completed, totalWindows, windowsWithNoSubmissions, scoreBuckets, scores } = data;

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>2. {t('daily_report.keyMetrics')}</SectionTitle>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label={t('daily_report.operationalCompleteness')} value={`${pct(totalSubmissions, expectedSubmissions)} (${totalSubmissions}/${expectedSubmissions})`} variant={variant} />
        <MetricCard label={t('daily_report.missingSubmissions')} value={missingSubmissions} variant={variant} />
        <MetricCard label={t('daily_report.totalSubmissions')} value={totalSubmissions} variant={variant} />
        <MetricCard label={t('daily_report.avgScore')} value={avgScore.toFixed(1)} variant={variant} />
        <MetricCard label={t('daily_report.successRate')} value={pct(accepted.length, totalSubmissions)} variant={variant} />
        <MetricCard label={t('daily_report.rejectionRate')} value={pct(rejected.length, totalSubmissions)} variant={variant} />
        <MetricCard label={t('daily_report.completionRate')} value={pct(completed.length, totalSubmissions)} variant={variant} />
        <MetricCard label={t('daily_report.pendingApprovals')} value={pendingApproval.length} variant={variant} />
        <MetricCard label={t('daily_report.mealWindows')} value={totalWindows} variant={variant} />
        <MetricCard label={t('daily_report.emptyWindows')} value={windowsWithNoSubmissions.length} variant={variant} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubSection title={t('daily_report.scoreDistribution')} variant={variant}>
          <div className="space-y-1">
            {Object.entries(scoreBuckets).map(([k, v]) => (
              <KeyValueRow key={k} label={k} value={`${v} (${pct(v, scores.length)})`} />
            ))}
          </div>
        </SubSection>

        <SubSection title={t('daily_report.acceptanceVsRejection')} variant={variant}>
          <KeyValueRow label={t('daily_report.accepted')} value={`${accepted.length} (${pct(accepted.length, totalSubmissions)})`} />
          <KeyValueRow label={t('daily_report.rejected')}  value={`${rejected.length} (${pct(rejected.length, totalSubmissions)})`} />
          <KeyValueRow label={t('daily_report.pending')}   value={`${pendingApproval.length} (${pct(pendingApproval.length, totalSubmissions)})`} />
        </SubSection>
      </div>
    </Section>
  );
};

interface SubmissionCardProps {
  submission: any;
  window: any;
  score: number;
  showNotes?: boolean;
  variant?: 'screen' | 'print';
}
export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, window, score, showNotes, variant = 'screen' }) => {
  const { t } = useTranslation();
  const borderClass = variant === 'print' ? '' : 'border';
  
  return (
    <li className={`rounded-md ${borderClass} bg-background p-3`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{submission.form?.name ?? submission.form_type}</p>
          <p className="text-xs text-muted-foreground">
            {t('daily_report.window')}: {window.label} • {t('daily_report.status')}: {submission.status} • {t('daily_report.branchApprovalStatus')}: {submission.branch_approval}
          </p>
          {showNotes && submission.branch_approval_notes?.trim() && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {t('daily_report.notes')}: <span className="text-foreground">{submission.branch_approval_notes}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{score}</p>
          <p className="text-xs text-muted-foreground">{t('daily_report.score')}</p>
        </div>
      </div>
    </li>
  );
};

export const DetailedAnalysisSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { totalWindows, contractName, kitchenName, zoneName, expectedSubmissions, totalSubmissions, missingSubmissions, pendingApproval, windowsBelowExpected, topPerformers, lowPerformers, medianCycleMins, bottlenecks } = data;

  const operationalOverviewItems: React.ReactNode[] = [
    <span key="item1" dangerouslySetInnerHTML={{ __html: t('daily_report.operationalOverviewItem1', {
      totalWindows,
      contractName,
      kitchenName,
      zoneName
    }) }} />,
    <span key="item2" dangerouslySetInnerHTML={{ __html: t('daily_report.operationalOverviewItem2', {
      expectedSubmissions,
      totalSubmissions,
      missing: missingSubmissions,
      completeness: pct(totalSubmissions, expectedSubmissions)
    }) }} />,
    <span key="item3" dangerouslySetInnerHTML={{ __html: t('daily_report.operationalOverviewItem3', {
      pendingCount: pendingApproval.length
    }) }} />,
  ];

  if (windowsBelowExpected.length) {
    const shortfallText = windowsBelowExpected.slice(0, 4).map((x) => 
      t('daily_report.windowMissing', { window: x.window.label, missing: x.missing })
    ).join(' • ') + (windowsBelowExpected.length > 4 ? ' • …' : '');
    
    operationalOverviewItems.push(
      <span key="item4">{t('daily_report.operationalOverviewItem4', { shortfalls: shortfallText })}</span>
    );
  }

  const efficiencyItems: React.ReactNode[] = [
    <span key="eff1" dangerouslySetInnerHTML={{ __html: t('daily_report.efficiencyItem1', { pendingCount: pendingApproval.length }) }} />,
    <span key="eff2" dangerouslySetInnerHTML={{ __html: t('daily_report.efficiencyItem2', {
      medianCycleTime: medianCycleMins !== null ? t('daily_report.minutesFormat', { minutes: Math.round(medianCycleMins) }) : '—'
    }) }} />,
  ];

  if (bottlenecks.length) {
    const paddingClass = isRTL ? 'pr-5' : 'pl-5';
    const textSize = variant === 'print' ? 'text-xs' : 'text-sm';
    const bottleneckItems = bottlenecks.map((b) => (
      <li key={b.submission.id}>
        {b.submission.form?.name ?? b.submission.form_type} • {b.window.label} • {t('daily_report.minutesFormat', { minutes: Math.round(b.cycleMins) })} • {t('daily_report.lastChange')} {formatDateTime((b.submission.status_history ?? []).slice(-1)[0]?.changed_at)}
      </li>
    ));

    efficiencyItems.push(
      <span key="eff3">
        {t('daily_report.efficiencyItem3')}
        <ul className={`list-disc ${paddingClass} mt-1 space-y-1 ${textSize}`}>
          {bottleneckItems}
        </ul>
      </span>
    );
  }

  const textSize = variant === 'print' ? 'text-xs' : 'text-sm';

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>3. {t('daily_report.detailedAnalysis')}</SectionTitle>

      <SubSection title={t('daily_report.operationalOverview')} variant={variant}>
        <BulletList items={operationalOverviewItems} variant={variant} />
      </SubSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubSection title={t('daily_report.highPerformingSubmissions')} variant={variant}>
          {topPerformers.length ? (
            <ul className="space-y-2">
              {topPerformers.map(({ submission, window, score }) => (
                <SubmissionCard key={submission.id} submission={submission} window={window} score={score} variant={variant} />
              ))}
            </ul>
          ) : (
            <p className={`${textSize} text-muted-foreground`}>{t('daily_report.noScoredSubmissions')}</p>
          )}
        </SubSection>

        <SubSection title={t('daily_report.lowPerformingSubmissions')} variant={variant}>
          {lowPerformers.length ? (
            <ul className="space-y-2">
              {lowPerformers.map(({ submission, window, score }) => (
                <SubmissionCard key={submission.id} submission={submission} window={window} score={score} showNotes variant={variant} />
              ))}
            </ul>
          ) : (
            <p className={`${textSize} text-muted-foreground`}>{t('daily_report.noScoredSubmissions')}</p>
          )}
        </SubSection>
      </div>

      <SubSection title={t('daily_report.efficiencyExecution')} variant={variant}>
        <BulletList items={efficiencyItems} variant={variant} />
      </SubSection>
    </Section>
  );
};

export const InsightsSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { performanceClass, accepted, rejected, pendingApproval, scoreBuckets, missingSubmissions, windowsWithNoSubmissions, rejectedWithoutNotes, pendingWithoutHistory } = data;

  // Translate performance class
  const performanceClassLabel = 
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good' ? t('daily_report.good') :
    performanceClass === 'Moderate' ? t('daily_report.moderate') :
    t('daily_report.poor');

  // Build weaknesses text parts
  const weaknessParts = [];
  if (missingSubmissions) {
    weaknessParts.push(t('daily_report.weaknessMissingSubmissions', { count: missingSubmissions }));
  } else {
    weaknessParts.push(t('daily_report.weaknessNoShortfall'));
  }
  if (windowsWithNoSubmissions.length) {
    weaknessParts.push(t('daily_report.weaknessZeroWindows'));
  }
  if (pendingApproval.length) {
    weaknessParts.push(t('daily_report.weaknessPendingApprovals'));
  }
  if (rejectedWithoutNotes.length) {
    weaknessParts.push(t('daily_report.weaknessNoFeedback'));
  }

  const insightItems: React.ReactNode[] = [
    <span key="insight1" dangerouslySetInnerHTML={{ __html: t('daily_report.insightItem1', {
      performanceClass: performanceClassLabel,
      acceptedCount: accepted.length,
      rejectedCount: rejected.length,
      pendingCount: pendingApproval.length
    }) }} />,
    <span key="insight2" dangerouslySetInnerHTML={{ __html: t('daily_report.insightItem2', {
      topScoreCount: scoreBuckets['90–100']
    }) }} />,
    <span key="insight3">
      {t('daily_report.insightItem3Prefix')} {weaknessParts.join(', ')}.
    </span>,
  ];

  if (pendingWithoutHistory.length) {
    insightItems.push(
      <span key="insight4" dangerouslySetInnerHTML={{ __html: t('daily_report.insightItem4', {
        count: pendingWithoutHistory.length
      }) }} />
    );
  }

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>4. {t('daily_report.insights')}</SectionTitle>
      <BulletList items={insightItems} variant={variant} />
    </Section>
  );
};

export const RecommendationsSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { missingSubmissions, windowsBelowExpected, pendingApproval, rejectedWithoutNotes } = data;

  const recommendationItems = [
    missingSubmissions ? 
      t('daily_report.recommendation1WithMissing', {
        shortfalls: windowsBelowExpected.slice(0, 4).map((x) => 
          t('daily_report.windowMissing', { window: x.window.label, missing: x.missing })
        ).join(' • ') + (windowsBelowExpected.length > 4 ? ' • …' : '')
      }) :
      t('daily_report.recommendation1NoMissing'),

    pendingApproval.length ?
      t('daily_report.recommendation2WithPending', {
        pendingCount: pendingApproval.length
      }) :
      t('daily_report.recommendation2NoPending'),

    rejectedWithoutNotes.length ?
      t('daily_report.recommendation3WithoutNotes', {
        count: rejectedWithoutNotes.length
      }) :
      t('daily_report.recommendation3WithNotes'),

    t('daily_report.recommendation4'),
  ];

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>5. {t('daily_report.recommendations')}</SectionTitle>
      <BulletList items={recommendationItems} variant={variant} />
    </Section>
  );
};


// ============================================================
// OPERATIONAL KPI DASHBOARD SECTION
// ============================================================

export const OperationalKPIDashboardSection: React.FC<{
  data: ReportData;
  variant?: 'screen' | 'print';
}> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();

  const {
    totalSubmissions,
    expectedSubmissions,
    accepted,
    rejected,
    pendingApproval,
    completed,
    avgScore,
    missingSubmissions,
    windowsWithNoSubmissions,
    scores,
    lowPerformers,
  } = data;

  const completionRate = pct(totalSubmissions, expectedSubmissions);

  const successRate = pct(accepted.length, totalSubmissions);

  const rejectionRate = pct(rejected.length, totalSubmissions);

  const pendingRate = pct(
    pendingApproval.length,
    totalSubmissions
  );

  const highRiskCount = lowPerformers.filter(
    (x) => x.score < 50
  ).length;

  const excellentScores = scores.filter(
    (s) => s >= 90
  ).length;

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>
        2. {t('daily_report.operationalKPIDashboard')}
      </SectionTitle>

      <div className="space-y-5">
        {/* ================================================= */}
        {/* Operational Execution */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.operationalExecution')}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              {t('daily_report.operationalExecutionDesc')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label={t('daily_report.totalSubmissions')}
              value={totalSubmissions}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.expectedSubmissions')}
              value={expectedSubmissions}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.completionRate')}
              value={completionRate}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.missingSubmissions')}
              value={missingSubmissions}
              variant={variant}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* Quality Performance */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.qualityPerformance')}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              {t('daily_report.qualityPerformanceDesc')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label={t('daily_report.avgScore')}
              value={avgScore.toFixed(1)}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.successRate')}
              value={successRate}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.rejectionRate')}
              value={rejectionRate}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.highRiskSubmissions')}
              value={highRiskCount}
              variant={variant}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* Workflow Efficiency */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.workflowEfficiency')}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              {t('daily_report.workflowEfficiencyDesc')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label={t('daily_report.pendingApprovals')}
              value={pendingApproval.length}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.pendingRate')}
              value={pendingRate}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.completed')}
              value={completed.length}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.emptyWindows')}
              value={windowsWithNoSubmissions.length}
              variant={variant}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* Compliance & Operational Stability */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.complianceAndStability')}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              {t('daily_report.complianceAndStabilityDesc')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label={t('daily_report.accepted')}
              value={accepted.length}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.rejected')}
              value={rejected.length}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.excellentScores')}
              value={excellentScores}
              variant={variant}
            />

            <MetricCard
              label={t('daily_report.operationalAlerts')}
              value={
                missingSubmissions +
                pendingApproval.length +
                highRiskCount
              }
              variant={variant}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// CRITICAL RISKS SECTION
// ============================================================

export const CriticalRisksSection: React.FC<{
  data: ReportData;
  variant?: 'screen' | 'print';
}> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();

  const {
    lowPerformers,
    pendingApproval,
    missingSubmissions,
    windowsWithNoSubmissions,
  } = data;

  const criticalForms = lowPerformers.filter(
    (x) => x.score < 50
  );

  const risks = [
    ...(missingSubmissions > 0
      ? [
          {
            severity: 'critical',
            title: t('daily_report.missingSubmissionRisk'),
            description: t(
              'daily_report.missingSubmissionRiskDesc',
              {
                count: missingSubmissions,
              }
            ),
          },
        ]
      : []),

    ...(pendingApproval.length > 0
      ? [
          {
            severity: 'warning',
            title: t('daily_report.pendingApprovalRisk'),
            description: t(
              'daily_report.pendingApprovalRiskDesc',
              {
                count: pendingApproval.length,
              }
            ),
          },
        ]
      : []),

    ...(windowsWithNoSubmissions.length > 0
      ? [
          {
            severity: 'warning',
            title: t('daily_report.emptyWindowsRisk'),
            description: t(
              'daily_report.emptyWindowsRiskDesc',
              {
                count: windowsWithNoSubmissions.length,
              }
            ),
          },
        ]
      : []),
  ];

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>
        3. {t('daily_report.criticalRisksEscalations')}
      </SectionTitle>

      <div className="space-y-4">
        {/* ================================================= */}
        {/* Executive Risk Alerts */}
        {/* ================================================= */}

        {risks.length > 0 && (
          <div className="space-y-3">
            {risks.map((risk, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-4 ${
                  risk.severity === 'critical'
                    ? 'border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/20'
                    : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      risk.severity === 'critical'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      {risk.title}
                    </p>

                    <p className="text-sm text-muted-foreground mt-1 leading-6">
                      {risk.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================================================= */}
        {/* High Risk Submissions */}
        {/* ================================================= */}

        {criticalForms.length > 0 && (
          <div className="rounded-xl border bg-background p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold">
                {t('daily_report.highRiskSubmissions')}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {t('daily_report.highRiskSubmissionsDesc')}
              </p>
            </div>

            <div className="space-y-3">
              {criticalForms.map(
                ({ submission, score, window }) => (
                  <div
                    key={submission.id}
                    className="rounded-lg border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          {submission.form?.name ??
                            submission.form_type}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {window.label}
                        </p>

                        <p className="text-sm text-rose-700 dark:text-rose-300 mt-3 leading-6">
                          {t(
                            'daily_report.highRiskOperationalImpact'
                          )}
                        </p>
                      </div>

                      <div className="text-center min-w-[80px]">
                        <p className="text-3xl font-bold text-rose-600">
                          {Math.round(score)}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {t('daily_report.score')}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};


// ============================================================
// TREND ANALYTICS SECTION
// ============================================================

export const TrendAnalyticsSection: React.FC<{
  data: ReportData;
  variant?: 'screen' | 'print';
}> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();

  const {
    avgScore,
    accepted,
    rejected,
    pendingApproval,
    totalSubmissions,
    scoreBuckets,
  } = data;

  const successRate = pct(
    accepted.length,
    totalSubmissions
  );

  const rejectionRate = pct(
    rejected.length,
    totalSubmissions
  );

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>
        4. {t('daily_report.trendAnalytics')}
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ================================================= */}
        {/* Performance Movement */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.performanceMovement')}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              {t('daily_report.performanceMovementDesc')}
            </p>
          </div>

          <div className="space-y-3">
            <KeyValueRow
              label={t('daily_report.avgScore')}
              value={avgScore.toFixed(1)}
            />

            <KeyValueRow
              label={t('daily_report.successRate')}
              value={successRate}
            />

            <KeyValueRow
              label={t('daily_report.rejectionRate')}
              value={rejectionRate}
            />

            <KeyValueRow
              label={t('daily_report.pendingApprovals')}
              value={pendingApproval.length}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* Score Distribution */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.scoreDistribution')}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              {t('daily_report.scoreDistributionDesc')}
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(scoreBuckets).map(
              ([range, value]) => (
                <div key={range}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">
                      {range}
                    </span>

                    <span className="text-sm font-medium">
                      {value}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(
                          (value /
                            Math.max(
                              ...Object.values(scoreBuckets)
                            )) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// ROOT CAUSE ANALYSIS SECTION
// ============================================================

export const RootCauseAnalysisSection: React.FC<{
  data: ReportData;
  variant?: 'screen' | 'print';
}> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();

  const {
    lowPerformers,
    rejectedWithoutNotes,
    pendingWithoutHistory,
  } = data;

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>
        5. {t('daily_report.rootCauseAnalysis')}
      </SectionTitle>

      <div className="space-y-4">
        {/* ================================================= */}
        {/* Repeated Operational Failures */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.repeatedFailures')}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              {t('daily_report.repeatedFailuresDesc')}
            </p>
          </div>

          <div className="space-y-3">
            {lowPerformers.slice(0, 5).map(
              ({ submission, score, window }) => (
                <div
                  key={submission.id}
                  className="rounded-lg border bg-muted/20 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {submission.form?.name}
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        {window.label}
                      </p>

                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-muted-foreground">
                          • {t('daily_report.rootCauseIssue1')}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          • {t('daily_report.rootCauseIssue2')}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          • {t('daily_report.rootCauseIssue3')}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-rose-600">
                        {Math.round(score)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {t('daily_report.score')}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* Workflow Weaknesses */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-background p-4">
            <p className="text-sm font-semibold mb-4">
              {t('daily_report.workflowWeaknesses')}
            </p>

            <div className="space-y-3">
              <KeyValueRow
                label={t(
                  'daily_report.rejectedWithoutNotes'
                )}
                value={rejectedWithoutNotes.length}
              />

              <KeyValueRow
                label={t(
                  'daily_report.pendingWithoutHistory'
                )}
                value={pendingWithoutHistory.length}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-background p-4">
            <p className="text-sm font-semibold mb-4">
              {t('daily_report.operationalImpact')}
            </p>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-6">
                {t(
                  'daily_report.operationalImpactDescription'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// ============================================================
// WORKFLOW INTELLIGENCE SECTION
// ============================================================

export const WorkflowIntelligenceSection: React.FC<{
  data: ReportData;
  variant?: 'screen' | 'print';
}> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();

  const {
    pendingApproval,
    bottlenecks,
    medianCycleMins,
  } = data;

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>
        6. {t('daily_report.workflowIntelligence')}
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ================================================= */}
        {/* SLA & Approval Efficiency */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.approvalEfficiency')}
            </p>
          </div>

          <div className="space-y-3">
            <KeyValueRow
              label={t('daily_report.pendingApprovals')}
              value={pendingApproval.length}
            />

            <KeyValueRow
              label={t('daily_report.avgApprovalTime')}
              value={
                medianCycleMins
                  ? `${Math.round(medianCycleMins)} min`
                  : '—'
              }
            />

            <KeyValueRow
              label={t('daily_report.workflowBottlenecks')}
              value={bottlenecks.length}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* Bottleneck Detection */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {t('daily_report.bottleneckDetection')}
            </p>
          </div>

          <div className="space-y-3">
            {bottlenecks.length ? (
              bottlenecks.slice(0, 5).map((b) => (
                <div
                  key={b.submission.id}
                  className="rounded-lg border bg-muted/20 p-3"
                >
                  <p className="text-sm font-medium">
                    {b.submission.form?.name}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {b.window.label}
                  </p>

                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                    {Math.round(b.cycleMins)} min
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('daily_report.noBottlenecks')}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};