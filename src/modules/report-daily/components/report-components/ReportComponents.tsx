import React from 'react';
import { useTranslation } from 'react-i18next';
import { EXPECTED_SUBMISSIONS_PER_WINDOW, type useDailyReportData } from '../../hooks/useDailyReportData';
import {
  getMetricStatus,
  getMetricStatusColor,
} from '../../utils/dashboardMetrics';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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


function translateSubmissionStatus(status: string, t: (key: string) => string): string {
  const key = `formSubmissions.${status}`;
  const translated = t(key);
  // If the key wasn't found i18n returns the key itself; fall back gracefully
  return translated !== key ? translated : status.replace(/_/g, ' ');
}

function translateBranchApproval(approval: string, t: (key: string) => string): string {
  switch (approval) {
    case 'accepted': return t('daily_report.accepted');
    case 'rejected': return t('daily_report.rejected');
    case 'pending':  return t('daily_report.pending');
    default:         return approval;
  }
}

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

interface SectionTitleProps {
  children: React.ReactNode;
  variant?: 'screen' | 'print';
  icon?: React.ReactNode;
}
const SectionTitle: React.FC<SectionTitleProps> = ({ children, variant = 'screen', icon }) => {
  const printClasses = variant === 'print' ? 'section-title' : '';
  return (
    <div className={`flex items-center gap-2 ${printClasses}`}>
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <p className="text-sm font-semibold">{children}</p>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  statusColor?: string;
  variant?: 'screen' | 'print';
}
const MetricCard: React.FC<MetricCardProps> = ({ label, value, statusColor, variant = 'screen' }) => {
  const printClasses = variant === 'print' ? 'metric-card' : '';
  const textSize = variant === 'print' ? 'text-base' : 'text-lg';
  const borderClass = variant === 'print' ? '' : 'border';
  return (
    <div className={`rounded-lg ${borderClass} bg-muted/20 p-3 ${printClasses}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`${textSize} font-semibold ${statusColor ?? ''}`}>{value}</p>
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
  valueColor?: string;
}
const KeyValueRow: React.FC<KeyValueRowProps> = ({ label, value, valueColor }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-sm font-medium ${valueColor ?? 'text-foreground'}`}>{value}</span>
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


  const performanceClassLabel =
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good'      ? t('daily_report.good') :
    performanceClass === 'Moderate'  ? t('daily_report.moderate') :
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

  // Print variant
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

  // Screen variant
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('daily_report.dailyOperationsReport')}</p>
          <p className="text-base font-semibold mt-0.5">
            {contractName} • {kitchenName} • {zoneName} • {serviceDate}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t('daily_report.keyTakeaways')}</p>
        <BulletList items={keyTakeaways} variant={variant} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          {t('daily_report.criticalRisks')} {criticalRisks.length ? '' : t('daily_report.noneDetected')}
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

export const ExecutiveSummarySection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { totalSubmissions, totalWindows, performanceClass, avgScore, accepted, expectedSubmissions, missingSubmissions, windowsWithNoSubmissions } = data;

  const performanceClassLabel =
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good'      ? t('daily_report.good') :
    performanceClass === 'Moderate'  ? t('daily_report.moderate') :
    t('daily_report.poor');

  const summaryParts = [
    t('daily_report.executiveSummaryPart1', {
      totalSubmissions,
      totalWindows,
      performanceClass: performanceClassLabel,
      avgScore: avgScore.toFixed(1),
      successRate: pct(accepted.length, totalSubmissions),
    })
  ];

  if (expectedSubmissions) {
    summaryParts.push(
      t('daily_report.executiveSummaryPart2', {
        completeness: pct(totalSubmissions, expectedSubmissions),
        actual: totalSubmissions,
        expected: expectedSubmissions,
        missing: missingSubmissions
      })
    );
  }

  if (windowsWithNoSubmissions.length) {
    summaryParts.push(
      t('daily_report.executiveSummaryPart3', {
        zeroWindowCount: windowsWithNoSubmissions.length
      })
    );
  } else {
    summaryParts.push(t('daily_report.executiveSummaryPart4'));
  }

  const textSize = variant === 'print' ? 'text-xs' : 'text-sm';

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant}>1. {t('daily_report.executiveSummary')}</SectionTitle>
      <div className={`${textSize} text-muted-foreground leading-relaxed space-y-2`}>
        {summaryParts.map((part, idx) => (
          <p key={idx} dangerouslySetInnerHTML={{ __html: part }} />
        ))}
      </div>
    </Section>
  );
};

