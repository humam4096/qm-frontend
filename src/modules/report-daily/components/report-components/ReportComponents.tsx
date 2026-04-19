import React from 'react';
import { useTranslation } from 'react-i18next';
import { EXPECTED_SUBMISSIONS_PER_WINDOW, type PerformanceClass, type useDailyReportData } from '../../hooks/useDailyReportData';

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


function performanceColor(c: PerformanceClass): string {
  switch (c) {
    case 'Excellent': return 'text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-700 dark:bg-emerald-900/20';
    case 'Good':      return 'text-teal-700 border-teal-300 bg-teal-50 dark:text-teal-400 dark:border-teal-700 dark:bg-teal-900/20';
    case 'Moderate':  return 'text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:bg-amber-900/20';
    case 'Poor':
    default:          return 'text-rose-700 border-rose-300 bg-rose-50 dark:text-rose-400 dark:border-rose-700 dark:bg-rose-900/20';
  }
}

// ─── Primitive UI components ──────────────────────────────────────────────────

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}
const Section: React.FC<SectionProps> = ({ children, className = '' }) => (
  <div className={`rounded-lg border p-4 space-y-3 ${className}`}>{children}</div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm font-semibold">{children}</p>
);

interface MetricCardProps {
  label: string;
  value: string | number;
}
const MetricCard: React.FC<MetricCardProps> = ({ label, value }) => (
  <div className="rounded-lg border bg-muted/20 p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}
const SubSection: React.FC<SubSectionProps> = ({ title, children }) => (
  <div className="rounded-lg border bg-muted/10 p-3 space-y-2">
    <p className="text-sm font-medium">{title}</p>
    {children}
  </div>
);

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
}
const BulletList: React.FC<BulletListProps> = ({ items }) => (
  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
    {items.map((item, idx) => <li key={idx}>{item}</li>)}
  </ul>
);

// ─── Domain components ────────────────────────────────────────────────────────

type ReportData = ReturnType<typeof useDailyReportData>;

