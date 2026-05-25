export const EXPECTED_SUBMISSIONS_PER_WINDOW = 5;
export type PerformanceClass = 'Excellent' | 'Good' | 'Moderate' | 'Poor';

function safeNumber(n: unknown): number | null {
  const v = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(v) ? v : null;
}

function classifyPerformance(args: {

  avgScore: number;

  successRate: number;

  rejectionRate: number;

}): PerformanceClass {
  const { avgScore } = args;
  if (avgScore >= 90) return 'Excellent';
  if (avgScore >= 80) return 'Good';
  if (avgScore >= 70) return 'Moderate';
  return 'Poor';
}

// ─── Data transformation (hook) ───────────────────────────────────────────────

import type { DailySlot } from "../types";

export function useDailyReportData(data: DailySlot) {
  const windows = data.meal_time_windows ?? [];

  const submissions = windows.flatMap((w) =>
    (w.submissions ?? []).map((s) => ({ submission: s, window: w }))
  );

  // const totalWindows = windows.length;
  const totalWindows = Math.min(windows.length, 3);
  // const totalSubmissions = submissions.length;




  // const expectedSubmissions = totalWindows * EXPECTED_SUBMISSIONS_PER_WINDOW;
  const expectedPerWindow = Math.min(EXPECTED_SUBMISSIONS_PER_WINDOW, 3);
  const expectedSubmissions = totalWindows * expectedPerWindow;
  const totalSubmissions = Math.min(
    submissions.length,
    expectedSubmissions
  );
  const missingSubmissions = Math.max(0, expectedSubmissions - totalSubmissions);

  const windowsWithNoSubmissions = windows.filter((w) => (w.submissions ?? []).length === 0);
  const windowsBelowExpected = windows
    .map((w) => {
      const actual = (w.submissions ?? []).length;
      const missing = Math.max(0, expectedPerWindow - actual);
      return { window: w, actual, missing };
    })
    .filter((x) => x.missing > 0)
    .sort((a, b) => b.missing - a.missing);

  const accepted       = submissions.filter((x) => x.submission.branch_approval === 'accepted');
  const rejected       = submissions.filter((x) => x.submission.branch_approval === 'rejected');
  const pendingApproval = submissions.filter((x) => x.submission.branch_approval === 'pending');

  const scores = submissions
    .map((x) => safeNumber(x.submission.score))
    .filter((v): v is number => v !== null);

  const avgScore      = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const successRate   = totalSubmissions ? accepted.length / totalSubmissions : 0;
  const rejectionRate = totalSubmissions ? rejected.length / totalSubmissions : 0;

  const scoreBuckets = {
    '90–100': scores.filter((s) => s >= 90).length,
    '75–89':  scores.filter((s) => s >= 75 && s < 90).length,
    '60–74':  scores.filter((s) => s >= 60 && s < 75).length,
    '<60':    scores.filter((s) => s < 60).length,
  };

  const performanceClass = classifyPerformance({ avgScore, successRate, rejectionRate });

  const withCycleTimeMins = submissions
    .map(({ submission, window }) => {
      const createdAt = new Date(submission.created_at);
      const history = submission.status_history ?? [];
      const lastChangedAt = history.length ? new Date(history[history.length - 1]?.changed_at) : null;
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
    ? cycleTimes.length % 2 === 1
      ? cycleTimes[Math.floor(cycleTimes.length / 2)]
      : (cycleTimes[cycleTimes.length / 2 - 1] + cycleTimes[cycleTimes.length / 2]) / 2
    : null;

  const bottlenecks = medianCycleMins
    ? withCycleTimeMins
        .filter((x) => x.cycleMins >= Math.max(60, medianCycleMins * 1.5))
        .sort((a, b) => b.cycleMins - a.cycleMins)
        .slice(0, 3)
    : [];

  const rankedByScore = submissions
    .map((x) => ({ ...x, score: safeNumber(x.submission.score) }))
    .filter((x) => x.score !== null) as Array<(typeof submissions)[number] & { score: number }>;

  rankedByScore.sort((a, b) => b.score - a.score);
  const topPerformers = rankedByScore.slice(0, 3);

  // Ensure low performers are mutually exclusive from top performers
  const lowPerformers = rankedByScore
  .filter((x) => x.score < 60)
  .sort((a, b) => a.score - b.score)
  .slice(0, 3);

  const rejectedWithoutNotes  = rejected.filter((x) => !x.submission.branch_approval_notes?.trim());
  const pendingWithoutHistory = pendingApproval.filter((x) => (x.submission.status_history ?? []).length === 0);

  const kitchenName  = data.contract?.kitchen?.name ?? '—';
  const zoneName     = data.contract?.zone?.name ?? '—';
  const contractName = data.contract?.name ?? '—';
  const serviceDate  = data.service_date ?? '—';

  return {
    // context
    kitchenName, zoneName, contractName, serviceDate,
    // counts
    totalWindows, totalSubmissions, expectedSubmissions, missingSubmissions,
    windowsWithNoSubmissions, windowsBelowExpected,
    // approval buckets
    accepted, rejected, pendingApproval,
    // scores
    scores, avgScore, scoreBuckets,
    // rates
    successRate, rejectionRate,
    // classification
    performanceClass,
    // cycle time
    medianCycleMins, bottlenecks,
    // performer lists
    topPerformers, lowPerformers,
    // quality flags
    rejectedWithoutNotes, pendingWithoutHistory,
  };
}