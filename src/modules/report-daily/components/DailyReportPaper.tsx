
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DailySlot } from '../types';

interface DailyReportDisplayProps {
  data: DailySlot | null;
}



type PerformanceClass = 'Excellent' | 'Good' | 'Moderate' | 'Poor';

const DAILY_REPORT_EXPORT_COLOR_FIXES = `
  .daily-report-paper-export .bg-muted\\/30 { background-color: rgba(238, 236, 224, 0.3) !important; }
  .daily-report-paper-export .bg-muted\\/20 { background-color: rgba(238, 236, 224, 0.2) !important; }
  .daily-report-paper-export .bg-muted\\/10 { background-color: rgba(238, 236, 224, 0.1) !important; }
`;

function safeNumber(n: unknown): number | null {
  const v = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(v) ? v : null;
}

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

function classifyPerformance(args: {
  avgScore: number;
  successRate: number;
  rejectionRate: number;
  completionRate: number;
}): PerformanceClass {
  const { avgScore, successRate, rejectionRate, completionRate } = args;

  if (successRate >= 0.9 && avgScore >= 90 && rejectionRate <= 0.05 && completionRate >= 0.95) return 'Excellent';
  if (successRate >= 0.8 && avgScore >= 80 && rejectionRate <= 0.1 && completionRate >= 0.9) return 'Good';
  if (successRate >= 0.65 && avgScore >= 70 && completionRate >= 0.8) return 'Moderate';
  return 'Poor';
}

function performanceColor(c: PerformanceClass): string {
  switch (c) {
    case 'Excellent':
      return 'text-[#047857] border-[#6EE7B7] bg-[#ECFDF5]';
    case 'Good':
      return 'text-[#0F766E] border-[#5EEAD4] bg-[#F0FDFA]';
    case 'Moderate':
      return 'text-[#B45309] border-[#FCD34D] bg-[#FFFBEB]';
    case 'Poor':
    default:
      return 'text-[#BE123C] border-[#FDA4AF] bg-[#FFF1F2]';
  }
}

