import React from 'react';
import { useTranslation } from 'react-i18next';
import { EXPECTED_SUBMISSIONS_PER_WINDOW, type useDailyReportData } from '../../hooks/useDailyReportData';
import {
  getMetricStatus,
  getMetricStatusColor,
} from '../../utils/dashboardMetrics';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MAX_WINDOWS = 3;

const EFFECTIVE_EXPECTED_SUBMISSIONS_PER_WINDOW = Math.min(
  EXPECTED_SUBMISSIONS_PER_WINDOW,
  MAX_WINDOWS
);

function pct(n: number, d: number): string {
  if (!d) return '0%';
  return `${Math.round((n / d) * 100)}%`;
}


// ─── Primitive UI components ──────────────────────────────────────────────────

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'screen' | 'print';
}
const Section: React.FC<SectionProps> = ({ children, className = '', variant = 'screen' }) => {
  const printClasses = variant === 'print' ? 'print-section page-break-avoid' : '';
  return (
    <div className={`mb-6 space-y-3 ${printClasses} ${className}`}>
      {children}
    </div>
  );
};

interface SectionTitleProps {
  children: React.ReactNode;
  variant?: 'screen' | 'print';
  icon?: React.ReactNode;
  number?: string;
}
const SectionTitle: React.FC<SectionTitleProps> = ({ children, variant = 'screen', icon, number }) => {
  const printClasses = variant === 'print' ? 'section-title' : '';
  return (
    <div className={`flex items-baseline gap-2.5 pb-1.5 ${printClasses}`}
      style={{ borderBottom: '1px solid hsl(var(--border) / 0.4)' }}>
      {number && (
        <span className="text-[10px] font-medium text-muted-foreground/50 tracking-widest min-w-[20px]">
          {number}
        </span>
      )}
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>
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
  return (
    <div className={`bg-muted/20 rounded-md px-3 py-2.5 ${printClasses}`}>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground/60 mb-0.5">{label}</p>
      <p className={`text-lg font-medium leading-tight ${statusColor ?? 'text-foreground'}`}>{value}</p>
    </div>
  );
};

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
  variant?: 'screen' | 'print';
}
const SubSection: React.FC<SubSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{title}</p>
      {children}
    </div>
  );
};

