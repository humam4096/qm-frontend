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
  completionRate: number;
}): PerformanceClass {
  const { avgScore, successRate, rejectionRate, completionRate } = args;
  if (successRate >= 0.9 && avgScore >= 90 && rejectionRate <= 0.05 && completionRate >= 0.95) return 'Excellent';
  if (successRate >= 0.8 && avgScore >= 80 && rejectionRate <= 0.1 && completionRate >= 0.9) return 'Good';
  if (successRate >= 0.65 && avgScore >= 70 && completionRate >= 0.8) return 'Moderate';
  return 'Poor';
}


// ─── Data transformation (hook) ───────────────────────────────────────────────

import type { DailySlot } from "../types";

export function useDailyReportData(data: DailySlot) {
  const windows = data.meal_time_windows ?? [];

  const submissions = windows.flatMap((w) =>
    (w.submissions ?? []).map((s) => ({ submission: s, window: w }))
  );

  const totalWindows = windows.length;
  const totalSubmissions = submissions.length;
  const expectedSubmissions = totalWindows * EXPECTED_SUBMISSIONS_PER_WINDOW;
  const missingSubmissions = Math.max(0, expectedSubmissions - totalSubmissions);

  const windowsWithNoSubmissions = windows.filter((w) => (w.submissions ?? []).length === 0);
  const windowsBelowExpected = windows
    .map((w) => {
      const actual = (w.submissions ?? []).length;
      const missing = Math.max(0, EXPECTED_SUBMISSIONS_PER_WINDOW - actual);
      return { window: w, actual, missing };
    })
    .filter((x) => x.missing > 0)
    .sort((a, b) => b.missing - a.missing);

  const accepted       = submissions.filter((x) => x.submission.branch_approval === 'accepted');
  const rejected       = submissions.filter((x) => x.submission.branch_approval === 'rejected');
  const pendingApproval = submissions.filter((x) => x.submission.branch_approval === 'pending');

  const completed = submissions.filter((x) => {
    const a = x.submission.branch_approval;
    const status = (x.submission.status ?? '').toString();
    return a === 'accepted' || a === 'rejected' || status === 'approved_by_quality_manager';
  });

  const scores = submissions
    .map((x) => safeNumber(x.submission.score))
    .filter((v): v is number => v !== null);

  const avgScore       = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const successRate    = totalSubmissions ? accepted.length / totalSubmissions : 0;
  const rejectionRate  = totalSubmissions ? rejected.length / totalSubmissions : 0;
  const completionRate = totalSubmissions ? completed.length / totalSubmissions : 0;

  const scoreBuckets = {
    '90–100': scores.filter((s) => s >= 90).length,
    '75–89':  scores.filter((s) => s >= 75 && s < 90).length,
    '60–74':  scores.filter((s) => s >= 60 && s < 75).length,
    '<60':    scores.filter((s) => s < 60).length,
  };

  const performanceClass = classifyPerformance({ avgScore, successRate, rejectionRate, completionRate });

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
  const medianCycleMins = cycleTimes.length ? cycleTimes[Math.floor(cycleTimes.length / 2)] : null;

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
  const lowPerformers = [...rankedByScore].sort((a, b) => a.score - b.score).slice(0, 3);

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
    accepted, rejected, pendingApproval, completed,
    // scores
    scores, avgScore, scoreBuckets,
    // rates
    successRate, rejectionRate, completionRate,
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