interface HeaderCardProps {
  data: ReportData;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ data }) => {
  const { t } = useTranslation();
  const { contractName, kitchenName, zoneName, serviceDate, performanceClass } = data;

  // Translate performance class
  const performanceClassLabel = 
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good' ? t('daily_report.good') :
    performanceClass === 'Moderate' ? t('daily_report.moderate') :
    t('daily_report.poor');

  const keyTakeaways = [
    `Overall performance classified as ${performanceClassLabel} with an average score of ${data.avgScore.toFixed(1)} across ${data.scores.length}/${data.totalSubmissions} scored submissions.`,
    `Success (accepted) rate is ${pct(data.accepted.length, data.totalSubmissions)} with ${data.accepted.length} accepted and ${data.rejected.length} rejected submissions.`,
    data.totalWindows
      ? `Operational completeness is ${pct(data.totalSubmissions, data.expectedSubmissions)} (${data.totalSubmissions}/${data.expectedSubmissions}) based on an expectation of ${EXPECTED_SUBMISSIONS_PER_WINDOW} submissions per window; total missing submissions: ${data.missingSubmissions}.`
      : 'No meal windows found for this slot (expected completeness cannot be assessed).',
  ];

  const criticalRisks = [
    data.pendingApproval.length
      ? `${data.pendingApproval.length} submissions are still pending branch approval, creating execution uncertainty and delaying closure.`
      : '',
    data.rejectedWithoutNotes.length
      ? `${data.rejectedWithoutNotes.length} rejected submissions have no rejection notes, limiting root-cause analysis and corrective action quality.`
      : '',
    data.missingSubmissions
      ? `${data.missingSubmissions} expected submissions are missing versus plan (${data.totalSubmissions}/${data.expectedSubmissions}), creating reporting blind spots and increasing compliance risk.`
      : '',
  ].filter(Boolean);

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t('daily_report.dailyOperationsReport')}</p>
          <p className="text-base font-semibold">
            {contractName} • {kitchenName} • {zoneName} • {serviceDate}
          </p>
        </div>
        <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${performanceColor(performanceClass)}`}>
          {performanceClassLabel}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t('daily_report.keyTakeaways')} (3)</p>
        <BulletList items={keyTakeaways} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          {t('daily_report.criticalRisks')} (3) {criticalRisks.length ? '' : t('daily_report.noneDetected')}
        </p>
        {criticalRisks.length ? (
          <BulletList items={criticalRisks} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('daily_report.noHighSeverityRisks')}
          </p>
        )}
      </div>
    </div>
  );
};

export const ExecutiveSummarySection: React.FC<{ data: ReportData }> = ({ data }) => {
  const { t } = useTranslation();
  const { totalSubmissions, totalWindows, performanceClass, avgScore, accepted, completed, expectedSubmissions, missingSubmissions, windowsWithNoSubmissions } = data;
  
  // Translate performance class
  const performanceClassLabel = 
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good' ? t('daily_report.good') :
    performanceClass === 'Moderate' ? t('daily_report.moderate') :
    t('daily_report.poor');

  return (
    <Section>
      <SectionTitle>1. {t('daily_report.executiveSummary')}</SectionTitle>
      <p className="text-sm text-muted-foreground leading-relaxed">
        The day's meal operations for this slot produced <span className="font-medium text-foreground">{totalSubmissions}</span> submissions across{' '}
        <span className="font-medium text-foreground">{totalWindows}</span> meal time windows. Overall operational outcomes are{' '}
        <span className="font-medium text-foreground">{performanceClassLabel}</span>, driven by an average score of{' '}
        <span className="font-medium text-foreground">{avgScore.toFixed(1)}</span>, a success (accepted) rate of{' '}
        <span className="font-medium text-foreground">{pct(accepted.length, totalSubmissions)}</span>, and a completion rate of{' '}
        <span className="font-medium text-foreground">{pct(completed.length, totalSubmissions)}</span>.
        {expectedSubmissions
          ? ` Planned completeness (5 submissions per window) is ${pct(totalSubmissions, expectedSubmissions)} (${totalSubmissions}/${expectedSubmissions}), with ${missingSubmissions} missing submissions versus plan.`
          : ''}
        {windowsWithNoSubmissions.length
          ? ` Additionally, ${windowsWithNoSubmissions.length} time window(s) have zero submissions, indicating missed or unreported operations.`
          : ' No zero-submission windows were detected.'}
      </p>
    </Section>
  );
};

export const KeyMetricsSection: React.FC<{ data: ReportData }> = ({ data }) => {
  const { t } = useTranslation();
  const { totalSubmissions, expectedSubmissions, missingSubmissions, avgScore, accepted, rejected, pendingApproval, completed, totalWindows, windowsWithNoSubmissions, scoreBuckets, scores } = data;

  return (
    <Section>
      <SectionTitle>2. {t('daily_report.keyMetrics')}</SectionTitle>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label={t('daily_report.operationalCompleteness')} value={`${pct(totalSubmissions, expectedSubmissions)} (${totalSubmissions}/${expectedSubmissions})`} />
        <MetricCard label={t('daily_report.missingSubmissions')} value={missingSubmissions} />
        <MetricCard label={t('daily_report.totalSubmissions')} value={totalSubmissions} />
        <MetricCard label={t('daily_report.avgScore')} value={avgScore.toFixed(1)} />
        <MetricCard label={t('daily_report.successRate')} value={pct(accepted.length, totalSubmissions)} />
        <MetricCard label={t('daily_report.rejectionRate')} value={pct(rejected.length, totalSubmissions)} />
        <MetricCard label={t('daily_report.completionRate')} value={pct(completed.length, totalSubmissions)} />
        <MetricCard label={t('daily_report.pendingApprovals')} value={pendingApproval.length} />
        <MetricCard label={t('daily_report.mealWindows')} value={totalWindows} />
        <MetricCard label={t('daily_report.emptyWindows')} value={windowsWithNoSubmissions.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubSection title={t('daily_report.scoreDistribution')}>
          <div className="space-y-1">
            {Object.entries(scoreBuckets).map(([k, v]) => (
              <KeyValueRow key={k} label={k} value={`${v} (${pct(v, scores.length)})`} />
            ))}
          </div>
        </SubSection>

        <SubSection title={t('daily_report.acceptanceVsRejection')}>
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
}
export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, window, score, showNotes }) => {
  const { t } = useTranslation();
  
  return (
    <li className="rounded-md border bg-background p-3">
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

export const DetailedAnalysisSection: React.FC<{ data: ReportData }> = ({ data }) => {
  const { t } = useTranslation();
  const { totalWindows, contractName, kitchenName, zoneName, expectedSubmissions, totalSubmissions, missingSubmissions, pendingApproval, windowsBelowExpected, topPerformers, lowPerformers, medianCycleMins, bottlenecks } = data;

  return (
    <Section>
      <SectionTitle>3. {t('daily_report.detailedAnalysis')}</SectionTitle>

      <SubSection title={t('daily_report.operationalOverview')}>
        <BulletList items={[
          <>
            Submissions captured across <span className="font-medium text-foreground">{totalWindows}</span> meal time windows for contract{' '}
            <span className="font-medium text-foreground">{contractName}</span> (Kitchen: <span className="font-medium text-foreground">{kitchenName}</span>, Zone:{' '}
            <span className="font-medium text-foreground">{zoneName}</span>).
          </>,
          <>
            Expected submissions: <span className="font-medium text-foreground">{expectedSubmissions}</span> (5 per window). Actual submissions:{' '}
            <span className="font-medium text-foreground">{totalSubmissions}</span>. Missing vs plan:{' '}
            <span className="font-medium text-foreground">{missingSubmissions}</span> (completeness: <span className="font-medium text-foreground">{pct(totalSubmissions, expectedSubmissions)}</span>).
          </>,
          <>
            Incomplete operations: <span className="font-medium text-foreground">{pendingApproval.length}</span> pending approvals may represent delayed closure or unresolved issues.
          </>,
          ...(windowsBelowExpected.length ? [
            <>
              Shortfall by window (highest gaps):{' '}
              {windowsBelowExpected.slice(0, 4).map((x) => `${x.window.label} missing ${x.missing}`).join(' • ')}
              {windowsBelowExpected.length > 4 ? ' • …' : ''}
            </>,
          ] : []),
        ]} />
      </SubSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubSection title={t('daily_report.highPerformingSubmissions')}>
          {topPerformers.length ? (
            <ul className="space-y-2">
              {topPerformers.map(({ submission, window, score }) => (
                <SubmissionCard key={submission.id} submission={submission} window={window} score={score} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('daily_report.noScoredSubmissions')}</p>
          )}
        </SubSection>

        <SubSection title={t('daily_report.lowPerformingSubmissions')}>
          {lowPerformers.length ? (
            <ul className="space-y-2">
              {lowPerformers.map(({ submission, window, score }) => (
                <SubmissionCard key={submission.id} submission={submission} window={window} score={score} showNotes />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('daily_report.noScoredSubmissions')}</p>
          )}
        </SubSection>
      </div>

      <SubSection title={t('daily_report.efficiencyExecution')}>
        <BulletList items={[
          <>
            Approvals pending: <span className="font-medium text-foreground">{pendingApproval.length}</span> (risk of delayed closure and reduced reliability).
          </>,
          <>
            Median cycle time (from submission creation to last status change):{' '}
            <span className="font-medium text-foreground">{medianCycleMins !== null ? `${Math.round(medianCycleMins)} min` : '—'}</span>.
          </>,
          ...(bottlenecks.length ? [
            <>
              Potential bottlenecks (longest cycle times):
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {bottlenecks.map((b) => (
                  <li key={b.submission.id}>
                    {b.submission.form?.name ?? b.submission.form_type} • {b.window.label} • {Math.round(b.cycleMins)} min • last change{' '}
                    {formatDateTime((b.submission.status_history ?? []).slice(-1)[0]?.changed_at)}
                  </li>
                ))}
              </ul>
            </>,
          ] : []),
        ]} />
      </SubSection>
    </Section>
  );
};

export const InsightsSection: React.FC<{ data: ReportData }> = ({ data }) => {
  const { t } = useTranslation();
  const { performanceClass, accepted, rejected, pendingApproval, scoreBuckets, missingSubmissions, windowsWithNoSubmissions, rejectedWithoutNotes, pendingWithoutHistory } = data;

  // Translate performance class
  const performanceClassLabel = 
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good' ? t('daily_report.good') :
    performanceClass === 'Moderate' ? t('daily_report.moderate') :
    t('daily_report.poor');

  return (
    <Section>
      <SectionTitle>4. {t('daily_report.insights')}</SectionTitle>
      <BulletList items={[
        <>
          **How successful was the operation?** It was <span className="font-medium text-foreground">{performanceClassLabel}</span>, with{' '}
          <span className="font-medium text-foreground">{accepted.length}</span> accepted and <span className="font-medium text-foreground">{rejected.length}</span> rejected submissions, and{' '}
          <span className="font-medium text-foreground">{pendingApproval.length}</span> still pending approval.
        </>,
        <>
          **What worked well?** Score strength is concentrated in the top band (90–100) for{' '}
          <span className="font-medium text-foreground">{scoreBuckets['90–100']}</span> submission(s), supporting strong compliance when the process completes.
        </>,
        <>
          **Main weaknesses:** {missingSubmissions ? `missing submissions vs plan (${missingSubmissions})` : 'no submission shortfall vs plan detected'}
          {windowsWithNoSubmissions.length ? ', including zero-submission windows' : ''}{pendingApproval.length ? ', pending approvals delaying closure' : ''}{rejectedWithoutNotes.length ? ', and rejection decisions without usable feedback' : ''}.
        </>,
        ...(pendingWithoutHistory.length ? [
          <>
            Operational blind spot: <span className="font-medium text-foreground">{pendingWithoutHistory.length}</span> pending submission(s) have no status history, limiting traceability of where approvals stall.
          </>,
        ] : []),
      ]} />
    </Section>
  );
};

export const RecommendationsSection: React.FC<{ data: ReportData }> = ({ data }) => {
  const { t } = useTranslation();
  const { missingSubmissions, windowsBelowExpected, pendingApproval, rejectedWithoutNotes } = data;

  return (
    <Section>
      <SectionTitle>5. {t('daily_report.recommendations')}</SectionTitle>
      <BulletList items={[
        missingSubmissions ? (
          <>
            Enforce planned reporting completeness (5 submissions per window). Prioritize windows with the largest shortfalls first:{' '}
            {windowsBelowExpected.slice(0, 4).map((x) => `${x.window.label} missing ${x.missing}`).join(' • ')}
            {windowsBelowExpected.length > 4 ? ' • …' : ''}. Add a pre-close checkpoint to prevent end-of-window submission gaps.
          </>
        ) : (
          <>
            Maintain completeness discipline by continuing current submission controls; monitor any future "missing vs plan" variance as an early warning for under-reporting.
          </>
        ),

        pendingApproval.length ? (
          <>
            Reduce approval latency by prioritizing the <span className="font-medium text-foreground">{pendingApproval.length}</span> pending submissions for immediate branch review. Use cycle-time outliers (above median) to triage where workflow stalls.
          </>
        ) : (
          <>
            Sustain timely closure by keeping the current approval cadence; treat "pending approvals" as a zero-tolerance KPI for operational reliability.
          </>
        ),

        rejectedWithoutNotes.length ? (
          <>
            Improve corrective action quality by requiring rejection notes (currently missing on <span className="font-medium text-foreground">{rejectedWithoutNotes.length}</span> rejected submissions). Standardize a short taxonomy (e.g., hygiene, temperature, documentation, timing) to enable trend analytics.
          </>
        ) : (
          <>
            Keep feedback quality high by ensuring every rejection includes a concise, actionable note and by periodically auditing note completeness.
          </>
        ),

        <>
          Lift consistency by targeting the bottom-performing submissions (lowest scores) with focused checks and follow-up audits in the next cycle; prioritize forms/windows where low scores coincide with rejection or prolonged cycle times.
        </>,
      ]} />
    </Section>
  );
};