interface BulletListProps {
  items: React.ReactNode[];
  variant?: 'screen' | 'print';
}
const BulletList: React.FC<BulletListProps> = ({ items, variant = 'screen' }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const textSize = variant === 'print' ? 'text-xs' : 'text-xs';
  const paddingClass = isRTL ? 'pr-4' : 'pl-4';

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
    data.totalWindows
      ? t('daily_report.keyTakeaway3', {
          completeness: pct(data.totalSubmissions, data.expectedSubmissions),
          actual: data.totalSubmissions,
          expected: data.expectedSubmissions,
          expectedPerWindow: EFFECTIVE_EXPECTED_SUBMISSIONS_PER_WINDOW,
          missing: data.missingSubmissions
        })
      : t('daily_report.keyTakeaway3NoWindows'),
  ];

  // Print variant
  if (variant === 'print') {
    return (
      <div className="print-section page-break-avoid mb-6">
        {/* Masthead */}
        <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-4 pb-3`}
          style={{ borderBottom: '2px solid hsl(var(--foreground) / 0.15)' }}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">
              {t('daily_report.dailyOperationsReport')}
            </p>
            <h1 className="text-xl font-semibold text-foreground leading-tight">
              {contractName} · {kitchenName} · {zoneName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('daily_report.serviceDate')}: {serviceDate}
              {' · '}
              {t('daily_report.generatedOn')}: {new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>

        {/* Key takeaways */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            {t('daily_report.keyTakeaways')}
          </p>
          <BulletList items={keyTakeaways} variant="print" />
        </div>
      </div>
    );
  }

  // Screen variant
  return (
    <div className="mb-6 pb-4" style={{ borderBottom: '2px solid hsl(var(--foreground) / 0.12)' }}>
      {/* Masthead */}
      <div className="flex flex-col gap-0.5 md:flex-row md:items-start md:justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">
            {t('daily_report.dailyOperationsReport')}
          </p>
          <p className="text-lg font-semibold text-foreground leading-tight">
            {contractName} · {kitchenName} · {zoneName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{serviceDate}</p>
        </div>
        <span className="inline-flex items-center self-start mt-1 md:mt-0 text-xs text-muted-foreground">
          {performanceClassLabel}
        </span>
      </div>

      {/* Key takeaways */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {t('daily_report.keyTakeaways')}
        </p>
        <BulletList items={keyTakeaways} />
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

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant} number="01">1. {t('daily_report.executiveSummary')}</SectionTitle>
      <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
        {summaryParts.map((part, idx) => (
          <p key={idx} dangerouslySetInnerHTML={{ __html: part }} />
        ))}
      </div>
    </Section>
  );
};

export const KeyMetricsSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { totalSubmissions, expectedSubmissions, avgScore, rejected, rejectionRate } = data;

  const completenessStatus   = getMetricStatus(totalSubmissions, expectedSubmissions);
  const rejectionStatusColor = getMetricStatusColor(getMetricStatus(rejectionRate * 100, 10, true));

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant} number="02">2. {t('daily_report.keyMetrics')}</SectionTitle>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MetricCard
          label={t('daily_report.operationalCompleteness')}
          value={`${pct(totalSubmissions, expectedSubmissions)} (${totalSubmissions}/${expectedSubmissions})`}
          statusColor={getMetricStatusColor(completenessStatus)}
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
          label={t('daily_report.rejectionRate')}
          value={pct(rejected.length, totalSubmissions)}
          statusColor={rejectionStatusColor}
          variant={variant}
        />

      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <SubSection title={t('daily_report.scoreDistribution')} variant={variant}>
          <div>
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
      </div> */}
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
export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, window, score, showNotes }) => {
  const { t } = useTranslation();

  return (
    <li className="flex items-start justify-between gap-3 py-1.5"
      style={{ borderBottom: '1px solid hsl(var(--border) / 0.3)' }}>
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{submission.form?.name ?? submission.form_type}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {t('daily_report.window')}: {window.label}
        </p>
        {showNotes && submission.branch_approval_notes?.trim() && (
          <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">
            {t('daily_report.notes')}: <span className="text-foreground">{submission.branch_approval_notes}</span>
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-foreground">{score}</p>
        <p className="text-[10px] text-muted-foreground/60">{t('daily_report.score')}</p>
      </div>
    </li>
  );
};

export const DetailedAnalysisSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'print' }) => {
  const { t } = useTranslation();
  const { topPerformers, lowPerformers } = data;

  const textSize = variant === 'print' ? 'text-xs' : 'text-xs';

  return (
    <Section variant={variant}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubSection title={t('daily_report.highPerformingSubmissions')} variant={variant}>
          {topPerformers.length ? (
            <ul>
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
            <ul>
              {lowPerformers.slice(0, 3).map(({ submission, window, score }) => (
                <SubmissionCard key={submission.id} submission={submission} window={window} score={score} showNotes variant={variant} />
              ))}
            </ul>
          ) : (
            <p className={`${textSize} text-muted-foreground`}>{t('daily_report.noScoredSubmissions')}</p>
          )}
        </SubSection>
      </div>
    </Section>
  );
};

export const InsightsSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { pendingApproval, scoreBuckets, missingSubmissions, windowsWithNoSubmissions, rejectedWithoutNotes, pendingWithoutHistory } = data;

  const weaknessParts: string[] = [];
  if (missingSubmissions) {
    weaknessParts.push(t('daily_report.weaknessMissingSubmissions', { count: missingSubmissions }));
  } else {
    weaknessParts.push(t('daily_report.weaknessNoShortfall'));
  }
  if (windowsWithNoSubmissions.length) weaknessParts.push(t('daily_report.weaknessZeroWindows'));
  if (pendingApproval.length)          weaknessParts.push(t('daily_report.weaknessPendingApprovals'));
  if (rejectedWithoutNotes.length)     weaknessParts.push(t('daily_report.weaknessNoFeedback'));

  const insightItems: React.ReactNode[] = [
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
      <SectionTitle variant={variant} number="04">4. {t('daily_report.insights')}</SectionTitle>
      <BulletList items={insightItems} variant={variant} />
    </Section>
  );
};

export const RecommendationsSection: React.FC<{ data: ReportData; variant?: 'screen' | 'print' }> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { missingSubmissions, windowsBelowExpected, pendingApproval, rejectedWithoutNotes } = data;

  const recommendationItems = [
    missingSubmissions
      ? t('daily_report.recommendation1WithMissing', {
          shortfalls: windowsBelowExpected.slice(0, 4).map((x) =>
            t('daily_report.windowMissing', { window: x.window.label, missing: x.missing })
          ).join(' • ') + (windowsBelowExpected.length > 4 ? ' • …' : '')
        })
      : t('daily_report.recommendation1NoMissing'),

    pendingApproval.length
      ? t('daily_report.recommendation2WithPending', { pendingCount: pendingApproval.length })
      : t('daily_report.recommendation2NoPending'),

    rejectedWithoutNotes.length
      ? t('daily_report.recommendation3WithoutNotes', { count: rejectedWithoutNotes.length })
      : t('daily_report.recommendation3WithNotes'),

    t('daily_report.recommendation4'),
  ];

  return (
    <Section variant={variant}>
      <SectionTitle variant={variant} number="05">5. {t('daily_report.recommendations')}</SectionTitle>
      <BulletList items={recommendationItems} variant={variant} />
    </Section>
  );
};

// ─── Report footer ─────────────────────────────────────────────────────────────

interface ReportFooterProps {
  data: ReportData;
  variant?: 'screen' | 'print';
}
export const ReportFooter: React.FC<ReportFooterProps> = ({ data, variant = 'screen' }) => {
  const { t } = useTranslation();
  const { contractName, kitchenName, zoneName, serviceDate } = data;

  return (
    <div
      className={`flex items-center justify-between pt-3 mt-6 ${variant === 'print' ? 'print-section' : ''}`}
      style={{ borderTop: '1px solid hsl(var(--border) / 0.3)' }}
    >
      <span className="text-[10px] text-muted-foreground/50">
        {contractName} · {kitchenName} · {zoneName} · {serviceDate}
      </span>
      <span className="text-[10px] text-muted-foreground/50">
        {t('daily_report.dailyOperationsReport')}
      </span>
    </div>
  );
};