export const DailyReportPaper: React.FC<DailyReportDisplayProps> = ({ data }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!data) {
    return (
      <div className="daily-report-paper-export space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <style>{DAILY_REPORT_EXPORT_COLOR_FIXES}</style>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">{t('daily_report.noDataAvailable')}</p>
        </div>
      </div>
    );
  }

  // Business rule provided by ops: each meal window expects 5 submissions.
  const EXPECTED_SUBMISSIONS_PER_WINDOW = 5;

  const windows = data.meal_time_windows ?? [];
  const submissions = windows.flatMap((w) =>
    (w.submissions ?? []).map((s) => ({
      submission: s,
      window: w,
    }))
  );

  const totalWindows = windows.length;
  const totalSubmissions = submissions.length;
  const expectedSubmissions = totalWindows * EXPECTED_SUBMISSIONS_PER_WINDOW;
  const windowsWithNoSubmissions = windows.filter((w) => (w.submissions ?? []).length === 0);
  const windowsBelowExpected = windows
    .map((w) => {
      const actual = (w.submissions ?? []).length;
      const missing = Math.max(0, EXPECTED_SUBMISSIONS_PER_WINDOW - actual);
      return { window: w, actual, missing };
    })
    .filter((x) => x.missing > 0)
    .sort((a, b) => b.missing - a.missing);

  const missingSubmissions = Math.max(0, expectedSubmissions - totalSubmissions);
  // Note: completeness is shown as totalSubmissions/expectedSubmissions; keep it as a displayed KPI rather than a separate variable.

  const accepted = submissions.filter((x) => x.submission.branch_approval === 'accepted');
  const rejected = submissions.filter((x) => x.submission.branch_approval === 'rejected');
  const pendingApproval = submissions.filter((x) => x.submission.branch_approval === 'pending');

  const completed = submissions.filter((x) => {
    const a = x.submission.branch_approval;
    const status = (x.submission.status ?? '').toString();
    return a === 'accepted' || a === 'rejected' || status === 'approved_by_quality_manager';
  });

  const scores = submissions
    .map((x) => safeNumber(x.submission.score))
    .filter((v): v is number => v !== null);

  const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const successRate = totalSubmissions ? accepted.length / totalSubmissions : 0;
  const rejectionRate = totalSubmissions ? rejected.length / totalSubmissions : 0;
  const completionRate = totalSubmissions ? completed.length / totalSubmissions : 0;

  const scoreBuckets = {
    '90–100': scores.filter((s) => s >= 90).length,
    '75–89': scores.filter((s) => s >= 75 && s < 90).length,
    '60–74': scores.filter((s) => s >= 60 && s < 75).length,
    '<60': scores.filter((s) => s < 60).length,
  };

  const performanceClass = classifyPerformance({
    avgScore,
    successRate,
    rejectionRate,
    completionRate,
  });

  // Translate performance class
  const performanceClassLabel = 
    performanceClass === 'Excellent' ? t('daily_report.excellent') :
    performanceClass === 'Good' ? t('daily_report.good') :
    performanceClass === 'Moderate' ? t('daily_report.moderate') :
    t('daily_report.poor');

  const kitchenName = data.contract?.kitchen?.name ?? '—';
  const zoneName = data.contract?.zone?.name ?? '—';
  const contractName = data.contract?.name ?? '—';
  const serviceDate = data.service_date ?? '—';

  const withCycleTimeMins = submissions
    .map(({ submission, window }) => {
      const createdAt = new Date(submission.created_at);
      const history = submission.status_history ?? [];
      const lastChangedAt = history.length
        ? new Date(history[history.length - 1]?.changed_at)
        : null;
      const end = lastChangedAt && Number.isFinite(lastChangedAt.getTime()) ? lastChangedAt : null;
      const start = Number.isFinite(createdAt.getTime()) ? createdAt : null;
      const cycleMins = start && end ? Math.max(0, (end.getTime() - start.getTime()) / 60000) : null;
      return { submission, window, cycleMins };
    })
    .filter((x) => x.cycleMins !== null) as Array<{
    submission: (typeof submissions)[number]['submission'];
    window: (typeof submissions)[number]['window'];
    cycleMins: number;
  }>;

  const cycleTimes = withCycleTimeMins.map((x) => x.cycleMins).sort((a, b) => a - b);
  const medianCycleMins = cycleTimes.length
    ? cycleTimes[Math.floor(cycleTimes.length / 2)]
    : null;

  const bottlenecks = medianCycleMins
    ? withCycleTimeMins
        .filter((x) => x.cycleMins >= Math.max(60, medianCycleMins * 1.5))
        .sort((a, b) => b.cycleMins - a.cycleMins)
        .slice(0, 3)
    : [];

  const rankedByScore = submissions
    .map((x) => ({
      ...x,
      score: safeNumber(x.submission.score),
    }))
    .filter((x) => x.score !== null) as Array<(typeof submissions)[number] & { score: number }>;

  rankedByScore.sort((a, b) => b.score - a.score);
  const topPerformers = rankedByScore.slice(0, 3);
  const lowPerformers = rankedByScore
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const rejectedWithoutNotes = rejected.filter((x) => !x.submission.branch_approval_notes?.trim());
  const pendingWithoutHistory = pendingApproval.filter((x) => (x.submission.status_history ?? []).length === 0);

  const keyTakeaways: string[] = [
    `Overall performance classified as ${performanceClass} with an average score of ${avgScore.toFixed(1)} across ${scores.length}/${totalSubmissions} scored submissions.`,
    `Success (accepted) rate is ${pct(accepted.length, totalSubmissions)} with ${accepted.length} accepted and ${rejected.length} rejected submissions.`,
    totalWindows
      ? `Operational completeness is ${pct(totalSubmissions, expectedSubmissions)} (${totalSubmissions}/${expectedSubmissions}) based on an expectation of ${EXPECTED_SUBMISSIONS_PER_WINDOW} submissions per window; total missing submissions: ${missingSubmissions}.`
      : 'No meal windows found for this slot (expected completeness cannot be assessed).',
  ];

  const criticalRisks: string[] = [
    pendingApproval.length
      ? `${pendingApproval.length} submissions are still pending branch approval, creating execution uncertainty and delaying closure.`
      : '',
    rejectedWithoutNotes.length
      ? `${rejectedWithoutNotes.length} rejected submissions have no rejection notes, limiting root-cause analysis and corrective action quality.`
      : '',
    missingSubmissions
      ? `${missingSubmissions} expected submissions are missing versus plan (${totalSubmissions}/${expectedSubmissions}), creating reporting blind spots and increasing compliance risk.`
      : '',
  ].filter(Boolean);

  return (
    <div className="daily-report-paper-export max-w-4xl mx-auto bg-backgroundx text-foreground space-y-8 p-6 md:p-10 print:p-0" dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{DAILY_REPORT_EXPORT_COLOR_FIXES}</style>
      {/* Top summary */}
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
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {keyTakeaways.slice(0, 3).map((x, idx) => (
              <li key={idx}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{t('daily_report.criticalRisks')} (3) {criticalRisks.length ? '' : t('daily_report.noneDetected')}</p>
          {criticalRisks.length ? (
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {criticalRisks.slice(0, 3).map((x, idx) => (
                <li key={idx}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('daily_report.noHighSeverityRisks')}</p>
          )}
        </div>
      </div>

      {/* 1) Executive Summary */}
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm font-semibold">1. Executive Summary</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The day’s meal operations for this slot produced <span className="font-medium text-foreground">{totalSubmissions}</span> submissions across{' '}
          <span className="font-medium text-foreground">{totalWindows}</span> meal time windows. Overall operational outcomes are{' '}
          <span className="font-medium text-foreground">{performanceClass}</span>, driven by an average score of{' '}
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
      </div>

      {/* 2) Key Metrics */}
      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">2. {t('daily_report.keyMetrics')}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.operationalCompleteness')}</p>
            <p className="text-lg font-semibold">
              {pct(totalSubmissions, expectedSubmissions)} ({totalSubmissions}/{expectedSubmissions})
            </p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.missingSubmissions')}</p>
            <p className="text-lg font-semibold">{missingSubmissions}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.totalSubmissions')}</p>
            <p className="text-lg font-semibold">{totalSubmissions}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.avgScore')}</p>
            <p className="text-lg font-semibold">{avgScore.toFixed(1)}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.successRate')}</p>
            <p className="text-lg font-semibold">{pct(accepted.length, totalSubmissions)}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.rejectionRate')}</p>
            <p className="text-lg font-semibold">{pct(rejected.length, totalSubmissions)}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.completionRate')}</p>
            <p className="text-lg font-semibold">{pct(completed.length, totalSubmissions)}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.pendingApprovals')}</p>
            <p className="text-lg font-semibold">{pendingApproval.length}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.mealWindows')}</p>
            <p className="text-lg font-semibold">{totalWindows}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{t('daily_report.emptyWindows')}</p>
            <p className="text-lg font-semibold">{windowsWithNoSubmissions.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-muted/10 p-3 space-y-2">
            <p className="text-sm font-medium">{t('daily_report.scoreDistribution')}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {Object.entries(scoreBuckets).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <span>{k}</span>
                  <span className="font-medium text-foreground">
                    {v} ({pct(v, scores.length)})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-muted/10 p-3 space-y-2">
            <p className="text-sm font-medium">{t('daily_report.acceptanceVsRejection')}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center justify-between gap-3">
                <span>{t('daily_report.accepted')}</span>
                <span className="font-medium text-foreground">
                  {accepted.length} ({pct(accepted.length, totalSubmissions)})
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{t('daily_report.rejected')}</span>
                <span className="font-medium text-foreground">
                  {rejected.length} ({pct(rejected.length, totalSubmissions)})
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{t('daily_report.pending')}</span>
                <span className="font-medium text-foreground">
                  {pendingApproval.length} ({pct(pendingApproval.length, totalSubmissions)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3) Detailed Analysis */}
      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">3. {t('daily_report.detailedAnalysis')}</p>

        <div className="rounded-lg border bg-muted/10 p-3 space-y-2">
          <p className="text-sm font-medium">{t('daily_report.operationalOverview')}</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>
              Submissions captured across <span className="font-medium text-foreground">{totalWindows}</span> meal time windows for contract{' '}
              <span className="font-medium text-foreground">{contractName}</span> (Kitchen: <span className="font-medium text-foreground">{kitchenName}</span>, Zone:{' '}
              <span className="font-medium text-foreground">{zoneName}</span>).
            </li>
            <li>
              Expected submissions: <span className="font-medium text-foreground">{expectedSubmissions}</span> (5 per window). Actual submissions:{' '}
              <span className="font-medium text-foreground">{totalSubmissions}</span>. Missing vs plan:{' '}
              <span className="font-medium text-foreground">{missingSubmissions}</span> (completeness: <span className="font-medium text-foreground">{pct(totalSubmissions, expectedSubmissions)}</span>).
            </li>
            <li>
              Incomplete operations: <span className="font-medium text-foreground">{pendingApproval.length}</span> pending approvals may represent delayed closure or unresolved issues.
            </li>
            {!!windowsBelowExpected.length && (
              <li>
                Shortfall by window (highest gaps):{' '}
                {windowsBelowExpected
                  .slice(0, 4)
                  .map((x) => `${x.window.label} missing ${x.missing}`)
                  .join(' • ')}
                {windowsBelowExpected.length > 4 ? ' • …' : ''}
              </li>
            )}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-muted/10 p-3 space-y-2">
            <p className="text-sm font-medium">{t('daily_report.highPerformingSubmissions')}</p>
            {topPerformers.length ? (
              <ul className="space-y-2">
                {topPerformers.map(({ submission, window, score }) => (
                  <li key={submission.id} className="rounded-md border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{submission.form?.name ?? submission.form_type}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('daily_report.window')}: {window.label} • {t('daily_report.status')}: {submission.status} • {t('daily_report.branchApprovalStatus')}: {submission.branch_approval}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{score}</p>
                        <p className="text-xs text-muted-foreground">{t('daily_report.score')}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('daily_report.noScoredSubmissions')}</p>
            )}
          </div>

          <div className="rounded-lg border bg-muted/10 p-3 space-y-2">
            <p className="text-sm font-medium">{t('daily_report.lowPerformingSubmissions')}</p>
            {lowPerformers.length ? (
              <ul className="space-y-2">
                {lowPerformers.map(({ submission, window, score }) => (
                  <li key={submission.id} className="rounded-md border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{submission.form?.name ?? submission.form_type}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('daily_report.window')}: {window.label} • {t('daily_report.status')}: {submission.status} • {t('daily_report.branchApprovalStatus')}: {submission.branch_approval}
                        </p>
                        {!!submission.branch_approval_notes?.trim() && (
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
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('daily_report.noScoredSubmissions')}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-muted/10 p-3 space-y-2">
          <p className="text-sm font-medium">{t('daily_report.efficiencyExecution')}</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>
              Approvals pending: <span className="font-medium text-foreground">{pendingApproval.length}</span> (risk of delayed closure and reduced reliability).
            </li>
            <li>
              Median cycle time (from submission creation to last status change):{' '}
              <span className="font-medium text-foreground">{medianCycleMins !== null ? `${Math.round(medianCycleMins)} min` : '—'}</span>.
            </li>
            {!!bottlenecks.length && (
              <li>
                Potential bottlenecks (longest cycle times):
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {bottlenecks.map((b) => (
                    <li key={b.submission.id}>
                      {b.submission.form?.name ?? b.submission.form_type} • {b.window.label} • {Math.round(b.cycleMins)} min • last change{' '}
                      {formatDateTime((b.submission.status_history ?? []).slice(-1)[0]?.changed_at)}
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* 4) Insights */}
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm font-semibold">4. {t('daily_report.insights')}</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>
            **How successful was the operation?** It was <span className="font-medium text-foreground">{performanceClass}</span>, with{' '}
            <span className="font-medium text-foreground">{accepted.length}</span> accepted and <span className="font-medium text-foreground">{rejected.length}</span> rejected submissions, and{' '}
            <span className="font-medium text-foreground">{pendingApproval.length}</span> still pending approval.
          </li>
          <li>
            **What worked well?** Score strength is concentrated in the top band (90–100) for{' '}
            <span className="font-medium text-foreground">{scoreBuckets['90–100']}</span> submission(s), supporting strong compliance when the process completes.
          </li>
          <li>
            **Main weaknesses:** {missingSubmissions ? `missing submissions vs plan (${missingSubmissions})` : 'no submission shortfall vs plan detected'}
            {windowsWithNoSubmissions.length ? ', including zero-submission windows' : ''}{pendingApproval.length ? ', pending approvals delaying closure' : ''}{rejectedWithoutNotes.length ? ', and rejection decisions without usable feedback' : ''}.
          </li>
          {!!pendingWithoutHistory.length && (
            <li>
              Operational blind spot: <span className="font-medium text-foreground">{pendingWithoutHistory.length}</span> pending submission(s) have no status history, limiting traceability of where approvals stall.
            </li>
          )}
        </ul>
      </div>

      {/* 5) Recommendations */}
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm font-semibold">5. {t('daily_report.recommendations')}</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
          {missingSubmissions ? (
            <li>
              Enforce planned reporting completeness (5 submissions per window). Prioritize windows with the largest shortfalls first: {windowsBelowExpected
                .slice(0, 4)
                .map((x) => `${x.window.label} missing ${x.missing}`)
                .join(' • ')}
              {windowsBelowExpected.length > 4 ? ' • …' : ''}. Add a pre-close checkpoint to prevent end-of-window submission gaps.
            </li>
          ) : (
            <li>
              Maintain completeness discipline by continuing current submission controls; monitor any future “missing vs plan” variance as an early warning for under-reporting.
            </li>
          )}

          {pendingApproval.length ? (
            <li>
              Reduce approval latency by prioritizing the <span className="font-medium text-foreground">{pendingApproval.length}</span> pending submissions for immediate branch review. Use cycle-time outliers (above median) to triage where workflow stalls.
            </li>
          ) : (
            <li>
              Sustain timely closure by keeping the current approval cadence; treat “pending approvals” as a zero-tolerance KPI for operational reliability.
            </li>
          )}

          {rejectedWithoutNotes.length ? (
            <li>
              Improve corrective action quality by requiring rejection notes (currently missing on <span className="font-medium text-foreground">{rejectedWithoutNotes.length}</span> rejected submissions). Standardize a short taxonomy (e.g., hygiene, temperature, documentation, timing) to enable trend analytics.
            </li>
          ) : (
            <li>
              Keep feedback quality high by ensuring every rejection includes a concise, actionable note and by periodically auditing note completeness.
            </li>
          )}

          <li>
            Lift consistency by targeting the bottom-performing submissions (lowest scores) with focused checks and follow-up audits in the next cycle; prioritize forms/windows where low scores coincide with rejection or prolonged cycle times.
          </li>
        </ul>
      </div>
    </div>
  );
};