export const KeyMetricsSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { totalSubmissions, expectedSubmissions, missingSubmissions, avgScore, accepted, rejected, pendingApproval, totalWindows, windowsWithNoSubmissions, scoreBuckets, scores, successRate, rejectionRate } = data;

  // Health score for the overall operation
  // const healthScore = calculateHealthScore({ avgScore, successRate, completionRate: successRate, rejectionRate });
  // const healthStatus = getHealthStatus(healthScore);
  // const healthColor = getHealthStatusColor(healthStatus);

  // Per-metric status colors
  const completenessStatus  = getMetricStatus(totalSubmissions, expectedSubmissions);
  const successStatus       = getMetricStatus(successRate * 100, 80);
  const rejectionStatusColor = getMetricStatusColor(getMetricStatus(rejectionRate * 100, 10, true));
  const pendingStatusColor  = getMetricStatusColor(getMetricStatus(pendingApproval.length, 0, true));

  return (
    <Section variant={variant}>
      <div className="flex items-center justify-between">
        <SectionTitle variant={variant}>2. {t('daily_report.keyMetrics')}</SectionTitle>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label={t('daily_report.operationalCompleteness')}
          value={`${pct(totalSubmissions, expectedSubmissions)} (${totalSubmissions}/${expectedSubmissions})`}
          statusColor={getMetricStatusColor(completenessStatus)}
          variant={variant}
        />
        <MetricCard
          label={t('daily_report.missingSubmissions')}
          value={missingSubmissions}
          statusColor={missingSubmissions > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}
          variant={variant}
        />
        <MetricCard
          label={t('daily_report.totalSubmissions')}
          value={totalSubmissions}
          variant={variant}
        />
        <MetricCard
          label={t('daily_report.avgScore')}
          value={avgScore.toFixed(1)}
          statusColor={getMetricStatusColor(getMetricStatus(avgScore, 80))}
          variant={variant}
        />
        <MetricCard
          label={t('daily_report.successRate')}
          value={pct(accepted.length, totalSubmissions)}
          statusColor={getMetricStatusColor(successStatus)}
          variant={variant}
        />
        <MetricCard
          label={t('daily_report.rejectionRate')}
          value={pct(rejected.length, totalSubmissions)}
          statusColor={rejectionStatusColor}
          variant={variant}
        />
        <MetricCard
          label={t('daily_report.pendingApprovals')}
          value={pendingApproval.length}
          statusColor={pendingStatusColor}
          variant={variant}
        />
        <MetricCard
          label={t('daily_report.mealWindows')}
          value={totalWindows}
          variant={variant}
        />
        <MetricCard
          label={t('daily_report.emptyWindows')}
          value={windowsWithNoSubmissions.length}
          statusColor={windowsWithNoSubmissions.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}
          variant={variant}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubSection title={t('daily_report.scoreDistribution')} variant={variant}>
          <div className="space-y-1">
            {Object.entries(scoreBuckets).map(([k, v]) => (
              <KeyValueRow
                key={k}
                label={k}
                value={`${v} (${pct(v, scores.length)})`}
                valueColor={
                  k === '90–100' ? 'text-emerald-600 dark:text-emerald-400' :
                  k === '75–89'  ? 'text-teal-600 dark:text-teal-400' :
                  k === '60–74'  ? 'text-amber-600 dark:text-amber-400' :
                  'text-rose-600 dark:text-rose-400'
                }
              />
            ))}
          </div>
        </SubSection>

        <SubSection title={t('daily_report.acceptanceVsRejection')} variant={variant}>
          <KeyValueRow
            label={t('daily_report.accepted')}
            value={`${accepted.length} (${pct(accepted.length, totalSubmissions)})`}
            valueColor="text-emerald-600 dark:text-emerald-400"
          />
          <KeyValueRow
            label={t('daily_report.rejected')}
            value={`${rejected.length} (${pct(rejected.length, totalSubmissions)})`}
            valueColor={rejected.length > 0 ? 'text-rose-600 dark:text-rose-400' : undefined}
          />
          <KeyValueRow
            label={t('daily_report.pending')}
            value={`${pendingApproval.length} (${pct(pendingApproval.length, totalSubmissions)})`}
            valueColor={pendingApproval.length > 0 ? 'text-amber-600 dark:text-amber-400' : undefined}
          />
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
            {t('daily_report.window')}: {window.label} •{' '}
            {t('daily_report.status')}: {translateSubmissionStatus(submission.status, t)} •{' '}
            {t('daily_report.branchApprovalStatus')}: {translateBranchApproval(submission.branch_approval, t)}
          </p>
          {showNotes && submission.branch_approval_notes?.trim() && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {t('daily_report.notes')}: <span className="text-foreground">{submission.branch_approval_notes}</span>
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
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

  const performanceClassLabel =
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good'      ? t('daily_report.good') :
    performanceClass === 'Moderate'  ? t('daily_report.moderate') :
    t('daily_report.poor');

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
    // Use <strong> tags (rendered via dangerouslySetInnerHTML) instead of **markdown**
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
      <span dangerouslySetInnerHTML={{ __html: t('daily_report.insightItem3Prefix') }} />{' '}
      {weaknessParts.join(', ')}.
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
